'use client';

import { useState, useEffect } from 'react';
import { getContract, formatAddress, formatEther } from '../utils/web3';

export default function DonationsList() {
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection();

    // Listen for wallet connection events
    const handleWalletConnected = () => {
      setWalletConnected(true);
      fetchDonations();
    };

    const handleWalletDisconnected = () => {
      setWalletConnected(false);
      setDonations([]);
      setTotalDonations('0');
      setError(null);
    };

    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          fetchDonations();
        } else {
          setWalletConnected(false);
          setLoading(false);
        }
      } else {
        setWalletConnected(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletConnected(false);
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const contract = getContract();
      
      // Fetch total donations
      const total = await contract.totalDonations();
      setTotalDonations(formatEther(total));
      
      // Fetch all donations
      const donationsData = await contract.getAllDonations();
      
      const formattedDonations = donationsData.map((donation, index) => ({
        id: index,
        donor: donation.donor,
        amount: formatEther(donation.amount),
        timestamp: new Date(Number(donation.timestamp) * 1000),
        message: donation.message
      }));

      setDonations(formattedDonations.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching donations:', error);
      if (error.message.includes('Wallet not connected')) {
        setError('Please connect your wallet to view donations');
      } else {
        setError('Failed to load donations');
      }
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

  if (!walletConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-6">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <p className="text-lg font-medium">Connect Your Wallet</p>
          <p className="text-sm">Please connect your MetaMask wallet to view donations</p>
        </div>
        <button 
          onClick={checkWalletConnection}
          className="btn-primary"
        >
          Check Wallet Connection
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchDonations}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Donations Card */}
      <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <div className="text-3xl font-bold">{totalDonations} ETH</div>
          <p className="text-green-100 text-sm mt-2">
            Supporting crisis relief efforts
          </p>
        </div>
      </div>

      {/* Donations List */}
      {donations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <p className="text-lg font-medium">No donations yet</p>
            <p className="text-sm">Be the first to support crisis relief efforts</p>
          </div>
          <a href="/donate" className="btn-primary">
            Make First Donation
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="card border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {formatAddress(donation.donor)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(donation.timestamp)}
                      </div>
                    </div>
                  </div>
                  {donation.message && (
                    <p className="text-gray-600 text-sm italic">
                      "{donation.message}"
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {donation.amount} ETH
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 