import type { GeneratedFile, ScaffolderState } from '../types';

export function generateBackendFiles(state: ScaffolderState): GeneratedFile[] {
    const isBackend = state.archetype === 'backend-api' || state.archetype === 'fullstack-ssr';
    const isHono = state.framework === 'hono';
    const isFastify = state.framework === 'fastify';
    const isExpress = state.framework === 'express';
    const hasDb = state.database !== 'none';

    // GUARD: Never generate backend server files for pure client-side web SPAs, extensions or CLI tools
    if (!isBackend && !isHono && !isFastify && !isExpress && !hasDb) {
        return [];
    }

    const files: GeneratedFile[] = [];
    const hasTs = state.languages.includes('typescript');

    if (isHono) {
        files.push({
            path: `src/server.${hasTs ? 'ts' : 'js'}`,
            description: 'Hono lightweight microservice route handler',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `import { Hono } from 'hono';

const app = new Hono();

app.get('/health', (c) => c.json({ status: 'healthy', timestamp: Date.now() }));
app.get('/api/v1/ping', (c) => c.json({ message: 'pong', service: '${state.projectName}' }));

export default app;`
        });
    } else if (isFastify) {
        files.push({
            path: `src/server.${hasTs ? 'ts' : 'js'}`,
            description: 'Fastify high-throughput JSON server definition',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({ status: 'healthy', uptime: process.uptime() }));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();`
        });
    } else if (isExpress) {
        files.push({
            path: `src/server.${hasTs ? 'ts' : 'js'}`,
            description: 'Express REST API server with health endpoints',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `import express${hasTs ? ', { Request, Response }' : ''} from 'express';

const app = express();
app.use(express.json());

app.get('/health', (${hasTs ? 'req: Request, res: Response' : 'req, res'}) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(3000, () => {
  console.log('[${state.projectName}] API running on port 3000');
});`
        });
    }

    if (state.database === 'drizzle') {
        files.push({
            path: `src/db/schema.${hasTs ? 'ts' : 'js'}`,
            description: 'Drizzle ORM schema specification',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});`
        });
    }

    return files;
}
