import { useCallback, useState } from 'react';

const useBlockedTags = () => {
  const [blockedTags, setBlockedTags] = useState<number[]>();

  const updateBlockedTags = useCallback((types: number[]) => {
    setBlockedTags(types);
  }, []);

  const changeBlockedTagsFromInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: { id: number },
  ) => {
    if (e.target.checked) {
      setBlockedTags((types) => [...(types || []), type.id]);
      return;
    }
    setBlockedTags((types) => types?.filter((id) => id !== type.id));
  };

  return {
    blockedTags,
    changeBlockedTagsFromInput,
    updateBlockedTags,
  };
};

export default useBlockedTags;
