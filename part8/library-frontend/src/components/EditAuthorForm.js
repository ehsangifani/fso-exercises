import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR_BIRTH } from '../queries';

const toInt = (strNum) => {
	const res = Math.floor(strNum);
	return Number.isSafeInteger(res) ? res : undefined;
};

const EditAuthorForm = ({ show, setError, authors }) => {
	const [name, setName] = useState('');
	const [birth, setBirth] = useState('');

	const [changeBirth, result] = useMutation(EDIT_AUTHOR_BIRTH, {
		onError: (error) => {
			setError(error.graphQLErrors[0].message);
		},
	});

	useEffect(() => {
		if (result.data && result.data.editAuthor === null) {
			setError('author not found');
		}
	}, [result.data, setError]);

	if (!show) {
		return null;
	}

	const submit = async (event) => {
		event.preventDefault();
		if (!name) {
			setError('No author has been selected');
			return false;
		}

		changeBirth({ variables: { name, birth: toInt(birth) } });

		setName('');
		setBirth('');
	};

	return (
		<div>
			<h2>Set birthyear</h2>
			<form onSubmit={submit}>
				<div>
					name
					<select value={name} onChange={({ target }) => setName(target.value)}>
						<option disabled value="">
							Select an Author
						</option>
						{authors.map((a) => (
							<option key={a.name} value={a.name}>
								{a.name}
							</option>
						))}
					</select>
				</div>
				<div>
					born
					<input
						type="number"
						value={birth}
						onChange={({ target }) => setBirth(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	);
};

export default EditAuthorForm;
