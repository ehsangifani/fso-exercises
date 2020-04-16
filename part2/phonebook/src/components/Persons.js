import React from 'react';

const Person = ({ value, onDelete }) => {
	return (
		<li>
			{value.name} {value.number}
			<button onClick={onDelete}>delete</button>
		</li>
	)
};

const Persons = ({ values, deleteCB }) => {
	return (
		<ul>
			{values.map(person =>
				<Person key={person.name} value={person}
					onDelete={() => deleteCB(person.id)}
				/>
			)}
		</ul>
	)
};

export default Persons;