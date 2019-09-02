const Promise = require('bluebird')
const { spaceCenter } = require('krpc-node')
const db = require('./database')
const { returnFunctionOptions } = require('./helpers')

const autostage = async () => {
    const client = db.get('client').value()
    const control = db.get('control').value()
    const vessel = await client.send( spaceCenter.getActiveVessel() )

    const parts = await vessel.parts.get()

    const engines = await parts.engines.get();

    const getFuelsCalls = await Promise.all(
        engines.map( (engine) => engine.hasFuel.get(returnFunctionOptions) )
    )

    const streams = await Promise.all(
        getFuelsCalls.map( (func, index) =>
            client.addStream(func, `EngineFuel${index}`)
        )
    )

    const streamsId = streams.map( stream => stream.id.toString() )

    client.stream.on('message', async (streamState, updated) => {
            const updatedStreamsIds = updated.results.map( result => result.id.toString() )
            // console.log(updatedStreamsIds)
            if( updatedStreamsIds.every( (id) => !streamsId.includes(id) ) ) return null

            
            let noFuelEnginesStages = await Promise.filter(
                engines,
                async engine => !await engine.hasFuel.get()
            )
                .map( engine => engine.part.get() )
                .map( part => part.stage.get() )
            

            
            
            let currentStage = await control.currentStage.get()
            let fuelledEnginesStages = await Promise.filter(
                engines,
                engine => engine.hasFuel.get()
            )
                .map( engine => engine.part.get() )
                .map( part => part.stage.get() )

            while(
                ( await control.currentStage.get() > 1 ) &&
                (
                    noFuelEnginesStages.includes(currentStage) ||
                    !fuelledEnginesStages.some(engineState => engineState === currentStage)
                )
            ) {
                await control.activateNextStage()
                console.log('staged')
                currentStage = await control.currentStage.get()

                fuelledEnginesStages = await Promise.filter(
                    engines,
                    engine => engine.hasFuel.get()
                )
                    .map( engine => engine.part.get() )
                    .map( part => part.stage.get() )

                noFuelEnginesStages = await Promise.filter(
                    engines,
                    async engine => !await engine.hasFuel.get()
                )
                    .map( engine => engine.part.get() )
                    .map( part => part.stage.get() )
                
            }
            
    })
}

module.exports = autostage