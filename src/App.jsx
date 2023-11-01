import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState(false);
  const [filterCode, setFilterCode] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
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
      id: persons.length + 1,
    };

    let wasFound = false;
    persons.forEach((element) => {
      if (
        element.name === numberObject.name ||
        element.number === numberObject.number
      ) {
        alert("Stop!");
        wasFound = true;
      }
    });

    if (wasFound === false) {
      setPersons(persons.concat(numberObject));
      setNewName("");
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

  return (
    <div>
      <h2>Phonebook</h2>
      filter: <input onChange={filterPerson} />
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
      <h2>Numbers</h2>
      ...
      <ul>
        {showPersons.map((person) => (
          <li>
            {person.name} - {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
