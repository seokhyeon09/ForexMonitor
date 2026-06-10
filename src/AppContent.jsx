import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Controls from './components/Controls';
import AssetList from './components/AssetList';
import AssetForm from './components/AssetForm';
import { useExchangeRates } from './context/ExchangeRateContext';

const AppContent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { rates, error } = useExchangeRates();

  return (
    <>
      <header className="header">
        <div>
          <h1 style={{ marginBottom: '0.2rem' }}>🌐 외화 자산 모니터링</h1>
          <p className="text-secondary">실시간 환율을 반영한 내 자산 대시보드</p>
        </div>
        
        {rates && (
          <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', display: 'flex', gap: '1.5rem' }}>
            <div><span className="text-secondary">USD/KRW</span> <br/> <strong>{rates.USD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div>
            <div><span className="text-secondary">JPY/KRW</span> <br/> <strong>{rates.JPY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div>
            <div><span className="text-secondary">EUR/KRW</span> <br/> <strong>{rates.EUR.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div>
          </div>
        )}
      </header>

      {error && (
        <div className="glass-panel text-danger" style={{ marginBottom: '1.5rem', borderColor: 'var(--danger-color)' }}>
          환율 정보를 불러오는데 실패했습니다. 마지막 저장된 환율 또는 임시 환율이 적용됩니다. ({error})
        </div>
      )}

      <Dashboard />
      
      <main>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>자산 관리</h2>
        <Controls onOpenForm={() => setIsFormOpen(true)} />
        <AssetList />
      </main>

      {isFormOpen && <AssetForm onClose={() => setIsFormOpen(false)} />}
    </>
  );
};

export default AppContent;
