// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "paytomorrow-app", // Name of your application
      script: "npm", // Path to the Next.js executable5
      args: "start", // Arguments to run the app (start on port 3000)
      cwd: "./", // Working directory (replace with your app's path)
      env: {
        NODE_ENV: "production", // Set the environment to production
        // Add other environment variables here
      },
      // Optional configurations:
      // log_file: "/path/to/your/logs/combined.log", // Combined log file
      // out_file: "/path/to/your/logs/out.log", // Standard output log
      // error_file: "/path/to/your/logs/error.log", // Error log
      // watch: false, // Disable file watching
      // autorestart: true, // Automatically restart on failure
      // max_memory_restart: "1G", // Restart if memory exceeds 1GB
    },
  ],
};
