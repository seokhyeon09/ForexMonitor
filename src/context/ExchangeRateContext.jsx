import React, { createContext, useContext, useState, useEffect } from 'react';

const ExchangeRateContext = createContext();

export const useExchangeRates = () => useContext(ExchangeRateContext);

export const ExchangeRateProvider = ({ children }) => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        // Using a free CDN endpoint for latest KRW base rates
        // Note: This API returns rates with 'krw' as base. Example: krw.usd = 0.00074...
        // To get KRW per USD, we do 1 / krw.usd
        const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json');
        if (!res.ok) throw new Error('Failed to fetch exchange rates');
        const data = await res.json();
        
        // Calculate KRW per 1 unit of foreign currency
        const parsedRates = {
          USD: 1 / data.krw.usd,
          JPY: 1 / data.krw.jpy,
          EUR: 1 / data.krw.eur,
          // JPY is often calculated per 100 in Korea, but let's stick to per 1 unit for consistency, or we handle it in UI
        };
        
        setRates(parsedRates);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Fallback dummy rates if API fails
        setRates({ USD: 1350.50, JPY: 9.05, EUR: 1470.20 });
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <ExchangeRateContext.Provider value={{ rates, loading, error }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};
