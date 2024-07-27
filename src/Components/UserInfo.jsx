import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PreferredCurrency from './PreferredCurrency';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
  };

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!currency) newErrors.currency = 'Currency is required';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const userInfo = {
        name,
        email,
        currency
      };
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('User Info Saved:', userInfo);
      navigate('/user-info-and-finance');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-lg flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-4xl font-serif mb-4 text-yellow-600">User Information</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-5">
            <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input
              type="text"
              id="Name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4 sm:mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <PreferredCurrency onCurrencyChange={handleCurrencyChange} />
          {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserInfo;
