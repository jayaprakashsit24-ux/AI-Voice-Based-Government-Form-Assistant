import random
import datetime
from typing import Dict, Any, List
from ..models.schemas import (
    SubmissionRequest,
    SubmissionResponse,
    ReviewSummaryRequest,
    ReviewSummaryResponse
)
from .form_service import form_service

# In-memory store for demo submissions
DEMO_SUBMISSIONS_DB: Dict[str, Dict[str, Any]] = {}

class SubmissionService:
    @staticmethod
    def generate_review_summary(request: ReviewSummaryRequest) -> ReviewSummaryResponse:
        form = form_service.get_form_by_id(request.form_id)
        if not form:
            return ReviewSummaryResponse(
                spoken_summary="Form not found.",
                formatted_fields=[],
                missing_required=[],
                can_submit=False
            )

        spoken_lines: List[str] = ["Here is your application summary."]
        formatted_fields: List[Dict[str, Any]] = []
        missing_required: List[str] = []

        for field in form.fields:
            raw_val = request.data.get(field.id)
            if raw_val is None or str(raw_val).strip() == "":
                if field.required:
                    missing_required.append(field.label)
                formatted_fields.append({
                    "id": field.id,
                    "label": field.label,
                    "value": "Not provided",
                    "display": "Not provided",
                    "required": field.required,
                    "is_missing": field.required
                })
            else:
                str_val = str(raw_val)
                display_val = str_val
                spoken_val = str_val

                if field.mask_spoken and len(str_val) >= 4:
                    spoken_val = f"ending in {str_val[-4:]}"
                    display_val = f"XXXXXX{str_val[-4:]}"
                elif field.field_type == "currency":
                    display_val = f"₹{int(str_val):,}" if str_val.isdigit() else str_val
                    spoken_val = f"{str_val} rupees"

                spoken_lines.append(f"{field.label}: {spoken_val}.")
                formatted_fields.append({
                    "id": field.id,
                    "label": field.label,
                    "value": str_val,
                    "display": display_val,
                    "required": field.required,
                    "is_missing": False
                })

        can_submit = len(missing_required) == 0

        if not can_submit:
            missing_text = ", ".join(missing_required)
            spoken_lines.append(f"Warning: The following required fields are missing: {missing_text}. Please provide them before submitting.")
        else:
            spoken_lines.append("All required fields are completed. Would you like to edit any information, or say 'I confirm and submit'?")

        return ReviewSummaryResponse(
            spoken_summary=" ".join(spoken_lines),
            formatted_fields=formatted_fields,
            missing_required=missing_required,
            can_submit=can_submit
        )

    @staticmethod
    def submit_application(request: SubmissionRequest) -> SubmissionResponse:
        form = form_service.get_form_by_id(request.form_id)
        form_title = form.title if form else "Government Demo Application"

        # Generate realistic demo reference code: DEMO-<CATEGORY_PREFIX>-<YEAR>-<RANDOM>
        cat_prefix = request.form_id.split("-")[0].upper()[:3]
        year = datetime.datetime.now().year
        rand_id = random.randint(10000, 99999)
        ref_number = f"DEMO-{cat_prefix}-{year}-{rand_id}"

        submission_record = {
            "reference_number": ref_number,
            "form_id": request.form_id,
            "form_title": form_title,
            "submitted_at": datetime.datetime.now().isoformat(),
            "data": request.data,
            "is_demo": True
        }

        DEMO_SUBMISSIONS_DB[ref_number] = submission_record

        applicant_name = request.data.get("applicant_name") or request.data.get("full_name") or request.data.get("citizen_name") or "Applicant"

        spoken_receipt = (
            f"Congratulations {applicant_name}! Your demo application for {form_title} has been successfully recorded. "
            f"Your simulated application reference number is {ref_number}. "
            f"Please note this is a prototype demonstration for accessibility evaluation."
        )

        return SubmissionResponse(
            success=True,
            reference_number=ref_number,
            form_id=request.form_id,
            form_title=form_title,
            submitted_at=submission_record["submitted_at"],
            summary=request.data,
            is_demo=True,
            spoken_receipt=spoken_receipt
        )

    @staticmethod
    def get_submission(ref_number: str) -> Dict[str, Any]:
        return DEMO_SUBMISSIONS_DB.get(ref_number)

submission_service = SubmissionService()
