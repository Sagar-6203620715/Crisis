# Crisis Response dApp

A decentralized Web3 application for crisis reporting and humanitarian aid during national emergencies. Built with React, Next.js, Hardhat, and IPFS.

## Features

- **Crisis Reporting**: Submit verified crisis reports with images and location data
- **IPFS Storage**: Secure, decentralized storage for images and metadata
- **Blockchain Donations**: Transparent ETH donations with full traceability
- **Verification System**: Community-driven verification of crisis reports
- **MetaMask Integration**: Seamless wallet connection and transaction signing

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Blockchain**: Ethereum, Hardhat, ethers.js
- **Storage**: IPFS (Infura)
- **Smart Contracts**: Solidity, OpenZeppelin
- **Wallet**: MetaMask integration

## Project Structure

```
crisis-reporting-dapp/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   ├── reports/           # Reports page
│   └── donate/            # Donations page
├── components/            # React components
│   ├── Header.js          # Navigation header
│   ├── ReportForm.js      # Report submission form
│   ├── DonationForm.js    # Donation form
│   ├── ReportsList.js     # Reports display
│   └── DonationsList.js   # Donations display
├── contracts/             # Smart contracts
│   └── CrisisReporting.sol # Main contract
├── scripts/               # Deployment scripts
│   └── deploy.js          # Contract deployment
├── utils/                 # Utility functions
│   ├── web3.js           # Web3 integration
│   └── ipfs.js           # IPFS integration
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Smart Contract Features

### CrisisReporting.sol
- **Report Submission**: Submit crisis reports with metadata
- **Image Storage**: Store image hashes and IPFS CIDs
- **Donation Tracking**: Accept and track ETH donations
- **Verification System**: Community verification of reports
- **Reporter Management**: Verified reporter system

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MetaMask browser extension
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd crisis-reporting-dapp
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# IPFS Configuration (Infura)
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret

# Network Configuration
NEXT_PUBLIC_NETWORK_ID=1337
NEXT_PUBLIC_NETWORK_NAME=Hardhat Local
```

### 3. IPFS Setup (Optional)
For production, set up Infura IPFS:
1. Create account at [Infura](https://infura.io)
2. Create IPFS project
3. Add project ID and secret to `.env.local`

### 4. Deploy Smart Contract
```bash
# Start local Hardhat node
npm run node

# In new terminal, deploy contract
npm run deploy
```

### 5. Update Contract Address
After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with the deployed contract address.

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### Connecting Wallet
1. Click "Connect Wallet" in the header
2. Approve MetaMask connection
3. Ensure you're connected to the correct network (Hardhat localhost:8545)

### Submitting Reports
1. Navigate to "Reports" page
2. Fill in report details (title, description, location)
3. Upload an image (supports JPG, PNG, GIF)
4. Click "Submit Report"
5. Approve MetaMask transaction

### Making Donations
1. Navigate to "Donate" page
2. Enter donation amount in ETH
3. Add optional message
4. Click "Donate Now"
5. Approve MetaMask transaction

### Verifying Reports
- Only verified reporters can verify other reports
- Reports need 3 verifications to be marked as verified
- Contract owner can verify new reporters

## Development

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
npm start
```

## Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks on donations
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive validation of all inputs
- **Secure Withdrawals**: Only owner can withdraw accumulated donations

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced verification mechanisms
- [ ] Integration with emergency services APIs
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] DAO governance for fund allocation 