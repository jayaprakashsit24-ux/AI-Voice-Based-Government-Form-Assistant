# VoiceGov Assist 🇮🇳🎙️
### Accessible AI Voice-Based Government Form Assistant

> **Empowering visually impaired, blind, elderly, and motor-impaired citizens to discover, fill, verify, and submit government applications completely hands-free using voice.**

---

## 🌟 Overview & Problem Statement

Millions of citizens—including visually impaired individuals, senior citizens, and people with motor impairments—face insurmountable digital barriers when trying to access essential government schemes, scholarships, and pensions online. Complex digital portals require visual verification, mouse coordination, dense multi-step screens, and confusing input formats.

**VoiceGov Assist** solves this challenge by transforming government form filling into an accessible, conversational voice experience. It guides users step-by-step, asks clear questions aloud, understands spoken answers naturally via Gemini AI & Web Speech, confirms each response, checks for errors, reads back a full spoken summary, and issues a simulated application reference number.

---

## 🎯 Target Users
- **Visually Impaired & Blind Citizens**: No eyesight or screen-watching needed; real-time audio earcons and voice feedback guide every step.
- **Senior Citizens / Elderly**: Eliminates tiny fonts, tedious typing, and confusing navigation menus.
- **Motor-Impaired Users**: Operates 100% hands-free without a keyboard or mouse.
- **Multilingual / Rural Citizens**: Designed with dual-language architecture (English + Tamil preview).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons |
| **Speech-to-Text** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **Text-to-Speech** | Web SpeechSynthesis API with pitch, rate, and voice controls |
| **Earcon Audio Cues** | Web Audio API Synthesizer (instant melodic tones for listen, settle, success, confirm, and warning) |
| **Backend** | Python 3.14, FastAPI, Uvicorn, Pydantic v2, HTTPX |
| **Artificial Intelligence** | Google Gemini API (`gemini-2.5-flash`) for conversational NLU + robust heuristic fallback parser |
| **Accessibility** | WCAG 2.2 Level AA compliance, High Contrast mode, Large Text mode, ARIA live regions |

---

## 🚀 Key Features

### 1. Hands-Free Voice-Based Navigation
- Spoken commands recognized at any stage:
  - `"Start scholarship application"` / `"Start a new application"`
  - `"Yes"` / `"No"` / `"Confirm"` / `"Correct"`
  - `"Repeat the question"` / `"Say again"`
  - `"Go back"` / `"Previous question"`
  - `"Skip this field"`
  - `"Review my form"` / `"Read my details"`
  - `"I confirm and submit"`
  - `"Stop speaking"` / `"Be quiet"`
  - `"Help"` / `"What can I say?"`
  - `"Cancel application"`

### 2. 5 Accessible Government Demo Forms
1. 🎓 **Government Scholarship Application (Featured Primary Demo)**: Post-Matric & Merit Scholarship schemes.
2. 🆔 **Aadhaar Demographic Update Demo**: Address & phone update simulation (no biometrics or real UID stored).
3. 👴 **Senior Citizen Pension Application Demo**: Old age monthly assistance scheme.
4. 📜 **Income Certificate Application Demo**: Revenue department income certification.
5. 🏛️ **Public Service Grievance Demo**: Citizen grievance redressal (water, roads, electricity, health).

### 3. Step-by-Step Question & Confirmation Flow
- Asks one question at a time in warm, clear conversational English.
- Normalizes spoken utterances (e.g. *"I was born on November 15th 2006"* ➔ `2006-11-15`, *"one lakh fifty thousand"* ➔ `₹1,50,000`).
- **Confirmation step**: Repeats what it heard:
  > *"I heard Jaya Prakash. Is that correct? Say yes or no."*
- Saves the answer **only** upon user confirmation.

### 4. Intelligent Spoken Validation
- Validates 10-digit mobile numbers, dates of birth, email addresses, income amounts, and dropdown options.
- Explains problems aloud with actionable guidance:
  > *"Your mobile number should contain 10 digits starting with 6, 7, 8, or 9. Please say your mobile number again."*
- Masks sensitive phone numbers for auditory privacy (*"ending in 3166"*).

