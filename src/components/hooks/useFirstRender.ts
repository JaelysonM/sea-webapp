import { useRef } from 'react';

const useFirstRender = () => {
  const firstRender = useRef<boolean>();

  if (firstRender.current === undefined) {
    firstRender.current = true;
    return true;
  }

  return false;
};

export default useFirstRender;
