require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const PhoneBookEntry = require('./models/phonebookEntry')

app.use(express.json());
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<div>Phonebook has info for ${persons.length} people</div><br><div>${new Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
  PhoneBookEntry.find({}).then(result => {
    response.json(result);
  })
})

app.get('/api/persons/:id', (request, response) => {
  PhoneBookEntry.findById(request.params.id)
  .then(entry => {
    if (entry) {
      response.json(entry)
    } else {
      response.status(404).end() 
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  PhoneBookEntry.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  PhoneBookEntry.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const { body } = request;
  const { name, number } = body;
  if (!name || !number) {
    return response.status(400).json({ 
      error: 'The name and/or number is missing!' 
    })
  }

  const phoneBookEntry = new PhoneBookEntry({
    name,
    number,
  })

  phoneBookEntry.save().then(savedPerson => {
    response.json(savedPerson)
  });
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})