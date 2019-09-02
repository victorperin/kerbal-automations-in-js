const connect = require('./connect')
const resetVessel = require('./reset-vessel')
const prepareForLaunch = require('./prepare-for-launch')
const launch = require('./launch')
const activateAutoStage = require('./autostage')
const controlDirection = require('./control-direction')

const run = async () => {
    await connect()
    // console.log('connected')
    await resetVessel()
    // console.log('reset done')

    await prepareForLaunch()
    // console.log('prepared')

    await launch()
    // console.log('launched')
    activateAutoStage()

    controlDirection()



    console.log('done')
}

run()