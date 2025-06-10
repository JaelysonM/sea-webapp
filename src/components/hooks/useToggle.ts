import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type useToggleReturn = {
  value: boolean;
  toggle: () => void;
  setValue: Dispatch<SetStateAction<boolean>>;
};

const useToggle = (defaultValue?: boolean): useToggleReturn => {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => setValue((x) => !x), []);

  return { value, toggle, setValue };
};

export default useToggle;
