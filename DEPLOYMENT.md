# VidForge AI - Deployment Guide

## 🚀 Quick Deployment Options

### 1. GitHub Pages (Recommended - Free)

**Step-by-step:**
```bash
# Create a new repository on GitHub
# Clone it locally
git clone https://github.com/yourusername/vidforge-ai.git
cd vidforge-ai

# Add the files
cp path/to/index.html .
cp path/to/README.md .
cp path/to/config.js . # Optional

# Commit and push
git add .
git commit -m "Initial commit - VidForge AI"
git push origin main

# Enable GitHub Pages
# Go to: Repository Settings > Pages
# Source: Deploy from branch 'main'
# Directory: / (root)
```

Your site will be live at: `https://yourusername.github.io/vidforge-ai/`

---

### 2. Netlify (Easiest - Free)

**Method A: Drag & Drop**
1. Go to https://app.netlify.com/drop
2. Drag the `index.html` file
3. Done! Your site is live

**Method B: GitHub Integration**
1. Push code to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Select your repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or /)
6. Click "Deploy site"

**Custom Domain (Optional):**
```
Netlify Dashboard > Domain Settings > Add custom domain
```

---

### 3. Vercel (Professional - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your project
cd vidforge-ai

# Deploy
vercel --prod

# Follow the prompts
# Your site will be live at: https://your-project.vercel.app
```

**Or use GitHub Integration:**
1. Push to GitHub
2. Import to Vercel
3. Auto-deploys on every commit

---

### 4. Firebase Hosting (Google - Free)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Select:
# - Public directory: .
# - Single-page app: No
# - GitHub auto-deploys: Optional

# Deploy
firebase deploy --only hosting
```

---

### 5. Cloudflare Pages (CDN - Free)

1. Log in to Cloudflare Dashboard
2. Go to Pages
3. Create a project
4. Connect to GitHub or upload files
5. Deploy

**Benefits:**
- Global CDN
- Automatic SSL
- DDoS protection
- Analytics included

---

### 6. Render (Modern - Free)

```bash
# Create render.yaml in your project:
services:
  - type: web
    name: vidforge-ai
    env: static
    buildCommand: ""
    staticPublishPath: .
```

Then:
1. Push to GitHub
2. Connect Render to GitHub
3. Deploy

---

### 7. AWS S3 + CloudFront (Scalable)

```bash
# Create S3 bucket
aws s3 mb s3://vidforge-ai

# Upload files
aws s3 sync . s3://vidforge-ai --exclude ".git/*"

# Enable static website hosting
aws s3 website s3://vidforge-ai --index-document index.html

# Create CloudFront distribution (optional, for HTTPS)
aws cloudfront create-distribution \
  --origin-domain-name vidforge-ai.s3.amazonaws.com
```

---

### 8. Heroku (Traditional - Free Tier Available)

```bash
# Create Procfile (for static sites with PHP trick)
echo "web: vendor/bin/heroku-php-apache2" > Procfile

# Create composer.json
echo '{}' > composer.json

# Deploy
heroku create vidforge-ai
git push heroku main
heroku open
```

---

## 🔧 Configuration for Production

### 1. Add API Keys (Optional)

Edit `config.js` or add directly to `index.html`:

```javascript
// In your HTML or config.js
const HUGGINGFACE_TOKEN = 'hf_xxxxxxxxxxxxx';

// Update fetch calls:
headers: {
    'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
    'Content-Type': 'application/json'
}
```

### 2. Environment Variables

For platforms that support them:

**Netlify:**
```bash
# netlify.toml
[build.environment]
  HUGGINGFACE_API = "your_key_here"
```

**Vercel:**
```bash
# Add in Vercel Dashboard > Settings > Environment Variables
```

**GitHub Pages:**
Use GitHub Secrets and Actions

---

## 🎯 SEO & Performance Optimization

### Add Meta Tags

Add to `<head>` section:

```html
<!-- SEO -->
<meta name="description" content="Free AI Video Generator - Create stunning videos with AI">
<meta name="keywords" content="AI video, video generator, free AI, video creation">
<meta name="author" content="VidForge AI">

<!-- Open Graph -->
<meta property="og:title" content="VidForge AI - Free Video Generator">
<meta property="og:description" content="Create stunning AI-generated videos for free">
<meta property="og:image" content="https://yoursite.com/preview.jpg">
<meta property="og:url" content="https://yoursite.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="VidForge AI">
<meta name="twitter:description" content="Free AI Video Generation">
<meta name="twitter:image" content="https://yoursite.com/preview.jpg">

<!-- Mobile -->
<meta name="theme-color" content="#0a0e17">
<meta name="apple-mobile-web-app-capable" content="yes">
```

### Add Service Worker

Create `sw.js`:

```javascript
const CACHE_NAME = 'vidforge-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/config.js',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Performance Tips

1. **Minify HTML/CSS/JS** (if needed):
```bash
npm install -g html-minifier clean-css-cli uglify-js

html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

2. **Enable Compression**:
Most hosting platforms do this automatically

3. **Use CDN**:
Already implemented with Google Fonts

---

## 🔒 Security Best Practices

### 1. Content Security Policy

Add to HTML `<head>`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: blob:;
               connect-src 'self' https://api-inference.huggingface.co https://api.replicate.com;">
```

### 2. HTTPS

All recommended platforms provide free SSL certificates automatically.

### 3. Rate Limiting

For API keys, implement rate limiting:

```javascript
const rateLimit = {
    calls: 0,
    resetTime: Date.now() + 60000,
    
    async check() {
        if (Date.now() > this.resetTime) {
            this.calls = 0;
            this.resetTime = Date.now() + 60000;
        }
        
        if (this.calls >= 10) {
            throw new Error('Rate limit exceeded. Please wait.');
        }
        
        this.calls++;
    }
};
```

---

## 📊 Analytics (Optional)

### Google Analytics

Add before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible (Privacy-friendly alternative)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🧪 Testing

### Local Testing

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Browser Testing

Test on:
- Chrome (Desktop & Mobile)
- Firefox
- Safari
- Edge

### Performance Testing

- Google PageSpeed Insights
- GTmetrix
- WebPageTest

---

## 🔄 Continuous Deployment

### GitHub Actions (Free)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 📱 PWA (Progressive Web App) - Optional

Create `manifest.json`:

```json
{
  "name": "VidForge AI",
  "short_name": "VidForge",
  "description": "AI Video Generation Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0e17",
  "theme_color": "#00ffcc",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to HTML:
```html
<link rel="manifest" href="/manifest.json">
```

---

## 🎉 You're Ready!

Choose your deployment method and go live in minutes. All platforms listed offer free tiers perfect for this project.

**Recommended for Beginners:** GitHub Pages or Netlify  
**Recommended for Professionals:** Vercel or Cloudflare Pages  
**Recommended for Scale:** AWS S3 + CloudFront

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Test with fallback mode
4. Check platform-specific documentation

Happy deploying! 🚀
