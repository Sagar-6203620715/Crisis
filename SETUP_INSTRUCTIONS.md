# Setup Instructions for Crisis Response dApp

## Why Submit Report Might Not Be Working

The submit report functionality requires several components to be properly configured:

### 1. Environment Variables (Required for IPFS)

Create a `.env.local` file in your project root with the following variables:

```bash
# IPFS Storage Configuration
# You need at least one of these tokens for file uploads to work

# Web3.Storage (recommended) - Get free token from https://web3.storage/
WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# NFT.Storage (alternative) - Get free token from https://nft.storage/
NFT_STORAGE_TOKEN=your_nft_storage_token_here

# Smart Contract Configuration
# Update this with your deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Network Configuration (optional)
NEXT_PUBLIC_NETWORK_ID=31337
```

### 2. Get IPFS Storage Tokens

#### Option A: Web3.Storage (Recommended)
1. Go to https://web3.storage/
2. Sign up with your GitHub account
3. Create a new API token
4. Copy the token to your `.env.local` file

#### Option B: NFT.Storage
1. Go to https://nft.storage/
2. Sign up with your GitHub account
3. Create a new API token
4. Copy the token to your `.env.local` file

### 3. Deploy Smart Contract

1. Start local Hardhat node:
   ```bash
   npm run node
   ```

2. Deploy the contract:
   ```bash
   npm run deploy
   ```

3. Update the contract address in `.env.local` with the deployed address

### 4. Connect Wallet

1. Install Coinbase Wallet browser extension
2. Connect your wallet to the dApp
3. Ensure you have some test ETH for gas fees

## Troubleshooting

### Common Issues:

1. **"No IPFS storage providers configured"**
   - Solution: Add WEB3_STORAGE_TOKEN or NFT_STORAGE_TOKEN to `.env.local`

2. **"Wallet not connected"**
   - Solution: Connect your wallet using the connect button

3. **"Transaction failed"**
   - Solution: Ensure you have enough ETH for gas fees
   - Check if you're on the correct network

4. **"Upload failed"**
   - Solution: Check your internet connection
   - Verify IPFS tokens are valid
   - Check browser console for detailed error messages

### Testing the Setup:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/reports` page
3. Connect your wallet
4. Fill out the form and upload an image
5. Submit the report

### Debug Mode:

Open browser console (F12) to see detailed error messages and transaction logs.

## File Structure

```
Crisis/
├── .env.local                    # Environment variables (create this)
├── components/
│   └── ReportForm.js            # Report submission form
├── utils/
│   └── web3.js                  # Web3 and wallet connection
├── app/
│   └── api/
│       └── ipfs/
│           └── route.js         # IPFS upload API
└── contracts/
    └── CrisisReporting.sol      # Smart contract
```

## Support

If you continue to have issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure the smart contract is deployed and accessible
4. Check that your wallet is connected to the correct network 