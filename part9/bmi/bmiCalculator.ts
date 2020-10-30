const calculateBmi = (height: number, weight: number): string => {
	height /= 100;
	const bmi = weight / (height * height);
	switch (true) {
		case bmi < 15:
			return 'Very severely underweight';
		case bmi < 16:
			return 'Severely underweight';
		case bmi < 18.5:
			return 'Underweight';
		case bmi < 25:
			return 'Normal (healthy weight)';
		case bmi < 30:
			return 'Overweight';
		case bmi < 35:
			return 'Obese Class I (Moderately obese)';
		case bmi < 40:
			return 'Obese Class II (Severely obese)';
		case bmi >= 40:
			return 'Obese Class III (Very severely obese)';
	}
	return '';
};

if (typeof require !== 'undefined' && require.main === module) {
	interface Input {
		height: number;
		weight: number;
	}

	const parseArguments = (args: Array<string>): Input => {
		if (args.length < 4) throw new Error('Not enough arguments');
		if (args.length > 4) throw new Error('Too many arguments');
		if (!(isNaN(Number(args[2])) || isNaN(Number(args[3])))) {
			return {
				height: Number(args[2]),
				weight: Number(args[3]),
			};
		} else {
			throw new Error('height and/or weight were not numbers');
		}
	};

	try {
		const { height, weight } = parseArguments(process.argv);
		console.log(calculateBmi(height, weight));
	} catch (err) {
		console.error('Error: ', (err as Error).message);
	}
}

export default calculateBmi;
