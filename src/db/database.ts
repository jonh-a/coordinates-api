/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Pool from 'pg-pool';

dotenv.config();

const db = new Pool({
  max: 10,
  port: 5432,
  user: process.env.PG_USER,
  database: 'coordinates_api',
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

db.on('error', (err) => { throw err; });

const getDatabase = (name: string) => {
  if (name === 'db') return db;
};

const query = async (database: string, query_string: string, params: any[]) => {
  const pool = getDatabase(database);
  if (!pool) return;

  try {
    const res = await pool.query(query_string, params);
    if (!res.rows || res.rows.length === 0) {
      if (
        query_string?.toLowerCase()?.includes('delete')
        || query_string?.toLowerCase()?.includes('insert')
        || query_string?.toLowerCase()?.includes('update')
      ) {
        return { success: true };
      }

      const error = 'No results found.';
      return {
        success: false,
        error: { query_string, params, error },
      };
    }

    return { success: true, data: res.rows };
  } catch (e: any) {
    return {
      success: false,
      error: {
        error: e?.message,
        detail: e?.detail,
        table: e?.table,
        constraint: e?.constraint,
      },
    };
  }
};

export { query };
