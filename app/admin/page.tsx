"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface PostDraft {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  excerpt: string;
  date: string;
  tags: string;
  faqs: FaqItem[];
  contentMarkdown: string;
  relatedTools: string[];
  status: "published" | "draft";
}

interface PostRow {
  slug: string;
  title: string;
  date: string;
  status: string;
  managed: "admin" | "code";
}

const EMPTY: PostDraft = {
  slug: "",
  title: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  tags: "",
  faqs: [{ q: "", a: "" }],
  contentMarkdown: "",
  relatedTools: [],
  status: "draft",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function wordCount(s: string): number {
  const w = s.trim().split(/\s+/).filter(Boolean);
  return s.trim() ? w.length : 0;
}

export default function AdminPage() {
  const [me, setMe] = useState<{ authenticated: boolean; configured: boolean } | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [posts, setPosts] = useState<PostRow[]>([]);
  const [githubOk, setGithubOk] = useState(true);
  const [view, setView] = useState<"list" | "edit">("list");
  const [draft, setDraft] = useState<PostDraft>(EMPTY);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [tools, setTools] = useState<{ slug: string; name: string }[]>([]);
  const [toolFilter, setToolFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const refreshMe = useCallback(async () => {
    const r = await fetch("/api/admin/me", { cache: "no-store" });
    setMe(await r.json());
  }, []);

  useEffect(() => {
    refreshMe();
    fetch("/api/admin/tools")
      .then((r) => r.json())
      .then((d) => setTools(d.tools || []))
      .catch(() => {});
  }, [refreshMe]);

  const refreshPosts = useCallback(async () => {
    const r = await fetch("/api/admin/posts", { cache: "no-store" });
    if (r.status === 401) {
      setMe({ authenticated: false, configured: true });
      return;
    }
    const d = await r.json();
    setPosts(d.posts || []);
    setGithubOk(d.github !== false);
  }, []);

  useEffect(() => {
    if (me?.authenticated) refreshPosts();
  }, [me, refreshPosts]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoggingIn(false);
    if (r.ok) {
      setPassword("");
      refreshMe();
    } else {
      const d = await r.json().catch(() => ({}));
      setLoginError(d.error || "Login failed.");
    }
  }

  async function doLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setMe({ authenticated: false, configured: true });
    setView("list");
  }

  function newPost() {
    setDraft({ ...EMPTY, date: new Date().toISOString().slice(0, 10), faqs: [{ q: "", a: "" }] });
    setEditingSlug(null);
    setView("edit");
    setNotice(null);
  }

  async function editPost(slug: string) {
    const r = await fetch(`/api/admin/posts/${slug}`, { cache: "no-store" });
    if (!r.ok) {
      setNotice({ kind: "err", text: "Could not load the post." });
      return;
    }
    const { post } = await r.json();
    setDraft({
      slug: post.slug,
      title: post.title,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription,
      keywords: (post.keywords || []).join(", "),
      excerpt: post.excerpt,
      date: post.date,
      tags: (post.tags || []).join(", "),
      faqs: post.faqs?.length ? post.faqs : [{ q: "", a: "" }],
      contentMarkdown: post.contentMarkdown,
      relatedTools: post.relatedTools || [],
      status: post.status,
    });
    setEditingSlug(slug);
    setView("edit");
    setNotice(null);
    window.scrollTo(0, 0);
  }

  async function deletePost(slug: string) {
    if (!window.confirm(`Delete "${slug}" permanently? This cannot be undone.`)) return;
    const r = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    if (r.ok) {
      setNotice({ kind: "ok", text: `Deleted ${slug}.` });
      refreshPosts();
    } else {
      setNotice({ kind: "err", text: "Delete failed." });
    }
  }

  const checks = useMemo(() => {
    const kw = draft.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    const title = draft.title.trim();
    const desc = draft.metaDescription.trim();
    const words = wordCount(draft.contentMarkdown);
    const realFaqs = draft.faqs.filter((f) => f.q.trim() && f.a.trim());
    const list: { ok: boolean; label: string }[] = [
      { ok: title.length >= 30 && title.length <= 65, label: `Title 30-65 chars (now ${title.length})` },
      { ok: kw.length > 0 && kw.some((k) => title.toLowerCase().includes(k)), label: "Primary keyword appears in the title" },
      { ok: desc.length >= 140 && desc.length <= 165, label: `Meta description 140-165 chars (now ${desc.length})` },
      { ok: /^[a-z0-9-]{3,80}$/.test(draft.slug), label: "URL slug is lowercase, hyphenated" },
      { ok: words >= 600, label: `Content ≥ 600 words (now ${words})` },
      { ok: realFaqs.length >= 3, label: `At least 3 FAQs (now ${realFaqs.length})` },
      { ok: draft.relatedTools.length >= 1, label: `Linked to ≥ 1 tool (now ${draft.relatedTools.length})` },
      { ok: draft.excerpt.trim().length >= 40, label: "Excerpt written (shows on blog index)" },
    ];
    return list;
  }, [draft]);

  const score = checks.filter((c) => c.ok).length;

  async function save(status: "published" | "draft") {
    setSaving(true);
    setNotice(null);
    const payload = {
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      metaTitle: draft.metaTitle.trim() || undefined,
      metaDescription: draft.metaDescription.trim(),
      keywords: draft.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      excerpt: draft.excerpt.trim(),
      date: draft.date,
      tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
      faqs: draft.faqs.filter((f) => f.q.trim() && f.a.trim()),
      contentMarkdown: draft.contentMarkdown,
      relatedTools: draft.relatedTools,
      status,
    };
    const r = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (r.ok) {
      setNotice({
        kind: "ok",
        text:
          status === "published"
            ? `Published! Live at /blog/${payload.slug} after the site rebuilds (~2 min).`
            : `Draft saved for /blog/${payload.slug}.`,
      });
      setEditingSlug(payload.slug);
      refreshPosts();
    } else {
      setNotice({ kind: "err", text: d.error || "Save failed." });
    }
  }

  function set<K extends keyof PostDraft>(k: K, v: PostDraft[K]) {
    setDraft((d) => {
      const next = { ...d, [k]: v };
      if (k === "title" && !editingSlug) next.slug = slugify(v as string);
      return next;
    });
  }

  const filteredTools = tools.filter(
    (t) =>
      !toolFilter ||
      t.name.toLowerCase().includes(toolFilter.toLowerCase()) ||
      t.slug.includes(toolFilter.toLowerCase())
  );

  if (!me) {
    return (
      <div className="wrap" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 560 }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!me.configured) {
    return (
      <div className="wrap" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 640 }}>
        <h1 className="hero-title">Admin not configured</h1>
        <p className="sec-sub">
          Set the <code>ADMIN_PASSWORD</code> environment variable on your hosting (Vercel → Project →
          Settings → Environment Variables), then redeploy. For publishing you also need{" "}
          <code>GITHUB_CONTENT_TOKEN</code> — a GitHub personal access token with <em>Contents:
          read &amp; write</em> on the yatools repository.
        </p>
      </div>
    );
  }

  if (!me.authenticated) {
    return (
      <div className="wrap" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 460 }}>
        <p className="eyebrow"><span className="dot" aria-hidden="true" /> Site admin</p>
        <h1 className="hero-title" style={{ margin: "14px 0" }}>YATools <em>Admin</em></h1>
        <form onSubmit={doLogin} className="card" style={{ padding: 28 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ width: "100%", marginBottom: 16 }}
          />
          {loginError && <p style={{ color: "var(--red)", marginBottom: 12 }}>{loginError}</p>}
          <button type="submit" className="btn btn-primary" disabled={loggingIn} style={{ width: "100%" }}>
            {loggingIn ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = { width: "100%", marginBottom: 4 };
  const labelStyle: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 600, fontSize: "0.92rem" };
  const hintStyle: React.CSSProperties = { fontSize: "0.8rem", color: "var(--muted)", marginBottom: 14 };

  return (
    <div className="wrap" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 1060 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="eyebrow"><span className="dot" aria-hidden="true" /> Site admin</p>
          <h1 className="hero-title" style={{ margin: "10px 0 0" }}>Blog <em>manager</em></h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {view === "edit" ? (
            <button className="btn" onClick={() => setView("list")}>← All posts</button>
          ) : (
            <button className="btn btn-primary" onClick={newPost}>+ New post</button>
          )}
          <button className="btn" onClick={doLogout}>Log out</button>
        </div>
      </div>

      {!githubOk && (
        <div className="card" style={{ padding: 18, marginBottom: 20, borderColor: "var(--red)" }}>
          <strong>Publishing is disabled:</strong> set <code>GITHUB_CONTENT_TOKEN</code> in Vercel
          environment variables (GitHub token with Contents: read &amp; write on yatools), then redeploy.
        </div>
      )}

      {notice && (
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 20,
            borderColor: notice.kind === "ok" ? "var(--green, #2f9e44)" : "var(--red)",
          }}
        >
          {notice.text}
        </div>
      )}

      {view === "list" && (
        <div className="card" style={{ padding: 8 }}>
          {posts.map((p) => (
            <div
              key={p.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flexGrow: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  /blog/{p.slug} · {p.date} · {p.status}
                  {p.managed === "code" && " · code-managed"}
                </div>
              </div>
              {p.managed === "admin" ? (
                <>
                  <button className="btn btn-sm" onClick={() => editPost(p.slug)}>Edit</button>
                  <button className="btn btn-sm" onClick={() => deletePost(p.slug)} style={{ color: "var(--red)" }}>
                    Delete
                  </button>
                </>
              ) : (
                <a className="btn btn-sm no-underline" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">
                  View →
                </a>
              )}
            </div>
          ))}
          {posts.length === 0 && <p style={{ padding: 20 }}>No posts yet.</p>}
        </div>
      )}

      {view === "edit" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Title *</label>
              <input className="input" style={inputStyle} value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="How to … (Free)" />
              <div style={hintStyle}>{draft.title.length} chars — aim for 30-65.</div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>URL slug *</label>
              <input className="input" style={inputStyle} value={draft.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="how-to-do-x-free" disabled={!!editingSlug} />
              <div style={hintStyle}>/blog/{draft.slug || "…"}{editingSlug ? " (locked after creation)" : " — auto-generated from the title"}</div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Meta title (optional)</label>
              <input className="input" style={inputStyle} value={draft.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Defaults to the title" />
              <div style={hintStyle}>{draft.metaTitle.length} chars — only needed if you want a different search-result title.</div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Meta description *</label>
              <textarea className="textarea" rows={3} style={inputStyle} value={draft.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="The snippet Google shows under your title…" />
              <div style={{ ...hintStyle, color: draft.metaDescription.length >= 140 && draft.metaDescription.length <= 165 ? "var(--green, #2f9e44)" : undefined }}>
                {draft.metaDescription.length} chars — aim for 140-165.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Keywords *</label>
                <input className="input" style={inputStyle} value={draft.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="merge pdf free, combine pdf online" />
                <div style={hintStyle}>Comma-separated, most important first.</div>
              </div>
              <div>
                <label style={labelStyle}>Tags</label>
                <input className="input" style={inputStyle} value={draft.tags} onChange={(e) => set("tags", e.target.value)} placeholder="PDF, How-to" />
                <div style={hintStyle}>Comma-separated badges.</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Date *</label>
                <input type="date" className="input" style={inputStyle} value={draft.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Excerpt *</label>
                <input className="input" style={inputStyle} value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One-two sentences shown on the blog index…" />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Content (Markdown) *</label>
              <textarea
                className="textarea font-mono2"
                rows={16}
                style={{ ...inputStyle, fontSize: "0.85rem", lineHeight: 1.6 }}
                value={draft.contentMarkdown}
                onChange={(e) => set("contentMarkdown", e.target.value)}
                placeholder={"## Step 1: …\n\nWrite the guide in Markdown. Use ## for headings, - for lists, **bold**, and [link text](/tools/merge-pdf) for links to tools."}
              />
              <div style={hintStyle}>{wordCount(draft.contentMarkdown)} words — aim for 600+.</div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>FAQs</label>
              {draft.faqs.map((f, i) => (
                <div key={i} className="card" style={{ padding: 14, marginBottom: 10 }}>
                  <input className="input" style={{ ...inputStyle, marginBottom: 8 }} value={f.q} placeholder="Question"
                    onChange={(e) => { const faqs = [...draft.faqs]; faqs[i] = { ...faqs[i], q: e.target.value }; set("faqs", faqs); }} />
                  <textarea className="textarea" rows={2} style={inputStyle} value={f.a} placeholder="Answer (2-4 sentences)"
                    onChange={(e) => { const faqs = [...draft.faqs]; faqs[i] = { ...faqs[i], a: e.target.value }; set("faqs", faqs); }} />
                  <button className="btn btn-sm" onClick={() => set("faqs", draft.faqs.filter((_, j) => j !== i))}>Remove</button>
                </div>
              ))}
              <button className="btn btn-sm" onClick={() => set("faqs", [...draft.faqs, { q: "", a: "" }])}>+ Add FAQ</button>
              <div style={{ ...hintStyle, marginTop: 8 }}>FAQs boost Google rich results — 3-6 is ideal.</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Related tools (internal links)</label>
              <input className="input" style={{ ...inputStyle, marginBottom: 10 }} value={toolFilter} onChange={(e) => setToolFilter(e.target.value)} placeholder="Filter tools…" />
              <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 10, padding: 10 }}>
                {filteredTools.map((t) => (
                  <label key={t.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 4px", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={draft.relatedTools.includes(t.slug)}
                      onChange={(e) => set("relatedTools", e.target.checked ? [...draft.relatedTools, t.slug] : draft.relatedTools.filter((s) => s !== t.slug))}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
              <div style={{ ...hintStyle, marginTop: 8 }}>Selected: {draft.relatedTools.length}</div>
            </div>
          </div>

          <div style={{ position: "sticky", top: 100 }}>
            <div className="card" style={{ padding: 22, marginBottom: 16 }}>
              <h3 className="font-display" style={{ fontSize: "1.2rem", marginBottom: 4 }}>SEO score</h3>
              <p className="font-mono2" style={{ fontSize: "2rem", color: score >= 7 ? "var(--green, #2f9e44)" : "var(--red)", margin: "0 0 12px" }}>
                {score}/8
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.86rem", lineHeight: 2 }}>
                {checks.map((c, i) => (
                  <li key={i} style={{ color: c.ok ? "var(--text)" : "var(--muted)" }}>
                    <span aria-hidden="true">{c.ok ? "✅" : "⬜"}</span> {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: 22 }}>
              <button className="btn btn-primary" style={{ width: "100%", marginBottom: 10 }} disabled={saving} onClick={() => save("published")}>
                {saving ? "Publishing…" : "🚀 Publish"}
              </button>
              <button className="btn" style={{ width: "100%" }} disabled={saving} onClick={() => save("draft")}>
                {saving ? "Saving…" : "Save draft"}
              </button>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>
                Publishing commits to GitHub — the live site rebuilds automatically in ~2 minutes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
