const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('not enought enteries');
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log('Error in syntax');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://environment:${password}@cluster0.1n7nfri.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

// Needed lines to make sure things are working
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (number && name) {
  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log('\nphonebook:');
    result.forEach((person) => {
      console.log(`${person._doc.name} ${person._doc.number}`);
    });
    console.log('\n');
    mongoose.connection.close();
  });
}
