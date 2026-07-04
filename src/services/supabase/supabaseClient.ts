/* eslint-disable @typescript-eslint/no-this-alias */
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mock Database State for fallback mode
const MOCK_STORAGE_KEY = 'locallens_mock_db';

interface DemoUser {
  id: string;
  username: string;
  password?: string;
  email?: string;
  created_at: string;
}

interface MockRow {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface MockDB {
  demo_users: DemoUser[];
  travel_preferences: MockRow[];
  saved_destinations: MockRow[];
  trip_plans: MockRow[];
  stories: MockRow[];
  favorites: MockRow[];
  search_history: MockRow[];
  [table: string]: MockRow[] | DemoUser[];
}

/**
 * Retrieves the local mock database state from localStorage.
 * Initializes it with default demo user data if none exists.
 * 
 * @returns {MockDB} The parsed mock database object.
 */
const getMockDB = (): MockDB => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) {
    const initialDb: MockDB = {
      demo_users: [
        { id: 'usr-admin-123', username: 'admin', password: 'admin123', created_at: new Date().toISOString() }
      ],
      travel_preferences: [],
      saved_destinations: [],
      trip_plans: [],
      stories: [],
      favorites: [],
      search_history: []
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  return JSON.parse(data) as MockDB;
};

/**
 * Saves the current state of the mock database back to localStorage.
 * 
 * @param {MockDB} db - The mock database object to persist.
 * @returns {void}
 */
const saveMockDB = (db: MockDB): void => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
};

interface Filter {
  column: string;
  value: unknown;
}

/**
 * A builder class designed to simulate Supabase query building.
 * Supports chainable filtering and basic operations such as select, eq, insert, upsert, delete.
 * 
 * @class MockQueryBuilder
 */
class MockQueryBuilder {
  private table: string;
  private filters: Filter[] = [];
  private client: MockSupabaseClient;

  /**
   * Constructs a new MockQueryBuilder instance.
   * 
   * @param {string} table - The table name.
   * @param {MockSupabaseClient} client - The reference to the parent client.
   */
  constructor(table: string, client: MockSupabaseClient) {
    this.table = table;
    this.client = client;
  }

  /**
   * Simulates selecting columns. Currently a no-op that supports builder chaining.
   * 
   * @param {string} [_columns='*'] - Columns to select.
   * @returns {this} The query builder instance.
   */
  select(_columns = '*'): this {
    // Return builder to support chaining
    return this;
  }

  /**
   * Filters results by matching key-value pairs.
   * 
   * @param {string} column - Name of the column.
   * @param {unknown} value - Value to check for equality.
   * @returns {this} The query builder instance.
   */
  eq(column: string, value: unknown): this {
    this.filters.push({ column, value });
    return this;
  }

  /**
   * Inserts records into the simulated database.
   * 
   * @param {Record<string, unknown> | Record<string, unknown>[]} values - The records to insert.
   * @returns {object} An object containing select and then methods for asynchronous execution.
   */
  insert(values: Record<string, unknown> | Record<string, unknown>[]) {
    const builder = this;
    return {
      async select() {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        
        const toInsert = Array.isArray(values) ? values : [values];
        const inserted = toInsert.map((item) => ({
          id: (item.id as string) || `row-${Math.random().toString(36).substring(2, 11)}`,
          user_id: builder.client.getCurrentUserId() || 'usr-admin-123',
          created_at: new Date().toISOString(),
          ...item
        }));

        const tableList = db[builder.table] as MockRow[];
        tableList.push(...inserted);
        saveMockDB(db);
        return { data: inserted, error: null };
      },
      async then(resolve: (result: { data: MockRow[]; error: Error | null }) => void) {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        const toInsert = Array.isArray(values) ? values : [values];
        const inserted = toInsert.map((item) => ({
          id: (item.id as string) || `row-${Math.random().toString(36).substring(2, 11)}`,
          user_id: builder.client.getCurrentUserId() || 'usr-admin-123',
          created_at: new Date().toISOString(),
          ...item
        }));
        const tableList = db[builder.table] as MockRow[];
        tableList.push(...inserted);
        saveMockDB(db);
        resolve({ data: inserted, error: null });
      }
    };
  }

