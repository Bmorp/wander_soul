import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { siteUrl, sitemapXml, robotsTxt } from './scripts/sitemap.mjs'
import { allPaths, renderPage, fileFor } from './scripts/seo-pages.mjs'

// Once the live address is known (SITE_URL, or Vercel's production domain), the build
// makes the social-card links absolute (WhatsApp and Facebook ignore relative ones) and
// writes sitemap.xml and robots.txt next to the page.
//
// It also writes every page of the site as its own HTML file (scripts/seo-pages.mjs): its own
// title, description, link-preview picture, structured data and a plain-text copy of its
// words, for the readers that never run the page's scripts (WhatsApp and Facebook link
// previews, a search engine's first fetch, AI assistants). The app takes over in the browser
// as usual. Unknown addresses get 404.html.
function liveAddress() {
  const base = siteUrl()
  return {
    name: 'wandersoul-live-address',
    apply: 'build',
    // After Vite's own HTML step, so index.html is already in the bundle to copy.
    enforce: 'post',
    transformIndexHtml(html) {
      if (!base) return html
      return html
        .replace('content="/og-image.jpg"', `content="${base}/og-image.jpg"`)
        .replace(
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="${base}/og-image.jpg" />`,
        )
    },
    generateBundle(_, bundle) {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(base) })
      if (!base) {
        this.warn('No SITE_URL: skipping sitemap.xml and absolute social-card links.')
      } else {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(base) })
      }
      const shell = bundle['index.html']
      if (!shell || shell.type !== 'asset') {
        this.warn('SEO pages: index.html is not in the bundle yet, so the pages have no HTML of their own.')
        return
      }
      const html = String(shell.source)
      const warn = (m) => this.warn(m)
      for (const path of allPaths) {
        const out = renderPage(html, path, base, warn)
        if (path === '/') shell.source = out
        else this.emitFile({ type: 'asset', fileName: fileFor(path), source: out })
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: renderPage(html, '/404', base, warn) })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), liveAddress()],
})
