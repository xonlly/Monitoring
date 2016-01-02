module.exports = function () {
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
  return argsGetted;
}
