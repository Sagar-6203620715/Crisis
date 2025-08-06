'use client';

import { useState, useEffect } from 'react';
import { getContract, formatAddress, formatEther } from '../utils/web3';
import { getIPFSGatewayURL } from '../utils/ipfs';

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection();

    // Listen for wallet connection events
    const handleWalletConnected = () => {
      setWalletConnected(true);
      fetchReports();
    };

    const handleWalletDisconnected = () => {
      setWalletConnected(false);
      setReports([]);
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
          fetchReports();
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

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const contract = getContract();
      const reportsData = await contract.getAllReports();
      
      const formattedReports = reportsData.map((report, index) => ({
        id: index,
        title: report.title,
        description: report.description,
        location: report.location,
        imageHash: report.imageHash,
        ipfsCID: report.ipfsCID,
        reporter: report.reporter,
        timestamp: new Date(Number(report.timestamp) * 1000),
        verified: report.verified,
        verificationCount: Number(report.verificationCount)
      }));

      setReports(formattedReports.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.message.includes('Wallet not connected')) {
        setError('Please connect your wallet to view reports');
      } else {
        setError('Failed to load reports');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async (reportId) => {
    try {
      setVerifying(prev => ({ ...prev, [reportId]: true }));
      const contract = getContract();
      const tx = await contract.verifyReport(reportId);
      await tx.wait();
      
      // Refresh reports after verification
      await fetchReports();
      alert('Report verified successfully!');
    } catch (error) {
      console.error('Error verifying report:', error);
      if (error.message.includes('Only verified reporters')) {
        alert('Only verified reporters can verify reports. Contact the platform administrator to become a verified reporter.');
      } else if (error.message.includes('Already verified')) {
        alert('You have already verified this report.');
      } else if (error.message.includes('Cannot verify your own')) {
        alert('You cannot verify your own report.');
      } else {
        alert('Failed to verify report. Please try again.');
      }
    } finally {
      setVerifying(prev => ({ ...prev, [reportId]: false }));
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

  const getVerificationStatus = (verified, verificationCount) => {
    if (verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified ({verificationCount} verifications)
        </span>
      );
    } else if (verificationCount > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Pending ({verificationCount}/3 verifications)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Unverified (0/3 verifications)
        </span>
      );
    }
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-lg font-medium">Connect Your Wallet</p>
          <p className="text-sm">Please connect your MetaMask wallet to view crisis reports</p>
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
          onClick={fetchReports}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">No crisis reports yet</p>
          <p className="text-sm">Be the first to submit a crisis report</p>
        </div>
        <a href="/reports" className="btn-primary">
          Submit First Report
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <div key={report.id} className="card border-l-4 border-crisis-red">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image */}
            <div className="lg:w-1/3">
              <img
                src={getIPFSGatewayURL(report.ipfsCID)}
                alt={report.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-image.svg';
                }}
              />
            </div>
            
            {/* Content */}
            <div className="lg:w-2/3 flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                  {getVerificationStatus(report.verified, report.verificationCount)}
                </div>
                
                <p className="text-gray-600 mb-4">{report.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {report.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(report.timestamp)}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Reporter: {formatAddress(report.reporter)}
                </div>
              </div>
              
              {/* Verification Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleVerifyReport(report.id)}
                  disabled={verifying[report.id]}
                  className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying[report.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 