const pptxgen = require('pptxgenjs');

let pres = new pptxgen();

// Slide 1 title
let slide1 = pres.addSlide();
slide1.addText('DefiCollege: A Decentralized Token Exchange (DEX)', { x: 1.0, y: 1.5, w: 8.0, h: 1.0, align: 'center', fontSize: 32, bold: true, color: '363636' });
slide1.addText('Building a Web3 Swap Platform on the Ethereum Blockchain', { x: 1.0, y: 2.5, w: 8.0, h: 1.0, align: 'center', fontSize: 20, color: '7F7F7F' });
slide1.addText('Presenter: Your Name\nDate: Today', { x: 1.0, y: 4.0, w: 8.0, h: 1.0, align: 'center', fontSize: 16, color: '363636' });

// Slide 2
let slide2 = pres.addSlide();
slide2.addText('What is DefiCollege?', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide2.addText([
    { text: 'A fully functional Web3 decentralized application (dApp).' },
    { text: 'Designed to simulate a real-world Decentralized Exchange (DEX) like Uniswap.' },
    { text: 'Goal: Enable users to seamlessly swap between two custom cryptocurrency tokens securely on the blockchain without a middleman.', options: { bold: true } },
    { text: 'Operates entirely on smart contracts, demonstrating trustless Web3 mechanics.' }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 18, color: '363636' });

// Slide 3
let slide3 = pres.addSlide();
slide3.addText('Platform Capabilities', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide3.addText([
    { text: 'MetaMask Integration: Users can log in directly using their digital wallets.' },
    { text: 'Network Safety Lock: Automatically detects and prompts users to switch to the Sepolia Testnet to prevent lost funds.' },
    { text: 'Token Faucet: A "Claim" button that mints 1,000 free A & B tokens directly to the users wallet for testing.' },
    { text: 'Smart Swapping: A bi-directional interface (A -> B or B -> A) verifying token allowances before swapping.' },
    { text: 'Wallet Addition: Built-in buttons to automatically import the custom tokens into the users MetaMask visibility.' }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 18, color: '363636' });

// Slide 4
let slide4 = pres.addSlide();
slide4.addText('Tools & Technologies Used', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide4.addText([
    { text: 'Blockchain Network: Ethereum Sepolia Testnet' },
    { text: 'Smart Contracts: Solidity, OpenZeppelin (ERC20 standard)' },
    { text: 'Development Environment: Hardhat (v3) & Node.js' },
    { text: 'Frontend Framework: React (Vite) with TypeScript' },
    { text: 'UI/UX: Modern Glassmorphic CSS Design & Lucide Icons' },
    { text: 'Web3 Library: Ethers.js (v6) for blockchain-to-frontend communication' },
    { text: 'Hosting: Deployed live on GitHub Pages' }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 18, color: '363636' });

// Slide 5
let slide5 = pres.addSlide();
slide5.addText('How the Blockchain Backend Works', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide5.addText([
    { text: 'TokenA.sol & TokenB.sol' },
    { text: 'Custom ERC20 tokens compliant with Ethereum standards.', options: { indentLevel: 1 } },
    { text: 'Native mint() function built-in for the decentralized faucet.', options: { indentLevel: 1 } },
    { text: 'SimpleSwap.sol' },
    { text: 'The Liquidity Manager.', options: { indentLevel: 1 } },
    { text: 'Holds the core reserve of tokens (funded by the deployer).', options: { indentLevel: 1 } },
    { text: 'Uses transferFrom logic to execute trustless swaps after checking user approvals.', options: { indentLevel: 1 } }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 18, color: '363636' });

// Slide 6
let slide6 = pres.addSlide();
slide6.addText('The Swap Journey', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide6.addText([
    { text: 'Connect: User connects their MetaMask wallet.' },
    { text: 'Claim: User mints 1,000 free tokens from the smart contract.' },
    { text: 'Approve: User signs an approve() transaction, granting the SimpleSwap contract permission.' },
    { text: 'Swap: User selects the swap amount, signs the swap() transaction, and the smart contract mathematically deducts Token A and returns Token B.' },
    { text: 'Success: Balances update dynamically on the frontend.' }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: { type: 'number' }, fontSize: 18, color: '363636' });

// Slide 7
let slide7 = pres.addSlide();
slide7.addText('Overcoming Web3 Hurdles', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide7.addText([
    { text: 'Challenge: MetaMask returning BAD_DATA parameter errors during approvals.' },
    { text: 'Solution: Identified an incompatibility between MetaMask injection and Ethers.js v6.16. Downgraded to v6.13 to restore seamless transaction signing.', options: { indentLevel: 1 } },
    { text: 'Challenge: Users interacting on the wrong network (e.g., Ethereum Mainnet).' },
    { text: 'Solution: Programmed the frontend to query provider.getNetwork(). If the Chain ID isn\'t 11155111 (Sepolia), MetaMask auto-prompts a network switch.', options: { indentLevel: 1 } },
    { text: 'Challenge: Hardhat ES-Module module resolution.' },
    { text: 'Solution: Re-architected deployment scripts to seamlessly integrate with Typechains and Ethersv6 inside an ESM environment.', options: { indentLevel: 1 } }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 16, color: '363636' });

// Slide 8
let slide8 = pres.addSlide();
slide8.addText('Live Project Demo', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide8.addText([
    { text: '(During this slide, open your live GitHub Pages link)' },
    { text: '1. Let’s connect our wallet...' },
    { text: '2. I will now claim 1000 free tokens...' },
    { text: '3. As you can see, MetaMask pops up to approve the transaction...' },
    { text: '4. Now, let’s swap 100 Token A for Token B...' }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, fontSize: 18, color: '363636' });

// Slide 9
let slide9 = pres.addSlide();
slide9.addText('What\'s Next for DefiCollege?', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide9.addText([
    { text: 'Dynamic Pricing (AMM): Implement constant product formula (x * y = k) for algorithmic real-time pricing instead of a fixed rate.' },
    { text: 'Liquidity Pools: Allow users to deposit their own tokens to earn a percentage of swap fees.' },
    { text: 'Price Oracle: Adding Chainlink price feeds for real-world fiat value tracking.' },
    { text: 'Transaction History: A dedicated dashboard indexing past swaps using The Graph.' }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 18, color: '363636' });

// Slide 10
let slide10 = pres.addSlide();
slide10.addText('Conclusion', { x: 0.5, y: 0.5, w: 9.0, h: 1.0, fontSize: 24, bold: true, color: '1A3B8C' });
slide10.addText([
    { text: 'DefiCollege successfully demonstrates the power of decentralized finance.' },
    { text: 'By bridging React and Solidity, it abstracts complex blockchain mechanics into a seamless, user-friendly interface.' },
    { text: 'Thank You! Any Questions?', options: { bold: true, color: '1A3B8C' } }
], { x: 0.5, y: 1.5, w: 9.0, h: 3.5, bullet: true, fontSize: 20, color: '363636' });

pres.writeFile({ fileName: 'DefiCollege_Presentation.pptx' })
    .then(fileName => {
        console.log(`Created file: ${fileName}`);
    })
    .catch(err => {
        console.error(err);
    });
