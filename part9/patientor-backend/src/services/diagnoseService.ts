import diagnosesData from '../../data/diagnoses.json';

import type { Diagnose } from '../types';

const diagnoses = diagnosesData as Array<Diagnose>;

const getDiagnoses = (): Array<Diagnose> => {
	return diagnoses;
};

export default {
	getDiagnoses,
};
