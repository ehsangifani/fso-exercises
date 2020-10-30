import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatientEntry } from '../utils';

const router = express.Router();

router.post('/:id/entries', (req, res) => {
	const patient = patientService.findByID(req.params.id);
	if (!patient) {
		res.status(400).json({ error: 'invalid patient id' });
		return;
	}
	try {
		const payload = toNewEntry(req.body);
		const entry = patientService.addPatientEntry(patient.id, payload);
		if (entry) {
			res.json(entry);
		} else {
			res.status(400).json('invalid request');
		}
	} catch (e) {
		res.status(400).json((e as Error).message);
	}
});

router.get('/:id', (req, res) => {
	const record = patientService.findByID(req.params.id);
	if (record) {
		res.json(record);
	} else {
		res.sendStatus(404);
	}
});

router.get('/', (_req, res) => {
	res.send(patientService.getPatients());
});

router.post('/', (req, res) => {
	try {
		const payload = toNewPatientEntry(req.body);
		const newEntry = patientService.addPatient(payload);
		res.json(newEntry);
	} catch (e) {
		res.status(400).json((e as Error).message);
	}
});

export default router;
