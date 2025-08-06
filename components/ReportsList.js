'use client';

import { useState, useEffect } from 'react';
import { getContract, formatAddress, formatEther } from '../utils/web3';
import { getIPFSGatewayURL } from '../utils/ipfs';

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
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
      setError('Failed to load reports');
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
          onClick={fetchReports}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No reports submitted yet.</p>
        <p className="text-sm text-gray-500 mt-2">Be the first to submit a crisis report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Crisis Reports</h2>
        <button 
          onClick={fetchReports}
          className="btn-secondary"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div key={report.id} className="card hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={getIPFSGatewayURL(report.imageHash)}
                alt={report.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              {report.verified && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Verified
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {report.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-3">
                {report.description}
              </p>

              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {report.location}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By: {formatAddress(report.reporter)}</span>
                <span>{formatDate(report.timestamp)}</span>
              </div>

              {report.verificationCount > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {report.verificationCount} verification{report.verificationCount !== 1 ? 's' : ''}
                </div>
              )}

              <div className="pt-3 border-t border-gray-200">
                <a
                  href={getIPFSGatewayURL(report.ipfsCID)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Full Report →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 