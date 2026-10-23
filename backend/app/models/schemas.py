from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class FormField(BaseModel):
    id: str
    label: str
    spoken_prompt: str
    help_text: str
    field_type: str = "text"  # name, date, tel, email, select, currency, number, text, textarea
    required: bool = True
    options: Optional[List[str]] = None
    validation_regex: Optional[str] = None
    error_prompt: Optional[str] = None
    example_spoken: Optional[str] = None
    mask_spoken: bool = False  # E.g. for phone numbers, "ending in 3166"


class FormTemplate(BaseModel):
    id: str
    title: str
    category: str
    description: str
    disclaimer: str = "Demo Form: Fictional demonstration for accessibility testing. No real government submission will occur."
    estimated_minutes: int = 3
    fields: List[FormField]


class ParseVoiceInputRequest(BaseModel):
    form_id: Optional[str] = None
    field_id: Optional[str] = None
    transcript: str
    current_value: Optional[str] = None
    language: str = "en"
    mode: str = "filling"  # "filling", "confirming", "review", "navigation"
    form_data: Optional[Dict[str, Any]] = None


class ParseVoiceInputResponse(BaseModel):
    intent: str  # answer, confirm_yes, confirm_no, repeat, skip, go_back, review, submit, stop, help, select_form, cancel, unknown
    extracted_value: Optional[str] = None
    display_value: Optional[str] = None
    spoken_confirmation: Optional[str] = None
    is_valid: bool = True
    validation_error: Optional[str] = None
    spoken_feedback: Optional[str] = None
    target_field_id: Optional[str] = None
    target_form_id: Optional[str] = None
    confidence: float = 1.0


class ReviewSummaryRequest(BaseModel):
    form_id: str
    data: Dict[str, Any]
    language: str = "en"


class ReviewSummaryResponse(BaseModel):
    spoken_summary: str
    formatted_fields: List[Dict[str, Any]]
    missing_required: List[str]
    can_submit: bool


class SubmissionRequest(BaseModel):
    form_id: str
    data: Dict[str, Any]
    applicant_consent: bool = True


class SubmissionResponse(BaseModel):
    success: bool
    reference_number: str
    form_id: str
    form_title: str
    submitted_at: str
    summary: Dict[str, Any]
    is_demo: bool = True
    spoken_receipt: str
