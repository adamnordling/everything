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

            // 1. Inline the critical compiled CSS directly into <style> for zero network render delay
            for (const [fileName, asset] of Object.entries(ctx.bundle)) {
                if (fileName.endsWith('.css') && asset.type === 'asset') {
                    const cssContent = typeof asset.source === 'string' ? asset.source : asset.source.toString();
                    inlinedHtml = inlinedHtml.replace(
                        new RegExp(`<link[^>]*href="[^"]*${fileName}"[^>]*>`, 'i'),
                        `<style>${cssContent}</style>`
                    );
                    inlinedHtml = inlinedHtml.replace(
                        /<link rel="stylesheet"[^>]*crossorigin[^>]*>/i,
                        `<style>${cssContent}</style>`
                    );
                }
            }

            // 2. Minify document whitespace, comments, and inline CSS
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
        target: 'es2022',
        rollupOptions: {
            output: {
                // Splits tools into modular chunks (e.g. tool-network.js, tool-crypto.js)
                manualChunks(id) {
                    if (id.includes('src/tools/network/')) return 'tool-network';
                    if (id.includes('src/tools/crypto/')) return 'tool-crypto';
                    if (id.includes('src/tools/media/')) return 'tool-media';
                    if (id.includes('src/tools/time/')) return 'tool-time';
                }
            }
        }
    }
});