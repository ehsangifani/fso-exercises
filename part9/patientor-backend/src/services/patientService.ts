import patients from '../../data/patients';

import type { Patient, NonSensitivePatient, NewPatientEntry, NewEntry, Entry } from '../types';

const newID = (): string => {
	const buf = Buffer.allocUnsafe(16);
	buf.writeDoubleBE(Date.now());
	buf.writeDoubleBE(Math.random(), 8);
	return buf.toString('hex');
};

const getPatients = (): Array<NonSensitivePatient> => {
	return patients.map(obj => {
		return { ...obj, ssn: undefined };
	});
};

const addPatient = (patient: NewPatientEntry): Patient => {
	const newRecord = {
		id: newID(),
		...patient,
	};
	patients.push(newRecord);
	return newRecord;
};

const findByID = (id: string): Patient | undefined => {
	const record = patients.find(v => v.id === id);
	return record;
};

const addPatientEntry = (patientId: Patient['id'], entry: NewEntry): Entry | undefined => {
	const patient = findByID(patientId);
	if (!patient) {
		return undefined;
	}
	const newEntry = { ...entry, id: newID() } as Entry;
	patient.entries.push(newEntry);
	return newEntry;
};

export default {
	addPatient,
	addPatientEntry,
	findByID,
	getPatients,
};
