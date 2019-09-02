const { spaceCenter } = require('krpc-node')
const db = require('./database')

const resetVessel = async () => {
    const client = db.get('client').value()

    const { results }  = await client.send(spaceCenter.quickload())

    if(results[0].error)
        await client.send(spaceCenter.quicksave())
}


module.exports = resetVessel