const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).catch(error => console.log(error))
const PhoneBookEntrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: String,
})

PhoneBookEntrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

PhoneBookEntrySchema.plugin(uniqueValidator)

module.exports = mongoose.model('PhoneBookEntry', PhoneBookEntrySchema)