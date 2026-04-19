# Blog Post Structure — EcoVibe Floors (Bulgarian)

## Overview

Blog posts for EcoVibe Floors are longer-form educational content targeting Bulgarian homeowners, interior designers, and contractors. They rank for organic search and seed social media content. Tone is the same warmth as Facebook/Instagram — but with more depth, more detail, and slightly more formal structure.

---

## Standard Post Template

```
[META DESCRIPTION — 150-155 characters, includes primary keyword]
[H1 TITLE — includes primary keyword near the beginning]
[Последна актуализация: DD.MM.YYYY]

[INTRO — 80-120 words, hook formula]

[НАКРАТКО — 3-5 bullet key takeaway box]

[TABLE OF CONTENTS — anchor links to all H2 sections]

[BODY — 3-6 H2 sections]

[FAQ — H2: "Често задавани въпроси" — 3-5 Q&A pairs]

[CONCLUSION — 60-100 words]
[CTA — 2-4 sentences]

[SOURCES — brief references]
```

---

## Section-by-Section Guide

### Meta Description
- 150-155 characters maximum
- Must include the primary keyword naturally
- Should create curiosity or state a clear benefit
- Bulgarian example: "Инженерен паркет или SPC настилка — кой под е по-добър? Сравняваме издръжливост, цена и подходящи помещения, за да изберете правилно."

### H1 Title
- Primary keyword near the beginning
- Question format works well for how-to posts: "Как да изберем паркет за подово отопление?"
- Comparison format for comparison posts: "Инженерен паркет vs SPC настилка — честното сравнение"
- Keep under 65 characters for SEO display

### Freshness Date (Последна актуализация)

Displayed immediately below the H1 title.

```
*Последна актуализация: 14.04.2026*
```

- Bulgarian date format: DD.MM.YYYY
- Maps to `dateModified` in the Firestore schema
- Update only when content changes meaningfully — not for typo fixes

---

### Introduction (Intro Hook Formula)
**Three-part structure:**
1. **Hook** — state the problem or question the reader has (1-2 sentences)
2. **Why it matters** — why getting this right is important (1-2 sentences)
3. **Preview** — tell them what they'll learn in this post (1-2 sentences)

**Bulgarian example:**
```
Изборът на подово покритие е едно от най-важните решения при обзавеждане на дом — и едно от най-объркващите.

Инженерен паркет или SPC настилка? Двата варианта изглеждат сходно, но имат съществени разлики в структурата, издръжливостта и подходящите помещения.

В тази статия разглеждаме честно и двата варианта, за да стигнете до информирано решение.
```

### Накратко (Key Takeaway Box)

Placed immediately after the introduction, **before** the Table of Contents. This is the highest-value section for AI citation and featured snippets — AI systems actively extract summary-formatted content.

**Format in markdown:**
```
> **Накратко:**
> - Инженерният паркет е съвместим с подово отопление до 27°C.
> - Минимална препоръчана дебелина: 15 mm.
> - Не е подходящ за бани — при директен контакт с вода.
> - Може да се шлайфа и обнови — за разлика от ламинат и SPC.
```

**Rules:**
- 3-5 bullets, each 1 sentence
- Each bullet is self-contained — readable without context from the rest of the post
- Start with a concrete claim (not a vague setup): "X е Y" or "X може/не може Z"
- Good: "SPC настилката е 100% водоустойчива — подходяща за бани и кухни."
- Bad: "В тази статия ще научите важни факти за SPC настилката."
- Maps to the summary box styled with CSS class `.key-takeaway-box` (the `speakable` target)

---

### Table of Contents (Съдържание)

Placed after the Накратко box, before the first H2. Renders as a `<nav>` element in HTML.

**Format in markdown:**
```
## Съдържание
- [Какво е инженерен паркет?](#kakvo-e)
- [Видове инженерен паркет](#vidove)
- [Монтаж и поддръжка](#montazh)
- [Често задавани въпроси](#faq)
```

