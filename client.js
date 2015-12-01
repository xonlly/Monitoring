"use strict"

const Client = require('./core/Client');

const MyServer = new Client({
  key : 'A45DE87Daez89D',
  master : '127.0.0.1',
  ping : 1000 // Ping toutes les 10 secondes.
})
