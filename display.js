'use strict'

var blessed   = require('blessed');
var args      = require('./lib/utils/args')();
var config    = {
  server  : args.host   || '127.0.0.1',
  port    : args.port   || 8156,
  key     : args.key    || '456DAde486qD684de6'
};
var socket    = require('socket.io-client')('http://'+config.server+':'+config.port, {
  timeout : 6000
});

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

var status = 'offline';

socket.on('connect', function(){
  socket.emit('auth', config.key);
});

socket.on('isAuth', function (data) {
  if (data.success) {

    topBar.setText('Status: online');
    topBar.style.bg = 'default'
    topBar.style.fg = 'green'
    screen.render();
    socket.emit('room', 'client')

  } else {

    topBar.setText('Status: Security key not valid.');
    topBar.style.fg = 'red'
    screen.render();

  }
})

socket.on('update', function(data){

  var ids = Object.keys(data.servers);

  for(var i=0; i<ids.length; i++) {

    // Adding visual client
    setClient(data.servers[ids[i]].os.name)

    // Update infos on visual client.
    upClient(data.servers[ids[i]].os.name, data.servers[ids[i]].os, data.servers[ids[i]].online)
  }

});

socket.on('disconnect', function(){
  topBar.style.bg = 'red'
  topBar.style.fg = 'black'
  topBar.setText('Status: disconnected');
  //progress.setProgress(10);
  screen.render();
});

/* Un minimum de responsive */
var clientsOps = {
  width : 40,
  progress : 5,
  marginLeft: 2,
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
  top: 0,
  maxBlocksWidth: 4,

};

/**
 * MAJ des infos sur les cards clients
 */
function upClient(id, os, online) {
  if (clients.list.indexOf(id) === -1) return;

//  console.log(os.cpuAverage);

  clients.box[id].style.bg = online ? 'white' : 'red'
  clients.average[id].style.bg = online ? 'white' : 'red'

  var cpuPourcent = Math.floor(os.cpuAverage);
  clients.cpu[id].setProgress(Math.floor(os.cpuAverage));
  clients.cpu[id].style.bar.bg = cpuPourcent < 50 ? 'green' : cpuPourcent < 80 ? 'yellow' : 'red';
  clients.textCPU[id].setText('CPU\r\n' + Math.floor(os.cpuAverage)+'%');

  var ramPourcent = Math.floor(os.mempourcent);
  clients.ram[id].setProgress(ramPourcent);
  clients.ram[id].style.bar.bg = ramPourcent < 50 ? 'green' : ramPourcent < 80 ? 'yellow' : 'red';

  clients.textRAM[id].setText('RAM\r\n' + Math.floor(os.mempourcent)+'%');

  var trafficStr = '';
  if (os.traffic) {
    for (var i=0; i<os.traffic.length; i++) {
      trafficStr += 'down: '+os.traffic[i][0]+'kb/s | up: '+os.traffic[i][1]+'kb/s \r\n';
    }
  }

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
\r\n'+trafficStr);

  screen.render()
}

/**
 * Ajout d'une carte visuel pour les clients
 */
function setClient(id) {

  if (clients.list.indexOf(id) !== -1) return;
  clients.list.push(id);

  clients.box[id] = blessed.box({
    content : id,
    top: clients.top + '%+' +clientsOps.top,
    left: clientsOps.marginLeft + (clients.currentLeft * (clientsOps.width +10)+5),
    width: clientsOps.width,
    border: 'line',
    height: '40%',
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
        bg: 'green',
        fg: 'blue'
      },
      border: {
        fg: 'default',
      }
    },
    ch: '',
    orientation: 'vertical',
    //height: 10,
    //width: 3,
    width: clientsOps.progress,
    height: '20%',
    left: clientsOps.marginLeft + (clients.currentLeft * (clientsOps.width + 10)),
    top : (clients.top) + '%+' +clientsOps.top,
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
      }
    },
    ch: '',
    orientation: 'vertical',
    //height: 10,
    //width: 3,
    width: clientsOps.progress,
    height: '20%',
    left: clientsOps.marginLeft + (clients.currentLeft * (clientsOps.width + 10)),
    top : (clients.top + 20)+'%+'+clientsOps.top,
    filled: 100
  });


  clients.textCPU[id] = blessed.text({
    // parent: clients.cpu[id],
    content: 'CPU',
    left: clientsOps.marginLeft + (clients.currentLeft * (clientsOps.width + 10) + 1),
    style: {
  //    bg: 'green',
    },
    //align: 'center',
    top: (clients.top + 12)+'%'
  })


  clients.textRAM[id] = blessed.text({
    // parent: clients.cpu[id],
    content: 'RAM',
    left: clientsOps.marginLeft + (clients.currentLeft * (clientsOps.width + 10) + 1),
    style: {
    //  bg: 'green',
    },
    //align: 'center',
    top: (clients.top + 32)+'%'
  })

  clients.average[id] = blessed.text({
    // parent: clients.cpu[id],
    content: 'Avg',
    left: clientsOps.marginLeft + (clients.currentLeft * (clientsOps.width + 10) + 7),
    style: {
      fg: 'black',
      bg: 'white',
    },
    //align: 'center',
    top: (clients.top )+ '%+6'
  })


  clients.currentLeft += 1;

  if (clients.maxBlocksWidth == clients.currentLeft) {
    clients.currentLeft = 0;
    clients.top = 50;
  }
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
var backgroundBox = blessed.box({
/*  top: 'center',
  left: 'center',*/
  top: 2,
  left: 0,
  width: '100%',
  height: '100%-4',
  //content: 'Status: ' + status,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'default',
    border: {
      fg: 'yellow'
    },
    hover: {
      bg: 'green'
    }
  }
});

var topBar = blessed.box({
/*  top: 'center',
  left: 'center',*/
  top:0,
  left: 0,
  width: '100%',
  height: 3,
  content: 'Status: ' + status,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'red',
    border: {
      fg: 'yellow'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Append our box to the screen.

screen.append(backgroundBox);
screen.append(topBar);


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
