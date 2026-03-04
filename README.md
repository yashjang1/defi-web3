# DeFi College Project

This project contains two parts: a Smart Contract backend using Hardhat and a React Web App frontend using Vite.

## 1. Smart Contracts
The smart contracts are located in the `contracts` folder. They contain a custom ERC20 Token implementation and a simple Automated Market Maker (AMM) Swap logic allowing swapping Token A for Token B.

### Setup & Deploy to Sepolia Testing Network
1. Navigate to the `contracts` directory.
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Add your `PRIVATE_KEY` (must be from a wallet like MetaMask that has Sepolia test Ethereum) and `SEPOLIA_RPC_URL` (can get free from Alchemy or Infura).
4. Run the deploy script to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
*(This will deploy your custom Tokens and AMM contract onto the Sepolia testnet and place the contract addresses in the frontend automatically.)*

## 2. Web Frontend
The web application is located in the `frontend` directory. It comes with an elegant, modern "Glassmorphism" UI incorporating a Swap interface and a Live Coin Tracker using the CoinGecko API.

### Local Development
1. Navigate to the `frontend` directory: `cd frontend`
2. Run `npm install`
3. Run `npm run dev` and open your browser to `http://localhost:5173/`

### Hosting on GitHub Pages
We've set up everything for you to host it easily on GitHub!
1. Make sure your local codebase is connected to a GitHub Repository.
2. In the `frontend` folder's `package.json`, add your repository URL if not present.
3. Open a terminal in the `frontend` directory and run:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```
4. It will push the `dist/` branch to `gh-pages` branch on your GitHub. Go to your Github Repo -> Settings -> Pages -> Select branch `gh-pages` to complete hosting.
