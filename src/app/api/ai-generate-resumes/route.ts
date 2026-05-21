import { NextResponse } from "next/server"
import { z } from "zod"

const generationSchema = z.object({
    jobDescription: z.string().min(10, "Job description must be at least 10 characters").max(10000, "Job description must be at most 10,000 characters"),
    experienceLevel: z.enum(["fresher", "entry", "mid", "senior"]).default("fresher"),
    tone: z.enum(["professional", "creative", "technical"]).default("professional"),
    industry: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validationResult = generationSchema.safeParse(body)
        
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validationResult.error.issues },
                { status: 400 }
            )
        }

        const { jobDescription, experienceLevel, tone: _tone, industry } = validationResult.data

        const openRouterKey = process.env.OPENROUTER_API_KEY
        if (!openRouterKey) {
            return NextResponse.json(
                { error: "AI service not configured" },
                { status: 503 }
            )
        }

        // Generate 3 different resume variations
        const variations = [
            {
                id: "achievement",
                title: "Professional Summary Focus",
                description: "Emphasizes professional summary, skills and projects",
                prompt: `Create an Indian-style fresher/junior resume tailored for this job:

Job Description:
${jobDescription}

Experience Level: ${experienceLevel}
Industry: ${industry || "General"}

CRITICAL - Indian Education Format Required:
- Education must include: SSLC (10th), PUC/12th, and Degree levels
- Each education entry MUST have: institutionName, institutionAddress, degree (SSLC/PUC/B.Tech/B.Sc etc), course (Science/Commerce/Arts etc), marks (percentage or CGPA)

Requirements:
- Professional Summary: 3-4 sentences highlighting strengths, career goals, and key skills aligned with the job
- Soft Skills: 5-6 soft skills (communication, teamwork, leadership, problem-solving, time management, adaptability)
- Technical Skills: 6-8 job-relevant technical skills
- Projects: 2-3 academic or personal projects with title, description, technologies used
- Education: SSLC, PUC/12th, Degree with institution name, address, marks
- ONLY include experience if experience level is NOT fresher (0 years)
- For freshers: focus on education, projects, skills, internships (as projects)

IMPORTANT: Use realistic Indian institution names (e.g., "Sri Bhagawan Mahaveer Jain College", "Christ University", etc.) and Indian city names.

Format as valid JSON matching this exact structure:
{
  "personalInfo": {
    "firstName": "[FirstName]",
    "lastName": "[LastName]",
    "jobTitle": "Job Title from JD",
    "email": "email@example.com",
    "phone": "+91 99999 99999",
    "address": "Bengaluru, Karnataka",
    "linkedin": "linkedin.com/in/username",
    "website": "",
    "summary": "Professional summary highlighting skills and career goals"
  },
  "experience": [],
  "education": [
    {
      "id": "edu-1",
      "institutionName": "Indian University/College Name",
      "institutionAddress": "Bengaluru, Karnataka",
      "degree": "B.Tech",
      "course": "Computer Science",
      "marks": "85%",
      "startDate": "2020-06-01",
      "endDate": "2024-05-31",
      "description": "Key achievements and activities"
    },
    {
      "id": "edu-2",
      "institutionName": "PUC College Name",
      "institutionAddress": "Mysuru, Karnataka",
      "degree": "PUC",
      "course": "Science (PCMB)",
      "marks": "92%",
      "startDate": "2018-06-01",
      "endDate": "2020-05-31",
      "description": ""
    },
    {
      "id": "edu-3",
      "institutionName": "High School Name",
      "institutionAddress": "Mysuru, Karnataka",
      "degree": "SSLC",
      "course": "",
      "marks": "95%",
      "startDate": "2017-06-01",
      "endDate": "2018-05-31",
      "description": ""
    }
  ],
  "skills": [
    {"id": "skill-1", "name": "Technical Skill"},
    {"id": "soft-1", "name": "Communication (Soft Skill)"}
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Project Title",
      "description": "Project description with technologies used and your role",
      "link": ""
    }
  ],
  "certifications": [],
  "achievements": [],
  "languages": [],
  "links": []
}`
            },
            {
                id: "skills",
                title: "Skills & Projects Focus",
                description: "Highlights technical skills, projects and certifications",
                prompt: `Create an Indian-style fresher/junior resume focused on skills and projects for this job:

Job Description:
${jobDescription}

Experience Level: ${experienceLevel}
Industry: ${industry || "General"}

CRITICAL - Indian Education Format Required:
- Education must include: SSLC (10th), PUC/12th, and Degree levels
- Each education entry MUST have: institutionName, institutionAddress, degree (SSLC/PUC/B.Tech/B.Sc etc), course (Science/Commerce/Arts etc), marks (percentage or CGPA)

Requirements:
- Professional Summary: 2-3 sentences focused on technical skills and enthusiasm
- Technical Skills: 10-12 job-relevant technical skills (include tools, languages, frameworks)
- Soft Skills: 4-5 soft skills listed alongside technical skills
- Projects: 3-4 detailed projects (academic + personal) with clear tech stack, description, and outcomes
- Education: SSLC, PUC/12th, Degree with full details
- Certifications: 1-2 relevant certifications if applicable
- ONLY include experience if experience level is NOT fresher (0 years)

IMPORTANT: Use realistic Indian institution names and Indian city names.

Format as valid JSON matching this exact structure:
{
  "personalInfo": {
    "firstName": "[FirstName]",
    "lastName": "[LastName]",
    "jobTitle": "Technical Job Title",
    "email": "email@example.com",
    "phone": "+91 88888 88888",
    "address": "Chennai, Tamil Nadu",
    "linkedin": "linkedin.com/in/username",
    "website": "github.com/username",
    "summary": "Tech-focused professional summary"
  },
  "experience": [],
  "education": [
    {
      "id": "edu-1",
      "institutionName": "Indian Engineering College",
      "institutionAddress": "Chennai, Tamil Nadu",
      "degree": "B.E.",
      "course": "Information Technology",
      "marks": "8.2 CGPA",
      "startDate": "2020-08-01",
      "endDate": "2024-06-30",
      "description": "Focused on software development and data structures"
    },
    {
      "id": "edu-2",
      "institutionName": "State Board PUC College",
      "institutionAddress": "Coimbatore, Tamil Nadu",
      "degree": "HSC",
      "course": "Computer Science",
      "marks": "89%",
      "startDate": "2018-06-01",
      "endDate": "2020-04-30",
      "description": ""
    },
    {
      "id": "edu-3",
      "institutionName": "State Board High School",
      "institutionAddress": "Coimbatore, Tamil Nadu",
      "degree": "SSLC",
      "course": "",
      "marks": "94%",
      "startDate": "2017-06-01",
      "endDate": "2018-04-30",
      "description": ""
    }
  ],
  "skills": [
    {"id": "ts-1", "name": "Technical Skill"},
    {"id": "ss-1", "name": "Team Leadership (Soft Skill)"}
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Technical Project Name",
      "description": "Built using React, Node.js - description of what it does and your contribution",
      "link": "github.com/username/project"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023-06-01",
      "url": ""
    }
  ],
  "achievements": [],
  "languages": [],
  "links": []
}`
            },
            {
                id: "education",
                title: "Education & Academics Focus",
                description: "Showcases educational qualifications with strong academic record",
                prompt: `Create an Indian-style fresher resume emphasizing educational qualifications for this job:

Job Description:
${jobDescription}

Experience Level: ${experienceLevel}
Industry: ${industry || "General"}

CRITICAL - Indian Education Format Required:
- Education MUST include all three levels: SSLC (10th), PUC/12th, and Degree
- Each education entry MUST have: institutionName, institutionAddress, degree, course, marks

Requirements:
- Professional Summary: 2-3 sentences about academic background and career aspirations
- Education Section (MOST IMPORTANT - detailed):
  * Degree (B.Tech/B.Sc/B.Com/BBA etc.): Institution name, city, course, marks/CGPA, year
  * PUC/12th: Institution name, city, stream (Science/Commerce/Arts), marks, year
  * SSLC/10th: School name, city, marks, year
- Technical Skills: 8-10 skills relevant to the job
- Soft Skills: 5-6 soft skills
- Projects: 1-2 academic projects
- Achievements: Academic achievements, competitions, extracurricular

IMPORTANT: Use realistic Indian institution names, cities, and marks (85-95% range for good students).

Format as valid JSON matching this exact structure:
{
  "personalInfo": {
    "firstName": "[FirstName]",
    "lastName": "[LastName]",
    "jobTitle": "Fresh Graduate - [Field]",
    "email": "email@example.com",
    "phone": "+91 77777 77777",
    "address": "Hyderabad, Telangana",
    "linkedin": "linkedin.com/in/username",
    "website": "",
    "summary": "Academic-focused summary highlighting education and career goals"
  },
  "experience": [],
  "education": [
    {
      "id": "edu-1",
      "institutionName": "Osmania University",
      "institutionAddress": "Hyderabad, Telangana",
      "degree": "B.Sc",
      "course": "Computer Science",
      "marks": "82%",
      "startDate": "2021-07-01",
      "endDate": "2024-06-30",
      "description": "Relevant coursework: Data Structures, DBMS, Web Technologies"
    },
    {
      "id": "edu-2",
      "institutionName": "Sri Chaitanya Junior College",
      "institutionAddress": "Hyderabad, Telangana",
      "degree": "Intermediate",
      "course": "MPC",
      "marks": "91%",
      "startDate": "2019-06-01",
      "endDate": "2021-04-30",
      "description": ""
    },
    {
      "id": "edu-3",
      "institutionName": "Bhashyam High School",
      "institutionAddress": "Hyderabad, Telangana",
      "degree": "SSC",
      "course": "",
      "marks": "9.5 GPA",
      "startDate": "2018-06-01",
      "endDate": "2019-04-30",
      "description": ""
    }
  ],
  "skills": [
    {"id": "skill-1", "name": "Job-relevant Technical Skill"},
    {"id": "soft-1", "name": "Quick Learner (Soft Skill)"}
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Academic Project",
      "description": "Final year project description with tech stack",
      "link": ""
    }
  ],
  "certifications": [],
  "achievements": [
    {
      "id": "ach-1",
      "title": "Academic Achievement",
      "description": "Details of the achievement or award"
    }
  ],
  "languages": [],
  "links": []
}`
            }
        ]

        // Generate all 3 variations in parallel
        const generationPromises = variations.map(async (variation) => {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                    "X-Title": "Resume Builder AI Generator"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert resume writer and career coach. Create realistic, ATS-optimized resumes in valid JSON format only. No markdown, no explanations, just pure JSON."
                        },
                        {
                            role: "user",
                            content: variation.prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            })

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status}`)
            }

            const data = await response.json()
            const resumeText = data.choices[0].message.content

            // Parse the JSON response
            let resumeData
            try {
                const jsonMatch = resumeText.match(/```json\n?([\s\S]*?)\n?```/) || resumeText.match(/\{[\s\S]*\}/)
                const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : resumeText
                resumeData = JSON.parse(jsonString)
            } catch {
                throw new Error("Failed to parse AI-generated resume")
            }

            return {
                id: variation.id,
                title: variation.title,
                description: variation.description,
                data: resumeData
            }
        })

        const resumes = await Promise.all(generationPromises)

        console.log(`Successfully generated ${resumes.length} resume variations`)

        return NextResponse.json({ success: true, resumes })
    } catch (error) {
        console.error("AI Resume Generation Error:", error)
        return NextResponse.json(
            { error: "Failed to generate resumes. Please try again." },
            { status: 500 }
        )
    }
}
