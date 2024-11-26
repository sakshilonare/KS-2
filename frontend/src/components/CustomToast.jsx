// src/components/CustomToast.js
import React from 'react';

const CustomToast = ({ message, type }) => {
    return (
        <div className={`flex items-center p-4 rounded-md text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {type === 'success' ? (
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            <span>{message}</span>
        </div>
    );
};

export default CustomToast;
