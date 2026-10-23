from fastapi import APIRouter
from ...models.schemas import (
    ParseVoiceInputRequest,
    ParseVoiceInputResponse,
    ReviewSummaryRequest,
    ReviewSummaryResponse
)
from ...services.gemini_service import gemini_service
from ...services.form_service import form_service
from ...services.submission_service import submission_service

router = APIRouter()

@router.post("/parse", response_model=ParseVoiceInputResponse)
def parse_voice_input(request: ParseVoiceInputRequest):
    field = None
    if request.form_id and request.field_id:
        field = form_service.get_field_by_id(request.form_id, request.field_id)

    return gemini_service.parse_voice_utterance(
        transcript=request.transcript,
        mode=request.mode,
        field=field,
        current_value=request.current_value,
        language=request.language
    )

@router.post("/review", response_model=ReviewSummaryResponse)
def generate_review(request: ReviewSummaryRequest):
    return submission_service.generate_review_summary(request)
