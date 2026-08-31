# Changelog

All notable changes to the **Batwaara** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-08-31

### Added
- **1-Click UPI Deep Linking & Dynamic QR Code Settlement Modal**:
  - Direct intent links for Google Pay, PhonePe, Paytm, and BHIM UPI (`upi://pay`).
  - Dynamic QR code generation for scanning directly from mobile banking apps.
- **Settle Up Authorization Guard**:
  - Debt transfer details are visible to all group members for full financial transparency.
  - Interactive **Settle Up (UPI)** button is enabled **ONLY** for the designated debtor who owes money. For non-debtors, the button is disabled displaying `Waiting for [Payer]`.
- **Permanent Base64 & Supabase Storage Receipt System**:
  - Automatic Base64 fallback ensuring receipt attachments are permanently preserved in PostgreSQL without expiring on session reload.
  - Added live attached receipt thumbnail preview box with **View** & **Remove** controls inside the Add Expense modal.
  - Added a prominent **"Receipt Attached 🧾"** badge to expense list cards with error boundary handling.
- **Bayer 4x4 Canvas Dither Trip Memory Component**:
  - Real-time HTML Canvas dither shader (`<DitherImage />`) for squad road trip photos using a duo-tone emerald/slate Bayer 4x4 matrix.
- **Interactive Aceternity Payment Integrations Orbit**:
  - Satellite payment app tiles (Google Pay, PhonePe, Paytm, UPI) orbiting around the Batwaara core logo.
- **Expanded FAQs Section**:
  - Added 6 new comprehensive FAQ entries covering 1-Click UPI deep linking, guest profile claiming, AI voice logging, greedy debt simplification math, and data security.

### Fixed
- Fixed 3D Spinning Globe canvas rendering and positioning in `FeaturesSection.tsx`.
- Fixed broken receipt preview modal by adding custom fallback card for expired blob links.
- Updated YouTube product demo link and high-definition thumbnail to `https://youtu.be/z4NXXb7zIrM`.
- Fixed group member duplication guards in `addGroupMember` and `getGroupSummary`.
- Fixed Resizable Navbar folding overlap when expanded.

---

## [1.1.0] - 2026-08-30

### Added
- **Clerk OAuth Authentication Integration**:
  - Secure sign-in and sign-up with Google, GitHub, and Email via Clerk.
  - Automatic profile creation and synchronization in Supabase PostgreSQL.
- **AI OCR Receipt Scanner**:
  - Automated merchant, date, total amount, and category extraction via OCR Space API.
- **AI Voice & Natural Language Expense Logger**:
  - Web Speech API voice recording + OpenAI/Gemini powered prompt parser (`/api/ai/parse-voice`).
  - Automatically parses amount, description, category, and matches group member names.
- **Stripe / Neo-Grotesque Developer Tech Aesthetic**:
  - Configured `Plus Jakarta Sans` for headers, `Inter` for body text, and `JetBrains Mono` with `tabular-nums` for currency figures.

---

## [1.0.0] - 2026-08-15

### Added
- **Core Group Expense Management**:
  - Create groups, generate shareable invite codes, and add guest or registered members.
- **Flexible Expense Split Modes**:
  - Equal split, percentage split, exact amount split, and shares split.
- **Greedy Debt Simplification Algorithm**:
  - Minimizes $N \times N$ group debt balances down to the fewest directed cash transfers.
- **Analytics & Insights**:
  - Group spending charts, category totals breakdown, and AI summary insights generator (`/api/ai/insights`).

---

[1.2.0]: https://github.com/AbhinavMangalore16/edclarity-ai/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/AbhinavMangalore16/edclarity-ai/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/AbhinavMangalore16/edclarity-ai/releases/tag/v1.0.0