### 5. Full Voice Review & Simulated Submission
- Reads a consolidated summary of all completed fields aloud.
- Allows editing any specific field on demand.
- Requires final voice confirmation: *"I confirm and submit"*.
- Generates a simulated government reference number (e.g., `DEMO-SCH-2026-85732`) and a printable receipt.
- **Safety guarantee**: Explicitly labeled as a fictional demo prototype for accessibility testing.

### 6. WCAG 2.2 AA Accessibility & Assistive Features
- **High Contrast Mode**: Crisp yellow/cyan on deep black.
- **Large Text Mode**: 125% scalable typography.
- **Web Audio Earcons**: Ascending chime on mic activation, double bell on confirmation prompt, celebration chime on success, low tone on error.
- **Keyboard Shortcuts**:
  - <kbd>Space</kbd>: Push-to-Talk / Toggle Mic
  - <kbd>R</kbd>: Repeat Current Question
  - <kbd>M</kbd>: Stop Speaking / Mute
  - <kbd>H</kbd>: Open Voice Help Modal
  - <kbd>Alt + C</kbd>: Toggle High Contrast
  - <kbd>Alt + L</kbd>: Toggle Large Text
  - <kbd>Alt + S</kbd>: Speech Rate & Pitch Settings
  - <kbd>Esc</kbd>: Close Dialogs / Reset
- **Hybrid Input**: Accessible keyboard inputs provided as a backup if a user has speech difficulties.
- **Dual-Language Architecture**: Ready for Tamil voice interaction (`ta-IN`).

---

## 📁 Project Structure

```
voicegov-assist/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI application & CORS
│   │   ├── config.py                # Environment settings & Gemini config
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py           # Pydantic schemas (Field, Template, NLU, Submission)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── form_service.py      # 5 government demo form schemas & field definitions
│   │   │   ├── gemini_service.py    # Gemini API NLU & rule-based conversational parser
│   │   │   └── submission_service.py# In-memory demo submissions & reference generator
│   │   └── api/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── forms.py         # GET /api/forms, GET /api/forms/{id}
│   │           ├── voice_assistant.py # POST /api/assistant/parse, POST /api/assistant/review
│   │           └── submissions.py   # POST /api/submissions, GET /api/submissions/{ref}
│   ├── tests/
│   │   └── test_api.py              # 10 comprehensive unit & integration tests
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── types/
│   │   │   └── form.ts              # TypeScript interfaces
│   │   ├── services/
│   │   │   ├── audioEffects.ts      # Web Audio API earcon chimes (C5, E5, G5)
│   │   │   ├── speechService.ts     # Web Speech API recognition & speech synthesis
│   │   │   └── apiService.ts        # Backend REST client
│   │   ├── components/
│   │   │   ├── Header.tsx           # Accessible header with contrast & text size switches
│   │   │   ├── AudioVisualizer.tsx  # Dynamic 7-bar voice wave & status pill
│   │   │   ├── VoiceStatusCard.tsx  # Question card, live transcript, Yes/No confirm
│   │   │   ├── FormSelector.tsx     # 5 government application cards with voice hints
│   │   │   ├── VoiceFormFiller.tsx  # Step-by-step form filler & live form preview
│   │   │   ├── FormReview.tsx       # Spoken summary review & field edit actions
│   │   │   ├── SubmissionReceipt.tsx# Simulated reference ID & printable demo receipt
│   │   │   ├── VoiceHelpModal.tsx   # Voice command reference dialog
│   │   │   └── AudioSettingsModal.tsx# Speech speed (0.7x-1.4x), pitch, and voice picker
│   │   ├── App.tsx                  # Core state coordinator & keyboard shortcuts
│   │   ├── index.css                # Tailwind CSS v4 & accessibility tokens
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── start-backend.bat                # 1-click backend runner
├── start-frontend.bat               # 1-click frontend runner
├── run-all.bat                      # 1-click launcher for Windows CMD
├── run-all.ps1                      # 1-click launcher for PowerShell
└── README.md
```

---

## ⚡ Quick Setup & Running

### Prerequisites
1. **Python 3.10+** (tested on Python 3.14)
2. **Node.js 18+** & **npm**
3. Modern browser with Web Speech API support (Google Chrome, Microsoft Edge, or Chromium-based browsers)

---

### Method A: One-Click Launch (Windows)
Double-click `run-all.bat` or run in PowerShell:
```powershell
.\run-all.ps1
```
This automatically launches both the FastAPI backend (`http://127.0.0.1:8000`) and the React frontend (`http://localhost:5173`).

