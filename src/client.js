"use strict"

const Client = require('./service/client')
const Args = require('./utils/args')()

new Client({
  server : Args.host || '127.0.0.1',
  port : Args.port || 8156,
  key : Args.key || '456DAde486qD684de6'
})
