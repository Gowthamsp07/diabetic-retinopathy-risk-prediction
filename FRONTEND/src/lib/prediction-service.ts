// ===============================
// UI SAFE TYPES (MATCH ASSESSMENT)
// ===============================
export interface PatientData {
  age?: number;
  gender?: string; // "male" | "female" | "other" (UI-friendly)
  diabetesType?: string;
  yearsSinceDiagnosis?: number;
  hba1c?: number;
  fastingBloodSugar?: number;
  postprandialBloodSugar?: number;
  systolicBP?: number;
  diastolicBP?: number;
  bmi?: number;
  smoking?: boolean;
  physicalActivityLevel?: string;
  familyHistoryDR?: boolean;
}

// ===============================
// BACKEND PAYLOAD
// ===============================
type BackendGender = "Male" | "Female";
type BackendYesNo = "Yes" | "No";

interface BackendPayload {
  age: number;
  gender: BackendGender;
  time_in_hospital: number;
  num_lab_procedures: number;
  num_medications: number;
  number_outpatient: number;
  number_emergency: number;
  number_inpatient: number;
  number_diagnoses: number;
  insulin: BackendYesNo;
  diabetesMed: BackendYesNo;
}

// ===============================
// RAW BACKEND RESPONSE
// ===============================
interface BackendResponse {
  success: boolean;
  probability?: number;
  risk_level?: string;
  recommendation?: string;
  model?: string;
  features_used?: string[];
  error?: string;
  required_features?: string[];
}

// ===============================
// NORMALIZED UI RESULT
// ===============================
export interface PredictionResult {
  riskProbability: number;
  riskLevel: "Low" | "Moderate" | "High";
  contributingFactors: {
    factor: string;
    value: string;
    impact: "low" | "medium" | "high";
  }[];
  recommendations: string[];
  modelInfo: {
    algorithm: string;
    accuracy: number;
    rocAuc: number;
  };
}

const API_BASE_URL =
  import.meta.env.VITE_ML_API_URL || "http://127.0.0.1:8000/api";

// ===============================
// MAPPER
// ===============================
function mapToBackend(data: PatientData): BackendPayload {
  // Gender: map UI-friendly → backend enum
  const uiGender = (data.gender || "").toLowerCase();
  const gender: BackendGender = uiGender === "female" ? "Female" : "Male";

  // Years since diagnosis & control markers are used to create
  // stable, bounded proxies for hospital-utilization style features.
  const years = data.yearsSinceDiagnosis ?? 1;
  const hba1c = data.hba1c ?? 7;
  const bmi = data.bmi ?? 26;
  const activity = (data.physicalActivityLevel || "sedentary").toLowerCase();
  const hasFamilyHistory = data.familyHistoryDR ?? false;
  const isSmoker = data.smoking ?? false;

  // Derive reasonable synthetic hospital metrics.
  const time_in_hospital = Math.max(
    0,
    Math.min(30, Math.round(years / 2 + (hba1c - 7))),
  );

  const num_lab_procedures = Math.max(
    10,
    Math.min(80, Math.round(20 + years * 2 + (hba1c - 6) * 4)),
  );

  const num_medications = Math.max(
    1,
    Math.min(30, Math.round(3 + years / 2 + (bmi - 22) / 2)),
  );

  const number_outpatient = Math.max(
    0,
    Math.min(10, Math.round(years / 3 + (hba1c - 6))),
  );

  const number_emergency = Math.max(
    0,
    Math.min(
      5,
      Math.round(
        (hba1c > 9 ? 2 : 0) +
          (isSmoker ? 1 : 0) +
          (activity === "sedentary" ? 1 : 0),
      ),
    ),
  );

  const number_inpatient = Math.max(
    0,
    Math.min(
      5,
      Math.round(
        years / 5 +
          (hba1c > 8 ? 1 : 0) +
          (hasFamilyHistory ? 1 : 0),
      ),
    ),
  );

  const number_diagnoses = Math.max(
    1,
    Math.min(
      10,
      Math.round(
        3 +
          (years > 5 ? 1 : 0) +
          (bmi > 30 ? 1 : 0) +
          (isSmoker ? 1 : 0),
      ),
    ),
  );

  const insulin: BackendYesNo =
    data.diabetesType === "type1" || hba1c >= 9 ? "Yes" : "No";
  const diabetesMed: BackendYesNo = "Yes";

  return {
    age: data.age ?? 40,
    gender,
    time_in_hospital,
    num_lab_procedures,
    num_medications,
    number_outpatient,
    number_emergency,
    number_inpatient,
    number_diagnoses,
    insulin,
    diabetesMed,
  };
}