---

### Method B: Manual Step-by-Step

#### 1. Setup Backend
```bash
cd backend

# (Optional) Add your Gemini API key in backend/.env:
# GEMINI_API_KEY=your_key_here

# Install Python requirements
py -m pip install -r requirements.txt

# Run automated tests
py -m pytest tests -v

# Start the FastAPI server
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now running at `http://127.0.0.1:8000`.

#### 2. Setup Frontend
Open a second terminal:
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in Google Chrome or Microsoft Edge.

---

## 🎙️ 2–3 Minute Hackathon Demo Script

Here is an ideal walkthrough for presenting to judges:

| Step | Action / What to Speak | What the Assistant Does |
| :---: | :--- | :--- |
| **1** | Open `http://localhost:5173`. Click the Mic button or press <kbd>Space</kbd>. Say:<br>👉 *"Start scholarship application"* | Assistant chimes, selects the Scholarship form, and asks: *"What is your full name?"* |
| **2** | Speak:<br>👉 *"My name is Jaya Prakash"* | Assistant extracts `Jaya Prakash`, chimes, and asks: *"I heard Jaya Prakash. Is that correct? Say yes or no."* |
| **3** | Speak:<br>👉 *"Yes"* | Plays celebration earcon, confirms `Jaya Prakash` into the form, and asks for Date of Birth. |
| **4** | Speak:<br>👉 *"November 15, 2006"* | Parses spoken date to `November 15, 2006` (`2006-11-15`) and asks for confirmation. User says *"Yes"*. |
| **5** | Assistant asks for Gender. Speak:<br>👉 *"Male"* ➔ Confirm with *"Yes"*. | Saves `Male` and proceeds to Mobile Number. |
| **6** | Assistant asks for 10-digit mobile number. Speak:<br>👉 *"9876543210"* | Masks phone number: *"I heard mobile number ending in 3210. Is that correct? Say yes or no."* User says *"Yes"*. |
| **7** | Say:<br>👉 *"Skip this field"* on optional email. | Skips email gracefully. |
| **8** | Fill State (*"Tamil Nadu"*), District (*"Coimbatore"*), Education level (*"Undergraduate"*), Income (*"one lakh fifty thousand"* ➔ `₹1,50,000`), Category (*"Merit-cum-Means"*). | All fields populate in real-time on the live form sheet on screen. |
| **9** | Review Screen automatically opens. Assistant reads:<br>👉 *"Here is your application summary: Full Name: Jaya Prakash. Date of birth: November 15, 2006. District: Coimbatore. Mobile number: ending in 3210..."* | Citizen verifies all fields without looking at the monitor. |
| **10** | Final submission command. Speak:<br>👉 *"I confirm and submit"* | Assistant generates simulated reference ID: `DEMO-SCH-2026-85732` and reads confirmation receipt aloud. |

---

## 🔒 Privacy, Security & Ethical Safeguards

1. **Microphone Transparency**: Microphone is only active when explicitly turned on via push-to-talk or auto-prompted. Never listens secretly.
2. **No Real PII Stored**: No 12-digit Aadhaar UID or biometric data is collected or stored.
3. **Simulated Reference Numbers**: Clearly labeled prototype. Never connects to actual government portals without authorization.
4. **Ephemerality**: Spoken audio is analyzed ephemerally in browser and memory; raw audio recordings are never stored.

---

## ♿ Accessibility Compliance Summary (WCAG 2.2 AA)
- **Guideline 1.1 (Text Alternatives)**: All controls, state pills, and audio visualizer states have descriptive `aria-label` and `aria-live` regions.
- **Guideline 1.4 (Distinguishable)**: Default palette achieves 7:1 contrast ratio; dedicated High Contrast Mode provides true black (`#000000`) with luminous yellow (`#FFFF00`).
- **Guideline 2.1 (Keyboard Accessible)**: 100% of portal capabilities operable with keyboard hotkeys (<kbd>Space</kbd>, <kbd>R</kbd>, <kbd>M</kbd>, <kbd>H</kbd>, <kbd>Alt+C</kbd>, <kbd>Alt+L</kbd>).
- **Guideline 3.3 (Input Assistance)**: Explicit spoken error messages explain exact formatting requirements before re-prompting.

---

## 📜 License
Distributed under the MIT License for educational and social impact evaluation.
