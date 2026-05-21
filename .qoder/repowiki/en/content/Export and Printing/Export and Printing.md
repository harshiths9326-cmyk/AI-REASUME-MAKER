# Export and Printing

<cite>
**Referenced Files in This Document**
- [resume-preview.tsx](file://src/components/resume/resume-preview.tsx)
- [builder.page.tsx](file://src/app/builder/page.tsx)
- [types.ts](file://src/lib/types.ts)
- [generate_pdf.py](file://src/generate_pdf.py)
- [generate_docx.py](file://src/generate_docx.py)
- [generate_massive_docx.py](file://src/generate_massive_docx.py)
- [generate_massive_docx_v3.py](file://src/generate_massive_docx_v3.py)
- [generate_massive_docx_v4.py](file://src/generate_massive_docx_v4.py)
- [generate_massive_docx_v5.py](file://src/generate_massive_docx_v5.py)
- [generate_massive_docx_v6.py](file://src/generate_massive_docx_v6.py)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document explains the export and printing functionality of the resume builder application. It covers:
- How the frontend generates downloadable PDFs using a client-side print pipeline
- How Python scripts generate DOCX and PDF documents from structured text
- How images are embedded and formatted across formats
- How to customize exports, handle large documents, and optimize performance
- Guidance for extending export formats and troubleshooting common issues

## Project Structure
The export pipeline spans both the frontend React components and backend Python scripts:
- Frontend: A React preview component renders the resume and triggers a browser-based print workflow to produce a PDF.
- Backend: Python scripts transform structured text into DOCX and PDF documents with consistent formatting and image handling.

```mermaid
graph TB
subgraph "Frontend (Next.js)"
A["Builder Page<br/>builder.page.tsx"]
B["Resume Preview<br/>resume-preview.tsx"]
C["Types & State<br/>types.ts"]
end
subgraph "Backend (Python)"
D["Generate DOCX<br/>generate_docx.py"]
E["Generate PDF<br/>generate_pdf.py"]
F["Large DOCX v1<br/>generate_massive_docx.py"]
G["Large DOCX v3<br/>generate_massive_docx_v3.py"]
H["Large DOCX v4<br/>generate_massive_docx_v4.py"]
I["Large DOCX v5<br/>generate_massive_docx_v5.py"]
J["Large DOCX v6<br/>generate_massive_docx_v6.py"]
end
A --> B
B --> C
B --> D
B --> E
D --> |"Text + Images"| B
E --> |"Text + Images"| B
```

**Diagram sources**
- [builder.page.tsx:11-78](file://src/app/builder/page.tsx#L11-L78)
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)
- [types.ts:69-103](file://src/lib/types.ts#L69-L103)
- [generate_docx.py:6-79](file://src/generate_docx.py#L6-L79)
- [generate_pdf.py:8-84](file://src/generate_pdf.py#L8-L84)
- [generate_massive_docx.py:140-179](file://src/generate_massive_docx.py#L140-L179)
- [generate_massive_docx_v3.py:401-571](file://src/generate_massive_docx_v3.py#L401-L571)
- [generate_massive_docx_v4.py:433-520](file://src/generate_massive_docx_v4.py#L433-L520)
- [generate_massive_docx_v5.py:428-517](file://src/generate_massive_docx_v5.py#L428-L517)
- [generate_massive_docx_v6.py:428-516](file://src/generate_massive_docx_v6.py#L428-L516)

**Section sources**
- [builder.page.tsx:11-78](file://src/app/builder/page.tsx#L11-L78)
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)
- [types.ts:69-103](file://src/lib/types.ts#L69-L103)

## Core Components
- Resume Preview (client-side PDF export):
  - Uses a print engine to capture the resume DOM and produce a PDF via the browser’s print dialog.
  - Applies print-specific CSS to ensure consistent page sizes, margins, and background rendering.
- Python DOCX/PDF generators:
  - Parse structured text with special markers for headings, lists, code blocks, and images.
  - Render DOCX with consistent fonts, spacing, and borders; embed images with captions.
  - Generate PDFs with justified text, page breaks, and image placement.

Key export behaviors:
- Formatting preservation: Headings, lists, code blocks, and justified text are preserved across formats.
- Image handling: Special markers embed images and add captions; scripts resolve image paths and handle missing files.
- Layout optimization: Page breaks and print CSS ensure multi-page documents render cleanly.

**Section sources**
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)
- [generate_docx.py:6-79](file://src/generate_docx.py#L6-L79)
- [generate_pdf.py:8-84](file://src/generate_pdf.py#L8-L84)

## Architecture Overview
The export architecture combines a React-based print pipeline with Python-based document generation.

```mermaid
sequenceDiagram
participant U as "User"
participant BP as "Builder Page<br/>builder.page.tsx"
participant RP as "Resume Preview<br/>resume-preview.tsx"
participant PR as "Print Engine"
participant BR as "Browser Print Dialog"
participant PY as "Python Scripts"
U->>BP : "Click Export"
BP->>RP : "Render resume with template"
RP->>PR : "Trigger print with target ref"
PR->>BR : "Open print dialog"
BR-->>PR : "PDF generated"
PR-->>RP : "onAfterPrint callback"
RP-->>U : "Download complete"
Note over RP,PR : "Print CSS ensures A4, margins, backgrounds"
U->>PY : "Run DOCX/PDF generator"
PY->>PY : "Parse text markers<br/>Add headings/lists/code/images"
PY-->>U : "Generated DOCX/PDF file"
```

**Diagram sources**
- [builder.page.tsx:11-78](file://src/app/builder/page.tsx#L11-L78)
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)
- [generate_docx.py:6-79](file://src/generate_docx.py#L6-L79)
- [generate_pdf.py:8-84](file://src/generate_pdf.py#L8-L84)

## Detailed Component Analysis

### Frontend Export: Resume Preview and Print Pipeline
- Purpose: Render the resume template and trigger a client-side PDF export.
- Key mechanics:
  - A ref targets the resume content to be exported.
  - A print engine captures the DOM subtree and opens the browser’s print dialog.
  - Print CSS ensures A4 page size, zero margins, and background rendering.
  - Loading state prevents concurrent edits during export.

```mermaid
sequenceDiagram
participant RP as "ResumePreview"
participant RT as "Template Renderer"
participant PR as "Print Hook"
participant BR as "Browser Print"
RP->>RT : "Render selected template"
RP->>PR : "useReactToPrint({ contentRef })"
PR->>BR : "Print dialog with captured DOM"
BR-->>PR : "PDF output"
PR-->>RP : "onAfterPrint"
```

**Diagram sources**
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)

**Section sources**
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)

### Python DOCX Export: Structured Text to DOCX
- Input: Plain text with markers for headings, lists, code blocks, and images.
- Features:
  - Headings mapped to DOCX levels with centering or left alignment.
  - Lists rendered with bullet styles.
  - Code blocks formatted with monospaced fonts and tight spacing.
  - Images inserted with optional captions; missing images logged as placeholders.
  - Default font and paragraph spacing configured globally.

```mermaid
flowchart TD
Start(["Start DOCX Export"]) --> Read["Read input text file"]
Read --> Loop{"Line type?"}
Loop --> |Heading| AddHeading["Add DOCX heading"]
Loop --> |List Item| AddBullet["Add bullet paragraph"]
Loop --> |Code Block| AddCode["Add code paragraph"]
Loop --> |Image| AddImage["Insert picture + caption"]
Loop --> |Empty| Skip["Skip line"]
Loop --> |Text| AddPara["Add justified paragraph"]
AddHeading --> Loop
AddBullet --> Loop
AddCode --> Loop
AddImage --> Loop
Skip --> Loop
AddPara --> Loop
Loop --> |End| Save["Save DOCX file"]
Save --> End(["Done"])
```

**Diagram sources**
- [generate_docx.py:6-79](file://src/generate_docx.py#L6-L79)

**Section sources**
- [generate_docx.py:6-79](file://src/generate_docx.py#L6-L79)

### Python PDF Export: Structured Text to PDF
- Input: Plain text with markers for headings, lists, code blocks, and images.
- Features:
  - Page size A4 with generous margins.
  - Custom paragraph styles for justification, centering, captions, and code.
  - Page breaks before top-level headings.
  - Image insertion with fixed dimensions and optional captions; missing images reported.

```mermaid
flowchart TD
Start(["Start PDF Export"]) --> Read["Read input text file"]
Read --> Loop{"Line type?"}
Loop --> |Heading| AddPageBreak["Page break"] --> AddTitle["Add title/heading"]
Loop --> |List Item| AddJustified["Add justified paragraph"]
Loop --> |Code Block| AddCode["Add code paragraph"]
Loop --> |Image| InsertImg["Insert image + caption"]
Loop --> |Empty| AddSpacer["Add vertical spacer"]
Loop --> |Text| AddJustified
AddTitle --> Loop
AddJustified --> Loop
AddCode --> Loop
InsertImg --> Loop
Loop --> |End| Build["Build PDF"]
Build --> End(["Done"])
```

**Diagram sources**
- [generate_pdf.py:8-84](file://src/generate_pdf.py#L8-L84)

**Section sources**
- [generate_pdf.py:8-84](file://src/generate_pdf.py#L8-L84)

### Large DOCX Generators: Advanced Formatting and Borders
- Purpose: Produce multi-chapter, large-format reports with consistent styling and page borders.
- Notable features:
  - Page borders added via DOCX XML elements.
  - Consistent fonts, line spacing, and heading weights.
  - Code blocks formatted with Courier New and tight spacing.
  - Images inserted with captions and centered alignment.
  - Multi-section chapters with page breaks between topics.

```mermaid
flowchart TD
Start(["Start Large DOCX"]) --> Borders["Add page borders"]
Borders --> Setup["Set margins and sections"]
Setup --> Title["Add title page"]
Title --> Chapters["Iterate chapters"]
Chapters --> Head["Add chapter heading"]
Head --> Intro["Add intro paragraphs"]
Intro --> Img["Insert image + post-image text"]
Img --> Subpoints["Add subpoints"]
Subpoints --> Break["Add page break (except last)"]
Break --> Chapters
Chapters --> |Done| Save["Save DOCX"]
Save --> End(["Done"])
```

**Diagram sources**
- [generate_massive_docx.py:140-179](file://src/generate_massive_docx.py#L140-L179)
- [generate_massive_docx_v3.py:401-571](file://src/generate_massive_docx_v3.py#L401-L571)
- [generate_massive_docx_v4.py:433-520](file://src/generate_massive_docx_v4.py#L433-L520)
- [generate_massive_docx_v5.py:428-517](file://src/generate_massive_docx_v5.py#L428-L517)
- [generate_massive_docx_v6.py:428-516](file://src/generate_massive_docx_v6.py#L428-L516)

**Section sources**
- [generate_massive_docx.py:140-179](file://src/generate_massive_docx.py#L140-L179)
- [generate_massive_docx_v3.py:401-571](file://src/generate_massive_docx_v3.py#L401-L571)
- [generate_massive_docx_v4.py:433-520](file://src/generate_massive_docx_v4.py#L433-L520)
- [generate_massive_docx_v5.py:428-517](file://src/generate_massive_docx_v5.py#L428-L517)
- [generate_massive_docx_v6.py:428-516](file://src/generate_massive_docx_v6.py#L428-L516)

### Data Model and State Flow
- The resume data model defines all sections (personal info, experience, education, skills, projects, certifications, achievements, languages, links).
- The builder page manages state, persists to session storage, and feeds the preview component.
- The preview component selects a template and triggers the print/export pipeline.

```mermaid
classDiagram
class ResumeData {
+PersonalInfo personalInfo
+Experience[] experience
+Education[] education
+Skill[] skills
+Project[] projects
+Certification[] certifications
+Achievement[] achievements
+Language[] languages
+Link[] links
}
class PersonalInfo {
+string firstName
+string lastName
+string jobTitle
+string email
+string phone
+string address
+string linkedin
+string website
+string summary
}
class Experience {
+string id
+string company
+string position
+string startDate
+string endDate
+string description
}
class Education {
+string id
+string school
+string degree
+string startDate
+string endDate
+string description
}
class Skill {
+string id
+string name
}
class Project {
+string id
+string title
+string description
+string link
}
class Certification {
+string id
+string name
+string issuer
+string date
+string url
}
class Achievement {
+string id
+string title
+string description
}
class Language {
+string id
+string language
+string proficiency
}
class Link {
+string id
+string label
+string url
}
ResumeData --> PersonalInfo
ResumeData --> Experience
ResumeData --> Education
ResumeData --> Skill
ResumeData --> Project
ResumeData --> Certification
ResumeData --> Achievement
ResumeData --> Language
ResumeData --> Link
```

**Diagram sources**
- [types.ts:69-103](file://src/lib/types.ts#L69-L103)

**Section sources**
- [types.ts:69-103](file://src/lib/types.ts#L69-L103)
- [builder.page.tsx:11-78](file://src/app/builder/page.tsx#L11-L78)

## Dependency Analysis
- Frontend dependencies:
  - Resume preview depends on the template renderer and the print engine.
  - The builder page depends on the resume data model and template selection.
- Backend dependencies:
  - DOCX/PDF scripts depend on the input text format and image paths.
  - Large DOCX scripts depend on consistent chapter structures and image locations.

```mermaid
graph LR
Types["types.ts"] --> Builder["builder.page.tsx"]
Builder --> Preview["resume-preview.tsx"]
Preview --> DOCX["generate_docx.py"]
Preview --> PDF["generate_pdf.py"]
DOCX --> Large1["generate_massive_docx.py"]
DOCX --> Large3["generate_massive_docx_v3.py"]
DOCX --> Large4["generate_massive_docx_v4.py"]
DOCX --> Large5["generate_massive_docx_v5.py"]
DOCX --> Large6["generate_massive_docx_v6.py"]
```

**Diagram sources**
- [types.ts:69-103](file://src/lib/types.ts#L69-L103)
- [builder.page.tsx:11-78](file://src/app/builder/page.tsx#L11-L78)
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)
- [generate_docx.py:6-79](file://src/generate_docx.py#L6-L79)
- [generate_pdf.py:8-84](file://src/generate_pdf.py#L8-L84)
- [generate_massive_docx.py:140-179](file://src/generate_massive_docx.py#L140-L179)
- [generate_massive_docx_v3.py:401-571](file://src/generate_massive_docx_v3.py#L401-L571)
- [generate_massive_docx_v4.py:433-520](file://src/generate_massive_docx_v4.py#L433-L520)
- [generate_massive_docx_v5.py:428-517](file://src/generate_massive_docx_v5.py#L428-L517)
- [generate_massive_docx_v6.py:428-516](file://src/generate_massive_docx_v6.py#L428-L516)

**Section sources**
- [types.ts:69-103](file://src/lib/types.ts#L69-L103)
- [builder.page.tsx:11-78](file://src/app/builder/page.tsx#L11-L78)
- [resume-preview.tsx:789-800](file://src/components/resume/resume-preview.tsx#L789-L800)

## Performance Considerations
- Frontend export:
  - Keep the exported DOM lightweight; avoid heavy third-party widgets.
  - Use print CSS to minimize layout thrashing and ensure deterministic page breaks.
  - Debounce or disable user edits during export to prevent inconsistent snapshots.
- Python export:
  - For large DOCX generation, batch operations and avoid repeated style reconfiguration.
  - Pre-validate image paths to reduce runtime exceptions and retries.
  - Use consistent fonts and spacing to reduce rendering overhead.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Missing images in DOCX/PDF:
  - Ensure image paths exist; scripts resolve a brain directory and insert placeholders when missing.
  - Validate that image filenames and captions are correctly formatted in the input text.
- Backgrounds not printing:
  - Confirm print CSS applies background rendering for the template’s color scheme.
  - Use print-specific CSS to force background colors and page borders.
- Page breaks cutting content:
  - Apply print CSS to avoid page splits mid-block; use page break rules for sections.
- Large document generation slowness:
  - Reduce image sizes and use vector formats when possible.
  - Split content into smaller batches if generating extremely large reports.

**Section sources**
- [generate_docx.py:48-70](file://src/generate_docx.py#L48-L70)
- [generate_pdf.py:56-77](file://src/generate_pdf.py#L56-L77)
- [generate_massive_docx.py:8-28](file://src/generate_massive_docx.py#L8-L28)

## Conclusion
The resume builder provides a robust export pipeline:
- Client-side PDF export via a print engine with print CSS ensures consistent, high-fidelity output.
- Python-based DOCX and PDF generators preserve formatting, handle images, and scale to large documents.
- Extending export formats is straightforward: adapt the input text format and add new Python generators or modify the print pipeline.

[No sources needed since this section summarizes without analyzing specific files]