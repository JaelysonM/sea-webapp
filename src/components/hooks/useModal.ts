import { useState } from 'react';

const useModal = () => {
  const [showModal, setShowDeleteModal] = useState(false);

  function onShow() {
    setShowDeleteModal(true);
  }

  function onHide() {
    setShowDeleteModal(false);
  }

  return {
    showModal,
    onShow,
    onHide,
  };
};

export default useModal;
