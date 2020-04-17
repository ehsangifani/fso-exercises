const mongoose = require('mongoose');

const printHelpandExit = () => {
	console.log('USAGE: node mongo.js yourpassword');
	console.log('USAGE: node mongo.js yourpassword "new name" <number>');
	process.exit(1);
};

const argv = process.argv;

if (argv.length !== 3 && argv.length !== 5) {
	printHelpandExit();
}

const password = argv[2];

const url =
	`mongodb+srv://fullstack:${password}@cluster0-leoq6.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

if (argv.length === 3) {
	Person.find({}).then(persons => {
		console.log("phonebook:");
		persons.forEach(person => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
} else {
	const person = new Person({
		name: argv[3],
		number: argv[4],
	});

	person.save().then(result => {
		console.log(`added ${result.name} ${result.number} to phonebook`);
		mongoose.connection.close();
	});

}
