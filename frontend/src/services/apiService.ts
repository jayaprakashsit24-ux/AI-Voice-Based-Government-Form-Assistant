import type { FormTemplate, ParseVoiceResponse, ReviewResponse, SubmissionResponse } from '../types/form';

const API_BASE = '/api';

export const apiService = {
  async getForms(): Promise<FormTemplate[]> {
    try {
      const res = await fetch(`${API_BASE}/forms`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getForms failed, falling back to embedded templates:', err);
      return [];
    }
  },

  async getForm(formId: string): Promise<FormTemplate | null> {
    try {
      const res = await fetch(`${API_BASE}/forms/${formId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`API getForm(${formId}) failed:`, err);
      return null;
    }
  },

  async parseVoiceInput(payload: {
    form_id?: string;
    field_id?: string;
    transcript: string;
    current_value?: string;
    language?: string;
    mode?: string;
  }): Promise<ParseVoiceResponse> {
    try {
      const res = await fetch(`${API_BASE}/assistant/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API parseVoiceInput failed:', err);
      return {
        intent: 'unknown',
        is_valid: true,
        extracted_value: payload.transcript,
        display_value: payload.transcript,
        spoken_confirmation: `I heard ${payload.transcript}. Is that correct? Say yes or no.`,
        confidence: 0.7,
      };
    }
  },

  async generateReview(payload: {
    form_id: string;
    data: Record<string, any>;
    language?: string;
  }): Promise<ReviewResponse> {
    try {
      const res = await fetch(`${API_BASE}/assistant/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API generateReview failed:', err);
      return {
        spoken_summary: 'Unable to connect to backend for summary.',
        formatted_fields: [],
        missing_required: [],
        can_submit: true,
      };
    }
  },

  async submitApplication(payload: {
    form_id: string;
    data: Record<string, any>;
    applicant_consent?: boolean;
  }): Promise<SubmissionResponse> {
    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, applicant_consent: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API submitApplication failed, generating local fallback receipt:', err);
      const randNum = Math.floor(10000 + Math.random() * 90000);
      return {
        success: true,
        reference_number: `DEMO-LOC-2026-${randNum}`,
        form_id: payload.form_id,
        form_title: 'Demo Government Application',
        submitted_at: new Date().toISOString(),
        summary: payload.data,
        is_demo: true,
        spoken_receipt: `Your demo application has been saved. Your reference number is DEMO-LOC-2026-${randNum}.`,
      };
    }
  },
};
