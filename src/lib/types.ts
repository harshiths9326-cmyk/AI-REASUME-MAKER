export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    summary: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    link: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
}

export interface Language {
    id: string;
    language: string;
    proficiency: string; // e.g. Native, Fluent, Intermediate, Basic
}

export interface Link {
    id: string;
    label: string; // e.g. GitHub, Portfolio, LinkedIn
    url: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    achievements: Achievement[];
    languages: Language[];
    links: Link[];
}

export const initialResumeData: ResumeData = {
    personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        website: "",
        summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    links: [],
};

