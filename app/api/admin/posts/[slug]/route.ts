import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminPostAny } from "@/lib/admin-posts";

const OWNER = "pitafiyasir1-a11y";
const REPO = "yatools";
const BRANCH = "main";
const DIR = "data/admin-posts";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await params;
  const post = getAdminPostAny(slug);
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await params;
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) return NextResponse.json({ error: "GITHUB_CONTENT_TOKEN is not configured." }, { status: 503 });

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "yatools-admin",
  };
  const getRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIR}/${slug}.json?ref=${BRANCH}`,
    { headers, cache: "no-store" }
  );
  if (getRes.status === 404) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!getRes.ok) return NextResponse.json({ error: "GitHub read failed." }, { status: 502 });
  const { sha } = await getRes.json();

  const delRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIR}/${slug}.json`,
    {
      method: "DELETE",
      headers,
      body: JSON.stringify({ message: `Delete blog post: ${slug}`, sha, branch: BRANCH }),
    }
  );
  if (!delRes.ok) return NextResponse.json({ error: "GitHub delete failed." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
