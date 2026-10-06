import { NextResponse } from "next/server";
import { TOOLS } from "@/lib/site";

/* Public tool list for the admin editor's "related tools" picker. */
export async function GET() {
  return NextResponse.json({
    tools: TOOLS.map((t) => ({ slug: t.slug, name: t.name })),
  });
}
