// CurrencyConversion.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExchangeAlt } from 'react-icons/fa';

const CurrencyConversion = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [conversionRate, setConversionRate] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrencyOptions = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setCurrencyOptions(Object.keys(data.rates));
      } catch (error) {
        console.error('Error fetching currency options:', error);
        setError('Failed to fetch currency options.');
      }
    };

    fetchCurrencyOptions();
  }, []);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        setConversionRate(data.rates[toCurrency] || 1);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
        setError('Failed to fetch conversion rate.');
      }
    };

    if (fromCurrency && toCurrency) {
      fetchConversionRate();
    }
  }, [fromCurrency, toCurrency]);

  const handleConversion = () => {
    if (!amount || isNaN(amount)) {
      setError('Please enter a valid amount.');
      return;
    }
    setConvertedAmount((amount * conversionRate).toFixed(2));
    setError('');
  };

  const handleBack = () => {
    navigate('/budget-summary');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-3xl sm:text-5xl font-serif mb-6 text-yellow-600 text-center flex items-center justify-center">
          <FaExchangeAlt className="mr-2" /> Currency Conversion
        </h2>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-lg font-medium mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="from-currency" className="block text-lg font-medium mb-1">From Currency</label>
          <select
            id="from-currency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="to-currency" className="block text-lg font-medium mb-1">To Currency</label>
          <select
            id="to-currency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={handleConversion}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Convert
        </button>
        {convertedAmount && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold">Converted Amount</h3>
            <p className="text-lg">{convertedAmount} {toCurrency}</p>
          </div>
        )}
        <button
          onClick={handleBack}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Back to Budget Summary
        </button>
      </div>
    </div>
  );
};

export default CurrencyConversion;
