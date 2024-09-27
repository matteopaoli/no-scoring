// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "nextjs-app", // Name of your application
      script: "node_modules/.bin/next", // Path to the Next.js executable
      args: "start -p 3000", // Arguments to run the app (start on port 3000)
      cwd: "~/no-scoring", // Working directory (replace with your app's path)
      instances: "max", // Number of instances (use 'max' to utilize all CPU cores)
      exec_mode: "cluster", // Enables clustering mode
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
