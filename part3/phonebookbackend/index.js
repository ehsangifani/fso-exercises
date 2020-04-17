require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
//const cors = require('cors');
const Person = require('./models/person');


const app = express();
app.use(express.static('build'));
app.use(express.json());
//app.use(cors())

morgan.token('post-body', (req, res) => {
	return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(
	':method :url :status :res[content-length] - :response-time ms :post-body'
));

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons.map(person => person.toJSON()));
	});
});

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedFormattedPerson => {
			response.json(savedFormattedPerson);
		})
		.catch(error => next(error));
});

app.get('/info', (request, response) => {
	Person.estimatedDocumentCount().then(len => {
		const time = new Date();
		response.send(`Phonebook has info for ${len} people<br>${time}`);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person.toJSON());
		} else {
			response.status(404).end();
		}
	}).catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id).then(result => {
		response.status(204).end();
	}).catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;
	if (body.number.split('').filter(char => char >= '0' && char <= '9')
		.length < 8) {
		return next({
			name: 'ValidationError',
			message: 'number must be at least 8 digits.'
		});
	}
	const person = {
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			if (updatedPerson) {
				response.json(updatedPerson.toJSON());
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

//=================================================================
const errorHandler = (error, request, response, next) => {
	console.error(error.message);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message });
	}
	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
