import { useEffect, useState } from 'react';

type ImageStatus = 'loading' | 'loaded' | 'error';

const useImageLoader = (src: string): ImageStatus => {
  const [status, setStatus] = useState<ImageStatus>('loading');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      setStatus('loaded');
    };

    const handleError = () => {
      setStatus('error');
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return status;
};
export default useImageLoader;
