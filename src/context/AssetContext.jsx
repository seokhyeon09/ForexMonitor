import React, { createContext, useContext, useState, useEffect } from 'react';

const AssetContext = createContext();

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('forex_assets');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  useEffect(() => {
    localStorage.setItem('forex_assets', JSON.stringify(assets));
  }, [assets]);

  const addAsset = (asset) => {
    const newAsset = { ...asset, id: crypto.randomUUID(), regDate: new Date().toISOString() };
    setAssets((prev) => [newAsset, ...prev]);
  };

  const updateAsset = (id, updatedFields) => {
    setAssets((prev) => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
  };

  const deleteAsset = (id) => {
    setAssets((prev) => prev.filter(a => a.id !== id));
  };

  const filteredAndSortedAssets = assets
    .filter(a => filterCurrency === 'ALL' || a.currency === filterCurrency)
    .filter(a => a.assetName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.regDate) - new Date(a.regDate);
      if (sortBy === 'date-asc') return new Date(a.regDate) - new Date(b.regDate);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  return (
    <AssetContext.Provider value={{
      assets,
      filteredAndSortedAssets,
      addAsset,
      updateAsset,
      deleteAsset,
      searchTerm, setSearchTerm,
      filterCurrency, setFilterCurrency,
      sortBy, setSortBy
    }}>
      {children}
    </AssetContext.Provider>
  );
};
