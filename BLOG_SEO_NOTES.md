# Competitor SEO Research — Notes for YATools (dev notes, not a route)

Researched 2026-10-06 via text fetch of homepages + one popular tool page each:
iLovePDF (/merge_pdf), SmallSEOTools (/merge-pdf/), 123apps network (mp3cut.net),
Sejda (/merge-pdf). Findings are structural patterns, not copied copy.

## What each competitor does

### iLovePDF
- Title: brand + category keyword ("iLovePDF | Online PDF tools for PDF lovers").
- Tool page title/H1 are keyword-first and plain: "Merge PDF files online. Free service to merge PDF".
- Anatomy: H1 → one-line subhead → **tool widget immediately above the fold** → big CTA → minimal SEO copy below.
- Internal linking: homepage = full tool grid (icon + name + one-line description); category tab filters (All, Organize, Optimize, Convert, Edit, Security…).
- Trust: ISO/SSL badges, "100% FREE and easy to use".
- No FAQ block on the tool page — the page stays tool-focused.

### SmallSEOTools
- Tool title/H1 = keyword + brand suffix ("Merge PDF - Combine PDF Files by our Free PDF Joiner").
- Anatomy: H1 → intro paragraph → widget → "How To …?" numbered steps → long SEO sections ("Why Choose…", "Features of…", "Benefits of…", "Testimonials", "FAQs").
- Keyword strategy: heavy repetition of variants (merge pdf online / pdf combiner / pdf binder / pdf joiner). Ranks, but reads spammy — do NOT copy the density, copy the *coverage*.
- **Long-tail variant pages**: separate pages per size query ("Compress PDF to 50KB", "Compress JPEG to 100KB"). Clever intent capture.
- In-content links to sibling tools (rotate pdf, lock PDF) inside body copy; testimonials for trust.
- 9-question FAQ targeting objections: cost? limits? safety? formats? OS support?

### 123apps (network: mp3cut.net, pdf.io, convert.io…)
- Title: "Web Apps by 123apps - Edit, Convert, Create".
- Homepage groups tools by category (Video / Audio / PDF / Converters); each tool lives on its own domain — a cross-domain network strategy.
- Tool page title targets use-case keywords: "Online MP3 Cutter - Cut Songs, Make Ringtones".
- Anatomy: H1 ("Audio Cutter") → benefit H2 → widget → **feature card grid** (fade in/out, iPhone ringtones, extract audio from video…) → "How to Trim Audio?" 3 numbered steps → summary paragraph → **star rating widget** (4.4/5, 27,693 votes — rich-snippet bait).

### Sejda
- Tool title: "Merge PDF Files Online"; H1 uses task language, not keyword stuffing: "Combine multiple PDFs and images into one".
- **Honest limits directly under the widget**: "Free service for documents up to 50 pages or 50 MB and 3 tasks per hour" + "Files stay private. Automatically deleted after 2 hours."
- Anatomy: widget → deep "How to Merge PDF Files" guide: 12 numbered H3 mini-sections with screenshots, cross-links to sibling tools (Alternate & Mix).
- Homepage has a **"How-to PDF Guides" section = a mini blog**; every guide ends with a CTA link to the tool. Bidirectional content↔tool linking.
- Social proof: 4.5 stars / 1,874 Google reviews.

## 10 concrete recommendations for YATools tool pages

1. **Widget above the fold, always.** H1 (keyword-front-loaded) + one-line subhead → working tool immediately. Long copy lives below the widget, never above it.
2. **Title pattern**: `<Verb> <Thing> — Free, No Sign-Up`, keyword first, under 60 chars. e.g. "Free Image Compressor — Shrink JPG, PNG, WebP".
3. **Meta description pattern**: action verb + what it does + "free" + differentiator (private / no uploads / no watermark) + formats. Under 160 chars.
4. **Numbered "How to …" steps right after the widget.** All four competitors do this; our `Steps` component already matches — keep it on every page.
5. **FAQ on every tool page mapped to real objections** (limits? cost? safety? formats?) — SmallSEOTools' 9-question shape. `FaqList` + `faqJsonLd` are already wired; the win is question selection, not format.
6. **Honest limits line directly under the widget** (Sejda pattern): mono microcopy like "Free · runs in your browser · ~10MB image limit". Builds trust, preempts support questions, feeds the FAQ.
7. **Cross-link sibling tools inside body copy** with descriptive anchors (Sejda/SmallSEOTools pattern) — don't rely only on the RelatedTools card grid.
8. **Long-tail variant coverage** (SmallSEOTools' "Compress JPEG to 100KB" play): add preset chips in the tool UI (e.g. "target 100KB / 500KB / 1MB") and publish one long-tail landing page or blog post per high-intent variant.
9. **Feature card grid** (mp3cut pattern), distinct from use-cases: each card names a concrete job ("make iPhone ringtones", "extract audio from video") — natural keyword-variant coverage without stuffing.
10. **Homepage "How-to guides" section** (Sejda pattern): surface `/blog` posts on the homepage; link every post to its tool and every tool page to its post ("Learn more: How to merge PDF files for free"). Bidirectional links pass relevance both ways.

## What NOT to copy
- SmallSEOTools' keyword-stuffing density and generic testimonials — risks readability and (long-term) quality signals.
- Fake ratings/review counts — add aggregate ratings only when real; until then use trust badges (privacy-by-design, no sign-up, no watermark).

## Blog program (started 2026-10-06, /blog)
- 4 launch posts map 1:1 to tools: merge-pdf-files-free → /tools/merge-pdf; compress-images-without-losing-quality → /tools/image-compressor (+converter, +resizer); qr-code-with-logo → /tools/qr-code-generator (+qr-scanner); remove-image-background-free → /tools/background-remover.
- Post template: keyword title (<60ch) + meta (<160ch) → breadcrumb → eyebrow → H1 → meta row (date, read time, tags) → excerpt → prose H2s → tool CTA card → FAQ (FaqList + FAQPage schema) → RelatedTools → more-posts nav → Article JSON-LD.
- Next candidates: "compress image to 100kb", "jpg to pdf on iphone", "qr code for wifi", "png vs jpg vs webp", "pdf to word free", "add page numbers to pdf".
