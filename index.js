// Express request
const express = require('express');
const app = express();

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

// Serving the backend to the browser
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
