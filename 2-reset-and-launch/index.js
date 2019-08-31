const connect = require('./connect')
const resetVessel = require('./reset-vessel')
const prepareForLaunch = require('./prepare-for-launch')
const launch = require('./launch')

const run = async () => {
    await connect()
    await resetVessel()

    await prepareForLaunch()

    await launch()

    console.log('done')
}

run()