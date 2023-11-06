import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import personService from './services/persons';
import Notifications from './components/Notifications';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [updateData, setUpdateData] = useState(1);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, [updateData]);

  const addContact = (e) => {
    e.preventDefault();

    const personsObj = {
      name: newName,
      number: newNumber,
    };

    const existing = persons.find((person) => person.name === newName);

    if (existing) {
      const updateNumber = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (updateNumber) {
        personService
          .update(existing.id, personsObj)
          .then(() => {
            setUpdateData(updateData + 1);

            setSuccessMessage(
              `Updated ${existing.name}'s number successfully!`
            );
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server!`
            );

            setTimeout(() => {
              setErrorMessage(null);
            }, 3000);

            setUpdateData(updateData + 1);
          });
      }
    } else {
      personService.create(personsObj).then((data) => {
        personService.getAll().then((data) => {
          setPersons(persons.concat(personsObj));
          setPersons(data);
        });
      });

      setSuccessMessage(
        `Added ${personsObj.name}'s informations successfully!`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }

    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(new RegExp(e.target.value, 'ig'));
  };

  const handleDelete = (e) => {
    const deleteData = confirm(`Delete ${e.target.name} ?`);

    if (deleteData) {
      personService.remove(e.target.id, e.target.name).then(() => {
        setUpdateData(updateData + 1);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notifications message={successMessage} type="success" />
      <Notifications message={errorMessage} type="error" />

      <Filter handleFilter={handleFilter} />

      <h2>add a new</h2>
      <PersonForm
        args={{
          addContact,
          newName,
          newNumber,
          handleNameChange,
          handleNumberChange,
        }}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
