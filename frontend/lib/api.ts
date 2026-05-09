/**
 * 调用后端 API 的封装
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PredictInput {
  Gender: string;        // "Female" | "Male"
  Age: number;
  Height: number;        // 米
  Weight: number;        // 千克
  family_history_with_overweight: string;  // "yes" | "no"
  FAVC: string;          // "yes" | "no"
  FCVC: number;          // 1-3
  NCP: number;
  CAEC: string;          // "no" | "Sometimes" | "Frequently" | "Always"
  SMOKE: string;
  CH2O: number;          // 1-3
  SCC: string;
  FAF: number;           // 0-3
  TUE: number;           // 0-2
  CALC: string;
  MTRANS: string;
}

export interface PredictResponse {
  success: boolean;
  prediction: {
    label_en: string;
    label_zh: string;
    message: string;
    confidence: number;
  };
  bmi: number;
  probabilities: Array<{
    label_en: string;
    label_zh: string;
    probability: number;
  }>;
  shap_explanations: Array<{
    feature: string;
    feature_zh: string;
    value: number;
    abs_value: number;
  }>;
}

export async function predict(input: PredictInput): Promise<PredictResponse> {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 错误 (${res.status}): ${errText}`);
  }

  return res.json();
}
