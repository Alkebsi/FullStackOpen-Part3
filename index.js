// Importing DotEnv
// require('dotenv').config();

// Importing CROS
const cors = require('cors');

// Importing Express
const express = require('express');
const app = express();

// Importing Morgan
const morgan = require('morgan');

// Configuring morgan
morgan.token('body', (request) => {
  return JSON.stringify(request.body); // I was imporvising in this line, and it worked!
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

// Print info on the index.html instnace
app.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    const html = `
        <p>Phonebook has info for ${people.length} poeple</p>
        <p>${Date()}</p>
      `;

    response.send(html);
  });
});

// The perosns JSON API response
app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

// Getting the REST API responses / accourding to their ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Deleting a RESTful resource / Accourding to its ID
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Adding a RESTful resource to the persons API
app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  Person.find({}).then((people) => {
    if (people.find((p) => p.name === body.name)) {
      return response.status(400).json({
        error: 'dublicated name',
      });
    }

    const person = Person({
      // id: Math.round(Math.random() * 100000),
      name: body.name,
      number: body.number,
    });

    person
      .save()
      .then(() => {
        response.json(person);
      })
      .catch((error) => next(error));
  });
});

// Updating a person who aready exist
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatePerson) => {
      response.json(updatePerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// Serving the backend to the browser
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
