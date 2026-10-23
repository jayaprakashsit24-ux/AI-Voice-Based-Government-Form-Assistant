export type VoiceAssistantState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'confirming'
  | 'review'
  | 'completed'
  | 'error';

export interface FormField {
  id: string;
  label: string;
  spoken_prompt: string;
  help_text: string;
  field_type: 'text' | 'name' | 'date' | 'tel' | 'email' | 'select' | 'currency' | 'number' | 'textarea';
  required: boolean;
  options?: string[];
  validation_regex?: string;
  error_prompt?: string;
  example_spoken?: string;
  mask_spoken?: boolean;
}

export interface FormTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  disclaimer: string;
  estimated_minutes: number;
  fields: FormField[];
}

export interface ParseVoiceResponse {
  intent: string;
  extracted_value?: string;
  display_value?: string;
  spoken_confirmation?: string;
  is_valid: boolean;
  validation_error?: string;
  spoken_feedback?: string;
  target_field_id?: string;
  target_form_id?: string;
  confidence: number;
}

export interface ReviewResponse {
  spoken_summary: string;
  formatted_fields: {
    id: string;
    label: string;
    value: string;
    display: string;
    required: boolean;
    is_missing: boolean;
  }[];
  missing_required: string[];
  can_submit: boolean;
}

export interface SubmissionResponse {
  success: boolean;
  reference_number: string;
  form_id: string;
  form_title: string;
  submitted_at: string;
  summary: Record<string, any>;
  is_demo: boolean;
  spoken_receipt: string;
}

export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voiceURI?: string;
  language: 'en' | 'ta';
}
