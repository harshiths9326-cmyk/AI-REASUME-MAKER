# Google OAuth Setup Guide

To enable "Sign in with Google" for your AI Resume Maker, follow these steps in the Google Cloud Console.

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown and select **New Project**.
3. Name it `AI Resume Maker` and click **Create**.

## 2. Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the required App Information:
   - **App name**: `AI Resume Maker`
   - **User support email**: Your email address.
   - **Developer contact information**: Your email address.
4. Click **Save and Continue** until you return to the dashboard.

## 3. Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > OAuth client ID**.
3. Select **Web application** as the application type.
4. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for local development)
   - `https://your-project-url.supabase.co` (from your Supabase dashboard)
5. **Authorized redirect URIs**:
   - `https://acgjlopzdedvyxqzheeu.supabase.co/auth/v1/callback`
   *(Get your specific Supabase URL from your Supabase Dashboard > Settings > API)*.
6. Click **Create**. You will receive your **Client ID** and **Client Secret**.

## 4. Add Credentials to Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication > Providers > Google**.
3. Toggle **Enabled** to ON.
4. Paste your **Client ID** and **Client Secret**.
5. Click **Save**.

## 5. (Important) Setup Redirects
Ensure your Supabase Site URL and Redirect URLs are configured:
- Go to **Authentication > Settings**.
- Set **Site URL** to `http://localhost:3000` (for now).
- Add `http://localhost:3000/auth/callback` to the **Redirect URLs**.

---
**Note**: For production, replace `localhost:3000` with your actual domain URL.
