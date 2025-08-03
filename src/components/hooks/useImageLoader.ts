import { useEffect, useState } from 'react';

const DB_NAME = 'image-content-cache';
const STORE_NAME = 'image-store';
const DB_VERSION = 1;

interface CacheRecord {
  key: string;
  blob: Blob;
  timestamp: number;
}

const getDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject('Erro ao abrir o IndexedDB.');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

const idbCache = {
  get: async (key: string): Promise<CacheRecord | null> => {
    const db = await getDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  },
  set: async (key: string, blob: Blob): Promise<void> => {
    const db = await getDb();
    const record: CacheRecord = { key, blob, timestamp: Date.now() };
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Falha ao salvar no cache.');
    });
  },
};

// --- Hook `useImageLoader` com retorno de status e imageUrl ---

type ImageStatus = 'loading' | 'loaded' | 'error';

interface ImageState {
  status: ImageStatus;
  imageUrl: string | null;
}

const CACHE_EXPIRATION_MS = 86400000; // 24 horas

const useImageLoader = (src: string | null | undefined): ImageState => {
  const [imageState, setImageState] = useState<ImageState>({
    status: 'loading',
    imageUrl: null,
  });

  useEffect(() => {
    let objectUrl: string | undefined;

    const loadImage = async () => {
      if (!src) {
        setImageState({ status: 'error', imageUrl: null });
        return;
      }

      // Inicia como 'loading' sempre que o 'src' mudar
      setImageState({ status: 'loading', imageUrl: null });

      const cacheKey = src.split('?')[0];

      try {
        const cached = await idbCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION_MS) {
          objectUrl = URL.createObjectURL(cached.blob);
          setImageState({ status: 'loaded', imageUrl: objectUrl });
          return;
        }

        const response = await fetch(src);
        if (!response.ok) throw new Error('Falha na requisição da imagem');

        const blob = await response.blob();
        await idbCache.set(cacheKey, blob);

        objectUrl = URL.createObjectURL(blob);
        setImageState({ status: 'loaded', imageUrl: objectUrl });
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        setImageState({ status: 'error', imageUrl: null });
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return imageState;
};

export default useImageLoader;
