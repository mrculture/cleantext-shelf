# Publishing CleanText Shelf

## Recommended First Host

Cloudflare Pages is the recommended first host for UtilityShelf because it is free for static sites and gives a cleaner growth path for a network of micro utilities.

See `DEPLOYMENT-ROUTE.md` for the recommended GitHub-to-Cloudflare publishing route and fallback options.

## Cloudflare Pages Path

1. Create a GitHub repository for this folder.
2. Push `index.html`, `styles.css`, `app.js`, `README.md`, and `PUBLISHING.md`.
3. In Cloudflare Pages, choose "Connect to Git".
4. Select the repository.
5. Use these build settings:
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/`
6. Deploy.
7. Add a custom domain after the first deployment succeeds.

## GitHub Pages Path

1. Create a public GitHub repository.
2. Push this folder's files to the repository root.
3. Open repository Settings.
4. Go to Pages.
5. Set source to Deploy from a branch.
6. Choose the main branch and root folder.
7. Save and wait for the Pages URL.

## Suggested URL

Best long-term structure:

`https://utilityshelf.com/text-cleaner/`

Good standalone subdomain:

`https://cleantext.utilityshelf.com/`

## Pre-Publish QA

- Test on desktop width.
- Test on mobile width.
- Paste messy text and confirm hidden-character markers appear.
- Paste over 100,000 characters and confirm preview truncation appears.
- Paste over 250,000 characters and confirm the large-paste warning appears.
- Confirm tracking links keep useful parameters and remove tracking parameters.
- Confirm redaction only runs when selected.
- Confirm the privacy promise is accurate: no backend calls should be added without updating the copy.
- Confirm Terms, Privacy, and Contact footer links open correctly.
- Replace the placeholder contact email if a different inbox will be used.
