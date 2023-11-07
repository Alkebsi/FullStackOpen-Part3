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

// Initial data
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

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
  response.json(persons);
});

// Getting the REST API responses / accourding to their ID
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = persons.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Deleting a RESTful resource / Accourding to its ID
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
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

  const note = {
    id: Math.round(Math.random() * 100000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(note);

  response.json(note);
});

// Serving the backend to the browser
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
