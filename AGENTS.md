<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Build an expense splitting app for groups. 
Features: create named groups (e.g., 'Beach Trip 2024', 'Apartment Roommates') and add members by name. 
Add expenses with: description, amount, who paid, and who it's split between. Support three split types — equal, by percentage, and custom amounts. Show a running balance page displaying net amounts (e.g., 'You owe Sarah $23.50' or 'Mike owes you $15.00'). 
Add a 'Settle Up' page that calculates the optimal minimum payments to clear all debts. 
Include expense categories (Food, Transport, Lodging, Activities, Shopping, Other) and a group summary showing total spent per person and per category as a pie chart. 
Add a chronological expense history list with filters. Use a clean modern theme with green for positive balances and red for debts.

Build a comprehensive group expense management platform with user authentication, multiple groups with invite links, expense logging with receipt photo URLs and categories, flexible split options (equal, percentage, exact amounts, shares), real-time balance calculations with debt simplification, optimal settlement path algorithm, multi-currency support with exchange rate conversion, recurring expense support for rent/utilities, spending analytics with per-person and per-category breakdowns, expense timeline with filters, CSV export of group history, and a settlement history log. Use a premium fintech-inspired design with clean typography.


Use Clerk for authentication and supabase for database. 
