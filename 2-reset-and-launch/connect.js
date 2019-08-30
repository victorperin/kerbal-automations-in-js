const { createClient } = require('krpc-node')
const db = require('./database')

const saveToDatabase = client => db.set('client', client).value()

const getClient = () =>
    createClient({
        rpc: { // yes, you need to pass all default values
            protocol: 'ws',
            host: 'localhost',
            port: '50000/?name=perin', //bypass client name, since the original lib doesn't let me.
        }
    })
        .then(saveToDatabase)

module.exports = getClient