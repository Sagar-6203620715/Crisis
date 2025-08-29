# Quick Start Guide

Get the Crisis Response dApp running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Coinbase Wallet browser extension or mobile app
- Git

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd crisis-reporting-dapp

# Run setup script
npm run setup

# Install dependencies
npm install
```

## Step 2: Start Local Blockchain

```bash
# Start Hardhat local node (keep this running)
npm run node
```

You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

## Step 3: Deploy Smart Contract

In a new terminal:

```bash
# Deploy the contract
npm run deploy
```

You should see:
```
CrisisReporting deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployer verified as reporter: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

## Step 4: Configure Coinbase Wallet

1. Open Coinbase Wallet (browser extension or mobile app)
2. Add a new network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

3. Import one of the test accounts from the Hardhat output (they have 10000 ETH each)

## Step 5: Start the Application

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser!

## Step 6: Test the dApp

1. **Connect Wallet**: Click "Connect Coinbase Wallet" and approve in Coinbase Wallet
2. **Submit Report**: Go to Reports page, fill form, upload image, submit
3. **Make Donation**: Go to Donate page, enter amount, donate
4. **View Data**: Check the homepage to see reports and donations

## Troubleshooting

### Coinbase Wallet Connection Issues
- Ensure you're connected to Hardhat Local network
- Check that the RPC URL is correct: `http://127.0.0.1:8545`
- Make sure the Hardhat node is running

### Contract Deployment Issues
- Ensure Hardhat node is running before deploying
- Check that you have enough ETH in your account
- Verify the contract address in `.env.local`

### IPFS Issues
- For development, the app uses public IPFS gateways
- For production, set up Infura IPFS credentials in `.env.local`

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the smart contract tests: `npm run test`
- Explore the code structure in the `contracts/` and `components/` folders

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all services are running (Hardhat node, Next.js dev server)
3. Ensure Coinbase Wallet is properly configured
4. Check the [README.md](README.md) for detailed troubleshooting 