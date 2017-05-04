var diskAdapter = require('sails-disk');

var connections = {

  // Setup Adapters
  // Creates named adapters that have been required
  adapters: {
    'default': diskAdapter,
    disk: diskAdapter
  },

  // Build Connections Config
  // Setup connections using the named adapter configs
  connections: {
    myLocalDisk: {
      adapter: 'disk'
    }

    //myLocalMySql: {
    //  adapter: 'mysql',
    //  host: 'localhost',
    //  database: 'foobar'
    //}
  },

  defaults: {
    migrate: 'safe'
  }

};

module.exports = connections;
