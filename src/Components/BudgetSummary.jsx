import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BudgetSummary = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [conversionRate, setConversionRate] = useState(1);
  const [currencyError, setCurrencyError] = useState('');
  const [overBudget, setOverBudget] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const financeData = JSON.parse(sessionStorage.getItem('financeData'));

    if (userInfo && financeData) {
      setSelectedCurrency(userInfo.currency);
      setTotalIncome(parseFloat(financeData.monthlyIncome));
      setTotalExpenses(
        financeData.expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0)
      );
      const remaining = parseFloat(financeData.monthlyIncome) -
        financeData.expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);
      setRemainingBudget(remaining);
      setOverBudget(remaining < 0);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${selectedCurrency}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setConversionRate(data.rates[selectedCurrency] || 1);
      } catch (error) {
        setCurrencyError('Failed to fetch currency conversion rate.');
        console.error('Error fetching conversion rate:', error);
      }
    };

    if (selectedCurrency) {
      fetchConversionRate();
    }
  }, [selectedCurrency]);

  const handleProceed = () => {
    navigate('/review-and-save');
  };

  const handleBack = () => {
    navigate('/user-info-and-finance');
  };

  const handleCurrencyConversion = () => {
    navigate('/currency-converter');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-lg">
        <h1 className="text-3xl sm:text-5xl font-serif mb-6 text-yellow-600 text-center">Budget Summary</h1>
        <div className="mb-6 text-center">
          <p className="text-xl sm:text-2xl font-semibold">
            Total Income: <span className="font-bold text-green-600">{totalIncome.toFixed(2)} {selectedCurrency}</span>
          </p>
          <p className="text-xl sm:text-2xl font-semibold">
            Total Expenses: <span className="font-bold text-red-600">{totalExpenses.toFixed(2)} {selectedCurrency}</span>
          </p>
          <p className={`text-xl sm:text-2xl font-semibold ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
            Remaining Budget: <span className="font-bold">{remainingBudget.toFixed(2)} {selectedCurrency}</span>
          </p>
          {overBudget && (
            <p className="text-red-600 mt-6 text-lg font-semibold">
              Your expenses exceed your income. Please review your budget.
            </p>
          )}
        </div>
        <div className="mb-6 text-center">
          {currencyError && <p className="text-red-600 text-lg font-semibold">{currencyError}</p>}
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleProceed}
            className="bg-blue-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Proceed to Review
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={handleCurrencyConversion}
            className="bg-green-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
          > Real-Time Currency Conversion</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
