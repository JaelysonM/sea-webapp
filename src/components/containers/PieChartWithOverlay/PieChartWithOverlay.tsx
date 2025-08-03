import React from 'react';

import { PieChart, PieChartSliceData } from 'components/elements';
import useImageLoader from 'components/hooks/useImageLoader';

interface Props {
  imageSrc: string;
  imageAlt?: string;
  chartSlices: PieChartSliceData[];
  chartSize?: string | number;
  chartPosition?: { top: string; left: string };
  className?: string;
  onSliceDetailClick: (slice: PieChartSliceData) => void;
}

const PieChartWithOverlay: React.FC<Props> = ({
  imageSrc,
  imageAlt = 'Prato',
  chartSlices,
  chartSize = 120,
  chartPosition = { top: '50%', left: '50%' },
  className = '',
  onSliceDetailClick,
}) => {
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    maxWidth: 500,
  };

  const chartOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: chartPosition.top,
    left: chartPosition.left,
    transform: 'translate(-50%, -50%)',
  };

  const { status: imageStatus, imageUrl: cachedImageUrl } = useImageLoader(imageSrc);

  return (
    <div style={wrapperStyle} className={className}>
      {imageStatus === 'loading' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <span>Carregando imagem...</span>
        </div>
      )}
      <img src={cachedImageUrl || imageSrc} alt={imageAlt} style={imageStyle} />
      <div style={chartOverlayStyle}>
        <PieChart
          slices={chartSlices}
          size={Number(chartSize)}
          onSliceDetailClick={onSliceDetailClick}
        />
      </div>
    </div>
  );
};

export default PieChartWithOverlay;
