const Server = require('./service/server.js')
const Args = require('./utils/args')()

new Server({
  serverName : "Devteck Monitoring",
  key : Args.key || "456DAde486qD684de6",
  port : Args.port || 8156,
})
