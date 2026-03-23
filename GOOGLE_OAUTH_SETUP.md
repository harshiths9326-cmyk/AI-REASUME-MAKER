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
   - `http://localhost:3000` (Your local development URL)
   - `https://acgjlopzdedvyxqzheeu.supabase.co` (Your Supabase URL, from `.env.local`)
5. **Authorized redirect URIs**:
   - `https://acgjlopzdedvyxqzheeu.supabase.co/auth/v1/callback`
   *(This is the exact redirect URI required by your Supabase project)*.
6. Click **Create**. You will receive your **Client ID** and **Client Secret**.

## 4. Add Credentials to Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (`acgjlopzdedvyxqzheeu`).
3. Go to **Authentication > Providers > Google**.
4. Toggle **Enable Sign in with Google** to ON.
5. Paste your **Client ID** and **Client Secret**.
6. Switch **"Skip nonce check"** to OFF (or leave default).
7. Click **Save**.

## 5. (Important) Setup Redirects in Supabase
Ensure your Supabase Site URL and Redirect URLs are configured:
1. Go to **Authentication > URL Configuration**.
2. Set **Site URL** to `http://localhost:3000`.
3. Add `http://localhost:3000/auth/callback` to the **Redirect URLs**.
4. Click **Save**.

---
**Note**: For production (like Vercel deployment), replace `http://localhost:3001` in both Google Cloud Console (JavaScript origins and URL Configuration) and Supabase Dashboard (Redirect URLs) with your actual live domain URL (e.g., `https://your-app.vercel.app/auth/callback`).
