import { defineConfig, type Plugin } from 'vite';
import { minify } from 'html-minifier-terser';

function inlineCssAndMinifyHtml(): Plugin {
    return {
        name: 'inline-css-and-minify-html',
        apply: 'build',
        enforce: 'post',
        async transformIndexHtml(html, ctx) {
            if (!ctx.bundle) return html;
            let inlinedHtml = html;

            for (const [fileName, asset] of Object.entries(ctx.bundle)) {
                if (fileName.endsWith('.css') && asset.type === 'asset') {
                    const cssContent = typeof asset.source === 'string' ? asset.source : asset.source.toString();
                    // Match ONLY the local bundled CSS asset chunk, never CDN links like Leaflet
                    const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const linkRegex = new RegExp(`<link[^>]*href=["'][^"']*${escaped}["'][^>]*>`, 'i');
                    inlinedHtml = inlinedHtml.replace(linkRegex, `<style>${cssContent}</style>`);
                }
            }

            return await minify(inlinedHtml, {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                minifyCSS: true
            });
        }
    };
}

export default defineConfig({
    base: './',
    root: './',
    publicDir: 'public',
    plugins: [inlineCssAndMinifyHtml()],
    worker: {
        format: 'es'
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2022'
    }
});