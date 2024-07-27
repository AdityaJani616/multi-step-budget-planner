import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PreferredCurrency from './PreferredCurrency';
import { useNavigate } from 'react-router-dom';

const UserInfoAndFinance = () => {
  const navigate = useNavigate();

  // State for user info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('');
  const [displayCurrency, setDisplayCurrency] = useState(''); // For displaying selected currency
  const [currencyError, setCurrencyError] = useState('');

  // State for income and expenses
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [expenses, setExpenses] = useState([{ name: '', amount: '' }]);
  const [incomeError, setIncomeError] = useState('');
  const [expenseError, setExpenseError] = useState('');

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      const { name, email, currency } = JSON.parse(storedUserInfo);
      setName(name);
      setEmail(email);
      setDisplayCurrency(currency); // Set display currency from stored info
    }
  }, []);

  useEffect(() => {
    // Reset expenses when the component is mounted
    setExpenses([{ name: '', amount: '' }]);
  }, []);

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    setCurrencyError(''); // Clear any previous errors
  };

  const handleUserInfoChange = (event) => {
    const { id, value } = event.target;
    if (id === 'Name') setName(value);
    if (id === 'email') setEmail(value);
  };

  const handleSubmitUserInfo = (event) => {
    event.preventDefault();
    const userInfo = {
      name,
      email,
      currency,
    };
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    setDisplayCurrency(currency); // Update display currency
    console.log('User Info Updated:', userInfo);
  };

  const handleExpenseChange = (index, event) => {
    const { id, value } = event.target;
    const updatedExpenses = [...expenses];
    updatedExpenses[index][id] = value;
    setExpenses(updatedExpenses);
  };

  const handleAddExpense = () => {
    const lastExpense = expenses[expenses.length - 1];
    if (validateExpenseName(lastExpense.name) && validateAmount(lastExpense.amount)) {
      setExpenses([...expenses, { name: '', amount: '' }]);
      setExpenseError(''); // Clear any previous errors
    } else {
      setExpenseError('Please fill in the last expense with valid details before adding a new one.');
    }
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const validateIncome = (value) => {
    // Ensure the value is a valid number and not NaN
    return !isNaN(value) && value.trim() !== '' && parseFloat(value) > 0;
  };

  const handleSubmitFinance = (event) => {
    event.preventDefault();
    if (!validateIncome(monthlyIncome)) {
      setIncomeError('Please enter a valid income amount.');
      return;
    }

    // Check if at least one expense detail is added
    const hasValidExpense = expenses.some(expense => validateExpenseName(expense.name) && validateAmount(expense.amount));
    if (!hasValidExpense) {
      setExpenseError('Please add at least one valid expense detail.');
      return;
    }

    const financeData = {
      monthlyIncome: parseFloat(monthlyIncome), // Convert to number
      expenses,
    };
    sessionStorage.setItem('financeData', JSON.stringify(financeData));
    navigate('/budget-summary'); // Navigate to Budget Summary page
  };

  // Validation function for expense name
  const validateExpenseName = (value) => {
    // Allow only letters and spaces
    return /^[A-Za-z\s]*$/.test(value);
  };

  // Validation function for expense amount
  const validateAmount = (value) => {
    return !isNaN(value) && value.trim() !== '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-lg flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-4xl font-serif mb-4 text-yellow-600">User Information</h1>
        <form className="w-full mb-8" onSubmit={handleSubmitUserInfo}>
          <div className="mb-4 sm:mb-5">
            <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input
              type="text"
              id="Name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              placeholder="John Doe"
              value={name}
              onChange={handleUserInfoChange}
            />
          </div>
          <div className="mb-4 sm:mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              placeholder="user@gmail.com"
              value={email}
              onChange={handleUserInfoChange}
            />
          </div>
          <PreferredCurrency onCurrencyChange={handleCurrencyChange} />
          {currencyError && <p className="text-red-500 mb-4">{currencyError}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              Update Info
            </button>
          </div>
        </form>

        <h2 className="text-xl sm:text-2xl font-serif mb-4 text-yellow-600">Income and Expenses</h2>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-lg flex flex-col items-center">
          <p className="text-lg mb-2">Selected Currency: <span className="font-semibold text-green-600">{displayCurrency || 'None'}</span></p>
          <form className="w-full" onSubmit={handleSubmitFinance}>
            <div className="mb-4 sm:mb-5">
              <label htmlFor="monthlyIncome" className="block mb-2 text-sm font-medium text-gray-900">Monthly Income</label>
              <input
                type="number"
                id="monthlyIncome"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                placeholder="1000"
                value={monthlyIncome}
                onChange={(e) => {
                  if (validateIncome(e.target.value)) {
                    setMonthlyIncome(e.target.value);
                    setIncomeError(''); // Clear any previous errors
                  } else {
                    setIncomeError('Please enter a valid income amount.');
                  }
                }}
              />
              {incomeError && <p className="text-red-500 text-sm mt-2">{incomeError}</p>}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Expenses</h3>
              {expenses.map((expense, index) => (
                <div key={index} className="flex items-center mb-4">
                  <input
                    type="text"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-2/3 p-2.5"
                    placeholder="Expense Name"
                    value={expense.name}
                    onChange={(e) => {
                      if (validateExpenseName(e.target.value)) {
                        handleExpenseChange(index, e);
                      }
                    }}
                  />
                  <input
                    type="number"
                    id="amount"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-1/3 p-2.5 ml-2"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={(e) => {
                      if (validateAmount(e.target.value)) {
                        handleExpenseChange(index, e);
                      }
                    }}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="text-red-500 ml-2"
                      onClick={() => handleRemoveExpense(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {expenseError && <p className="text-red-500 text-sm mt-2">{expenseError}</p>}
              <button
                type="button"
                className="bg-green-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-green-600 transition-colors mt-2"
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
              >
                Save and Continue
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInfoAndFinance;
