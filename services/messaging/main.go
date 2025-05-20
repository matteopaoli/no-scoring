package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"
	"github.com/aymerick/raymond"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type EmailRequest struct {
	TemplateName string                 `json:"template_name"`
	Data         map[string]interface{} `json:"data"`
}

func loadTemplate(templateName string) (string, error) {
	templatePath := filepath.Join("templates", templateName+".hbs")
	content, err := os.ReadFile(templatePath)
	if err != nil {
		return "", fmt.Errorf("failed to load template: %w", err)
	}
	return string(content), nil
}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(os.Getenv("AWS_REGION")),
	)
	if err != nil {
		log.Fatalf("Unable to load AWS config: %v", err)
	}

	sesClient := ses.NewFromConfig(cfg)

	r := gin.Default()

	r.POST("/send-email", func(c *gin.Context) {
		var req EmailRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		// Inject system data
		if req.Data == nil {
			req.Data = make(map[string]interface{})
		}
		req.Data["date"] = time.Now().UTC().Format(time.RFC1123Z)

		fmt.Printf("%+v\n", req.Data)

		// Load and render the template
		rawTemplate, err := loadTemplate(req.TemplateName)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		renderedMessage, err := raymond.Render(rawTemplate, req.Data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Template rendering failed",
				"details": err.Error(),
			})
			return
		}

		fmt.Println("---- Rendered Message ----")
		fmt.Println(renderedMessage)
		fmt.Println("---- End of Rendered Message ----")


		// Prepare raw email input
		input := &ses.SendRawEmailInput{
			RawMessage: &types.RawMessage{
				Data: []byte(renderedMessage),
			},
		}

		_, err = sesClient.SendRawEmail(context.TODO(), input)
		if err != nil {
			log.Println("SES SendRawEmail error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Email sent"})
	})

	r.Run(":6000")
}
