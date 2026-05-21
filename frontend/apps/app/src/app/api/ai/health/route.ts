import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    groq: Boolean(process.env.GROQ_API_KEY),
    githubToken: Boolean(process.env.GITHUB_TOKEN),
    githubApp: Boolean(
      process.env.GITHUB_APP_ID &&
        (process.env.GITHUB_APP_PRIVATE_KEY || process.env.NEXT_PUBLIC_GITHUB_APP_PRIVATE_KEY)
    ),
  });
}
