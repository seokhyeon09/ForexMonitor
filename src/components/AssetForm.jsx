import React, { useState } from 'react';
import { useAssets } from '../context/AssetContext';
import { useExchangeRates } from '../context/ExchangeRateContext';

const AssetForm = ({ onClose }) => {
  const { assets, addAsset, updateAsset } = useAssets();
  const { rates } = useExchangeRates();
  
  const [formData, setFormData] = useState({
    assetName: '',
    currency: 'USD',
    amount: '',
    buyRate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.assetName.trim()) {
      alert('자산명을 입력해주세요.');
      return;
    }
    
    if (!formData.amount) {
      alert('외화 금액을 입력해주세요.');
      return;
    }

    let finalBuyRate = parseFloat(formData.buyRate);

    // 매수 환율 빈칸 시 현재 환율 자동 적용
    if (!formData.buyRate) {
      if (formData.currency === 'KRW') {
        finalBuyRate = 1;
      } else {
        if (!rates || !rates[formData.currency]) {
          alert('현재 환율을 불러올 수 없어 자동 입력이 불가능합니다. 수동으로 입력해주세요.');
          return;
        }
        finalBuyRate = rates[formData.currency];
        alert('매수 환율을 입력하지 않아 현재 실시간 환율을 기준으로 자동 입력되었습니다.');
      }
    }

    const parsedAmount = parseFloat(formData.amount);

    if (parsedAmount <= 0) {
      alert('금액은 0보다 커야 합니다.');
      return;
    }

    if (finalBuyRate <= 0) {
      alert('매수 환율은 0보다 커야 합니다.');
      return;
    }
    
    // KRW 예외: 항상 매수 환율 1
    if (formData.currency === 'KRW') {
      finalBuyRate = 1;
    }

    // 외화 매수 시 기초자금 차감 로직
    if (formData.currency !== 'KRW') {
      const costKRW = parsedAmount * finalBuyRate;
      const krwAsset = assets.find(a => a.currency === 'KRW');
      const currentKRWBalance = krwAsset ? krwAsset.amount : 0;
      
      if (currentKRWBalance - costKRW < 0) {
        const confirmMsg = `기초자금 잔액이 부족합니다.\n(현재: ${Math.floor(currentKRWBalance).toLocaleString()}원 / 필요: ${Math.floor(costKRW).toLocaleString()}원)\n\n그래도 등록하시겠습니까? (기초자금이 마이너스가 됩니다)`;
        if (!window.confirm(confirmMsg)) {
          return; // 사용자가 취소하면 등록 중단
        }
      }

      // 기초자금 차감 반영
      if (krwAsset) {
        updateAsset(krwAsset.id, { amount: krwAsset.amount - costKRW });
      } else {
        addAsset({
          assetName: '기초자금',
          currency: 'KRW',
          amount: -costKRW,
          buyRate: 1
        });
      }
    }
    
    addAsset({
      assetName: formData.assetName.trim(),
      currency: formData.currency,
      amount: parsedAmount,
      buyRate: finalBuyRate
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>새 자산 등록</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>자산명</label>
            <input required type="text" name="assetName" className="input-field" value={formData.assetName} onChange={handleChange} placeholder="예: 신한은행 달러예금" />
          </div>
          
          <div className="form-group">
            <label>통화 종류</label>
            <select name="currency" className="input-field" value={formData.currency} onChange={handleChange}>
              <option value="USD">USD (달러)</option>
              <option value="JPY">JPY (엔)</option>
              <option value="EUR">EUR (유로)</option>
              <option value="KRW">KRW (원화 - 기초자금/기본금)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>{formData.currency === 'KRW' ? '원화 금액' : '외화 금액'}</label>
            <input required type="number" step="0.01" min="0" name="amount" className="input-field" value={formData.amount} onChange={handleChange} placeholder="예: 1000" />
          </div>
          
          <div className="form-group">
            <label>평균 매수 환율 (1외화 당 원화)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              name="buyRate" 
              className="input-field" 
              value={formData.currency === 'KRW' ? '1' : formData.buyRate} 
              onChange={handleChange} 
              placeholder="비워둘 시 실시간 환율 자동 적용" 
              disabled={formData.currency === 'KRW'} 
            />
            {formData.currency === 'JPY' && <small className="text-secondary" style={{display: 'block', marginTop: '4px'}}>* 일본 엔화는 1엔당 원화 환율(예: 9.05)을 입력해주세요. (100엔 기준 아님)</small>}
            {formData.currency === 'KRW' && <small className="text-secondary" style={{display: 'block', marginTop: '4px'}}>* 원화는 기준 통화이므로 환율이 1로 고정됩니다.</small>}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-danger" onClick={onClose}>취소</button>
            <button type="submit" className="btn btn-primary">등록하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
