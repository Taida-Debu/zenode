import { getGitHubApp } from "@/backend/octokit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
   const app = getGitHubApp();
   if (!app) {
      return NextResponse.json(
         { error: "GitHub App is not configured (GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY)" },
         { status: 503 }
      );
   }

   const { searchParams } = new URL(req.url);
   const username = searchParams.get("username");
   const userId = searchParams.get("id");

   if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
   }

   if (!userId) {
      return NextResponse.json({ error: "Installation id is required" }, { status: 400 });
   }

   const octokit = await app.getInstallationOctokit(Number(userId));
   const repo = await octokit.request('GET /users/{username}/repos', {
      username,
      headers: {
         'X-GitHub-Api-Version': '2022-11-28'
      }
   });

   return NextResponse.json(repo);
}
