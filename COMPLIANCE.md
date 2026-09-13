# NoteMatch — Amazon Associates (Brazil) Compliance

This document tracks NoteMatch's compliance posture with the **Amazon Associates
Program (Brazil)** Operating Agreement, IP License, and Participation
Requirements, plus applicable Brazilian law (LGPD, Marco Civil da Internet,
Código Brasileiro de Autorregulamentação Publicitária).

> **Status:** The app is currently in a **pre-affiliate-link** state. No Amazon
> Special Links, ASINs, or Amazon URLs exist anywhere in the codebase. The
> changes below prepare the app so that affiliate links can be added safely in a
> future step. **Do not add affiliate links until the checklist at the bottom is
> complete.**

Official policy sources (verified 2026-09-13):
- Operating Agreement: https://associados.amazon.com.br/help/operating/agreement
- Program Policies (Participation Requirements, IP License, Trademark Guidelines):
  https://associados.amazon.com.br/help/operating/policies/

---

## What was fixed

### CRITICAL

1. **Hardcoded prices removed from the UI** (Participation Requirements §2(b)).
   `src/components/ResultsList.tsx` no longer renders `{rec.price}`. The
   catalog keeps `price`/`priceValue` for internal budget matching and future PA
   API use, but they are not displayed as Amazon product prices. Compliance
   comments added to `src/lib/catalog.ts`, `src/lib/types.ts`, and
   `ResultsList.tsx`.
2. **`PriceDisclaimer` component created** (IP License §2(i)) —
   `src/components/PriceDisclaimer.tsx`. Renders the official Brazilian
   Portuguese price/availability disclaimer and an optional date/time stamp.
   Not rendered yet (no prices shown); a comment in `ResultsList.tsx` shows
   where it goes.
3. **Date/time stamp** built into `PriceDisclaimer` via the `updatedAt` prop
   (IP License §2(i)) — required when prices are refreshed less than hourly via
   PA API / Data Feeds.
4. **Privacy policy page** created (Participation Requirements §3(e) + LGPD) —
   `src/app/privacidade/page.tsx` (static server component). Covers data
   collected, Supabase storage, Amazon Associates + Supabase third-party
   sharing, cookies/local storage, LGPD rights, contact, and effective date.
   Linked from `Footer.tsx`; a data-collection notice with a link to
   `/privacidade` appears in `ChatWidget.tsx` during the email/phone capture
   stages.
5. **`AffiliateDisclosure` component created** (FTC/Amazon link-level) —
   `src/components/AffiliateDisclosure.tsx`. Renders a small `#ComissõesPorCompra`
   badge (an officially endorsed Brazilian example). Not rendered yet; a comment
   in `ResultsList.tsx` shows where it goes adjacent to each future Special Link.

### HIGH

6. **Disclosure placement** — the site-wide Associates disclosure now also
   appears at the top of the results list in `ResultsList.tsx` (in addition to
   the footer), per FTC placement guidance.
