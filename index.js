// Importing DotEnv
require('dotenv').config();

// Importing CROS
const cors = require('cors');

// Importing Express
const express = require('express');
const app = express();

// Importing Morgan
const morgan = require('morgan');

// Configuring morgan
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body); // I was imporvising in this line, and it worked!
});

const morganWare = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

// Setting Middlewares
app.use(express.json());
app.use(morganWare);
app.use(cors());
app.use(express.static('dist'));

// Getting the Mongoose module
const Person = require('./modules/person');

// Initial data
let persons = [];

// Print info on the index.html instnace
app.get('/info', (request, response) => {
  const entries = persons.length;

  const html = `
    <p>Phonebook has info for ${entries} poeple</p>
    <p>${Date()}</p>
  `;

  response.send(html);
});

// The perosns JSON API response
app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
    persons.concat(people);
  });
});

// Getting the REST API responses / accourding to their ID
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// Deleting a RESTful resource / Accourding to its ID
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Adding a RESTful resource to the persons API
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  } else if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: 'dublicated name',
    });
  }

  const person = Person({
    // id: Math.round(Math.random() * 100000),
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(person);
  });
});

// Serving the backend to the browser
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
