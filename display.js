var blessed = require('blessed');

var argsGetted = { port : false, host : false, key : false };

process.argv.forEach(function(val, index, array) {
  switch (val) {
    case '-p': // Port
      argsGetted.port = array[index+1];
      break;

    case '-h': // Host
      argsGetted.host = array[index+1];
      break;

    case '-key':
    case '-k': // key
      argsGetted.key = array[index+1];
      break
  }
});


var config = {
  server : argsGetted.host || '127.0.0.1',
  port : argsGetted.port || 8156,
  key : argsGetted.key || '456DAde486qD684de6'
};

var toHHMMSS = function (number) {
    var sec_num = parseInt(number, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+'h'+minutes+'m '+seconds+'s';
    return time;
}

var socket = require('socket.io-client')('http://'+config.server+':'+config.port);

var status = 'offline';

socket.on('connect', function(){
  socket.emit('auth', config.key);
});

socket.on('isAuth', function (data) {
  if (data.success) {

    statusBar.setText('Status: online');
    statusBar.style.bg = 'default'
    statusBar.style.fg = 'green'
    screen.render();
    socket.emit('room', 'client')

  } else {

    statusBar.setText('Status: Security key not valid.');
    statusBar.style.fg = 'red'
    screen.render();

  }
})

socket.on('update', function(data){

  var ids = Object.keys(data.servers);

  for( i=0; i<ids.length; i++) {

    // Adding visual client
    setClient(data.servers[ids[i]].os.name)

    // Update infos on visual client.
    upClient(data.servers[ids[i]].os.name, data.servers[ids[i]].os, data.servers[ids[i]].online)
  }

});
socket.on('disconnect', function(){
  statusBar.style.bg = 'red'
  statusBar.style.fg = 'black'
  statusBar.setText('Status: disconnected');
  //progress.setProgress(10);
  screen.render();
});

/* Un minimum de responsive */
var clientsOps = {
  width : 40,
  progress : 5,
  top: 3,
}

/* Les clients */
var clients = {
  list: [],
  cpu : {},
  ram : {},
  textCPU : {},
  textRAM : {},

  average: {},
  box : {},
  currentLeft: 0,

};

/**
 * MAJ des infos sur les cards clients
 */
function upClient(id, os, online) {
  if (clients.list.indexOf(id) === -1) return;

//  console.log(os.cpuAverage);

  clients.box[id].style.bg = online ? 'white' : 'red'

  clients.cpu[id].setProgress(Math.floor(os.cpuAverage));
  clients.textCPU[id].setText('CPU\r\n' + Math.floor(os.cpuAverage)+'%');

  clients.ram[id].setProgress(Math.floor(os.mempourcent));
  clients.textRAM[id].setText('RAM\r\n' + Math.floor(os.mempourcent)+'%');

  clients.average[id].setContent('Average: \
\r\n\t'+os.loadavg[0]+' 1m \
\r\n\t'+os.loadavg[0]+' 5m \
\r\n\t'+os.loadavg[0]+' 15m \
\r\n\t \
\r\nHomeDir: '+ os.homedir +' \
\r\nNetwork Interfaces: \r\n\t-'+ Object.keys(os.networkInterfaces).join('\r\n\t-')+' \
\r\n \
\r\nArch: '+os.arch+' \
\r\nPlatform: '+ os.platform + ' \
\r\nRelease: '+ os.release +' \
\r\n \
\r\nUpTime: '+toHHMMSS(os.uptime)+' \
\r\n \
\r\n');

  screen.render()
}

/**
 * Ajout d'une carte visuel pour les clients
 */
function setClient(id) {

  if (clients.list.indexOf(id) !== -1) return;
  clients.list.push(id);

  clients.box[id] = blessed.box({
    content: 'Serveur: ' + id,
    top: clientsOps.top,
    left: clients.currentLeft * (clientsOps.width +10)+5,
    width: clientsOps.width,
    border: 'line',
    height: '50%',
    style: {
      bg: '#d2d2d2',
      fg: 'black',
    }
  })

  clients.cpu[id] = blessed.progressbar({
    parent: clients.box[id],
    border: 'line',
    style: {
      fg: 'blue',
      bg: 'default',
      bar: {
        bg: 'red',
        fg: 'blue'
      },
      border: {
        fg: 'default',
        bg: 'default'
      }
    },
    ch: '',
    orientation: 'vertical',
    //height: 10,
    //width: 3,
    width: clientsOps.progress,
    height: '25%',
    left: clients.currentLeft * (clientsOps.width + 10),
    top : clientsOps.top,
    filled: 0
  });

  clients.ram[id] = blessed.progressbar({
    parent: clients.box[id],
    border: 'line',
    style: {
      fg: 'blue',
      bg: 'default',
      bar: {
        bg: 'green',
        fg: 'blue'
      },
      border: {
        fg: 'default',
        bg: 'default'
      }
    },
    ch: '',
    orientation: 'vertical',
    //height: 10,
    //width: 3,
    width: clientsOps.progress,
    height: '25%',
    left: clients.currentLeft * (clientsOps.width + 10),
    top : '25%+'+clientsOps.top,
    filled: 100
  });


  clients.textCPU[id] = blessed.text({
    // parent: clients.cpu[id],
    content: 'CPU',
    left: clients.currentLeft * (clientsOps.width + 10) + 1,
    style: {
  //    bg: 'green',
    },
    //align: 'center',
    top: '12%'
  })


  clients.textRAM[id] = blessed.text({
    // parent: clients.cpu[id],
    content: 'RAM',
    left: clients.currentLeft * (clientsOps.width + 10) + 1,
    style: {
    //  bg: 'green',
    },
    //align: 'center',
    top: '40%'
  })

  clients.average[id] = blessed.text({
    // parent: clients.cpu[id],
    content: 'Avg',
    left: clients.currentLeft * (clientsOps.width + 10) + 7,
    style: {
      bg: 'white',
      fg: 'black',
    },
    //align: 'center',
    top: 3+3
  })


  clients.currentLeft += 1;

  /* Background BOX */
  screen.append(clients.box[id])

  /* CPU & RAM */
  screen.append(clients.cpu[id])
  screen.append(clients.ram[id])
  screen.append(clients.textCPU[id])
  screen.append(clients.textRAM[id])

  /* Infos */
  screen.append(clients.average[id])

  screen.render();
}


// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'my window title';



// Create a box perfectly centered horizontally and vertically.
var statusBar = blessed.box({
/*  top: 'center',
  left: 'center',*/
  left: 0,
  width: '100%',
  height: '100%-1',
  content: 'Status: ' + status,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'default',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Append our box to the screen.

screen.append(statusBar);


/* For test */
/*
setClient(1);
setTimeout(function () {
  setClient(3);
}, 3000);
setClient(2);setClient(2);
*/
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


// Render the screen.
screen.render();
