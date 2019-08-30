let { createClient, spaceCenter, krpc } = require('krpc-node')

const resetInitialScene = async (client) => {
    const { results }  = await client.send(spaceCenter.quickload())

    if(results[0].error)
        await client.send(spaceCenter.quicksave())
}

const prepareAndLaunch = async (client) => {
    await client.send(spaceCenter.getActiveVessel())
    const response = await client.send(spaceCenter.controlSetSas(true))
    // console.log(response.results[0].error)
    console.log('setAsTrue')
}


const execute = async () => {
    const client = await createClient({
        rpc: { // yes, you need to pass all default values
            protocol: 'ws',
            host: 'localhost',
            port: '50000/?name=perin', //bypass client name, since the original lib doesn't let me.
        }
    })

    await resetInitialScene(client)
    await prepareAndLaunch(client)


}

execute()