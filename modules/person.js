// Importing Mongoose
const mongoose = require('mongoose');

// Configuring Mongoose
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('connecting to ', url);

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error.message);
  });

// Creating and setting the Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (arr) {
        return /(\d{2}-\d{8,})|(\d{3}-\d{8,})/.test(arr);
      },
      message: 'Wrong Formation: e.g. 09-1234556 or 040-22334455',
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
