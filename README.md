# Monitoring easy

Server monitoring system, rapid installation and simple to use.

___

![Monitoring exemple](img/exemple.png)

![Monitoring exemple](img/exemple.gif)

___

# My node project

```bash
  npm install monitoring-easy
```

```javascript
require('monitoring-easy')({
  /* All is optional */
  name : 'MyProject',
  host : 'yourServer.fr',
  port : 8156,
  key : '456DAde486qD684de6'
})
```

___

# My server

```bash
  npm install monitoring-easy
```

## Run new "client" server

`npm run client` or `node ./src/client.js -p port -h host -k key`

### You need get network traffic ?

- On __Linux__ you need ifstat `sudo apt-get install ifstat` or go to download lib http://gael.roualland.free.fr/ifstat/
- On __Windows__ i have adding ifstat on the project, no command required.

## Run a master listenner

`npm run server` or `node ./src/server.js -p port -k key`

## Run a display for view live monitoring

`node run display` or `node ./display -p port -h host -k key`

___

# Change config for server monitoring

## Client

Go to ./src/client.js and edit config

## Server

Go to ./src/server.js and edit config

## Display

Go to ./display and edit config

# WebDisplay

The webdisplay is coming soon

___
# Current todolist

- Web Display
- ~~Client compatibility node 0.x~~
- Forever script
