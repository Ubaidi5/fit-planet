// pm2 process file. Copied into each release by the deploy workflow.
// Secrets are read from /var/www/fitplanet/shared/.env via Node's --env-file.
const APP_DIR = process.env.APP_DIR || "/var/www/fitplanet";

module.exports = {
  apps: [
    {
      name: "fitplanet",
      cwd: `${APP_DIR}/current`,
      script: "server.js",
      node_args: `--env-file=${APP_DIR}/shared/.env`,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
