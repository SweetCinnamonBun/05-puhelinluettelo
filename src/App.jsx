import { useEffect, useState } from "react";
import axios from "axios";
import personsService from "./services/persons";

const FilterForm = ({ filterPerson }) => {
  return (
    <div>
      filter: <input onChange={filterPerson} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handlePersonChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const Persons = ({ showPersons, deletePerson }) => {
  return (
    <div>
      <ul>
        {showPersons.map((person) => (
          <Person key={person.id} person={person} deletePerson={deletePerson} />
        ))}
      </ul>
    </div>
  );
};

const Person = ({ person, deletePerson }) => {
  return (
    <>
      <li>
        {person.name} - {person.number}
        <button type="submit" onClick={() => deletePerson(person.id)}>
          delete
        </button>
      </li>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState(false);
  const [filterCode, setFilterCode] = useState("");

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault();
    if (newName === "" || newNumber === "") {
      setNewName("");
      setNewNumber("");
      return;
    }
    const numberObject = {
      name: newName,
      number: newNumber,
    };

    let wasFound = false;
    persons.forEach((element) => {
      if (
        element.name === numberObject.name ||
        element.number === numberObject.number
      ) {
        // alert("Stop!");
        wasFound = true;
      }
    });

    if (wasFound === false) {
      personsService.create(numberObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
      });
    }

    if (wasFound === true) {
      if (
        window.confirm(
          `${numberObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const oldPerson = persons.find((x) => x.name === numberObject.name);
        const newNumberPerson = { ...oldPerson, number: numberObject.number };
        personsService
          .update(oldPerson.id, newNumberPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== oldPerson.id ? person : returnedPerson
              )
            );
          });
      }
    }

    setNewName("");
    setNewNumber("");
  };

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const filterPerson = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setFilterCode(event.target.value);
  };

  const showPersons =
    filterCode === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filterCode)
        );

  // const updatePersonNumber = (id) => {
  //   const changedPerson = persons.find((person) => person.id === id);
  //   const newPersonNumber = {...changedPerson, number:}
  //   personsService.update();
  // };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}`)) {
      personsService.deletePerson(id).then((removedPerson) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filterPerson={filterPerson} />
      <h2>Add a new phonenumber</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      ...
      <Persons showPersons={showPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
