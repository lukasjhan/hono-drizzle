import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users } from './schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

const app = new Hono();

app.get('/', (c) => {
  const results = db.select().from(users).all();
  return c.json({ results });
});

app.post('/', async (c) => {
  const body = await c.req.json<{ id: number; name: string; age: number }>();
  const { id, name, age } = body;
  const result = await db.insert(users).values({ id, name, age }).execute();
  return c.json({ id, name, age });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