  /**
   * Upserts records (inserts new or updates existing) based on ID/user filters.
   * 
   * @param {Record<string, unknown> | Record<string, unknown>[]} values - The records to upsert.
   * @returns {object} An object containing select and then methods for asynchronous execution.
   */
  upsert(values: Record<string, unknown> | Record<string, unknown>[]) {
    const builder = this;
    return {
      async select() {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        const toUpsert = Array.isArray(values) ? values : [values];
        const results: MockRow[] = [];
        
        toUpsert.forEach((item) => {
          const userId = builder.client.getCurrentUserId() || 'usr-admin-123';
          const tableList = db[builder.table] as MockRow[];
          const index = tableList.findIndex((r) => 
            (r.user_id === userId && r.id === item.id) || 
            (builder.table === 'travel_preferences' && r.user_id === userId)
          );
          
          const updatedItem: MockRow = {
            id: (item.id as string) || (index >= 0 ? tableList[index].id : `row-${Math.random().toString(36).substring(2, 11)}`),
            user_id: userId,
            updated_at: new Date().toISOString(),
            ...item
          };
          
          if (index >= 0) {
            tableList[index] = updatedItem;
          } else {
            tableList.push(updatedItem);
          }
          results.push(updatedItem);
        });
        
        saveMockDB(db);
        return { data: results, error: null };
      },
      async then(resolve: (result: { data: null; error: Error | null }) => void) {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        const toUpsert = Array.isArray(values) ? values : [values];
        const tableList = db[builder.table] as MockRow[];
        
        toUpsert.forEach((item) => {
          const userId = builder.client.getCurrentUserId() || 'usr-admin-123';
          const index = tableList.findIndex((r) => 
            (r.user_id === userId && r.id === item.id) || 
            (builder.table === 'travel_preferences' && r.user_id === userId)
          );
          const updatedItem: MockRow = {
            id: (item.id as string) || (index >= 0 ? tableList[index].id : `row-${Math.random().toString(36).substring(2, 11)}`),
            user_id: userId,
            updated_at: new Date().toISOString(),
            ...item
          };
          if (index >= 0) {
            tableList[index] = updatedItem;
          } else {
            tableList.push(updatedItem);
          }
        });
        saveMockDB(db);
        resolve({ data: null, error: null });
      }
    };
  }

  /**
   * Deletes records matching subsequent eq filters.
   * 
   * @returns {object} An object containing the eq filter function.
   */
  delete() {
    const builder = this;
    return {
      eq(column: string, value: unknown) {
        return {
          async then(resolve: (result: { error: Error | null }) => void) {
            const db = getMockDB();
            if (db[builder.table]) {
              const tableList = db[builder.table] as MockRow[];
              db[builder.table] = tableList.filter((r) => r[column] !== value);
              saveMockDB(db);
            }
            resolve({ error: null });
          }
        };
      }
    };
  }

  /**
   * Fetches a single row that matches current filters.
   * 
   * @returns {Promise<{ data: MockRow | null; error: Error | null }>} A promise resolving to a single record or an error.
   */
  async single(): Promise<{ data: MockRow | null; error: Error | null }> {
    const db = getMockDB();
    let rows = (db[this.table] || []) as MockRow[];

    // Apply filters
    this.filters.forEach(f => {
      rows = rows.filter((r) => r[f.column] === f.value);
    });

    if (rows.length > 0) {
      return { data: rows[0], error: null };
    }
    return { data: null, error: new Error('Row not found') };
  }

  /**
   * Triggers the async execution of the built query when chained with .then().
   * Simulates standard Row Level Security (RLS) matching the current user's data.
   * 
   * @param {(result: { data: MockRow[] | DemoUser[]; error: Error | null }) => void} resolve - Resolve callback.
   * @returns {Promise<void>}
   */
  async then(resolve: (result: { data: MockRow[] | DemoUser[]; error: Error | null }) => void): Promise<void> {
    const db = getMockDB();
    let rows = (db[this.table] || []) as MockRow[];

    // Apply simple RLS simulation
    if (this.client.getCurrentUserId() && this.table !== 'demo_users') {
      rows = rows.filter((r) => r.user_id === this.client.getCurrentUserId() || r.user_id === undefined);
    }

    // Apply filters
    this.filters.forEach(f => {
      rows = rows.filter((r) => r[f.column] === f.value);
    });

    resolve({ data: rows, error: null });
  }
}

/**
 * A simulated Supabase Client.
 * Provides custom authentication and query endpoints to run the app in offline/sandbox mode.
 * 
 * @class MockSupabaseClient
 */
class MockSupabaseClient {
  private currentUserId: string | null = null;

  /**
   * Constructs the MockSupabaseClient and triggers the initial session sync.
   */
  constructor() {
    this.syncSession();
  }

