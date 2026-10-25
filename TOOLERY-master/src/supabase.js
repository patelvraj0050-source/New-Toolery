import { createClient } from '@supabase/supabase-js';

// Environment variables or localStorage overrides
const getStoredConfig = () => {
  try {
    const localUrl = localStorage.getItem('toolery_supabase_url');
    const localKey = localStorage.getItem('toolery_supabase_key');
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    return {
      url: localUrl || envUrl || '',
      key: localKey || envKey || ''
    };
  } catch {
    return { url: '', key: '' };
  }
};

let clientInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getStoredConfig();

  if (!url || !key) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Supabase initialization warning:', err);
      return null;
    }
  }

  return clientInstance;
};

export const isSupabaseConfigured = () => {
  const { url, key } = getStoredConfig();
  return Boolean(url && key && url.startsWith('http'));
};

export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('toolery_supabase_url', url.trim());
  else localStorage.removeItem('toolery_supabase_url');

  if (key) localStorage.setItem('toolery_supabase_key', key.trim());
  else localStorage.removeItem('toolery_supabase_key');

  clientInstance = null; // Reset instance to recreate with new credentials
};

export const getActiveSupabaseConfig = () => {
  return getStoredConfig();
};

export const testSupabaseConnection = async (url, key) => {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('toolery_history').select('count', { count: 'exact', head: true });
    // Even if table doesn't exist yet, a response means URL & API key are valid
    if (error && error.code === 'PGRST116') {
      return { success: true, message: 'Connected to Supabase! (Database ready)' };
    }
    if (error && error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
      return { success: true, message: 'Connected to Supabase! Run schema.sql to initialize tables.' };
    }
    if (error && error.status === 401) {
      return { success: false, message: 'Invalid Supabase Anon Key.' };
    }
    return { success: true, message: 'Connected successfully to Supabase!' };
  } catch (err) {
    return { success: false, message: err.message || 'Could not connect to Supabase.' };
  }
};

export const signInWithOAuthProvider = async (provider = 'google') => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
  return { success: false, message: 'Supabase client not connected.' };
};

// ==========================================
// HIGH LEVEL SUPABASE DATA HELPERS (WITH LOCAL FALLBACK)
// ==========================================

export const syncHistoryRecord = async (action, status = 'Completed', details = {}) => {
  const entry = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    action,
    status,
    details: typeof details === 'object' ? details : { note: details },
    created_at: new Date().toISOString(),
    timestamp: Date.now()
  };

  // Local Storage Mirror
  try {
    const local = JSON.parse(localStorage.getItem('toolery_history') || '[]');
    local.unshift(entry);
    localStorage.setItem('toolery_history', JSON.stringify(local.slice(0, 50)));
  } catch (e) {
    console.error('Local history error', e);
  }

  // Supabase Sync
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('toolery_history').insert({
        action,
        status,
        details: entry.details,
        user_id: user ? user.id : null,
      });
    } catch (err) {
      console.warn('Supabase history sync error:', err);
    }
  }

  return entry;
};

export const syncFileRecord = async (fileData) => {
  const fileRecord = {
    id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: fileData.name,
    size: fileData.size || 0,
    type: fileData.type || 'file',
    action: fileData.action || 'Processed',
    status: fileData.status || 'Completed',
    created_at: new Date().toISOString(),
    timestamp: Date.now()
  };

  try {
    const local = JSON.parse(localStorage.getItem('toolery_files') || '[]');
    local.unshift(fileRecord);
    localStorage.setItem('toolery_files', JSON.stringify(local.slice(0, 50)));
  } catch (e) {
    console.error('Local file record error', e);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('toolery_files').insert({
        name: fileRecord.name,
        size: fileRecord.size,
        type: fileRecord.type,
        action: fileRecord.action,
        status: fileRecord.status,
        user_id: user ? user.id : null,
      });
    } catch (err) {
      console.warn('Supabase file record sync error:', err);
    }
  }

  return fileRecord;
};

export const getHistoryRecords = async () => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('toolery_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      // Fallback
    }
  }

  try {
    return JSON.parse(localStorage.getItem('toolery_history') || '[]');
  } catch {
    return [];
  }
};

export const getFilesRecords = async () => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('toolery_files')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      // Fallback
    }
  }

  try {
    return JSON.parse(localStorage.getItem('toolery_files') || '[]');
  } catch {
    return [];
  }
};
