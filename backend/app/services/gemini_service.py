import re
import json
import logging
from typing import Optional, Dict, Any, Tuple
from ..config import settings
from ..models.schemas import FormField, ParseVoiceInputResponse

logger = logging.getLogger("voicegov-assistant")

# Word-to-number mapping for spoken digits and amounts
NUMBER_WORDS = {
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
    "ten": "10", "eleven": "11", "twelve": "12", "thirteen": "13",
    "fourteen": "14", "fifteen": "15", "sixteen": "16", "seventeen": "17",
    "eighteen": "18", "nineteen": "19", "twenty": "20", "thirty": "30",
    "forty": "40", "fifty": "50", "sixty": "60", "seventy": "70",
    "eighty": "80", "ninety": "90", "hundred": "100"
}

MONTH_MAP = {
    "january": "01", "jan": "01",
    "february": "02", "feb": "02",
    "march": "03", "mar": "03",
    "april": "04", "apr": "04",
    "may": "05",
    "june": "06", "jun": "06",
    "july": "07", "jul": "07",
    "august": "08", "aug": "08",
    "september": "09", "sep": "09", "sept": "09",
    "october": "10", "oct": "10",
    "november": "11", "nov": "11",
    "december": "12", "dec": "12"
}

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self._genai_client = None

        if self.api_key:
            try:
                from google import genai
                self._genai_client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Gemini client successfully")
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI SDK: {e}. Will fallback to rule-based parser.")

    def parse_voice_utterance(
        self,
        transcript: str,
        mode: str = "filling",
        field: Optional[FormField] = None,
        current_value: Optional[str] = None,
        language: str = "en"
    ) -> ParseVoiceInputResponse:
        clean_text = transcript.strip().lower()

        # 1. First, check universal navigation / control commands
        nav_intent = self._detect_navigation_intent(clean_text, mode)
        if nav_intent:
            return nav_intent

        # 2. Check confirmation responses if in confirming mode
        if mode == "confirming":
            if self._is_affirmative(clean_text):
                return ParseVoiceInputResponse(
                    intent="confirm_yes",
                    extracted_value=current_value,
                    display_value=current_value,
                    spoken_feedback="Confirmed.",
                    confidence=0.99
                )
            elif self._is_negative(clean_text):
                return ParseVoiceInputResponse(
                    intent="confirm_no",
                    extracted_value=None,
                    spoken_feedback="Understood. Let's try again.",
                    confidence=0.99
                )

        # 3. If field is provided and mode is filling, parse field value
        if field:
            # Try Gemini if client is ready
            if self._genai_client and len(clean_text) > 1:
                try:
                    gemini_result = self._parse_with_gemini(transcript, field, language)
                    if gemini_result:
                        return gemini_result
                except Exception as e:
                    logger.warning(f"Gemini processing error: {e}. Falling back to rule-based parser.")

            # Rule-based field parser fallback
            return self._rule_based_parse_field(transcript, field)

        # If general navigation mode (e.g. form selection)
        return self._detect_form_selection(transcript)

    def _detect_navigation_intent(self, text: str, mode: str) -> Optional[ParseVoiceInputResponse]:
        # Repeat
        if any(w in text for w in ["repeat", "repeat the question", "say again", "pardon", "what did you say"]):
            return ParseVoiceInputResponse(intent="repeat", spoken_feedback="Repeating the question.")

        # Go back
        if any(w in text for w in ["go back", "previous", "previous question", "back"]):
            return ParseVoiceInputResponse(intent="go_back", spoken_feedback="Going back to the previous question.")

        # Skip
        if any(w in text for w in ["skip", "skip this", "skip this field", "skip question"]):
            return ParseVoiceInputResponse(intent="skip", spoken_feedback="Skipping this field.")

        # Stop / Pause
        if any(w in text for w in ["stop speaking", "shut up", "be quiet", "pause voice", "stop assistant"]):
            return ParseVoiceInputResponse(intent="stop", spoken_feedback="Stopping speech.")

        # Review
        if any(w in text for w in ["review my form", "read my details", "review application", "summary", "read form"]):
            return ParseVoiceInputResponse(intent="review", spoken_feedback="Opening application review.")

        # Submit
        if any(w in text for w in ["submit application", "confirm and submit", "i confirm and submit", "final submit", "submit form"]):
            return ParseVoiceInputResponse(intent="submit", spoken_feedback="Submitting application.")

        # Help
        if any(w in text for w in ["help", "what should i do", "what can i say", "give me help", "instructions"]):
            return ParseVoiceInputResponse(intent="help", spoken_feedback="Here is help.")

        # Cancel / Restart
        if any(w in text for w in ["cancel application", "restart form", "start over", "cancel form", "reset form"]):
            return ParseVoiceInputResponse(intent="cancel", spoken_feedback="Application reset.")

        return None

    def _is_affirmative(self, text: str) -> bool:
        tokens = text.split()
        affirmatives = [
            "yes", "yeah", "yep", "correct", "right", "true", "confirm", "sure",
            "yes it is", "that is correct", "thats right", "perfect", "save it",
            "aamaam", "aam", "sari", "ok", "okay"
        ]
        return any(a in text for a in affirmatives) or any(t in ["yes", "yeah", "yup", "ok", "correct"] for t in tokens)

    def _is_negative(self, text: str) -> bool:
        tokens = text.split()
        negatives = [
            "no", "nope", "wrong", "incorrect", "not correct", "not right",
            "change it", "no that is wrong", "illai", "illaiye"
        ]
        return any(n in text for n in negatives) or any(t in ["no", "nope", "wrong"] for t in tokens)

    def _detect_form_selection(self, text: str) -> ParseVoiceInputResponse:
        t = text.lower()
        if "scholarship" in t or "student" in t or "education" in t or "option 1" in t or "first form" in t:
            return ParseVoiceInputResponse(intent="select_form", target_form_id="scholarship-demo", spoken_feedback="Selected Government Scholarship Application.")
        if "aadhaar" in t or "update address" in t or "demographic" in t or "option 2" in t or "second form" in t:
            return ParseVoiceInputResponse(intent="select_form", target_form_id="aadhaar-update-demo", spoken_feedback="Selected Aadhaar Demographic Update Demo.")
        if "pension" in t or "senior citizen" in t or "old age" in t or "option 3" in t or "third form" in t:
            return ParseVoiceInputResponse(intent="select_form", target_form_id="pension-demo", spoken_feedback="Selected Senior Citizen Pension Scheme Demo.")
        if "income" in t or "certificate" in t or "revenue" in t or "option 4" in t or "fourth form" in t:
            return ParseVoiceInputResponse(intent="select_form", target_form_id="income-cert-demo", spoken_feedback="Selected Income Certificate Application Demo.")
        if "grievance" in t or "public service" in t or "complaint" in t or "option 5" in t:
            return ParseVoiceInputResponse(intent="select_form", target_form_id="generic-gov-demo", spoken_feedback="Selected Public Service Grievance Demo.")

        # If user says "start" or "new application"
        if "start" in t or "new" in t or "begin" in t:
            return ParseVoiceInputResponse(intent="select_form", target_form_id="scholarship-demo", spoken_feedback="Starting the primary Government Scholarship Application demo.")

        return ParseVoiceInputResponse(intent="unknown", spoken_feedback="I didn't recognize that command. Please say help or choose a form.")

    def _rule_based_parse_field(self, transcript: str, field: FormField) -> ParseVoiceInputResponse:
        raw = transcript.strip()
        lower = raw.lower()

        # Handle field types
        if field.field_type == "tel":
            digits = self._extract_digits(raw)
            if len(digits) == 10 and digits[0] in "6789":
                masked = f"ending in {digits[-4:]}"
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=digits,
                    display_value=digits,
                    spoken_confirmation=f"I heard mobile number {masked}. Is that correct? Say yes or no.",
                    is_valid=True
                )
            else:
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=digits,
                    display_value=digits,
                    is_valid=False,
                    validation_error=field.error_prompt or "Your mobile number should contain 10 digits starting with 6, 7, 8, or 9. Please say your mobile number again.",
                    spoken_feedback=field.error_prompt or "Your mobile number should contain 10 digits starting with 6, 7, 8, or 9. Please say your mobile number again."
                )

        elif field.field_type == "name":
            # Strip prefixes like "my name is", "i am", "name is"
            cleaned_name = re.sub(r"^(my name is|i am|this is|name is|myself)\s+", "", raw, flags=re.IGNORECASE).strip()
            # Capitalize words
            cleaned_name = " ".join(word.capitalize() for word in cleaned_name.split())
            if len(cleaned_name) >= 2:
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=cleaned_name,
                    display_value=cleaned_name,
                    spoken_confirmation=f"I heard {cleaned_name}. Is that correct? Say yes or no.",
                    is_valid=True
                )
            else:
                return ParseVoiceInputResponse(
                    intent="answer",
                    is_valid=False,
                    validation_error=field.error_prompt or "Please provide your full legal name.",
                    spoken_feedback=field.error_prompt or "Please provide your full legal name."
                )

        elif field.field_type == "date":
            parsed_date, display_date = self._parse_spoken_date(raw)
            if parsed_date:
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=parsed_date,
                    display_value=display_date,
                    spoken_confirmation=f"I heard {display_date}. Is that correct? Say yes or no.",
                    is_valid=True
                )
            else:
                return ParseVoiceInputResponse(
                    intent="answer",
                    is_valid=False,
                    validation_error=field.error_prompt or "Please say a valid date of birth including day, month, and year.",
                    spoken_feedback=field.error_prompt or "Please say a valid date of birth including day, month, and year, for example: November 15, 2006."
                )

        elif field.field_type == "select":
            matched_option = self._match_select_option(raw, field.options or [])
            if matched_option:
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=matched_option,
                    display_value=matched_option,
                    spoken_confirmation=f"I heard {matched_option}. Is that correct? Say yes or no.",
                    is_valid=True
                )
            else:
                opts = ", ".join(field.options or [])
                return ParseVoiceInputResponse(
                    intent="answer",
                    is_valid=False,
                    validation_error=f"Please choose one of the options: {opts}.",
                    spoken_feedback=f"Please choose one of: {opts}."
                )

        elif field.field_type == "currency" or field.field_type == "number":
            amount = self._parse_spoken_number_or_currency(raw)
            if amount is not None:
                display = f"₹{amount:,}" if field.field_type == "currency" else str(amount)
                spoken_disp = f"{amount} rupees" if field.field_type == "currency" else str(amount)
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=str(amount),
                    display_value=display,
                    spoken_confirmation=f"I heard {spoken_disp}. Is that correct? Say yes or no.",
                    is_valid=True
                )
            else:
                return ParseVoiceInputResponse(
                    intent="answer",
                    is_valid=False,
                    validation_error=field.error_prompt or "Please provide a valid numeric value.",
                    spoken_feedback=field.error_prompt or "Please provide a valid numeric value."
                )

        elif field.field_type == "email":
            # Extract email or normalize "at" / "dot"
            norm_email = self._normalize_spoken_email(raw)
            email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
            if re.match(email_regex, norm_email):
                return ParseVoiceInputResponse(
                    intent="answer",
                    extracted_value=norm_email,
                    display_value=norm_email,
                    spoken_confirmation=f"I heard {norm_email}. Is that correct? Say yes or no.",
                    is_valid=True
                )
            else:
                return ParseVoiceInputResponse(
                    intent="answer",
                    is_valid=False,
                    validation_error=field.error_prompt or "Please provide a valid email address.",
                    spoken_feedback=field.error_prompt or "Please provide a valid email address, or say skip."
                )

        # Default text / textarea
        cleaned_text = re.sub(r"^(my answer is|i want to say|it is|it's)\s+", "", raw, flags=re.IGNORECASE).strip()
        cleaned_text = cleaned_text[0].upper() + cleaned_text[1:] if cleaned_text else ""
        return ParseVoiceInputResponse(
            intent="answer",
            extracted_value=cleaned_text,
            display_value=cleaned_text,
            spoken_confirmation=f"I heard {cleaned_text}. Is that correct? Say yes or no.",
            is_valid=True
        )

    def _extract_digits(self, text: str) -> str:
        words = text.lower().replace("-", " ").split()
        digits = []
        for word in words:
            if word in NUMBER_WORDS:
                digits.append(NUMBER_WORDS[word])
            elif word.isdigit():
                digits.append(word)
        joined = "".join(digits)
        # Also clean direct digits in text
        if not joined:
            joined = re.sub(r"\D", "", text)
        return joined

    def _parse_spoken_date(self, text: str) -> Tuple[Optional[str], Optional[str]]:
        t = text.lower().replace(",", " ").replace("-", " ").replace("/", " ")
        words = t.split()

        # Check for month word
        found_month = None
        found_month_name = None
        for word in words:
            if word in MONTH_MAP:
                found_month = MONTH_MAP[word]
                found_month_name = word.capitalize()
                break

        # Extract all numbers
        nums = []
        for word in words:
            clean_word = re.sub(r"(st|nd|rd|th)$", "", word)
            if clean_word in NUMBER_WORDS:
                num_val = int(NUMBER_WORDS[clean_word])
                nums.append(num_val)
            elif clean_word.isdigit():
                nums.append(int(clean_word))

        day = None
        year = None

        if found_month:
            for num in nums:
                if 1 <= num <= 31 and day is None:
                    day = num
                elif num >= 1900 and year is None:
                    year = num

            if day and year:
                iso_date = f"{year:04d}-{found_month}-{day:02d}"
                display_date = f"{found_month_name} {day}, {year}"
                return iso_date, display_date
        else:
            # If spoken as digits: e.g. 15 11 2006
            if len(nums) == 3:
                d, m, y = nums[0], nums[1], nums[2]
                if y < 100:
                    y += 2000 if y < 50 else 1900
                if 1 <= m <= 12 and 1 <= d <= 31:
                    iso_date = f"{y:04d}-{m:02d}-{d:02d}"
                    display_date = f"{d:02d}/{m:02d}/{y:04d}"
                    return iso_date, display_date

        return None, None

    def _match_select_option(self, text: str, options: list[str]) -> Optional[str]:
        t = text.lower()
        # Direct exact or substring match
        for opt in options:
            if opt.lower() in t or t in opt.lower():
                return opt

        # Semantic keywords
        if "male" in t and "female" not in t:
            return "Male"
        if "female" in t or "woman" in t or "girl" in t:
            return "Female"
        if "other" in t or "transgender" in t:
            return "Other"

        # Education level synonyms
        if "college" in t or "degree" in t or "bachelor" in t or "ug" in t or "undergrad" in t:
            return "Undergraduate"
        if "school" in t or "12th" in t or "plus two" in t or "+2" in t or "higher secondary" in t or "inter" in t:
            return "Higher Secondary"
        if "master" in t or "pg" in t or "postgrad" in t or "msc" in t or "mtech" in t:
            return "Postgraduate"
        if "polytechnic" in t or "diploma" in t:
            return "Diploma"

        # Scholarship categories
        if "merit" in t or "means" in t:
            return "Merit-cum-Means"
        if "post matric" in t or "post-matric" in t:
            return "Post-Matric"
        if "pre matric" in t or "pre-matric" in t:
            return "Pre-Matric"
        if "higher" in t or "support" in t:
            return "Higher Education Support"

        # Marital status
        if "married" in t and "unmarried" not in t:
            return "Married"
        if "unmarried" in t or "single" in t:
            return "Unmarried"
        if "widow" in t:
            return "Widowed"

        # Update reasons
        if "address" in t:
            return "Address Change"
        if "mobile" in t or "phone" in t:
            return "Mobile Number Update"
        if "name" in t:
            return "Name Correction"

        # Grievance department
        if "water" in t:
            return "Water Supply"
        if "electric" in t or "power" in t:
            return "Electricity"
        if "road" in t or "bridge" in t or "pothole" in t:
            return "Roads and Bridges"
        if "health" in t or "hospital" in t:
            return "Health"

        return None

    def _parse_spoken_number_or_currency(self, text: str) -> Optional[int]:
        t = text.lower().replace(",", " ").replace("rupees", " ").replace("rs", " ")

        # Look for lakhs multiplier
        lakh_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)", t)
        if lakh_match:
            try:
                num = float(lakh_match.group(1))
                return int(num * 100000)
            except ValueError:
                pass

        # Spoken words like "one lakh fifty thousand"
        if "lakh" in t or "thousand" in t or "crore" in t:
            total = 0
            curr = 0
            words = t.split()
            for word in words:
                if word in NUMBER_WORDS:
                    val = int(NUMBER_WORDS[word])
                    curr += val
                elif word.isdigit():
                    curr += int(word)
                elif word in ["lakh", "lakhs", "lac", "lacs"]:
                    total += (curr or 1) * 100000
                    curr = 0
                elif word in ["thousand", "thousands"]:
                    total += (curr or 1) * 1000
                    curr = 0
                elif word in ["crore", "crores"]:
                    total += (curr or 1) * 10000000
                    curr = 0
            total += curr
            if total > 0:
                return total

        # Check pure digits
        digits = re.sub(r"[^\d]", "", t)
        if digits:
            try:
                return int(digits)
            except ValueError:
                pass

        return None

    def _normalize_spoken_email(self, text: str) -> str:
        t = text.lower().strip()
        t = t.replace(" at the rate ", "@").replace(" at the rate of ", "@").replace(" at ", "@")
        t = t.replace(" dot ", ".").replace(" point ", ".")
        t = re.sub(r"\s+", "", t)
        return t

    def _parse_with_gemini(
        self,
        transcript: str,
        field: FormField,
        language: str = "en"
    ) -> Optional[ParseVoiceInputResponse]:
        """Calls Gemini model to intelligently extract structured values from natural conversational speech."""
        prompt = f"""
You are an accessibility voice assistant parser for VoiceGov Assist.
A user answered a government form question. Extract the exact value, validate it, and format a spoken confirmation.

Field Information:
- Field ID: {field.id}
- Label: {field.label}
- Spoken Prompt: {field.spoken_prompt}
- Field Type: {field.field_type}
- Required: {field.required}
- Options: {field.options}
- Validation Regex: {field.validation_regex}
- Error Prompt: {field.error_prompt}
- Spoken Masking: {field.mask_spoken}

User Spoken Utterance: "{transcript}"

Return ONLY a valid JSON object with the following keys:
{{
  "intent": "answer" or navigation intent like "repeat", "go_back", "skip", "help", "cancel", "submit", "review",
  "extracted_value": "cleaned normalized value (e.g. 'Jaya Prakash', '2006-11-15', '9876543210', 'Undergraduate', '150000')",
  "display_value": "user-friendly display string",
  "spoken_confirmation": "A natural, warm confirmation sentence, e.g., 'I heard Jaya Prakash. Is that correct? Say yes or no.' (If phone number, mask as 'ending in 3166')",
  "is_valid": true or false,
  "validation_error": null or "clear error explanation if value is invalid",
  "spoken_feedback": null or "spoken feedback for error"
}}
"""
        response = self._genai_client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        if not response or not response.text:
            return None

        # Clean JSON markdown fences
        text = response.text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```[a-z]*\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        data = json.loads(text)
        return ParseVoiceInputResponse(
            intent=data.get("intent", "answer"),
            extracted_value=data.get("extracted_value"),
            display_value=data.get("display_value"),
            spoken_confirmation=data.get("spoken_confirmation"),
            is_valid=data.get("is_valid", True),
            validation_error=data.get("validation_error"),
            spoken_feedback=data.get("spoken_feedback"),
            confidence=0.95
        )

gemini_service = GeminiService()
