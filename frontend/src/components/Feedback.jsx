import React from 'react';
import NavigationBar from './NavigationBar';

const Feedback = () => {
  return (
    <><NavigationBar />
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-1/2 flex justify-center items-center">
        <img src="feedback.gif" alt="Feedback GIF" className="w-full h-auto" style={{ maxHeight: '80%', maxWidth: '80%' }} />
      </div>
      <div className="w-1/2 p-8">
        <h2 className="text-5xl font-bold mb-4">We'd Love Your Feedback!</h2>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 text-lg" htmlFor="feedback">Your Feedback:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" id="feedback" rows="4" placeholder="Type your feedback here..."></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 text-lg" htmlFor="email">Your Email:</label>
            <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" id="email" type="email" placeholder="Enter your email..." />
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default Feedback;
