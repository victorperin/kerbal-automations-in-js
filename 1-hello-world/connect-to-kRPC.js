let { createClient, spaceCenter, krpc } = require('krpc-node')
const WebSocket = require('ws')
const protobufjs = require('protobufjs')

const teste = () => console.log('teste')

const execute = async () => {

    const client = await createClient({
        rpc: { // yes, you need to pass all default values
            protocol: 'ws',
            host: 'localhost',
            port: '50000/?name=perin', //bypass client name, since the original lib doesn't let me.
        }
    })


    const result = await client.send(krpc.getClientName())

    console.log(result) // should output perin
    


}

const nativeWebsocket = () => {
    const socket = new WebSocket('ws://localhost:50000/?name=native')
}

execute()
nativeWebsocket()