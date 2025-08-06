'use client';

import { useState, useEffect } from 'react';
import { getContract, formatAddress, formatEther } from '../utils/web3';

export default function DonationsList() {
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const contract = getContract();
      
      const [donationsData, totalAmount] = await Promise.all([
        contract.getAllDonations(),
        contract.totalDonations()
      ]);
      
      const formattedDonations = donationsData.map((donation, index) => ({
        id: index,
        donor: donation.donor,
        amount: formatEther(donation.amount),
        timestamp: new Date(Number(donation.timestamp) * 1000),
        message: donation.message
      }));

      setDonations(formattedDonations.reverse()); // Show newest first
      setTotalDonations(formatEther(totalAmount));
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crisis-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDonations}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Donations</h2>
        <button 
          onClick={fetchDonations}
          className="btn-secondary"
        >
          Refresh
        </button>
      </div>

      {/* Total Donations Card */}
      <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Total Donations</h3>
          <p className="text-3xl font-bold">{totalDonations} ETH</p>
          <p className="text-sm opacity-90 mt-1">
            {donations.length} donation{donations.length !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No donations received yet.</p>
          <p className="text-sm text-gray-500 mt-2">Be the first to make a donation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
          
          <div className="space-y-3">
            {donations.map((donation) => (
              <div key={donation.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatAddress(donation.donor)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(donation.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      {donation.amount} ETH
                    </p>
                  </div>
                </div>
                
                {donation.message && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 italic">
                      "{donation.message}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 