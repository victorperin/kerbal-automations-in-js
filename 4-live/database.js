const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const Memory = require('lowdb/adapters/Memory')

const initialState = {
    client: {},
    vessel: null,
}

const adapter = new Memory()
const db = low(adapter)

db.defaults(initialState).write()

module.exports = db