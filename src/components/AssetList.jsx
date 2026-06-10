import React from 'react';
import { useAssets } from '../context/AssetContext';
import { useExchangeRates } from '../context/ExchangeRateContext';

const AssetItem = ({ asset }) => {
  const { deleteAsset } = useAssets();
  const { rates } = useExchangeRates();

  const currentRate = rates?.[asset.currency] || 0;
  const investedKRW = asset.amount * asset.buyRate;
  const currentKRW = asset.amount * currentRate;
  const pnl = currentKRW - investedKRW;
  const returnRate = (pnl / investedKRW) * 100;
  const isPositive = pnl >= 0;

  return (
    <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ flex: '1 1 200px' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {asset.assetName} 
          <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{asset.currency}</span>
        </h3>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          외화: {asset.amount.toLocaleString()} {asset.currency} | 매수환율: {asset.buyRate.toLocaleString()} 원 | 현재환율: {currentRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} 원
        </p>
      </div>

      <div style={{ textAlign: 'right', flex: '1 1 150px' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
          {currentKRW.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원
        </div>
        <div className={isPositive ? 'text-success' : 'text-danger'} style={{ fontSize: '0.95rem' }}>
          {pnl > 0 ? '+' : ''}{pnl.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원 ({returnRate.toFixed(2)}%)
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-danger" onClick={() => {
          if(window.confirm('정말 이 자산을 삭제하시겠습니까?')) deleteAsset(asset.id);
        }}>삭제</button>
      </div>
    </div>
  );
};

const AssetList = () => {
  const { filteredAndSortedAssets, assets } = useAssets();

  if (assets.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <h2>보유 중인 자산이 없습니다.</h2>
        <p>상단의 '+ 새 자산 등록' 버튼을 눌러 첫 외화 자산을 등록해보세요!</p>
      </div>
    );
  }

  if (filteredAndSortedAssets.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <h3>조건에 맞는 자산이 없습니다.</h3>
        <p>검색어나 필터 조건을 변경해보세요.</p>
      </div>
    );
  }

  return (
    <div className="asset-list">
      {filteredAndSortedAssets.map(asset => (
        <AssetItem key={asset.id} asset={asset} />
      ))}
    </div>
  );
};

export default AssetList;
