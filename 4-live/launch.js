const { spaceCenter } = require('krpc-node')
const db = require('./database')

const launch = async () => {
    const client = db.get('client').value()
    const control = db.get('control').value()
    await client.send( spaceCenter.controlActivateNextStage(control.id) )
}

module.exports = launch