from fastapi import APIRouter, HTTPException
from ...models.schemas import SubmissionRequest, SubmissionResponse
from ...services.submission_service import submission_service

router = APIRouter()

@router.post("", response_model=SubmissionResponse)
def submit_form(request: SubmissionRequest):
    return submission_service.submit_application(request)

@router.get("/{reference_number}")
def get_submission(reference_number: str):
    record = submission_service.get_submission(reference_number)
    if not record:
        raise HTTPException(status_code=404, detail="Submission reference not found.")
    return record
