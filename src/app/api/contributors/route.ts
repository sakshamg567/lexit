import { Octokit } from "octokit";

export async function GET(request: Request) {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contributors", {
      owner: "puang59",
      repo: "lexit",
    })

    const contributors = data.map((contributor) => ({
      name: contributor.login,
      avatar: contributor.avatar_url,
      profile: contributor.html_url,
    }))


    return new Response(JSON.stringify({ contributors }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response('Bad Request', { status: 400 });
  }
}
