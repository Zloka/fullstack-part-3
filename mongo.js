const mongoose = require('mongoose')

const lengthOfArgs = process.argv.length;
if (lengthOfArgs < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

if (lengthOfArgs !== 3 && lengthOfArgs !== 5) {
  console.log('Please provide a correct amount of arguments!')
  process.exit(1)
}

const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://zakke:${password}@cluster0.g6fzr.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).catch(error => console.log(error))
const PhoneBookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
})
const PhoneBookEntry = mongoose.model('PhoneBookEntry', PhoneBookEntrySchema)

if (lengthOfArgs === 5) {
  const phoneBookEntry = new PhoneBookEntry({
    name,
    number,
  })
  
  phoneBookEntry.save().then(result => {
    console.log('Phone book entry saved!')
    mongoose.connection.close()
  });
} else {
  PhoneBookEntry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phoneBookEntry => {
      console.log(`${phoneBookEntry.name} ${phoneBookEntry.number}`)
    })
    mongoose.connection.close()
  })
}