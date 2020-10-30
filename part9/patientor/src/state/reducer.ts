import { State } from "./state";
import { Diagnosis, Entry, Patient, PatientDetailed } from "../types";

export type Action =
	| {
		type: "SET_PATIENT_LIST";
		payload: Patient[];
	}
	| {
		type: "ADD_PATIENT";
		payload: Patient;
	}
	| {
		type: "UPDATE_PATIENT_INFO";
		payload: PatientDetailed;
	}
	| {
		type: "SET_DIAGNOSES";
		payload: Diagnosis[];
	}
	| {
		type: "ADD_PATIENT_ENTRY",
		payload: Entry,
		id: Patient['id'];
	};


export const setPatientList = (list: Patient[]): Action => {
	return {
		type: "SET_PATIENT_LIST",
		payload: list
	};
};

export const addPatient = (patient: Patient): Action => {
	return {
		type: "ADD_PATIENT",
		payload: patient
	};
};

export const updatePatient = (patient: PatientDetailed): Action => {
	return {
		type: "UPDATE_PATIENT_INFO",
		payload: patient
	};
};

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
	return {
		type: "SET_DIAGNOSES",
		payload: diagnoses
	};
};

export const addEntry = (id: Patient['id'], entry: Entry): Action => {
	return {
		type: "ADD_PATIENT_ENTRY",
		id,
		payload: entry
	};
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_PATIENT_LIST":
			return {
				...state,
				patients: {
					...action.payload.reduce(
						(memo, patient) => ({ ...memo, [patient.id]: patient }),
						{}
					),
					...state.patients
				}
			};
		case "ADD_PATIENT":
			return {
				...state,
				patients: {
					...state.patients,
					[action.payload.id]: action.payload
				}
			};
		case "UPDATE_PATIENT_INFO":
			return {
				...state,
				patients: {
					...state.patients,
					[action.payload.id]: action.payload
				}
			};
		case "SET_DIAGNOSES":
			return {
				...state,
				diagnoses: {
					...action.payload.reduce((acc, cur) => {
						acc[cur.code] = cur;
						return acc;
					}, ({} as { [id: string]: Diagnosis; })),
					...state.diagnoses
				}
			};
		case "ADD_PATIENT_ENTRY":
			const current = state.patients[action.id];
			return {
				...state,
				patients: {
					...state.patients,
					[action.id]: {
						...current,
						entries: [...current.entries, action.payload]
					}
				}
			};
		default:
			return state;
	}
};
