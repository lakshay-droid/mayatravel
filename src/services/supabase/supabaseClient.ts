/* eslint-disable @typescript-eslint/no-this-alias */
import { createClient } from '@supabase/supabase-js';


// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mock Database State for fallback mode
const MOCK_STORAGE_KEY = 'locallens_mock_db';

const getMockDB = () => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) {
    const initialDb = {
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
  return JSON.parse(data);
};

const saveMockDB = (db: any) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
};

// Chainable query builder for Mock Client
class MockQueryBuilder {
  private table: string;
  private filters: { column: string; value: any }[] = [];
  private client: MockSupabaseClient;

  constructor(table: string, client: MockSupabaseClient) {
    this.table = table;
    this.client = client;
  }

  select(_columns = '*') {
    // Return builder to support chaining
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value });
    return this;
  }

  insert(values: any | any[]) {
    const builder = this;
    return {
      async select() {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        
        const toInsert = Array.isArray(values) ? values : [values];
        const inserted = toInsert.map((item: any) => ({
          id: item.id || `row-${Math.random().toString(36).substr(2, 9)}`,
          user_id: builder.client.getCurrentUserId() || 'usr-admin-123',
          created_at: new Date().toISOString(),
          ...item
        }));

        db[builder.table].push(...inserted);
        saveMockDB(db);
        return { data: inserted, error: null };
      },
      async then(resolve: any) {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        const toInsert = Array.isArray(values) ? values : [values];
        const inserted = toInsert.map((item: any) => ({
          id: item.id || `row-${Math.random().toString(36).substr(2, 9)}`,
          user_id: builder.client.getCurrentUserId() || 'usr-admin-123',
          created_at: new Date().toISOString(),
          ...item
        }));
        db[builder.table].push(...inserted);
        saveMockDB(db);
        resolve({ data: inserted, error: null });
      }
    };
  }

  upsert(values: any) {
    const builder = this;
    return {
      async select() {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        const toUpsert = Array.isArray(values) ? values : [values];
        const results: any[] = [];
        
        toUpsert.forEach((item: any) => {
          const userId = builder.client.getCurrentUserId() || 'usr-admin-123';
          const index = db[builder.table].findIndex((r: any) => 
            (r.user_id === userId && r.id === item.id) || 
            (builder.table === 'travel_preferences' && r.user_id === userId)
          );
          
          const updatedItem = {
            id: item.id || (index >= 0 ? db[builder.table][index].id : `row-${Math.random().toString(36).substr(2, 9)}`),
            user_id: userId,
            updated_at: new Date().toISOString(),
            ...item
          };
          
          if (index >= 0) {
            db[builder.table][index] = updatedItem;
          } else {
            db[builder.table].push(updatedItem);
          }
          results.push(updatedItem);
        });
        
        saveMockDB(db);
        return { data: results, error: null };
      },
      async then(resolve: any) {
        const db = getMockDB();
        if (!db[builder.table]) db[builder.table] = [];
        const toUpsert = Array.isArray(values) ? values : [values];
        toUpsert.forEach((item: any) => {
          const userId = builder.client.getCurrentUserId() || 'usr-admin-123';
          const index = db[builder.table].findIndex((r: any) => 
            (r.user_id === userId && r.id === item.id) || 
            (builder.table === 'travel_preferences' && r.user_id === userId)
          );
          const updatedItem = {
            id: item.id || (index >= 0 ? db[builder.table][index].id : `row-${Math.random().toString(36).substr(2, 9)}`),
            user_id: userId,
            updated_at: new Date().toISOString(),
            ...item
          };
          if (index >= 0) {
            db[builder.table][index] = updatedItem;
          } else {
            db[builder.table].push(updatedItem);
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
      eq(column: string, value: any) {
        return {
          async then(resolve: any) {
            const db = getMockDB();
            if (db[builder.table]) {
              db[builder.table] = db[builder.table].filter((r: any) => r[column] !== value);
              saveMockDB(db);
            }
            resolve({ error: null });
          }
        };
      }
    };
  }

  async single() {
    const db = getMockDB();
    let rows = db[this.table] || [];

    // Apply filters
    this.filters.forEach(f => {
      rows = rows.filter((r: any) => r[f.column] === f.value);
    });

    if (rows.length > 0) {
      return { data: rows[0], error: null };
    }
    return { data: null, error: new Error('Row not found') };
  }

  async then(resolve: any) {
    const db = getMockDB();
    let rows = db[this.table] || [];

    // Apply simple RLS simulation
    if (this.client.getCurrentUserId() && this.table !== 'demo_users') {
      rows = rows.filter((r: any) => r.user_id === this.client.getCurrentUserId() || r.user_id === undefined);
    }

    // Apply filters
    this.filters.forEach(f => {
      rows = rows.filter((r: any) => r[f.column] === f.value);
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

  syncSession() {
    const session = sessionStorage.getItem('locallens_session');
    if (session) {
      this.currentUserId = JSON.parse(session).user?.id || null;
    } else {
      const user = sessionStorage.getItem('locallens_user');
      if (user) {
        this.currentUserId = JSON.parse(user).id || null;
      } else {
        this.currentUserId = null;
      }
    }
  }

  getCurrentUserId() {
    this.syncSession();
    return this.currentUserId;
  }

  auth = {
    getUser: async () => {
      this.syncSession();
      if (this.currentUserId) {
        const db = getMockDB();
        const user = db.demo_users.find((u: any) => u.id === this.currentUserId);
        if (user) {
          return { data: { user: { id: user.id, email: `${user.username}@locallens.ai`, user_metadata: { username: user.username } } }, error: null };
        }
      }
      return { data: { user: null }, error: new Error('No active session') };
    },
    getSession: async () => {
      const session = sessionStorage.getItem('locallens_session');
      if (session) {
        return { data: { session: JSON.parse(session) }, error: null };
      }
      return { data: { session: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const db = getMockDB();
      const username = email.split('@')[0];
      const user = db.demo_users.find((u: any) => u.username === username && u.password === password);
      
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
    signOut: async () => {
      sessionStorage.removeItem('locallens_session');
      sessionStorage.removeItem('locallens_user');
      this.currentUserId = null;
      return { error: null };
    }
  };

  from(table: string) {
    return new MockQueryBuilder(table, this);
  }
}

// Export the active client
export const isMockMode = !supabaseUrl || !supabaseAnonKey;
export const supabase = isMockMode 
  ? (new MockSupabaseClient() as any) 
  : createClient(supabaseUrl, supabaseAnonKey);
