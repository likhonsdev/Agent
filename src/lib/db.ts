import postgres from 'postgres';

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

// Create a PostgreSQL client
const createClient = () => {
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return postgres(connectionString, {
    ssl: true, // Neon DB requires SSL
    max: 10, // Maximum number of connections
    idle_timeout: 30, // Connection timeout in seconds
  });
};

// Singleton instance of the postgres client
let sql: ReturnType<typeof postgres> | null = null;

/**
 * Get a database client instance
 */
export function getClient() {
  if (!sql) {
    sql = createClient();
  }
  return sql;
}

/**
 * Execute a query with error handling
 */
export async function query<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const client = getClient();
    // The postgres client returns a Promise-like object but TypeScript needs help with the typing
    return await (client(queryText, ...params) as unknown as Promise<T[]>);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Save a generated component to the database
 */
export async function saveGeneratedComponent(data: {
  prompt: string;
  code: string;
  language: string;
  provider: string;
  explanation?: string;
}) {
  return await query(
    `INSERT INTO generated_components (prompt, code, language, provider, explanation, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING id`,
    [
      data.prompt,
      data.code,
      data.language,
      data.provider,
      data.explanation || '',
    ]
  );
}

/**
 * Get previously generated components
 */
export async function getRecentComponents(limit = 10) {
  return await query(
    `SELECT id, prompt, code, language, provider, explanation, created_at
     FROM generated_components
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
}

/**
 * Initialize database tables if they don't exist
 */
export async function initDatabase() {
  const tableExists = await query(`
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = 'generated_components'
    );
  `);

  // Create table if it doesn't exist
  if (!tableExists[0]?.exists) {
    await query(`
      CREATE TABLE generated_components (
        id SERIAL PRIMARY KEY,
        prompt TEXT NOT NULL,
        code TEXT NOT NULL,
        language TEXT NOT NULL,
        provider TEXT NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP NOT NULL
      );
    `);
    console.log('Created generated_components table');
  }
}