7. **Email compliance** — the `ChatWidget` final message now includes the
   Associates disclosure, an unsubscribe note ("Pode cancelar a qualquer
   momento"), and a reference to the privacy policy. A comment near
   `saveLeadToApi` documents the future email-sending requirements (physical
   sender address, unsubscribe link, disclosure in body).
8. **Performance claims softened** (Participation Requirements §2(b)) —
   unverifiable numeric FPS claims in `src/lib/catalog.ts` were replaced with
   qualitative language (e.g. "mais de 144 FPS" → "alta taxa de quadros em
   configurações altas"; "mais de 100 FPS em Fortnite" → "desempenho elevado em
   jogos modernos"). Qualitative/factual claims (e.g. "Compila código
   rapidamente", "Roda Docker") were kept.
9. **CERTAIN CONTENT disclaimer added** to `Footer.tsx` (IP License §2(k)) in
   Brazilian Portuguese, for future display of Product Advertising Content.

### MEDIUM (no code change required; documented here)

10. **Comparison format** — `ComparisonModal` shows specs only, no prices. Safe as-is.
11. **No cloaking/redirects** — no links exist yet. N/A.
12. **No customer reviews** — none displayed. N/A.
13. **No incentivized clicks** — N/A.
14. **No paid search on Amazon trademarks** — N/A (code-level).
15–17. **180-day rule, paid ads, Agent Terms** — operational; see "April 2026 rules" below.
18. **No offline use of Amazon Marks** — N/A.
19. **Mobile app policy** — no mobile app. N/A.
20. **Brazilian wording verification** — the price disclaimer and CERTAIN CONTENT
    wording were verified against associados.amazon.com.br on 2026-09-13 (see
    "Disclaimer wording" below). The site-wide disclosure uses an equivalent
    paraphrase ("Como associado da Amazon, podemos receber comissão por compras
    qualificadas."); the official help-page example is "Como associado da
    Amazon, eu recebo por compras qualificadas." — confirm the preferred wording
    before launch.

---

## Disclaimer wording (verified 2026-09-13)

All wording was verified against the official Brazilian Associates policies.

### Price/availability disclaimer (IP License §2(i))
> "Os preços e a disponibilidade dos produtos estão corretos na data/horário
> indicados e poderão sofrer alterações. Quaisquer informações de preço e
> disponibilidade exibidas [no(s) respectivo(s) Site(s) da Amazon, conforme
> aplicável] no momento da compra serão aplicáveis à compra desse produto."

NoteMatch uses the Amazon.com.br-specific form (replacing the bracketed
placeholder with "na Amazon.com.br"). Rendered by `PriceDisclaimer.tsx`.

### CERTAIN CONTENT disclaimer (IP License §2(k))
> "O CONTEÚDO EXIBIDO [NESTE APLICATIVO ou NESTE SITE, conforme aplicável] É
> ORIGINADO DA AMAZON. ESTE CONTEÚDO É EXIBIDO COMO SE ENCONTRA ('AS IS') E
> PODERÁ SER MODIFICADO OU EXCLUÍDO A QUALQUER MOMENTO."

NoteMatch uses the "NESTE SITE" form. Rendered in `Footer.tsx`.

### Link-level disclosure (FTC / Amazon help)
Official accepted short-form examples: `"(link patrocinado)"`, `"#pub"`,
`"#ComissõesPorCompra"`. NoteMatch's `AffiliateDisclosure` defaults to
`"#ComissõesPorCompra"` (configurable via the `label` prop).

### Site-wide Associates disclosure
Official help-page example: "Como associado da Amazon, eu recebo por compras
qualificadas." NoteMatch currently uses the equivalent paraphrase "Como
associado da Amazon, podemos receber comissão por compras qualificadas." in
both `Footer.tsx` and `ResultsList.tsx`. Confirm the preferred wording before
launch.

---

## April 2026 rules to be aware of

These are operational/programmatic rules (not code), but the team must keep them
in mind before and after adding affiliate links:

- **180-day shipping/payment requirement**: To remain in the Program, the
  Associate site must be live and the Associate must have shipped/fulfilled at
  least one qualifying order (or generated qualifying revenue) within 180 days.
  Inactivity beyond 180 days can lead to account closure.
- **Paid ads disqualification**: Certain paid-search and paid-ads behaviors
  disqualify otherwise-qualifying purchases from earning commission (see the
  Commission Regulation's "Inserção Proibida de Busca Patrocinada" / Prohibited
  Search Placement rules). Do not bid on Amazon-owned terms (e.g. "amazon",
  "Kindle") or their misspellings in search tools.
- **Agent Terms (IP License §4)**: If any software agent (autonomous or
  semi-autonomous software acting on someone's behalf) accesses, uses, or
  interacts with Program Content, it must: (a) identify itself on every
  HTTP/HTTPS request via a `Agent/[name]` user-agent string, (b) not hide or
  obfuscate that it is an agent (no mimicking human speed/patterns, no
  CAPTCHA-bypassing), (c) answer truthfully when asked whether it is human or
  computer, and (d) not circumvent any blocking/limiting measures. Amazon may
  also limit agent access at its discretion. If NoteMatch ever uses an AI agent
  to fetch Amazon data (e.g. PA API via an LLM tool), it must comply with these
  Agent Terms.

---

## What remains to be done BEFORE adding affiliate links

The following must be completed in a future "add affiliate links" step. Until
then, **do not** add Special Links, ASINs, or Amazon URLs to the catalog or any
component.

1. **Wire up PA API / Creators API for live prices.** Obtain PA API
   credentials (access key pair + associate tag), implement a server-side fetch
   (cached ≤ 24h per IP License §2(h); refresh at least hourly to avoid the
   date/time-stamp requirement, or include the stamp via `PriceDisclaimer`'s
   `updatedAt` prop).
2. **Render `PriceDisclaimer` adjacent to each displayed price.** Once prices
   come from PA API, render `<PriceDisclaimer updatedAt={lastRefreshedAt} />`
   immediately next to each price in `ResultsList.tsx` (see the comment in that
   file). Include the date/time stamp unless refreshing at least hourly.
3. **Add the Special Links with the Associates tag.** Each recommendation gets a
   Special Link to the Amazon.com.br product detail page, formatted with the
   Associate tag/ID. Do not cloak or redirect through an intermediate URL.
4. **Render `AffiliateDisclosure` adjacent to each Special Link.** Render
   `<AffiliateDisclosure />` immediately next to each link (see the comment in
   `ResultsList.tsx`).
5. **Confirm exact Brazilian Portuguese disclaimer wording** with
   associados.amazon.com.br before launch (price disclaimer, CERTAIN CONTENT,
   site-wide disclosure). The wording in this repo was verified on 2026-09-13
   but Amazon may update its policies.
6. **Implement the email-sending flow** with CAN-SPAM/LGPD compliance. Each
   outgoing email must include: (a) a physical sender address, (b) a working
   unsubscribe link, and (c) the Associates disclosure in the email body. See
   the comment near `saveLeadToApi` in `ChatWidget.tsx`.
7. **Configure the privacy contact email** — replace the placeholder
   `contato@notematch.example` in `src/app/privacidade/page.tsx` with the real
   contact address for data requests.
8. **Re-verify performance claims** in `src/lib/catalog.ts` if any new numeric
   claims are added, to keep them qualitative and non-misleading.
9. **If using an AI agent to fetch Amazon data**, comply with the Agent Terms
   (IP License §4) — `Agent/[name]` user-agent, no human-mimicking, truthful
   identification.

---

## Checklist for the future "add affiliate links" step

- [ ] PA API credentials obtained and stored in server-side env (never exposed to client)
- [ ] Server-side PA API fetch implemented with caching ≤ 24h (refresh hourly to skip timestamp, or include timestamp)
- [ ] `<PriceDisclaimer updatedAt={...} />` rendered adjacent to each price in `ResultsList.tsx`
- [ ] Special Links added to each recommendation with the Associate tag, linking to Amazon.com.br product detail pages
- [ ] `<AffiliateDisclosure />` rendered immediately adjacent to each Special Link
- [ ] No cloaking/redirects: links go directly to Amazon
- [ ] No customer reviews/ratings displayed (unless obtained via PA API and compliant with §2(t))
- [ ] No incentivized-click language ("click here to support us", etc.)
- [ ] No paid-search bidding on Amazon-owned terms
- [ ] Site-wide Associates disclosure present (footer + near results) ✓ already done
- [ ] CERTAIN CONTENT disclaimer present (footer) ✓ already done
- [ ] Privacy policy live at `/privacidade` ✓ already done
- [ ] Privacy contact email configured (replace placeholder)
- [ ] Email-sending flow implemented with sender address + unsubscribe link + disclosure
- [ ] Brazilian Portuguese disclaimer wording confirmed with associados.amazon.com.br
- [ ] 180-day activity requirement monitored operationally
- [ ] If AI agents fetch Amazon data: Agent Terms compliance (`Agent/[name]` UA, transparency)
