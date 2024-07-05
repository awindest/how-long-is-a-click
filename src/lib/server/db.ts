import { dev } from '$app/environment';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const libsql_client = createClient({
	url: dev ? 'file:./db.sqlite' : `${TURSO_DATABASE_URL}`,
	authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(libsql_client, { schema });
