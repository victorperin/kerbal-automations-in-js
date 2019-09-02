const { createClient } = require('krpc-node')
const db = require('./database')

const saveToDatabase = async client => {
    await db.set('client', client).value()
    return client
}

const getClient = () =>
    createClient({
        rpc: { // yes, you need to pass all default values
            protocol: 'ws',
            host: 'localhost',
            port: '50000/?name=perin', //bypass client name, since the original lib doesn't let me.
        },
    })
        .then( async client => {
            await client.connectToStreamServer();
            return client            
        }) 
        .then(saveToDatabase)

module.exports = getClient