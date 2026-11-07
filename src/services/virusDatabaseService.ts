import { VirusDatabasePayload } from '../types';

export const VIRUS_DB_URL =
  'https://raw.githubusercontent.com/himayadz2026-sys/himaya-database/main/viruses.json';

export const STORAGE_KEY_DATA = 'himaya_virus_database_data';
export const STORAGE_KEY_VERSION = 'himaya_virus_database_version';

export interface FetchDatabaseResult {
  data: VirusDatabasePayload;
  isNewVersion: boolean;
  oldVersion: number | null;
  source: 'network' | 'cache';
  error?: string;
}

/**
 * Retrieves the cached virus database from local storage if present.
 * Strictly adheres to requirement #5: No hardcoded virus list.
 */
export const getLocalVirusDatabase = (): VirusDatabasePayload | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.version === 'number' &&
        typeof parsed.updated === 'string' &&
        Array.isArray(parsed.viruses)
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Himaya] Error reading cached virus database:', err);
  }
  return null;
};

/**
 * Fetches the virus database from GitHub every time the app opens.
 * Compares version number to detect updates and triggers the popup.
 * Persists data to local storage so it functions offline.
 */
export const fetchVirusDatabase = async (): Promise<FetchDatabaseResult> => {
  // Read previous stored version
  let prevVersion: number | null = null;
  try {
    const prevVersionStr = localStorage.getItem(STORAGE_KEY_VERSION);
    if (prevVersionStr !== null) {
      const parsedVer = parseInt(prevVersionStr, 10);
      if (!isNaN(parsedVer)) {
        prevVersion = parsedVer;
      }
    }
  } catch {
    // Ignore storage errors
  }

  try {
    // Add cache busting param to guarantee latest file from GitHub
    const urlWithTimestamp = `${VIRUS_DB_URL}?_t=${Date.now()}`;
    const response = await fetch(urlWithTimestamp, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    // Validate payload shape
    if (
      json &&
      typeof json.version === 'number' &&
      typeof json.updated === 'string' &&
      Array.isArray(json.viruses)
    ) {
      const data: VirusDatabasePayload = {
        version: json.version,
        updated: json.updated,
        viruses: json.viruses,
      };

      // Requirement #4: If version number increases, flag isNewVersion = true
      const isNewVersion = prevVersion !== null && data.version > prevVersion;

      // Requirement #3: Save the fetched database in local storage
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEY_VERSION, data.version.toString());
      } catch (storageErr) {
        console.warn('[Himaya] Could not save database to localStorage:', storageErr);
      }

      return {
        data,
        isNewVersion,
        oldVersion: prevVersion,
        source: 'network',
      };
    } else {
      throw new Error('Invalid JSON format received from GitHub database endpoint');
    }
  } catch (fetchErr: any) {
    console.warn('[Himaya] Network fetch failed, falling back to local storage:', fetchErr);

    // Requirement #3: If there is no internet, use the old saved one
    const cached = getLocalVirusDatabase();
    if (cached) {
      return {
        data: cached,
        isNewVersion: false,
        oldVersion: prevVersion,
        source: 'cache',
        error: fetchErr?.message || 'Network unavailable, loaded offline cache',
      };
    }

    // Default empty fallback only when completely offline on very first launch
    // Requirement #5: Do NOT hardcode the virus list inside the app!
    const emptyFallback: VirusDatabasePayload = {
      version: prevVersion ?? 1,
      updated: 'Pending Sync',
      viruses: [],
    };

    return {
      data: emptyFallback,
      isNewVersion: false,
      oldVersion: prevVersion,
      source: 'cache',
      error: 'Offline and no cached database found yet',
    };
  }
};
