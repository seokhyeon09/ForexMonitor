import React from 'react';
import { useAssets } from '../context/AssetContext';
import { useExchangeRates } from '../context/ExchangeRateContext';

const Dashboard = () => {
  const { assets } = useAssets();
  const { rates, loading, error } = useExchangeRates();

  if (loading) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2 className="text-secondary">⏳ 환율 정보를 불러오는 중입니다...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (error || !rates) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2 className="text-danger">⚠️ 환율 데이터를 불러오지 못했습니다.</h2>
        <p>네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  let totalInvested = 0;
  let totalCurrentValue = 0;

  const currencyBreakdown = {};

  assets.forEach(asset => {
    const currentRate = asset.currency === 'KRW' ? 1 : (rates[asset.currency] || 0);
    const invested = asset.amount * asset.buyRate;
    const currentVal = asset.amount * currentRate;

    totalInvested += invested;
    totalCurrentValue += currentVal;

    currencyBreakdown[asset.currency] = (currencyBreakdown[asset.currency] || 0) + currentVal;
  });

  const totalPnL = totalCurrentValue - totalInvested;
  const returnRate = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const isPositive = totalPnL >= 0;

  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <h3 className="text-secondary">총 자산 가치 (KRW)</h3>
        <h1 style={{ fontSize: '2rem' }}>
          {Math.floor(totalCurrentValue).toLocaleString('ko-KR')} 원
        </h1>
        <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
          <span className="text-secondary">평가 손익: </span>
          <span className={isPositive ? 'text-success' : 'text-danger'}>
            {totalPnL > 0 ? '+' : ''}{Math.floor(totalPnL).toLocaleString('ko-KR')} 원 
            ({returnRate.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="glass-panel">
        <h3 className="text-secondary">통화별 자산 비중 (KRW 가치 기준)</h3>
        {totalCurrentValue === 0 ? (
          <p className="text-secondary" style={{ marginTop: '1rem' }}>등록된 자산이 없습니다.</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {Object.entries(currencyBreakdown).map(([currency, value]) => {
              const percentage = ((value / totalCurrentValue) * 100).toFixed(1);
              return (
                <div key={currency} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{currency === 'KRW' ? '기초자금(KRW)' : currency}</span>
                  <strong>{percentage}%</strong>
                </div>
              );
            })}
            <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', display: 'flex', overflow: 'hidden', marginTop: '1rem' }}>
              {Object.entries(currencyBreakdown).map(([currency, value], idx) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                return (
                  <div 
                    key={currency} 
                    style={{ 
                      width: `${(value / totalCurrentValue) * 100}%`, 
                      background: colors[idx % colors.length] 
                    }} 
                    title={`${currency}: ${((value / totalCurrentValue) * 100).toFixed(1)}%`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