  /**
   * Syncs internal session state with the browser's storage options (sessionStorage/localStorage).
   * 
   * @returns {void}
   */
  syncSession(): void {
    const session = sessionStorage.getItem('locallens_session');
    if (session) {
      const parsedSession = JSON.parse(session) as { user?: { id: string } };
      this.currentUserId = parsedSession.user?.id || null;
    } else {
      const user = sessionStorage.getItem('locallens_user');
      if (user) {
        const parsedUser = JSON.parse(user) as { id: string };
        this.currentUserId = parsedUser.id || null;
      } else {
        this.currentUserId = null;
      }
    }
  }

  /**
   * Retrieves the currently active user ID.
   * 
   * @returns {string | null} The active user ID or null if unauthenticated.
   */
  getCurrentUserId(): string | null {
    this.syncSession();
    return this.currentUserId;
  }

  /**
   * Mock Authentication services mimicking Supabase GoTrue authentication APIs.
   */
  auth = {
    /**
     * Gets the current user data from session or database.
     * 
     * @returns {Promise<{ data: { user: { id: string; email: string; user_metadata: { username: string } } | null }; error: Error | null }>} Active user or error.
     */
    getUser: async (): Promise<{ data: { user: { id: string; email: string; user_metadata: { username: string } } | null }; error: Error | null }> => {
      this.syncSession();
      if (this.currentUserId) {
        const db = getMockDB();
        const user = db.demo_users.find((u) => u.id === this.currentUserId);
        if (user) {
          return { data: { user: { id: user.id, email: `${user.username}@locallens.ai`, user_metadata: { username: user.username } } }, error: null };
        }
      }
      return { data: { user: null }, error: new Error('No active session') };
    },
    /**
     * Retrieves the current authentication session object.
     * 
     * @returns {Promise<{ data: { session: unknown }; error: null }>} The active session or null.
     */
    getSession: async (): Promise<{ data: { session: unknown }; error: null }> => {
      const session = sessionStorage.getItem('locallens_session');
      if (session) {
        return { data: { session: JSON.parse(session) }, error: null };
      }
      return { data: { session: null }, error: null };
    },
    /**
     * Authenticates user using username extracted from email and matched password.
     * 
     * @param {object} params - Authentication payload.
     * @param {string} params.email - The user email.
     * @param {string} params.password - The user password.
     * @returns {Promise<{ data: { user: { id: string; email: string; user_metadata: { username: string } } | null; session: unknown }; error: Error | null }>} Auth result.
     */
    signInWithPassword: async ({ email, password }: { email: string; password: string }): Promise<{ data: { user: { id: string; email: string; user_metadata: { username: string } } | null; session: unknown }; error: Error | null }> => {
      const db = getMockDB();
      const username = email.split('@')[0];
      const user = db.demo_users.find((u) => u.username === username && u.password === password);
      
      if (user) {
        const session = {
          access_token: 'mock-token-xyz-123',
          user: { id: user.id, email, user_metadata: { username: user.username } }
        };
        sessionStorage.setItem('locallens_session', JSON.stringify(session));
        sessionStorage.setItem('locallens_user', JSON.stringify({ id: user.id, username: user.username }));
        this.currentUserId = user.id;
        return { data: { user: session.user, session }, error: null };
      }
      return { data: { user: null, session: null }, error: new Error('Invalid credentials') };
    },
    /**
     * Signs out the active user, clearing local tokens/session storage.
     * 
     * @returns {Promise<{ error: null }>} An object containing error key.
     */
    signOut: async (): Promise<{ error: null }> => {
      sessionStorage.removeItem('locallens_session');
      sessionStorage.removeItem('locallens_user');
      this.currentUserId = null;
      return { error: null };
    }
  };

  /**
   * Starts a query builder on a mock database table.
   * 
   * @param {string} table - Table name.
   * @returns {MockQueryBuilder} The query builder instance.
   */
  from(table: string): MockQueryBuilder {
    return new MockQueryBuilder(table, this);
  }
}

/**
 * Boolean flag indicating if the application is running in mock database mode.
 * Evaluates to true if either `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are not set.
 * 
 * @type {boolean}
 */
export const isMockMode = !supabaseUrl || !supabaseAnonKey;

/**
 * The initialized Supabase Client.
 * Automatically switches to a MockSupabaseClient instance if environment keys are missing.
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = isMockMode 
  ? (new MockSupabaseClient() as unknown as ReturnType<typeof createClient>) 
  : createClient(supabaseUrl, supabaseAnonKey);
