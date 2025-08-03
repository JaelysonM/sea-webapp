import { useCallback, useEffect, useRef } from 'react';

import { useNFC } from 'components/hooks';

interface UseNFCWithAutoRestartOptions {
  onScan?: (data: string) => void;
  onError?: (error: Error) => void;
  healthCheckInterval?: number;
  maxInactivityTime?: number;
  restartDelay?: number;
  initialDelay?: number;
}

interface UseNFCWithAutoRestartReturn {
  isReading: boolean;
  data: string | null;
  error: string | null;
  canUseNFC: boolean;
  clear: () => void;
}

const useNFCWithAutoRestart = (
  options: UseNFCWithAutoRestartOptions = {},
): UseNFCWithAutoRestartReturn => {
  const {
    healthCheckInterval = 10000,
    maxInactivityTime = 15000,
    restartDelay = 1000,
    initialDelay = 1000,
  } = options;

  const {
    isReading: nfcIsReading,
    data: nfcData,
    error: nfcError,
    canUseNFC,
    startReading: startNFC,
    stopReading: stopNFC,
    clear: clearNFC,
  } = useNFC();

  const lastActivityTimeRef = useRef(Date.now());
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const restartNFC = useCallback(async () => {
    if (!canUseNFC) return;

    try {
      await stopNFC();
      await new Promise((resolve) => setTimeout(resolve, restartDelay));
      await startNFC();
      lastActivityTimeRef.current = Date.now();
    } catch (err) {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      restartTimeoutRef.current = setTimeout(() => restartNFC(), 2000);
    }
  }, [canUseNFC, startNFC, stopNFC, restartDelay]);

  const initNFC = useCallback(async () => {
    if (!canUseNFC) return;

    try {
      await startNFC();
      lastActivityTimeRef.current = Date.now();
    } catch (err) {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      restartTimeoutRef.current = setTimeout(() => {
        if (canUseNFC && !nfcIsReading) {
          restartNFC();
        }
      }, 2000);
    }
  }, [canUseNFC, nfcIsReading, startNFC, restartNFC]);

  useEffect(() => {
    if (canUseNFC && !nfcIsReading) {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      initTimeoutRef.current = setTimeout(() => {
        if (canUseNFC && !nfcIsReading) {
          initNFC();
        }
      }, initialDelay);
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [canUseNFC, nfcIsReading, initNFC, initialDelay]);

  useEffect(() => {
    if (!canUseNFC || !nfcIsReading) {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
      return;
    }

    healthCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTimeRef.current;

      if (timeSinceLastActivity > maxInactivityTime) {
        restartNFC();
      }
    }, healthCheckInterval);

    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [canUseNFC, nfcIsReading, healthCheckInterval, maxInactivityTime, restartNFC]);

  useEffect(() => {
    if (nfcIsReading) {
      lastActivityTimeRef.current = Date.now();
    }
  }, [nfcIsReading]);

  useEffect(() => {
    if (nfcData) {
      lastActivityTimeRef.current = Date.now();
      if (options.onScan) {
        options.onScan(nfcData);
      }
      clearNFC();
    }
  }, [nfcData, clearNFC, options]);

  // Handle NFC errors
  useEffect(() => {
    if (nfcError && options.onError) {
      options.onError(new Error(nfcError));
    }
  }, [nfcError, options]);

  useEffect(() => {
    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  return {
    isReading: nfcIsReading,
    data: nfcData,
    error: nfcError,
    canUseNFC,
    clear: clearNFC,
  };
};

export default useNFCWithAutoRestart;
