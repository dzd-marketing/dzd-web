// src/utils/serviceCache.ts

// Types and Interfaces
interface Service {
  service: number;
  name: string;
  type: string | null;
  category: string;
  rate: string;
  min: number;
  max: number;
}

interface CacheData {
  services: Service[] | null;
  timestamp: number | null;
  pendingPromise: Promise<Service[]> | null;
}

interface LocalStorageResult {
  valid: boolean;
  services?: Service[];
}

interface WorkerResponse {
  services: Service[];
  meta: {
    count: number;
    last_sync: string | null;
  };
}

// Cache keys
const CACHE_KEYS = {
  SERVICES: 'smm_services_cache',
  TIMESTAMP: 'smm_services_timestamp',
  ETAG: 'smm_services_etag'
} as const;

// Cache expiry (23 hours)
const CACHE_EXPIRY = 23 * 60 * 60 * 1000;

// In-memory cache
let memoryCache: CacheData = {
  services: null,
  timestamp: null,
  pendingPromise: null
};

// Worker URL - REPLACE WITH YOUR WORKER URL
const WORKER_URL = 'https://smm-services-cache.sitewasd2026.workers.dev';

// Check if cache is valid
const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  return (Date.now() - timestamp) < CACHE_EXPIRY;
};

// Check localStorage
const checkLocalStorage = (): LocalStorageResult => {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.SERVICES);
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);

    if (cached && timestamp && isCacheValid(parseInt(timestamp))) {
      return {
        valid: true,
        services: JSON.parse(cached) as Service[]
      };
    }
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
  }
  return { valid: false };
};

// Fetch from worker
const fetchFromWorker = async (): Promise<Service[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${WORKER_URL}/api/services`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: WorkerResponse = await response.json();
    
    // Save to localStorage
    localStorage.setItem(CACHE_KEYS.SERVICES, JSON.stringify(data.services));
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());

    memoryCache.services = data.services;
    memoryCache.timestamp = Date.now();

    return data.services;

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Fallback to localStorage even if expired
    const fallback = localStorage.getItem(CACHE_KEYS.SERVICES);
    if (fallback) {
      return JSON.parse(fallback) as Service[];
    }
    
    throw error;
  }
};

// Get services with caching
export const getCachedServices = async (): Promise<Service[]> => {
  // 1. Check memory cache
  if (memoryCache.services && isCacheValid(memoryCache.timestamp)) {
    return memoryCache.services;
  }

  // 2. Deduplicate requests
  if (memoryCache.pendingPromise) {
    return memoryCache.pendingPromise;
  }

  // 3. Check localStorage
  const localData = checkLocalStorage();
  if (localData.valid && localData.services) {
    memoryCache.services = localData.services;
    memoryCache.timestamp = Date.now();
    return localData.services;
  }

  // 4. Fetch from worker
  memoryCache.pendingPromise = fetchFromWorker();
  
  try {
    const services = await memoryCache.pendingPromise;
    return services;
  } finally {
    memoryCache.pendingPromise = null;
  }
};

// Preload cache
export const preloadServices = (): void => {
  setTimeout(() => {
    getCachedServices().catch(() => {
      // Silently fail for preload
    });
  }, 1000);
};

// Clear cache
export const clearServicesCache = (): void => {
  memoryCache = { services: null, timestamp: null, pendingPromise: null };
  localStorage.removeItem(CACHE_KEYS.SERVICES);
  localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
};
