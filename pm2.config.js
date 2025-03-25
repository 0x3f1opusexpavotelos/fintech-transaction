module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "server.js",
      interpreter: "bun", // Bun interpreter
      env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}` // Add "~/.bun/bin/bun" to PATH
      }
    }
  ]
}
