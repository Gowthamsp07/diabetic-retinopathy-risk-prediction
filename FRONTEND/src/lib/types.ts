// HUMAN-FRIENDLY (UI)
export interface PatientData {
  age: number;
  gender: "male" | "female" | "other";

  diabetesType: "type1" | "type2" | "gestational" | "other";
  yearsSinceDiagnosis: number;

  hba1c: number;
  fastingBloodSugar: number;
  postprandialBloodSugar: number;
  bmi: number;
  systolicBP: number;
  diastolicBP: number;

  smoking: boolean;
  physicalActivityLevel: "sedentary" | "light" | "moderate" | "active";
  familyHistoryDR: boolean;
}

// MODEL-FRIENDLY (BACKEND)
export interface PredictionPayload {
  age: number;
  gender: "Male" | "Female";

  time_in_hospital: number;
  num_lab_procedures: number;
  num_medications: number;

  number_outpatient: number;
  number_emergency: number;
  number_inpatient: number;

  number_diagnoses: number;
  insulin: "Yes" | "No";
  diabetesMed: "Yes" | "No";
}
