# Save Resume Endpoint

<cite>
**Referenced Files in This Document**
- [route.ts](file://src/app/api/save-resume/route.ts)
- [supabase.ts](file://src/lib/supabase.ts)
- [types.ts](file://src/lib/types.ts)
- [supabase-setup.sql](file://supabase-setup.sql)
- [get-resume route.ts](file://src/app/api/get-resume/route.ts)
- [use-auth-guard.ts](file://src/hooks/use-auth-guard.ts)
- [package.json](file://package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Endpoint Overview](#endpoint-overview)
3. [Request Structure](#request-structure)
4. [Authentication Requirements](#authentication-requirements)
5. [Database Operation](#database-operation)
6. [Response Format](#response-format)
7. [Error Handling](#error-handling)
8. [Data Validation Rules](#data-validation-rules)
9. [Integration Examples](#integration-examples)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Security Considerations](#security-considerations)
12. [Conclusion](#conclusion)

## Introduction

The `/api/save-resume` endpoint is a server-side API that allows authenticated users to save and update their resume data in the system. This endpoint implements robust validation, authentication, and database operations to ensure secure and reliable resume storage.

## Endpoint Overview

**Method:** POST  
**URL:** `/api/save-resume`  
**Purpose:** Save or update resume data for authenticated users

The endpoint performs the following operations:
- Validates incoming request data against a comprehensive schema
- Authenticates the user using Supabase authentication
- Upserts resume data into the database with proper user association
- Returns success status along with the saved resume data

## Request Structure

### Required Parameters

The request must contain a JSON payload with the following structure:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the resume (slug format) |
| `data` | object | Yes | Complete resume data structure |

### Data Structure Details

The `data` object contains the complete resume information organized into sections:

**Personal Information Section**
- `firstName`: string - Candidate's first name
- `lastName`: string - Candidate's last name  
- `jobTitle`: string - Current or target job title
- `email`: string - Contact email address
- `phone`: string - Phone number
- `address`: string - Physical address
- `linkedin`: string - LinkedIn profile URL
- `website`: string - Personal website URL
- `summary`: string - Professional summary

**Optional Sections** (arrays of objects):
- `experience`: Array of work experience entries
- `education`: Array of educational qualifications
- `skills`: Array of technical/professional skills
- `projects`: Array of personal/professional projects
- `certifications`: Array of professional certifications
- `achievements`: Array of notable achievements
- `languages`: Array of languages spoken
- `links`: Array of external links

**Section sources**
- [route.ts:6-29](file://src/app/api/save-resume/route.ts#L6-L29)
- [types.ts:69-79](file://src/lib/types.ts#L69-L79)

## Authentication Requirements

### Supabase Authentication Flow

The endpoint requires users to be authenticated through Supabase. The authentication process follows these steps:

1. **User Session Validation**: The endpoint calls `supabase.auth.getUser()` to retrieve the current user session
2. **Authentication Check**: If no user is found or an authentication error occurs, the request is rejected
3. **User ID Assignment**: The authenticated user's UUID is automatically assigned to the `user_id` field during database operations

### Authentication Failure Scenarios

- **Missing Session**: No active user session found
- **Expired Token**: Authentication token has expired
- **Invalid Credentials**: Session verification failed

**Section sources**
- [route.ts:46-54](file://src/app/api/save-resume/route.ts#L46-L54)
- [supabase.ts:3-7](file://src/lib/supabase.ts#L3-L7)

## Database Operation

### Upsert Operation Details

The endpoint performs a PostgreSQL UPSERT operation on the `resumes` table with the following structure:

**Database Schema Reference**
- `id` (text): Primary key, unique resume identifier
- `user_id` (uuid): Foreign key referencing `auth.users(id)`
- `data` (jsonb): Complete resume data stored as JSON
- `updated_at` (timestamp): Automatic timestamp tracking modifications

### Upsert Behavior

The operation ensures that:
- If a resume with the given `id` exists for the user, it updates the existing record
- If no matching resume exists, it creates a new record
- The `updated_at` timestamp is automatically refreshed with the current time

### Database Constraints

The `resumes` table enforces:
- **Foreign Key Constraint**: Links to `auth.users` table
- **Row Level Security**: Users can only access their own resumes
- **Unique Identifier**: Each resume ID is unique per user

**Section sources**
- [route.ts:56-64](file://src/app/api/save-resume/route.ts#L56-L64)
- [supabase-setup.sql:4-9](file://supabase-setup.sql#L4-L9)

## Response Format

### Success Response

On successful completion, the endpoint returns:

```json
{
  "success": true,
  "resume": {
    "id": "string",
    "user_id": "uuid",
    "data": {},
    "updated_at": "timestamp"
  }
}
```

### Error Responses

The endpoint returns structured error responses with appropriate HTTP status codes:

**Validation Errors (400)**
```json
{
  "error": "Invalid resume data",
  "details": [
    {
      "path": ["field"],
      "message": "Error message"
    }
  ]
}
```

**Authentication Errors (401)**
```json
{
  "error": "Authentication required to save resumes"
}
```

**Database Errors (500)**
```json
{
  "error": "Database error: error message"
}
```

**Section sources**
- [route.ts:37-42](file://src/app/api/save-resume/route.ts#L37-L42)
- [route.ts:49-54](file://src/app/api/save-resume/route.ts#L49-L54)
- [route.ts:66-72](file://src/app/api/save-resume/route.ts#L66-L72)

## Error Handling

### Validation Layer

The endpoint implements comprehensive input validation using Zod schemas:

**Input Validation Rules:**
- `id`: Required string with minimum length of 1 character
- `data.personalInfo`: Required object containing all personal information fields
- All arrays (`experience`, `education`, `skills`, etc.) are optional
- String fields accept any non-empty values

**Validation Failure Response:**
- Returns HTTP 400 with detailed validation error information
- Error details include the specific field and validation message

### Authentication Layer

**Authentication Failure Handling:**
- Checks for both authentication errors and missing user sessions
- Returns HTTP 401 with clear authentication requirement message
- Prevents unauthorized access to resume data

### Database Layer

**Database Error Management:**
- Catches and logs database operation errors
- Returns HTTP 500 with sanitized error messages
- Provides fallback error handling for unexpected exceptions

**Section sources**
- [route.ts:31-82](file://src/app/api/save-resume/route.ts#L31-L82)

## Data Validation Rules

### Field-Level Validation

**Required Fields:**
- `id`: Must be a non-empty string
- `personalInfo.firstName`: Required string
- `personalInfo.lastName`: Required string
- `personalInfo.jobTitle`: Required string
- `personalInfo.email`: Required string

**Optional Fields:**
- All resume section arrays are optional
- Empty arrays are acceptable for empty sections

### Data Types and Formats

**String Fields:**
- Accept any string values
- No specific format validation enforced
- Suitable for free-form text input

**Array Fields:**
- Accept any array of objects
- No specific schema validation for array contents
- Allows flexible data structures for resume sections

**Section sources**
- [route.ts:6-29](file://src/app/api/save-resume/route.ts#L6-L29)

## Integration Examples

### Basic Request Example

```javascript
fetch('/api/save-resume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 'my-first-resume',
    data: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        linkedin: 'https://linkedin.com/in/johndoe',
        website: 'https://johndoe.dev',
        summary: 'Experienced software developer...'
      },
      experience: [],
      education: [],
      skills: []
    }
  })
})
```

### Complete Resume Example

```javascript
const completeResume = {
  id: 'john-doe-resume',
  data: {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Senior Software Engineer',
      email: 'john.doe@company.com',
      phone: '(555) 123-4567',
      address: '456 Oak Avenue, San Francisco, CA',
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.dev',
      summary: 'Passionate software engineer with 8+ years of experience in full-stack development...'
    },
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01-15',
        endDate: '2024-01-15',
        description: 'Led development team and architected scalable solutions...'
      }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'University of Technology',
        degree: 'BS Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-30',
        description: 'Graduated with honors'
      }
    ],
    skills: [
      { id: 'skill-1', name: 'JavaScript' },
      { id: 'skill-2', name: 'React' },
      { id: 'skill-3', name: 'Node.js' }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution...',
        link: 'https://github.com/johndoe/ecommerce'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-06-15',
        url: 'https://aws.amazon.com/certification'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Employee of the Year',
        description: 'Recognized for outstanding contributions...'
      }
    ],
    languages: [
      {
        id: 'lang-1',
        language: 'English',
        proficiency: 'Native'
      }
    ],
    links: [
      {
        id: 'link-1',
        label: 'GitHub',
        url: 'https://github.com/johndoe'
      }
    ]
  }
};
```

## Troubleshooting Guide

### Authentication Issues

**Common Authentication Problems:**

1. **401 Unauthorized Errors**
   - Verify user is logged in before calling the endpoint
   - Check that the authentication session is still valid
   - Ensure the client-side authentication state is synchronized

2. **Session Token Expiration**
   - Implement automatic re-authentication flow
   - Handle auth state changes using Supabase listeners
   - Refresh tokens when possible

**Section sources**
- [route.ts:49-54](file://src/app/api/save-resume/route.ts#L49-L54)
- [use-auth-guard.ts:36-44](file://src/hooks/use-auth-guard.ts#L36-L44)

### Database Connectivity Problems

**Database Error Symptoms:**
- 500 Internal Server Errors during save operations
- Database connection timeouts
- Supabase service unavailability

**Troubleshooting Steps:**
1. Verify Supabase project configuration
2. Check database connectivity and service status
3. Review Supabase dashboard for any service interruptions
4. Validate database credentials and connection limits

**Section sources**
- [route.ts:66-72](file://src/app/api/save-resume/route.ts#L66-L72)

### Validation Error Resolution

**Common Validation Issues:**
- Missing required fields in the request payload
- Incorrect data types for specific fields
- Malformed JSON in the request body

**Resolution Strategies:**
1. Validate the request payload against the schema before sending
2. Ensure all required fields are present and correctly formatted
3. Test with minimal valid payload first, then add optional fields

**Section sources**
- [route.ts:37-42](file://src/app/api/save-resume/route.ts#L37-L42)

## Security Considerations

### Authentication Security

The endpoint implements several security measures:
- **Session-Based Authentication**: Requires active user session
- **User Isolation**: Ensures users can only access their own data
- **Automatic User Association**: Prevents data tampering by automatically assigning user_id

### Data Integrity

**Row Level Security (RLS)** prevents unauthorized access:
- Users can only view, modify, or delete their own resumes
- Database policies enforce strict access controls
- Foreign key constraints ensure referential integrity

### Environment Configuration

**Critical Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous API key

**Section sources**
- [supabase-setup.sql:14-19](file://supabase-setup.sql#L14-L19)
- [supabase.ts:3-7](file://src/lib/supabase.ts#L3-L7)

## Conclusion

The `/api/save-resume` endpoint provides a robust, secure, and validated interface for saving and updating resume data. Its comprehensive error handling, authentication requirements, and database integration make it suitable for production use in resume management applications.

Key benefits include:
- **Comprehensive Validation**: Ensures data integrity before processing
- **Secure Authentication**: Protects user data through session-based authentication
- **Flexible Data Structure**: Accommodates various resume formats and content
- **Reliable Database Operations**: Uses UPSERT for seamless create/update operations
- **Clear Error Handling**: Provides meaningful feedback for debugging and user experience

The endpoint serves as a foundation for building sophisticated resume management systems while maintaining security and data integrity standards.