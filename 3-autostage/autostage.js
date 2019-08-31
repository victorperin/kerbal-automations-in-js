const Promise = require('bluebird')
const { spaceCenter } = require('krpc-node')
const db = require('./database')

const returnFunctionOptions = { _fn: true } // this return the function to be able to addStream

const autostage = async () => {
    const client = db.get('client').value()
    const control = db.get('control').value()
    const vessel = await client.send( spaceCenter.getActiveVessel() )

    const parts = await vessel.parts.get()

    const engines = await parts.engines.get();

    const getFuelsCalls = await Promise.all(
        engines.map( (engine) => engine.hasFuel.get(returnFunctionOptions) )
    )

    await Promise.all(
        getFuelsCalls.map( (func, index) =>
            client.addStream(func, `EngineFuel${index}`)
        )
    )

    client.stream.on('message', async (streamState) => {
            const control = db.get('control').value()

            
            const noFuelEnginesStages = await Promise.filter(
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
                currentStage = await control.currentStage.get()

                fuelledEnginesStages = await Promise.filter(
                    engines,
                    engine => engine.hasFuel.get()
                )
                    .map( engine => engine.part.get() )
                    .map( part => part.stage.get() )
            }
            
    })
}

module.exports = autostage