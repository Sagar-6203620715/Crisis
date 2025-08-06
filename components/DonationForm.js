'use client';

import { useState } from 'react';
import { getContract, parseEther, formatEther } from '../utils/web3';

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isDonating, setIsDonating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsDonating(true);

    try {
      const contract = getContract();
      const amountInWei = parseEther(amount);
      
      const tx = await contract.donate(message, { value: amountInWei });
      await tx.wait();
      
      alert('Thank you for your donation!');
      setAmount('');
      setMessage('');
      
    } catch (error) {
      console.error('Error making donation:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.001"
              step="0.001"
              className="input-field pr-12"
              placeholder="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ETH</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum donation: 0.001 ETH</p>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="input-field"
            placeholder="Leave a message of support..."
          />
        </div>

        <button
          type="submit"
          disabled={isDonating}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDonating ? 'Processing Donation...' : 'Donate Now'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How your donation helps:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Emergency relief supplies</li>
          <li>• Medical assistance</li>
          <li>• Food and water distribution</li>
          <li>• Shelter and infrastructure</li>
        </ul>
      </div>
    </div>
  );
} 