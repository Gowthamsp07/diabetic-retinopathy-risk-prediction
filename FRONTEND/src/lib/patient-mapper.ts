import { PatientData, PredictionPayload } from "./types";

/**
 * Converts UI-friendly patient data
 * into ANN model-compatible payload
 */
export function mapPatientToPayload(
  patient: PatientData
): PredictionPayload {
  // Gender mapping
  const gender: "Male" | "Female" =
    patient.gender === "male" ? "Male" : "Female";

  // Insulin usage approximation
  const insulin: "Yes" | "No" =
    patient.diabetesType === "type1" ? "Yes" : "No";

  // Activity → outpatient visits
  const number_outpatient =
    patient.physicalActivityLevel === "sedentary" ? 5 :
    patient.physicalActivityLevel === "light" ? 3 :
    patient.physicalActivityLevel === "moderate" ? 2 : 1;

  // HbA1c → emergency/inpatient risk
  const number_emergency = patient.hba1c >= 9 ? 1 : 0;
  const number_inpatient = patient.hba1c >= 10 ? 1 : 0;

  return {
    age: patient.age,
    gender,

    time_in_hospital:
      patient.yearsSinceDiagnosis > 10 ? 7 :
      patient.yearsSinceDiagnosis > 5 ? 5 : 3,

    num_lab_procedures:
      patient.hba1c > 8 ? 50 : 30,

    num_medications:
      patient.diabetesType === "type2" ? 2 : 1,

    number_outpatient,
    number_emergency,
    number_inpatient,

    number_diagnoses:
      patient.yearsSinceDiagnosis > 5 ? 3 : 1,

    insulin,
    diabetesMed: "Yes",
  };
}
