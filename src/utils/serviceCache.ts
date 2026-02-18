// src/utils/serviceCache.ts

interface Service {
  service: number;
  name: string;
  type: string | null;
  category: string;
  rate: string;
  min: number;
  max: number;
}

const CACHE_KEYS = {
  SERVICES: 'smm_services_cache',
  TIMESTAMP: 'smm_services_timestamp'
};

const CACHE_EXPIRY = 23 * 60 * 60 * 1000; // 23 hours
const WORKER_URL = 'https://smm-services-cache.sitewasd2026.workers.dev';

// Simple in-memory cache
let memoryServices: Service[] | null = null;
let memoryTimestamp: number | null = null;
let pendingPromise: Promise<Service[]> | null = null;

// Check if cache is valid
const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  return (Date.now() - timestamp) < CACHE_EXPIRY;
};

// Fetch from worker - SIMPLIFIED
const fetchFromWorker = async (): Promise<Service[]> => {
  console.log('🌐 Fetching services from worker...');
  
  try {
    const response = await fetch(`${WORKER_URL}/api/services`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Handle both array and object formats
    let services: Service[] = [];
    
    if (Array.isArray(data)) {
      services = data;
      console.log(`✅ Received array with ${services.length} services`);
    } else if (data && typeof data === 'object' && 'services' in data && Array.isArray(data.services)) {
      services = data.services;
      console.log(`✅ Received object with services array, length: ${services.length}`);
    } else {
      console.error('❌ Unexpected format:', data);
      throw new Error('Invalid API response format');
    }
    
    // Save to localStorage
    try {
      localStorage.setItem(CACHE_KEYS.SERVICES, JSON.stringify(services));
      localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
      console.log('💾 Saved to localStorage');
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    // Update memory cache
    memoryServices = services;
    memoryTimestamp = Date.now();

    return services;

  } catch (error) {
    console.error('❌ Error fetching from worker:', error);
    
    // Try localStorage as fallback
    const fallback = localStorage.getItem(CACHE_KEYS.SERVICES);
    if (fallback) {
      console.log('📦 Using localStorage fallback');
      return JSON.parse(fallback) as Service[];
    }
    
    throw error;
  }
};

// Main function to get services
export const getCachedServices = async (): Promise<Service[]> => {
  console.log('🔍 Getting cached services...');
  
  // 1. Check memory cache
  if (memoryServices && isCacheValid(memoryTimestamp)) {
    console.log('✅ Returning from memory cache:', memoryServices.length);
    return memoryServices;
  }

  // 2. Check localStorage
  try {
    const cached = localStorage.getItem(CACHE_KEYS.SERVICES);
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    
    if (cached && timestamp && isCacheValid(parseInt(timestamp))) {
      const services = JSON.parse(cached) as Service[];
      console.log('✅ Returning from localStorage:', services.length);
      
      // Update memory cache
      memoryServices = services;
      memoryTimestamp = parseInt(timestamp);
      
      return services;
    }
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
  }

  // 3. Prevent duplicate requests
  if (pendingPromise) {
    console.log('⏳ Using existing promise');
    return pendingPromise;
  }

  // 4. Fetch from worker
  console.log('🔄 Fetching from worker...');
  pendingPromise = fetchFromWorker();
  
  try {
    const services = await pendingPromise;
    return services;
  } finally {
    pendingPromise = null;
  }
};

// Preload function
export const preloadServices = (): void => {
  console.log('🔄 Preloading services...');
  setTimeout(() => {
    getCachedServices().catch(() => {});
  }, 1000);
};

// Clear cache
export const clearServicesCache = (): void => {
  console.log('🧹 Clearing cache');
  memoryServices = null;
  memoryTimestamp = null;
  pendingPromise = null;
  localStorage.removeItem(CACHE_KEYS.SERVICES);
  localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
};

// Debug function
export const debugServices = async (): Promise<void> => {
  console.log('🔧 DEBUG MODE');
  
  // Direct fetch
  try {
    const direct = await fetch(`${WORKER_URL}/api/services`).then(r => r.json());
    console.log('📡 Direct API:', Array.isArray(direct) ? `Array (${direct.length})` : 'Not array', direct);
  } catch (err) {
    console.error('Direct fetch failed:', err);
  }
  
  // Check localStorage
  const cached = localStorage.getItem(CACHE_KEYS.SERVICES);
  const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
  console.log('💾 localStorage:', cached ? `Has data (${JSON.parse(cached).length} items)` : 'Empty', 'Timestamp:', timestamp);
  
  // Get cached
  try {
    const services = await getCachedServices();
    console.log('📦 getCachedServices result:', Array.isArray(services) ? `Array (${services.length})` : 'Not array', services);
  } catch (err) {
    console.error('getCachedServices failed:', err);
  }
};
