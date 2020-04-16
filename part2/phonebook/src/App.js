import React, { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Filter from './components/Filter';
import Notification from './components/Notification';
import personsService from './services/persons';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterKey, setNewFilterKey] = useState('');
	const [notifications, setNotifications] = useState([])

	useEffect(() => {
		personsService
			.getAll()
			.then(initialPersons => {
				setPersons(initialPersons)
			});
	}, []);

	const pushNotification = (content, type) => {
		const newMsg = { content, type };
		setNotifications(notifications.concat(newMsg))
		setTimeout(() => {
			setNotifications(notifications.filter(n => n === newMsg));
		}, 5000);
	};
	const addPerson = (event) => {
		event.preventDefault();
		const currentPerson = persons.find(p => p.name === newName);
		if (currentPerson) {
			const ok = window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`);
			if (!ok) {
				return;
			}
			const newPerson = { ...currentPerson, number: newNumber };
			personsService
				.update(newPerson.id, newPerson)
				.then(returnedPerson => {
					pushNotification(
						`Changed ${returnedPerson.name} number`,
						'success'
					);
					setPersons(persons.map(p =>
						p.id !== newPerson.id ? p : returnedPerson))
				}).catch(() => {
					// assume no network problems
					pushNotification(
						`Information of ${newPerson.name} has already been removed from server`,
						'error'
					);
					setPersons(persons.filter(p => p.id !== newPerson.id));
				});
			setNewName('');
			setNewNumber('');
			return;
		}

		const person = {
			name: newName,
			number: newNumber,
		};
		personsService
			.create(person)
			.then(returnedPerson => {
				pushNotification(`Added ${returnedPerson.name}`, 'success');
				setPersons(persons.concat(returnedPerson));
			});

		setNewName('');
		setNewNumber('');
	};

	const deletePerson = (id) => {
		const person = persons.find(p => p.id === id);
		if (window.confirm(`Delete '${person.name}'?`)) {
			personsService
				.remove(id).then(() => {
					setPersons(persons.filter(p => p.id !== id));
				});
		}
	};
	const handleNameChange = (event) => {
		setNewName(event.target.value)
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	};

	const handlefilterKeyChange = (event) => {
		setNewFilterKey(event.target.value)
	};

	const filterPersons = () => {
		return persons.filter(person =>
			person.name.toLowerCase().includes(filterKey.toLowerCase())
		);
	};

	const personsToShow = filterKey ? filterPersons() : persons;

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification messages={notifications} />
			<Filter value={filterKey}
				onChange={handlefilterKeyChange}
			/>
			<h3>Add a new</h3>
			<PersonForm onSubmit={addPerson}
				name={newName} onNameChange={handleNameChange}
				number={newNumber} onNumberChange={handleNumberChange}
			/>
			<h3>Numbers</h3>
			<Persons values={personsToShow}
				deleteCB={deletePerson}
			/>
		</div>
	);
};

export default App;
