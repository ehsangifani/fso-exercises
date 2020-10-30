interface Result {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

const calculateExercises = (hours: Array<number>, target: number): Result => {
	const average = hours.reduce((acc, cur) => acc + cur, 0) / hours.length;
	const periodLength = hours.length;
	const success = average >= target;
	const trainingDays = hours.filter(v => v > 0).length;
	const rating = success ? 3 : average / target > 0.8 ? 2 : 1;
	let ratingDescription;
	switch (rating) {
		case 1:
			ratingDescription = 'you should try harder';
			break;
		case 2:
			ratingDescription = 'not too bad but could be better';
			break;
		case 3:
			ratingDescription = 'you did it! increase the target?';
			break;
	}
	return {
		average, periodLength, target, success,
		trainingDays, rating, ratingDescription
	};
};

if (typeof require !== 'undefined' && require.main === module) {
	interface Input {
		hours: Array<number>;
		target: number;
	}

	const parseArguments = (args: Array<string>): Input => {
		if (args.length < 4) throw new Error('Not enough arguments');
		const target = Number(args[2]);
		if (isNaN(target)) {
			throw new Error('target must be a number');
		}
		const hours = [];
		for (var i = 3; i < args.length; i++) {
			const h = Number(args[i]);
			if (isNaN(h)) {
				throw new Error(`${args[i]} is not a valid hour`);
			}
			hours.push(h);
		}
		return { hours, target };
	};

	try {
		const { hours, target } = parseArguments(process.argv);
		console.log(calculateExercises(hours, target));
	} catch (err) {
		console.error('Error: ', (err as Error).message);
	}
}

export default calculateExercises;
