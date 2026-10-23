from typing import List, Optional, Dict
from ..models.schemas import FormTemplate, FormField

DEMO_FORMS: List[FormTemplate] = [
    FormTemplate(
        id="scholarship-demo",
        title="Government Scholarship Application",
        category="Education & Student Welfare",
        description="Voice-assisted application for National Post-Matric & Merit Scholarship schemes. Suitable for school and college students.",
        disclaimer="DEMO ONLY: Fictional demonstration for accessibility testing. No actual government portal connection or real submission.",
        estimated_minutes=3,
        fields=[
            FormField(
                id="applicant_name",
                label="Full Name of Applicant",
                spoken_prompt="What is your full name?",
                help_text="Please state your full legal name as it appears on your school or college certificates.",
                field_type="name",
                required=True,
                example_spoken="Jaya Prakash",
                error_prompt="Please provide your full legal name."
            ),
            FormField(
                id="dob",
                label="Date of Birth",
                spoken_prompt="What is your date of birth?",
                help_text="Please state your date of birth. You can say date, month, and year, for example: November 15, 2006.",
                field_type="date",
                required=True,
                example_spoken="November 15, 2006",
                error_prompt="Please say a valid date of birth including day, month, and year."
            ),
            FormField(
                id="gender",
                label="Gender",
                spoken_prompt="What is your gender? Male, Female, or Other?",
                help_text="State Male, Female, or Other.",
                field_type="select",
                options=["Male", "Female", "Other"],
                required=True,
                example_spoken="Male",
                error_prompt="Please select Male, Female, or Other."
            ),
            FormField(
                id="mobile_number",
                label="10-Digit Mobile Number",
                spoken_prompt="What is your 10-digit mobile number?",
                help_text="State your 10-digit mobile phone number digits clearly.",
                field_type="tel",
                required=True,
                validation_regex=r"^[6-9]\d{9}$",
                example_spoken="9876543210",
                error_prompt="Your mobile number should contain 10 digits starting with 6, 7, 8, or 9. Please say your mobile number again.",
                mask_spoken=True
            ),
            FormField(
                id="email",
                label="Email Address",
                spoken_prompt="What is your email address?",
                help_text="Say your email address or say 'skip' if you do not have one.",
                field_type="email",
                required=False,
                validation_regex=r"^[\w\.-]+@[\w\.-]+\.\w+$",
                example_spoken="jayaprakash@example.com",
                error_prompt="Please provide a valid email address with an at-sign and domain name, or say skip."
            ),
            FormField(
                id="state",
                label="State / Union Territory",
                spoken_prompt="Which State or Union Territory do you reside in?",
                help_text="State your home state, for example: Tamil Nadu, Karnataka, Maharashtra, or Kerala.",
                field_type="text",
                required=True,
                example_spoken="Tamil Nadu",
                error_prompt="Please state the name of your State or Union Territory."
            ),
            FormField(
                id="district",
                label="District",
                spoken_prompt="Which district are you from?",
                help_text="State your district, for example: Coimbatore, Chennai, or Madurai.",
                field_type="text",
                required=True,
                example_spoken="Coimbatore",
                error_prompt="Please state your district name."
            ),
            FormField(
                id="education_level",
                label="Current Education Level",
                spoken_prompt="What is your current education level? Higher Secondary, Undergraduate, Postgraduate, or Diploma?",
                help_text="Choose Higher Secondary, Undergraduate, Postgraduate, or Diploma.",
                field_type="select",
                options=["Higher Secondary", "Undergraduate", "Postgraduate", "Diploma"],
                required=True,
                example_spoken="Undergraduate",
                error_prompt="Please select one of: Higher Secondary, Undergraduate, Postgraduate, or Diploma."
            ),
            FormField(
                id="annual_income",
                label="Annual Family Income (INR)",
                spoken_prompt="What is your annual family income in rupees?",
                help_text="State your total family income in rupees per year, for example: one lakh fifty thousand, or eighty thousand.",
                field_type="currency",
                required=True,
                example_spoken="150000",
                error_prompt="Please state a valid family income amount in rupees."
            ),
            FormField(
                id="scholarship_category",
                label="Scholarship Scheme Category",
                spoken_prompt="Which scholarship category are you applying for? Merit-cum-Means, Post-Matric, Pre-Matric, or Higher Education Support?",
                help_text="Select Merit-cum-Means, Post-Matric, Pre-Matric, or Higher Education Support.",
                field_type="select",
                options=["Merit-cum-Means", "Post-Matric", "Pre-Matric", "Higher Education Support"],
                required=True,
                example_spoken="Merit-cum-Means",
                error_prompt="Please choose one of the available scholarship categories."
            ),
        ]
    ),
    FormTemplate(
        id="aadhaar-update-demo",
        title="Aadhaar Demographic Update Demo",
        category="Civil & Identification Records",
        description="Demo prototype for updating residential address and contact details. No actual Aadhaar server connection or biometrics.",
        disclaimer="DEMO ONLY: Fictional simulation. Never enter your actual 12-digit Aadhaar UID. Only mock demographic updates are simulated.",
        estimated_minutes=2,
        fields=[
            FormField(
                id="full_name",
                label="Full Name as in Existing Card",
                spoken_prompt="What is your full name as printed on your card?",
                help_text="Speak your full name.",
                field_type="name",
                required=True,
                example_spoken="Jaya Prakash",
                error_prompt="Please state your full name."
            ),
            FormField(
                id="mobile_number",
                label="Registered Mobile Number",
                spoken_prompt="What is your 10-digit mobile number?",
                help_text="Speak your 10-digit mobile number.",
                field_type="tel",
                required=True,
                validation_regex=r"^[6-9]\d{9}$",
                example_spoken="9876543210",
                error_prompt="Please say your 10-digit mobile number.",
                mask_spoken=True
            ),
            FormField(
                id="address_line",
                label="New Residential Address",
                spoken_prompt="What is your new residential street address?",
                help_text="Speak your street address or house number and locality.",
                field_type="text",
                required=True,
                example_spoken="12 Gandhi Road, RS Puram",
                error_prompt="Please provide your street address."
            ),
            FormField(
                id="district",
                label="District",
                spoken_prompt="What is your district?",
                help_text="Speak your district name.",
                field_type="text",
                required=True,
                example_spoken="Coimbatore",
                error_prompt="Please provide your district."
            ),
            FormField(
                id="pin_code",
                label="Postal PIN Code",
                spoken_prompt="What is your 6-digit postal PIN code?",
                help_text="Say your 6-digit postal code.",
                field_type="number",
                required=True,
                validation_regex=r"^\d{6}$",
                example_spoken="641002",
                error_prompt="Postal PIN code must be 6 digits. Please say your PIN code again."
            ),
            FormField(
                id="state",
                label="State",
                spoken_prompt="What is your state?",
                help_text="Speak your state name.",
                field_type="text",
                required=True,
                example_spoken="Tamil Nadu",
                error_prompt="Please say your state name."
            ),
            FormField(
                id="update_reason",
                label="Reason for Update",
                spoken_prompt="What is the reason for update? Address Change, Mobile Number Update, or Name Correction?",
                help_text="Choose Address Change, Mobile Number Update, or Name Correction.",
                field_type="select",
                options=["Address Change", "Mobile Number Update", "Name Correction"],
                required=True,
                example_spoken="Address Change",
                error_prompt="Please select one of the update reasons."
            ),
        ]
    ),
    FormTemplate(
        id="pension-demo",
        title="Senior Citizen Pension Application Demo",
        category="Social Welfare & Pensions",
        description="Voice-based application for old age monthly pension assistance for senior citizens.",
        disclaimer="DEMO ONLY: Simulated social pension application for testing accessibility voice flows.",
        estimated_minutes=3,
        fields=[
            FormField(
                id="full_name",
                label="Applicant Full Name",
                spoken_prompt="What is the applicant's full name?",
                help_text="State the full name of the senior citizen.",
                field_type="name",
                required=True,
                example_spoken="Ramasamy Gounder",
                error_prompt="Please state the applicant's full name."
            ),
            FormField(
                id="dob",
                label="Date of Birth",
                spoken_prompt="What is the applicant's date of birth?",
                help_text="State date of birth with day, month, and year.",
                field_type="date",
                required=True,
                example_spoken="May 10, 1958",
                error_prompt="Please state a valid date of birth."
            ),
            FormField(
                id="mobile_number",
                label="Contact Mobile Number",
                spoken_prompt="What is your 10-digit contact mobile number?",
                help_text="State your 10-digit mobile number.",
                field_type="tel",
                required=True,
                validation_regex=r"^[6-9]\d{9}$",
                example_spoken="9842134567",
                error_prompt="Please provide a valid 10-digit mobile number.",
                mask_spoken=True
            ),
            FormField(
                id="marital_status",
                label="Marital Status",
                spoken_prompt="What is your marital status? Married, Unmarried, or Widowed?",
                help_text="Choose Married, Unmarried, or Widowed.",
                field_type="select",
                options=["Married", "Unmarried", "Widowed"],
                required=True,
                example_spoken="Widowed",
                error_prompt="Please choose Married, Unmarried, or Widowed."
            ),
            FormField(
                id="bank_account_last4",
                label="Bank Account Last 4 Digits",
                spoken_prompt="What are the last 4 digits of your savings bank account?",
                help_text="Say the last four digits of your bank account for verification.",
                field_type="number",
                required=True,
                validation_regex=r"^\d{4}$",
                example_spoken="4589",
                error_prompt="Please provide exactly 4 digits."
            ),
            FormField(
                id="district",
                label="District",
                spoken_prompt="Which district do you reside in?",
                help_text="State your district.",
                field_type="text",
                required=True,
                example_spoken="Salem",
                error_prompt="Please state your district."
            ),
            FormField(
                id="annual_income",
                label="Annual Family Income (INR)",
                spoken_prompt="What is your annual household income in rupees?",
                help_text="State your household income, for example: 40000.",
                field_type="currency",
                required=True,
                example_spoken="40000",
                error_prompt="Please state your income amount."
            ),
        ]
    ),
    FormTemplate(
        id="income-cert-demo",
        title="Income Certificate Application Demo",
        category="Revenue & District Administration",
        description="Demo application for obtaining an official family income certificate through voice guidance.",
        disclaimer="DEMO ONLY: Fictional revenue department demonstration.",
        estimated_minutes=2,
        fields=[
            FormField(
                id="applicant_name",
                label="Applicant Name",
                spoken_prompt="What is your full name?",
                help_text="Say your full name.",
                field_type="name",
                required=True,
                example_spoken="Kavitha Subramaniam",
                error_prompt="Please say your full name."
            ),
            FormField(
                id="guardian_name",
                label="Father / Husband / Guardian Name",
                spoken_prompt="What is your father or guardian's full name?",
                help_text="Say father, husband, or guardian name.",
                field_type="name",
                required=True,
                example_spoken="Subramaniam Natarajan",
                error_prompt="Please state guardian name."
            ),
            FormField(
                id="occupation",
                label="Primary Occupation",
                spoken_prompt="What is the primary family occupation? Agriculture, Private Job, Self-Employed, or Daily Wage?",
                help_text="State your occupation.",
                field_type="select",
                options=["Agriculture", "Private Job", "Self-Employed", "Daily Wage", "Other"],
                required=True,
                example_spoken="Agriculture",
                error_prompt="Please choose your primary occupation."
            ),
            FormField(
                id="annual_family_income",
                label="Total Annual Family Income (INR)",
                spoken_prompt="What is your total annual family income in rupees?",
                help_text="Say your total family income in rupees.",
                field_type="currency",
                required=True,
                example_spoken="95000",
                error_prompt="Please state your annual income in rupees."
            ),
            FormField(
                id="district",
                label="District",
                spoken_prompt="Which district do you reside in?",
                help_text="State your district name.",
                field_type="text",
                required=True,
                example_spoken="Tiruppur",
                error_prompt="Please state your district."
            ),
            FormField(
                id="taluk",
                label="Taluk / Sub-District",
                spoken_prompt="Which taluk do you belong to?",
                help_text="State your taluk.",
                field_type="text",
                required=True,
                example_spoken="Dharapuram",
                error_prompt="Please state your taluk name."
            ),
        ]
    ),
    FormTemplate(
        id="generic-gov-demo",
        title="Public Service Grievance Demo",
        category="General Citizen Services",
        description="Demo for registering citizen grievances or public service requests entirely through voice.",
        disclaimer="DEMO ONLY: Simulated grievance redressal portal.",
        estimated_minutes=2,
        fields=[
            FormField(
                id="citizen_name",
                label="Citizen Name",
                spoken_prompt="What is your full name?",
                help_text="State your full name.",
                field_type="name",
                required=True,
                example_spoken="Anand Kumar",
                error_prompt="Please state your full name."
            ),
            FormField(
                id="contact_number",
                label="10-Digit Contact Number",
                spoken_prompt="What is your 10-digit mobile number?",
                help_text="State your 10-digit mobile number.",
                field_type="tel",
                required=True,
                validation_regex=r"^[6-9]\d{9}$",
                example_spoken="9876543210",
                error_prompt="Please state a valid 10-digit mobile number.",
                mask_spoken=True
            ),
            FormField(
                id="service_department",
                label="Department",
                spoken_prompt="Which department is this regarding? Water Supply, Electricity, Roads and Bridges, or Health?",
                help_text="Choose Water Supply, Electricity, Roads and Bridges, or Health.",
                field_type="select",
                options=["Water Supply", "Electricity", "Roads and Bridges", "Health", "Other"],
                required=True,
                example_spoken="Water Supply",
                error_prompt="Please select the appropriate department."
            ),
            FormField(
                id="district",
                label="District",
                spoken_prompt="Which district does this request belong to?",
                help_text="State your district.",
                field_type="text",
                required=True,
                example_spoken="Madurai",
                error_prompt="Please state your district."
            ),
            FormField(
                id="grievance_summary",
                label="Grievance / Request Summary",
                spoken_prompt="Please speak a brief description of your service request or grievance.",
                help_text="Speak your problem clearly.",
                field_type="textarea",
                required=True,
                example_spoken="Street light repair needed on 4th cross street.",
                error_prompt="Please describe the grievance or service request."
            ),
        ]
    )
]

class FormService:
    @staticmethod
    def get_all_forms() -> List[FormTemplate]:
        return DEMO_FORMS

    @staticmethod
    def get_form_by_id(form_id: str) -> Optional[FormTemplate]:
        for form in DEMO_FORMS:
            if form.id == form_id:
                return form
        return None

    @staticmethod
    def get_field_by_id(form_id: str, field_id: str) -> Optional[FormField]:
        form = FormService.get_form_by_id(form_id)
        if not form:
            return None
        for field in form.fields:
            if field.id == field_id:
                return field
        return None

form_service = FormService()
