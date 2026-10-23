from fastapi import APIRouter, HTTPException
from typing import List
from ...models.schemas import FormTemplate
from ...services.form_service import form_service

router = APIRouter()

@router.get("", response_model=List[FormTemplate])
def list_forms():
    return form_service.get_all_forms()

@router.get("/{form_id}", response_model=FormTemplate)
def get_form(form_id: str):
    form = form_service.get_form_by_id(form_id)
    if not form:
        raise HTTPException(status_code=404, detail=f"Form '{form_id}' not found.")
    return form
