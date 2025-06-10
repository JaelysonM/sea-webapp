import { useEffect, useState } from 'react';

const useVisible = (initialState: boolean) => {
  const [visible, setVisible] = useState(initialState);

  useEffect(() => {
    setVisible(initialState);
  }, [initialState]);

  return { visible, setVisible };
};

export default useVisible;
