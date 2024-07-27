import React, { useEffect, useState } from 'react';

const PreferredCurrency = ({ onCurrencyChange }) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const currencyList = Object.keys(data.rates); // Get list of currencies from rates
        setCurrencies(currencyList);
      } catch (error) {
        setError('Failed to load currencies.');
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedCurrency(selected);
    onCurrencyChange(selected);
  };

  return (
    <div className="mb-4 sm:mb-5">
      <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900">Preferred Currency</label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading currencies...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          id="currency"
          value={selectedCurrency}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
        >
          <option value="" disabled>Select Currency</option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default PreferredCurrency;
