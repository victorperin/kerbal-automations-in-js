const { spaceCenter, krpc } = require('krpc-node')
const database = require('./database')
const { returnFunctionOptions } = require('./helpers')

module.exports = async () => {
    const client = database.get('client').value()
    const control = database.get('control').value()
    const vessel = database.get('vessel').value()

    const orbit = await vessel.orbit.get()
    database.set('orbit', orbit).value()

    const autopilot = await vessel.autoPilot.get()
    database.set('autopilot', autopilot).get()

    const surfaceReference = await vessel.surfaceReferenceFrame.get();
    const flight = await vessel.flight(surfaceReference)
    
    const [heading, meanAutitudeCall, apoapsisCall, periapsisCall] =  await Promise.all([
        flight.heading.get(),
        flight.meanAltitude.get(returnFunctionOptions),
        orbit.apoapsis.get(returnFunctionOptions),
        orbit.periapsis.get(returnFunctionOptions),
    ])

    const streams = await Promise.all([
        client.addStream(meanAutitudeCall, 'meanAltitude'),
        client.addStream(apoapsisCall, 'apoapsis'),
        client.addStream(periapsisCall, 'periapsis'),
    ]) 

    await streams.reduce(async (acc, stream) => {
        await acc
        return client.send( await krpc.setStreamRate(stream.id, 1) )
    }, Promise.resolve() )

    await autopilot.engage()
    await autopilot.targetPitchAndHeading(90,90)


    await client.stream.on('message', async (state) => {
        const KERBIN_RADIOUS = 600_000
        const DESIRED_ALTITUDE = 70_000

        if(state.apoapsis > DESIRED_ALTITUDE + KERBIN_RADIOUS){
            await autopilot.targetPitchAndHeading(0,90)
        }

        if(state.periapsis > DESIRED_ALTITUDE + KERBIN_RADIOUS){
            await control.throttle.set(0)
            await autopilot.targetPitchAndHeading(0,-90)

        }

        

    }) 


    // spaceCenter.flightGetHeading()

    // spaceCenter.flightGetDirection()

}