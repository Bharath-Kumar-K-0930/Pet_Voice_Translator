import React, { useEffect } from 'react';

const CatTranslatorPage = () => {
  useEffect(() => {
    // Redirect to the standalone HTML page
    window.location.href = '/Pet_Voice_Translator-web-CAT-only/templates/index.html';
  }, []);

  return null; // This component will redirect, so no need to render anything
};

export default CatTranslatorPage;
