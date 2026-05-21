from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.units import inch
import os

def create_pdf(input_text_file, pdf_file):
    doc = SimpleDocTemplate(pdf_file, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    
    # Custom styles
    styles.add(ParagraphStyle(name='MyJustify', parent=styles['Normal'], alignment=TA_JUSTIFY, fontSize=11, leading=14))
    styles.add(ParagraphStyle(name='MyCenterBold', parent=styles['Normal'], alignment=TA_CENTER, fontSize=14, leading=18, fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='MyCaption', parent=styles['Normal'], alignment=TA_CENTER, fontSize=9, italic=True, textColor='gray'))
    styles.add(ParagraphStyle(name='MyCode', parent=styles['Normal'], fontName='Courier', fontSize=8, leading=10, leftIndent=20, spaceBefore=6, spaceAfter=6))

    story = []

    if not os.path.exists(input_text_file):
        print(f"File not found: {input_text_file}")
        return

    with open(input_text_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    
    for line in lines:
        line_stripped = line.strip()
        
        if line_stripped.startswith('```'):
            in_code_block = not in_code_block
            continue
            
        if in_code_block:
            story.append(Paragraph(line.replace(' ', '&nbsp;').replace('<', '&lt;').replace('>', '&gt;'), styles['MyCode']))
            continue

        if not line_stripped:
            story.append(Spacer(1, 12))
            continue
            
        if line_stripped.startswith('# '):
            story.append(PageBreak())
            story.append(Paragraph(line_stripped[2:], styles['Title']))
            story.append(Spacer(1, 12))
        elif line_stripped.startswith('## '):
            story.append(Paragraph(line_stripped[3:], styles['Heading2']))
            story.append(Spacer(1, 10))
        elif line_stripped.startswith('### '):
            story.append(Paragraph(line_stripped[4:], styles['Heading3']))
            story.append(Spacer(1, 8))
        elif line_stripped.startswith('[IMAGE:'):
            parts = line_stripped[7:-1].split('|')
            img_path = parts[0].strip()
            caption = parts[1].strip() if len(parts) > 1 else ""
            
            brain_dir = r"C:\Users\Bhoomika\.gemini\antigravity\brain\7729b00b-8521-4b12-ad09-07549338132e"
            potential_path = os.path.join(brain_dir, img_path)
            if os.path.exists(potential_path):
                img_path = potential_path

            if os.path.exists(img_path):
                try:
                    img = Image(img_path, width=5.5*inch, height=4*inch)
                    story.append(img)
                    if caption:
                        story.append(Paragraph(caption, styles['MyCaption']))
                    story.append(Spacer(1, 12))
                except Exception as e:
                    story.append(Paragraph(f"[Error loading image: {img_path}]", styles['Normal']))
            else:
                story.append(Paragraph(f"[Image not found: {img_path}]", styles['Normal']))
        else:
            if line_stripped.startswith('- '):
                story.append(Paragraph(f"• {line_stripped[2:]}", styles['MyJustify']))
            else:
                story.append(Paragraph(line_stripped, styles['MyJustify']))

    doc.build(story)
    print(f"PDF created: {pdf_file}")

if __name__ == "__main__":
    create_pdf("ultimate_report_content.txt", "AI_Resume_Maker_Final_50Page_Report.pdf")
