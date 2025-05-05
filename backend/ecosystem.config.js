module.exports = {
  apps: [
    {
      name: "EcoVision",
      script: "node_modules/.bin/ts-node",
      args: "--files src/server.ts",
      watch: true,
      interpreter: "none", // Isso impede o PM2 de tentar usar npm
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
