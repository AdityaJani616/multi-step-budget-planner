import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserInfo from './Components/UserInfo';
import UserInfoAndFinance from './Components/UserInfoAndFinance';
import BudgetSummary from './Components/BudgetSummary';
import ReviewAndSave from './Components/ReviewAndSave';
import CurrencyConversion from './Components/CurrencyConversion';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserInfo />} />  
        <Route path="/user-info-and-finance" element={<UserInfoAndFinance />} />
        <Route path="/budget-summary" element={<BudgetSummary />} />
        <Route path="/review-and-save" element={<ReviewAndSave />} />
        <Route path='/currency-converter' element={<CurrencyConversion/>}/>
      </Routes>
    </Router>
  );
};

export default App;
