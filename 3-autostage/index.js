const connect = require('./connect')
const resetVessel = require('./reset-vessel')
const prepareForLaunch = require('./prepare-for-launch')
const launch = require('./launch')
const activateAutoStage = require('./autostage')

const run = async () => {
    await connect()
    await resetVessel()

    await prepareForLaunch()

    await launch()
    await activateAutoStage()

    console.log('done')
}

run()