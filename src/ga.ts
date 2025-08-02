import ReactGA from 'react-ga4';

export const initGA = () => {
  const measurementId = import.meta.env.VITE_APP_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.error('VITE_APP_GA_MEASUREMENT_ID is not defined');
    return;
  }
  ReactGA.initialize(measurementId);
};

export const trackPage = (url: string) => {
  ReactGA.send({ hitType: 'pageview', page: url });
};
