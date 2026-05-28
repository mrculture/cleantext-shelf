# Deployment Route

## Recommended Route

Use GitHub as the source repository and Cloudflare Pages as the public host.

This keeps the code versioned in GitHub while using Cloudflare's static hosting, CDN, HTTPS, custom domains, and future path into Workers if UtilityShelf grows.

## Current Local Status

The local machine does not currently have `git` or the GitHub CLI available in PowerShell, so the remote repository cannot be created or pushed automatically from this environment yet.

The site folder is ready to upload or commit:

- `index.html`
- `styles.css`
- `app.js`
- `terms.html`
- `privacy.html`
- `contact.html`
- `_headers`
- `.nojekyll`
- `robots.txt`
- `sitemap.xml`
- `README.md`
- `PUBLISHING.md`

## Option A: GitHub + Cloudflare Pages

1. Install Git for Windows if it is not already installed.
2. Create a new GitHub repository, for example `cleantext-shelf`.
3. Commit and push this folder to that repository.
4. In Cloudflare Pages, choose "Connect to Git".
5. Select the GitHub repository.
6. Use these build settings:
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/`
7. Deploy.
8. Add the custom domain or route.

## Option B: Direct Cloudflare Pages Upload

Use this if you want the fastest non-Git validation route.

1. Open Cloudflare Pages.
2. Choose "Upload assets".
3. Upload this folder's contents.
4. Deploy.
5. Add the custom domain later.

This is fast, but GitHub-connected deployment is better once you are iterating regularly.

## Option C: GitHub Pages

Use this if you want the simplest GitHub-only validation route.

1. Create a public GitHub repository.
2. Upload this folder's contents to the repository root.
3. Open repository Settings.
4. Go to Pages.
5. Set source to deploy from the main branch root.
6. Save and wait for the Pages URL.

## Domain Recommendation

For long-term UtilityShelf SEO, use:

`https://utilityshelf.com/text-cleaner/`

For a more app-like standalone launch, use:

`https://cleantext.utilityshelf.com/`

If using the subpath route, update `robots.txt`, `sitemap.xml`, and any canonical URLs before final publication.

