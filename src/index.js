const pino = require('pino')
const config = require('./config')
const PouchDB = require('pouchdb-node')
const scanner = require('./scanner')
const app = require('./app')
var { argv } = require("yargs")
  .scriptName("index")
  .usage('--port 9999')
  .option("port",{
    alias: "p",
    describe: "port to listen on",
    type: "number",
    nargs: 1
  })

const {port} = argv;

const logger = pino(Object.assign({}, config.logger, {
  serializers: {
    err: pino.stdSerializers.err
  }
}))

if (port) config.http.port = port

const db = new PouchDB(`http://localhost:${config.http.port}/db/_media`);

logger.info(config)

scanner({ logger, db, config })
app({ logger, db, PouchDB, config }).listen(config.http.port)