// ===============================
// RESPONSE NORMALIZER
// ===============================
function mapBackendToUi(
  response: BackendResponse,
  originalData?: PatientData
): PredictionResult {
  if (!response.success || typeof response.probability !== "number") {
    const detail =
      response.error ||
      "Backend returned an unsuccessful prediction response.";
    throw new Error(detail);
  }

  // Ensure probability is a valid number between 0-100
  let probability = response.probability;
  if (typeof probability !== 'number' || isNaN(probability)) {
    console.warn('⚠️ Invalid probability from backend, defaulting to 0');
    probability = 0;
  }
  // Clamp probability to valid range (0-100)
  probability = Math.max(0, Math.min(100, probability));

  let riskLevel: PredictionResult["riskLevel"];
  const level = (response.risk_level || "").toUpperCase();
  if (level.includes("HIGH")) {
    riskLevel = "High";
  } else if (level.includes("MODERATE")) {
    riskLevel = "Moderate";
  } else if (level.includes("LOW")) {
    riskLevel = "Low";
  } else {
    // Default to Low for "VERY LOW RISK" or unknown
    riskLevel = "Low";
  }

  const recommendationText =
    response.recommendation ||
    "Maintain regular check-ups and follow your physician's advice.";

  // Build detailed contributing factors based on original patient data
  const contributingFactors: PredictionResult["contributingFactors"] = [];

  if (originalData) {
    // HbA1c analysis
    if (originalData.hba1c) {
      let impact: "low" | "medium" | "high" = "low";
      if (originalData.hba1c >= 9) impact = "high";
      else if (originalData.hba1c >= 7.5) impact = "medium";

      contributingFactors.push({
        factor: "HbA1c Level",
        value: `${originalData.hba1c.toFixed(1)}%`,
        impact,
      });
    }

    // Years since diagnosis
    if (originalData.yearsSinceDiagnosis !== undefined) {
      let impact: "low" | "medium" | "high" = "low";
      if (originalData.yearsSinceDiagnosis >= 15) impact = "high";
      else if (originalData.yearsSinceDiagnosis >= 8) impact = "medium";

      contributingFactors.push({
        factor: "Diabetes Duration",
        value: `${originalData.yearsSinceDiagnosis} years`,
        impact,
      });
    }

    // BMI analysis
    if (originalData.bmi) {
      let impact: "low" | "medium" | "high" = "low";
      if (originalData.bmi >= 30) impact = "high";
      else if (originalData.bmi >= 27) impact = "medium";

      contributingFactors.push({
        factor: "Body Mass Index",
        value: `${originalData.bmi.toFixed(1)}`,
        impact,
      });
    }

    // Blood pressure analysis
    if (originalData.systolicBP && originalData.diastolicBP) {
      const isHighBP =
        originalData.systolicBP >= 140 || originalData.diastolicBP >= 90;
      if (isHighBP) {
        contributingFactors.push({
          factor: "Blood Pressure",
          value: `${originalData.systolicBP}/${originalData.diastolicBP} mmHg`,
          impact: "medium",
        });
      }
    }

    // Lifestyle factors
    if (originalData.smoking) {
      contributingFactors.push({
        factor: "Smoking Status",
        value: "Current smoker",
        impact: "high",
      });
    }

    if (originalData.familyHistoryDR) {
      contributingFactors.push({
        factor: "Family History",
        value: "Positive",
        impact: "medium",
      });
    }

    // Physical activity
    if (originalData.physicalActivityLevel) {
      const isSedentary =
        originalData.physicalActivityLevel.toLowerCase() === "sedentary";
      if (isSedentary) {
        contributingFactors.push({
          factor: "Physical Activity",
          value: "Sedentary lifestyle",
          impact: "medium",
        });
      }
    }
  }

  // If no factors were added, add a general one
  if (contributingFactors.length === 0) {
    contributingFactors.push({
      factor: "Overall Risk Profile",
      value: `${probability.toFixed(1)}% estimated risk`,
      impact:
        probability >= 70 ? "high" : probability >= 40 ? "medium" : "low",
    });
  }

  // Build comprehensive recommendations
  const recommendations: string[] = [recommendationText];

  if (originalData) {
    if (originalData.hba1c && originalData.hba1c >= 7) {
      recommendations.push(
        "Focus on improving blood glucose control through medication adherence and dietary modifications."
      );
    }
    if (originalData.bmi && originalData.bmi >= 27) {
      recommendations.push(
        "Consider weight management strategies to reduce overall diabetes complications risk."
      );
    }
    if (originalData.smoking) {
      recommendations.push(
        "Smoking cessation is strongly recommended to reduce diabetic retinopathy risk."
      );
    }
    if (
      originalData.physicalActivityLevel?.toLowerCase() === "sedentary"
    ) {
      recommendations.push(
        "Increase physical activity levels to improve glycemic control and cardiovascular health."
      );
    }
  }

  return {
    riskProbability: probability,
    riskLevel,
    contributingFactors,
    recommendations,
    modelInfo: {
      algorithm:
        response.model || "Deep Learning Neural Network (MLPClassifier)",
      // These are summary metrics from offline evaluation, not per-patient.
      accuracy: 94.95,
      rocAuc: 0.982,
    },
  };
}

// ===============================
// SINGLE EXPORT (IMPORTANT)
// ===============================
export async function predictRisk(
  data: PatientData
): Promise<PredictionResult> {
  const payload = mapToBackend(data);

  console.log("➡️ Sending payload to backend:", payload);
  console.log("📋 Original patient data:", data);

  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorMessage = "Prediction failed";
      try {
        const err = await res.json();
        errorMessage = err.detail || err.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const raw: BackendResponse = await res.json();
    console.log("✅ Raw backend response:", raw);

    const normalized = mapBackendToUi(raw, data);
    console.log("✅ Normalized prediction result:", normalized);

    return normalized;
  } catch (error) {
    console.error("❌ Prediction error:", error);
    throw error;
  }
}
