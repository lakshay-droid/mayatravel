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

const saveMockDB = (db: MockDB): void => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
};

interface Filter {
  column: string;
  value: unknown;
}

// Chainable query builder for Mock Client
class MockQueryBuilder {
  private table: string;
  private filters: Filter[] = [];
  private client: MockSupabaseClient;

  constructor(table: string, client: MockSupabaseClient) {
    this.table = table;
    this.client = client;
  }

  select(_columns = '*'): this {
    // Return builder to support chaining
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ column, value });
    return this;
  }

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

// Custom Mock Supabase Client API
class MockSupabaseClient {
  private currentUserId: string | null = null;

  constructor() {
    this.syncSession();
  }

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

  getCurrentUserId(): string | null {
    this.syncSession();
    return this.currentUserId;
  }

  auth = {
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
    getSession: async (): Promise<{ data: { session: unknown }; error: null }> => {
      const session = sessionStorage.getItem('locallens_session');
      if (session) {
        return { data: { session: JSON.parse(session) }, error: null };
      }
      return { data: { session: null }, error: null };
    },
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
    signOut: async (): Promise<{ error: null }> => {
      sessionStorage.removeItem('locallens_session');
      sessionStorage.removeItem('locallens_user');
      this.currentUserId = null;
      return { error: null };
    }
  };

  from(table: string): MockQueryBuilder {
    return new MockQueryBuilder(table, this);
  }
}

// Export the active client
export const isMockMode = !supabaseUrl || !supabaseAnonKey;
export const supabase = isMockMode 
  ? (new MockSupabaseClient() as unknown as ReturnType<typeof createClient>) 
  : createClient(supabaseUrl, supabaseAnonKey);
