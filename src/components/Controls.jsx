import React from 'react';
import { useAssets } from '../context/AssetContext';

const Controls = ({ onOpenForm }) => {
  const { 
    searchTerm, setSearchTerm, 
    filterCurrency, setFilterCurrency, 
    sortBy, setSortBy 
  } = useAssets();

  return (
    <div className="controls-bar glass-panel" style={{ padding: '1rem' }}>
      <input 
        type="text" 
        className="input-field" 
        placeholder="자산명 검색..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ flex: 1, minWidth: '200px' }}
      />
      
      <select 
        className="input-field" 
        value={filterCurrency} 
        onChange={(e) => setFilterCurrency(e.target.value)}
        style={{ width: '150px' }}
      >
        <option value="ALL">모든 통화</option>
        <option value="USD">USD (미국 달러)</option>
        <option value="JPY">JPY (일본 엔)</option>
        <option value="EUR">EUR (유로)</option>
      </select>
      
      <select 
        className="input-field" 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        style={{ width: '180px' }}
      >
        <option value="date-desc">등록일 (최신순)</option>
        <option value="date-asc">등록일 (오래된순)</option>
        <option value="amount-desc">금액 (높은순)</option>
        <option value="amount-asc">금액 (낮은순)</option>
      </select>

      <button className="btn btn-primary" onClick={onOpenForm}>
        + 새 자산 등록
      </button>
    </div>
  );
};

export default Controls;
