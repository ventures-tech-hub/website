# Loktara Ventures — immersive concept site

A responsive, single-page brand website built from the supplied visual reference.

## Run locally

From this folder:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

The site uses no build step or framework. Its depth, tilt, scroll-linked watermark
motion, navigation, and reveal effects are implemented with CSS and vanilla JavaScript.

## Deploy to Vercel

This is a static site and requires no build command.

### Vercel dashboard

1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set **Framework Preset** to **Other**.
4. Leave **Build Command** empty and set **Output Directory** to `.`.
5. Select **Deploy**.

### Vercel CLI

```powershell
npm install -g vercel
vercel
vercel --prod
```

Run those commands from this project folder. The first command may ask you to log in
and link or create a Vercel project.
