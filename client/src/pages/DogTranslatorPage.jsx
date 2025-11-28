import React, { useEffect } from 'react';

const DogTranslatorPage = () => {
  useEffect(() => {
    // Redirect to the standalone HTML page
    window.location.href = '/dog.html';
  }, []);

  return null; // This component will redirect, so no need to render anything
};

export default DogTranslatorPage;
