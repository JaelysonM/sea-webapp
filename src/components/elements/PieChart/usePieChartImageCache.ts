import { useImageLoader } from 'components/hooks';

import type { PieChartSliceData } from './PieChart';

interface UsePieChartImageCacheProps {
  slices: PieChartSliceData[];
}

export const usePieChartImageCache = ({ slices }: UsePieChartImageCacheProps) => {
  const imageStatuses = slices.map((slice) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return slice.imageSrc
      ? useImageLoader(slice.imageSrc)
      : { status: 'loaded' as const, imageUrl: null };
  });

  const allImagesLoaded = imageStatuses.every(
    (status) => status.status === 'loaded' || status.status === 'error',
  );

  const cachedSlices = slices.map((slice, index) => {
    const imageState = imageStatuses[index];
    return {
      ...slice,
      imageSrc: imageState.imageUrl || slice.imageSrc,
    };
  });

  return {
    allImagesLoaded,
    imageStatuses,
    cachedSlices,
  };
};
