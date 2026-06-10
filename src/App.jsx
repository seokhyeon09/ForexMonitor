import React from 'react';
import { AssetProvider } from './context/AssetContext';
import { ExchangeRateProvider } from './context/ExchangeRateContext';
import AppContent from './AppContent';

function App() {
  return (
    <ExchangeRateProvider>
      <AssetProvider>
        <AppContent />
      </AssetProvider>
    </ExchangeRateProvider>
  );
}

export default App;
