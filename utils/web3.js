import { ethers } from 'ethers';

// Contract ABI - This will be generated after compilation
const CONTRACT_ABI = [
  "function submitReport(string _title, string _description, string _location, string _imageHash, string _ipfsCID) external",
  "function donate(string _message) external payable",
  "function getAllReports() external view returns (tuple(string title, string description, string location, string imageHash, string ipfsCID, address reporter, uint256 timestamp, bool verified, uint256 verificationCount)[])",
  "function getAllDonations() external view returns (tuple(address donor, uint256 amount, uint256 timestamp, string message)[])",
  "function totalDonations() external view returns (uint256)",
  "function getReportsCount() external view returns (uint256)",
  "function verifyReport(uint256 _reportId) external",
  "function verifiedReporters(address) external view returns (bool)",
  "event ReportSubmitted(uint256 reportId, address reporter, string title, string ipfsCID)",
  "event DonationReceived(address donor, uint256 amount, string message)"
];

let provider;
let signer;
let contract;

export const connectWallet = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    // Contract address - replace with your deployed contract address
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
    
    return {
      address: accounts[0],
      provider,
      signer,
      contract
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const getContract = () => {
  if (!contract) {
    throw new Error('Wallet not connected');
  }
  return contract;
};

export const getSigner = () => {
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  return signer;
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei) => {
  return ethers.formatEther(wei);
};

export const parseEther = (ether) => {
  return ethers.parseEther(ether);
};

export const listenToEvents = (contract, eventName, callback) => {
  contract.on(eventName, callback);
  return () => contract.off(eventName, callback);
}; 