**Rules:**
- Include all H2 sections including the FAQ section
- Anchor IDs use Latin transliteration, lowercase, hyphens (consistent with slug convention)
- The `toc` frontmatter array is populated from these anchors
- Shared across BG and EN language versions (anchor IDs don't change)

---

### Body Sections (H2)
- Each H2 covers one complete idea — do not mix topics within a section
- Optimal: 3-6 H2 sections
- Short paragraphs: 2-4 sentences each
- Use bullet lists when listing features, benefits, or steps (easier to scan)
- Use comparison tables when comparing products or options
- **Explain technical terms on first use:** "HDF (High-Density Fiberboard) основа..."

### FAQ (Често задавани въпроси)

Placed after the last body H2 section, **before** the Conclusion. Required for every post — powers FAQPage schema markup for AI Overviews.

**Format in markdown:**
```
## Често задавани въпроси {#faq}

### Може ли инженерен паркет за подово отопление?
Да, инженерен паркет е съвместим с подово отопление. Препоръчително е максималната температура на пода да не надвишава 27°C. Изберете паркет с дебелина минимум 15 mm и HDF сърцевина.

### Може ли инженерен паркет в кухня?
Да, при условие че избягвате директен контакт с вода. Препоръчваме покритие с UV лак за по-висока устойчивост. Не е подходящ непосредствено до мивката или съдомиялната без защитна подложка.

### Колко издържа инженерният паркет?
При правилна поддръжка — 20-30 години. Може да се шлайфа и обнови 2-3 пъти, което удължава живота му спрямо ламинат или SPC.
```

**Rules:**
- **H3 for questions** (not bold text — H3 enables proper schema extraction)
- 3-5 Q&A pairs for cluster posts; 5-8 for pillar pages
- Questions must match real search queries — check Google autocomplete or "Хората питат още" box for the primary keyword
- Each answer starts with a direct response in sentence 1 — no preamble like "Добър въпрос..."
- Answer length: 2-4 sentences. Complete enough to stand alone as a citation.
- Good: "Да, инженерен паркет е съвместим с подово отопление при..."
- Bad: "Това е честа тема. Нека разгледаме въпроса внимателно..."
- Add `{#faq}` anchor to the H2 heading for ToC linking

---

### Conclusion
- Summarize the key insight in 1-2 sentences
- Do not introduce new information
- Bridge to the CTA

### Sources (Източници)

Placed at the very bottom, after the CTA. Not academic citations — brief references only.

**Format in markdown:**
```
---
**Източници:**
- Продуктова документация Ter Hürne — Tailored Parquet
- EN 13329 — европейски стандарт за класификация на паркет
```

**Rules:**
- Include when post references industry data, product specs, or external research
- If all information comes from EcoVibe product docs: "Продуктова документация Ter Hürne / DIG" is sufficient
- Maps to the `sources` array in the Firestore schema
- Optional for purely editorial posts (design inspiration, brand stories) — required for technical posts

---

### CTA (Call to Action)
- Always soft — never pushy
- Match the post topic: if post is about underfloor heating compatibility → CTA mentions consultation
- Standard CTA patterns (Bulgarian):
  - "Имате въпроси? Свържете се с нас за безплатна консултация."
  - "Разгледайте нашата колекция и намерете идеалния под за вашия дом."
  - "Не сте сигурни кой вариант е подходящ за вашето пространство? Пишете ни."

---

## Word Count by Post Type

| Post Type | Word Count | Notes |
|-----------|-----------|-------|
| How-to guide | 1,000–1,500 | Step-by-step format with H2 headers per step |
| Product comparison | 1,200–2,000 | Usually includes comparison table |
| Product guide | 800–1,200 | One product/collection in depth |
| Terminology explainer | 700–1,000 | Define, explain, give context |
| Design inspiration | 600–900 | More visual-driven; shorter copy |

---

## SEO Checklist

Before saving the draft, verify:

**Keywords & metadata:**
- [ ] Primary keyword in H1 title
- [ ] Primary keyword in first paragraph (naturally, not forced)
- [ ] Primary keyword in meta description
- [ ] Secondary keywords used naturally in body (not stuffed)
- [ ] H2 headers include keywords where natural
- [ ] Bulgarian technical terms spelled correctly (инженерен not инжинерен, настилка not настилька)
- [ ] Product names in original script: Ter Hürne, Hywood, DIG, Avatara, Venowood

**Required sections (all posts):**
- [ ] Freshness date present below H1 (`*Последна актуализация: DD.MM.YYYY*`)
- [ ] Накратко box present with 3-5 standalone bullets
- [ ] Table of Contents present with anchor links
- [ ] FAQ section present (minimum 3 Q&A pairs)
- [ ] FAQ questions match real search queries (not invented questions)
- [ ] Sources section present (at minimum a product documentation reference for technical posts)

**AI readability:**
- [ ] Each H2 section opens with a direct-answer sentence (not a rhetorical question)
- [ ] Internal CTA references EcoVibe products specifically

---

## AI Readability Guidelines

These formatting patterns increase the chance of AI systems (Google AI Overviews, ChatGPT Search, Perplexity) extracting and citing your content accurately.

1. **Накратко box is mandatory.** AI systems extract bullet summaries preferentially. This is the single highest-value element.

2. **Open each H2 with a direct-answer sentence.**
   - Good: "Инженерният паркет е подходящ за подово отопление, защото HDF сърцевината му осигурява стабилност при температурни промени."
   - Bad: "Може би се чудите дали паркетът е подходящ за подово отопление. Нека разгледаме темата."

3. **Definition-first pattern for key concepts.** AI systems extract standalone sentences.
   - Good: "SPC (Stone Plastic Composite) е 100% водоустойчива настилка с каменно-пластмасова сърцевина."
   - Bad: "Тъй като вече разгледахме инженерния паркет, нека сега разгледаме SPC..."

4. **One claim per paragraph.** AI extractors work at paragraph level. Long paragraphs with multiple points get truncated unpredictably.

5. **Use comparison tables for product comparisons.** Tables are among the most frequently cited content types in AI Overviews. Use `<thead>` and `<tbody>` structure.

6. **Use specific numbers and specs.** "Клас 32 (AC4)" is more citable than "много издръжлива". Product ratings, temperature ranges, and dimensions are exactly what AI systems extract and trust.

7. **FAQ answers are extraction targets.** Treat each FAQ answer as a standalone citable fact. If a reader only sees the FAQ answer, they should have the complete answer to their question.

---

## Using a Research PDF as Source Material

When drafting from a PDF in `resources/research/blog-pdfs/`:

1. Read the PDF fully first
2. Extract relevant facts as bullet points (do not quote verbatim)
3. Cross-reference any product claims with `products/[brand].md`
4. Mark unverifiable claims as `[VERIFY: description]`
5. Cite implicitly — "Проучвания показват..." or "Според индустриални данни..." — no academic citation format needed
6. Do NOT copy marketing language from competitor PDFs

---

## Blog Writing Style vs Social

| Dimension | Blog | Facebook/Instagram |
|-----------|------|-------------------|
| Sentence length | Slightly longer, but still short paragraphs | Short and punchy |
| Tone | Warm expert — more detailed, slightly more formal | Warm expert — casual, direct |
| Structure | Full post template (intro/body/CTA) | Hook + body + CTA |
| Jargon | Explain on first use, then use freely | Avoid or explain immediately |
| Length | 800-2000 words | 80-200 words |
| Purpose | Educate + rank organically | Engage + build community |

---

## Draft Metadata Template

All fields map directly to the Firestore document schema (see `research/blog-strategy-2026.md`).

```yaml
---
project: 04-ecovibe-floors
platform: blog
status: draft

# Identity
strategyId: P1
postType: pillar                         # pillar / cluster / cross-pillar / brand
phase: 1
inLanguage: bg                           # bg for BG drafts; en for EN drafts

# SEO
slug: engineered-parquet-complete-buyers-guide-2026   # English canonical slug — shared with EN translation. URL: /{lang}/blog/{slug}. NO Bulgarian characters.
title: "Инженерен паркет: пълното ръководство за купувача 2026"
metaDescription: "150–155 chars, includes primary keyword"
primaryKeyword: инженерен паркет
tags: [инженерен паркет, паркет, Ter Hürne, DIG]
category: engineered-parquet             # engineered-parquet / hybrid / spc-lvt / comparison / brand
schemaType: Article                      # Article / HowTo / FAQPage (primary type only)
robotsMeta: "max-snippet:-1, max-image-preview:large"

# Content metadata
wordCount: 2500
readingTimeMinutes: 9
dateModified: 2026-04-14

# Pillar-cluster relationship
isPartOf: null                           # Pillar slug for cluster posts; null for pillar pages
hasPart: [P1-C1, P1-C2, P1-C3]         # Cluster IDs for pillar pages; [] for clusters

# Speakable
speakable: ".key-takeaway-box"

# Linking — fill in before publishing
linksTo: [P1-C1, P1-C2]
relatedPostSlugs: [P1-C1, P1-C2, P1-C3]

# Hero image — Firebase Storage path (language-agnostic, same for BG and EN)
# Pattern: products/{collection}/{subcollection}/{sku}/full/{imagename}.webp
# Example: products/oak/chevron/FLR-3001/full/image1.webp
# Claude suggests this from featuredProducts when drafting. Confirm or swap before publishing.
heroImage: products/oak/chevron/FLR-3001/full/image1.webp

# Products featured
featuredProducts:
  - name: Tailored Parquet
    brand: Ter Hürne
    slug: tailored-parquet

# Entity mentions
mentions:
  - type: Brand
    name: Ter Hürne

# Sources referenced
sources:
  - "Продуктова документация Ter Hürne"

# Source material (internal — not exported to Firestore)
sourcePdf: none
sourceNotes: ""
---
```

**Notes on this template:**
- `heroImage` is a Firebase Storage path — the Next.js app resolves it to a URL at runtime via `getDownloadURL()`. Always use the `full` size.
- `summary` and `faq` are **not** in the YAML — they live in the markdown body only. The NextJS integration extracts them from the content at import time.
- `toc` is generated from the headings at build time — do not manually maintain it.
- `breadcrumbs` are generated by the frontend — not in the draft.
- EN draft files use the same `strategyId` and `slug`, but set `inLanguage: en` and use EN title/metaDescription.

---

## Backlink Workflow

When a post is published, existing posts may need to be updated to link back to it.

**Rule:** Every post's `linksTo` list defines which posts it links to. Those posts' `linkedFrom` field (in Firestore) must be updated, and a link to the new post must be added to their body text.

**Steps after publishing:**
1. Check the post's `linksTo` entries in the tracker
2. For each: open the existing post draft, find a natural place to add an anchor link, add it
3. Update the tracker's Backlink Update Queue — mark each entry done when live
4. Update the Firestore document's `internalLinks.backlinksAdded` array

**Anchor text rule:** Use descriptive, keyword-rich anchor text — never "click here" or "read more". All internal link URLs use **English slugs** (same as the `slug` frontmatter field), never Bulgarian transliteration.
- Good: `[Инженерен паркет за подово отопление](/blog/engineered-parquet-underfloor-heating)`
- Bad: `[Инженерен паркет за подово отопление](/blog/inzheneren-parket-podovo-otoplenie)` (Bulgarian transliteration — wrong)
- Bad: `[прочетете тук](/blog/engineered-parquet-underfloor-heating)` ("click here" anchor — wrong)

**Draft link convention:** When linking to a post that is not yet published (status `⬜ not-started`, `🔵 drafting`, or `🟡 draft-ready`), append `{draft}` after the URL. The Next.js app strips the link and renders as plain text (or "coming soon" indicator). When the target post is published, remove `{draft}` and the link becomes live.
- Unpublished: `[Инженерен паркет за подово отопление](/blog/engineered-parquet-underfloor-heating){draft}`
- Published: `[Инженерен паркет за подово отопление](/blog/engineered-parquet-underfloor-heating)`

**How to check:** Read the Slug Registry in `content/blog/blog-post-tracker.md` — it maps strategy IDs to English slugs and shows which posts are published.
