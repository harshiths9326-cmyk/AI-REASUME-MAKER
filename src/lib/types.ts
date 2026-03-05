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

export interface ResumeData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
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
};
