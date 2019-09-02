const { spaceCenter } = require('krpc-node')
const db = require('./database')

const prepareForLaunch = async () => {
    const client = db.get('client').value()
    const vessel = await client.send( spaceCenter.getActiveVessel() )

    db.set('vessel', vessel).value()

    const control = await client.send( spaceCenter.vesselGetControl(vessel.id) )
    db.set('control', control).value()

    await client.send([
        spaceCenter.controlSetSas(control.id, true),
        spaceCenter.controlSetThrottle(control.id, 1)
    ])

}

module.exports = prepareForLaunch