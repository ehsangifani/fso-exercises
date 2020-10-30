import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
import type { ErrorRequestHandler } from 'express';

const app = express();
app.use(express.json());
app.use(((err, _req, res, next) => {
	// @ts-expect-error err may have status
	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		return res.status(400).send({ error: 'malformed request' });
	}
	return next();
}) as ErrorRequestHandler);

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
	const height = Number(req.query.height);
	const weight = Number(req.query.weight);
	if (isNaN(height) || isNaN(weight)) {
		return res.send({ error: 'malformatted parameters' });
	}
	return res.send({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post('/exercises', (req, res) => {
	type Request = {
		daily_exercises: Array<number>;
		target: number;
	};
	if (!('daily_exercises' in req.body && 'target' in req.body)) {
		return res.status(400).json({ error: 'parameters missing' });
	}
	const { daily_exercises, target } = req.body as Request;
	if (typeof target !== 'number' || target < 0 ||
		!Array.isArray(daily_exercises) || daily_exercises.length < 1 ||
		!daily_exercises.every(v => typeof v == 'number')
	) {
		return res.status(400).json({ error: 'malformatted parameters' });
	}
	return res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3002;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
