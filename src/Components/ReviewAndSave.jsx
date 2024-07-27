import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const ReviewAndSave = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const financeData = JSON.parse(sessionStorage.getItem('financeData'));

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = (step) => {
    navigate(step);
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate a save operation with a delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Save the data permanently to localStorage
      localStorage.setItem('finalUserInfo', JSON.stringify(userInfo));
      localStorage.setItem('finalFinanceData', JSON.stringify(financeData));

      // Optionally log the final data to the console
      console.log('Final data saved:', { userInfo, financeData });

      // Hide the success message after a few seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 2000); // Adjust the delay as needed
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-300 via-teal-300 to-blue-300 p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 w-full max-w-4xl relative">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-green-700 text-center">Review and Save</h1>

        {isSaving && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-green-500 h-16 w-16 mb-4"></div>
          </div>
        )}

        {saveSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="text-center p-6 bg-green-500 text-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Success!</h2>
              <p className="text-lg">Your data has been saved.</p>
            </div>
          </div>
        )}

        <div className="mb-8 border-t-4 border-green-600 pt-4">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">User Information</h2>
          <p className="text-lg text-gray-700">Name: <span className="font-medium text-gray-900">{userInfo?.name || 'N/A'}</span></p>
          <p className="text-lg text-gray-700">Email: <span className="font-medium text-gray-900">{userInfo?.email || 'N/A'}</span></p>
          <p className="text-lg text-gray-700">Preferred Currency: <span className="font-medium text-gray-900">{userInfo?.currency || 'N/A'}</span></p>
        </div>

        <div className="mb-8 border-t-4 border-green-600 pt-4">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Finance Data</h2>
          <p className="text-lg text-gray-700">Monthly Income: <span className="font-medium text-gray-900">{financeData?.monthlyIncome || 'N/A'}</span></p>

          <h3 className="text-xl font-semibold mt-4 text-gray-800">Expenses:</h3>
          {financeData?.expenses && financeData.expenses.length > 0 ? (
            <table className="min-w-full mt-4 border-separate border-spacing-2">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="py-3 px-4 border-b">Expense Name</th>
                  <th className="py-3 px-4 border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {financeData.expenses.map((expense, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-gray-700 text-xl">{expense.name || 'Unnamed Expense'}</td>
                    <td className="py-2 px-4 border-b text-gray-700 text-right text-xl">{expense.amount || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-lg text-gray-700">No expenses recorded.</p>
          )}
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={() => handleEdit('/user-info-and-finance')}
            className="bg-green-600 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndSave;
