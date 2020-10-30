import express from 'express';
import cors from 'cors';
import diagnoseRouter from './routes/diagnoses';
import patientRouter from './routes/patients';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const router = express.Router();
router.get('/ping', (_req, res) => {
	res.send('pong');
});

app.use('/api/diagnosis', diagnoseRouter);
app.use('/api/patients', patientRouter);
app.use('/api', router);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
