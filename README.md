# Dura Plumbing — Website

Static HTML/CSS/JS site. No build step, no framework, no dependencies beyond Google Fonts.

## Structure
```
index.html        All page content and structure
css/style.css      Design tokens, layout, components
js/main.js         Mobile nav, scroll reveals, quote-form validation
favicon.svg        Site icon
```

## Run locally
Any static server works, for example:
```
python3 -m http.server 8000
```
Then open http://localhost:8000

## Deploy to Vercel
1. Push this folder to a GitHub repo (or drag-and-drop the folder into the Vercel dashboard).
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: **Other** (no build command, output directory is the project root).
4. Deploy.

## Design notes
- **Theme**: warm charcoal base with a single locked copper accent (evokes actual copper pipe rather than a generic neon/SaaS palette), plus a distinct brick-red used only for the emergency call-to-action.
- **Interactivity**: a scroll-progress bar at the very top of the page, subtle 3D tilt on the process/review cards as you move the cursor over them, magnetic pull on the primary call buttons, and the "How It Works" pipe diagram draws itself in as you scroll to it.

## Before going live
- **Quote form**: currently front-end only (validates and shows a success message, but does not send anywhere). Wire it up to a form service such as Formspree, or a serverless function, before launch.
- **Testimonials**: the three reviews are clearly-labelled placeholders. Swap in verified customer reviews.
- **Business facts**: no ABN, licence numbers, address, years in business, or specific service suburbs are included, since none were supplied. Add these once confirmed.
- **Images**: hero and section photography are sourced from Unsplash for the demo. Replace with real jobsite photos if available.
