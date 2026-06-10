import React, { useState } from 'react';
import { useAssets } from '../context/AssetContext';

const AssetForm = ({ onClose }) => {
  const { addAsset } = useAssets();
  
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
    
    if (!formData.amount || !formData.buyRate) {
      alert('외화 금액과 매수 환율을 입력해주세요.');
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    const parsedBuyRate = parseFloat(formData.buyRate);

    if (parsedAmount <= 0) {
      alert('외화 금액은 0보다 커야 합니다.');
      return;
    }

    if (parsedBuyRate <= 0) {
      alert('매수 환율은 0보다 커야 합니다.');
      return;
    }
    
    addAsset({
      assetName: formData.assetName.trim(),
      currency: formData.currency,
      amount: parsedAmount,
      buyRate: parsedBuyRate
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
            </select>
          </div>
          
          <div className="form-group">
            <label>외화 금액</label>
            <input required type="number" step="0.01" min="0" name="amount" className="input-field" value={formData.amount} onChange={handleChange} placeholder="예: 1000" />
          </div>
          
          <div className="form-group">
            <label>평균 매수 환율 (1외화 당 원화)</label>
            <input required type="number" step="0.01" min="0" name="buyRate" className="input-field" value={formData.buyRate} onChange={handleChange} placeholder="예: 1350" />
            {formData.currency === 'JPY' && <small className="text-secondary" style={{display: 'block', marginTop: '4px'}}>* 일본 엔화는 1엔당 원화 환율(예: 9.05)을 입력해주세요. (100엔 기준 아님)</small>}
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
