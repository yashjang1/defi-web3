import { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { ethers } from 'ethers';
import contracts from '../contracts.json';

interface SwapProps {
    account?: string;
}

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function mint() public"
];

const SWAP_ABI = [
    "function swapAforB(uint amount) public",
    "function swapBforA(uint amount) public"
];

export default function Swap({ account }: SwapProps) {
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isReversed, setIsReversed] = useState(false);

    const toggleReverse = () => {
        setIsReversed(!isReversed);
        setTokenA('');
        setTokenB('');
    };

    const handleInputChange = (value: string) => {
        setTokenA(value);
        if (!value || isNaN(Number(value))) {
            setTokenB('');
        } else {
            // Mock exchange rate 1 A = 0.98 B
            if (isReversed) {
                setTokenB((parseFloat(value) / 0.98).toFixed(4));
            } else {
                setTokenB((parseFloat(value) * 0.98).toFixed(4));
            }
        }
    };

    const handleMint = async () => {
        if (!account) {
            alert("Please connect your wallet first!");
            return;
        }
        setIsMinting(true);
        try {
            let provider = new ethers.BrowserProvider((window as any).ethereum);

            // 🛡️ Verify Sepolia Network (Chain ID: 11155111)
            const network = await provider.getNetwork();
            if (network.chainId !== 11155111n) {
                try {
                    await (window as any).ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }],
                    });
                    provider = new ethers.BrowserProvider((window as any).ethereum);
                } catch (e) {
                    alert("⚠️ Please switch your wallet to the Sepolia Testnet!");
                    setIsMinting(false);
                    return;
                }
            }

            const signer = await provider.getSigner();

            const tokenAContract = new ethers.Contract(contracts.TokenA, ERC20_ABI, signer);
            const tokenBContract = new ethers.Contract(contracts.TokenB, ERC20_ABI, signer);

            const txA = await tokenAContract.mint();
            await txA.wait();

            const txB = await tokenBContract.mint();
            await txB.wait();

            alert(`✅ Successfully minted A and B!`);
        } catch (error: any) {
            console.error(error);
            alert(`Minting failed: ${error.message || "Does your token contract have a public mint() function?"}`);
        }
        setIsMinting(false);
    };

    const addTokenToWallet = async (address: string, symbol: string) => {
        if (typeof window !== 'undefined' && 'ethereum' in window) {
            try {
                await (window as any).ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: address,
                            symbol: symbol,
                            decimals: 18,
                        },
                    },
                });
            } catch (error) {
                console.error("Error adding token to wallet", error);
            }
        } else {
            alert("MetaMask is not installed!");
        }
    };

    const handleSwap = async () => {
        if (!account) {
            alert("Please connect your wallet first!");
            return;
        }
        if (!tokenA || parseFloat(tokenA) <= 0) return;

        setIsSwapping(true);
        try {
            let provider = new ethers.BrowserProvider((window as any).ethereum);

            // 🛡️ Verify Sepolia Network (Chain ID: 11155111)
            const network = await provider.getNetwork();
            if (network.chainId !== 11155111n) {
                try {
                    await (window as any).ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }],
                    });
                    provider = new ethers.BrowserProvider((window as any).ethereum);
                } catch (e) {
                    alert("⚠️ Please switch your wallet to the Sepolia Testnet!");
                    setIsSwapping(false);
                    return;
                }
            }

            const signer = await provider.getSigner();

            const amountIn = ethers.parseUnits(tokenA, 18);
            const swapAddress = contracts.SimpleAMM;
            const swapContract = new ethers.Contract(swapAddress, SWAP_ABI, signer);

            const tokenAddress = isReversed ? contracts.TokenB : contracts.TokenA;
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

            // 1. Check Allowance
            const allowance = await tokenContract.allowance(account, swapAddress);
            if (allowance < amountIn) {
                console.log("Approving token...");
                const approveTx = await tokenContract.approve(swapAddress, ethers.MaxUint256);
                await approveTx.wait();
            }

            // 2. Perform Swap
            console.log("Swapping...");
            let swapTx;
            if (isReversed) {
                swapTx = await swapContract.swapBforA(amountIn);
            } else {
                swapTx = await swapContract.swapAforB(amountIn);
            }
            await swapTx.wait();

            alert(`✅ Successfully swapped ${tokenA} ${isReversed ? 'B' : 'A'} for ${tokenB} ${isReversed ? 'A' : 'B'}!`);
            setTokenA('');
            setTokenB('');
        } catch (error: any) {
            console.error("Swap Error:", error);
            alert(`Swap failed: ${error.message}`);
        }
        setIsSwapping(false);
    };

    // Determine button state
    let buttonText = "Enter an amount";
    let isButtonDisabled = true;

    if (!account) {
        buttonText = "Connect Wallet First";
    } else if (isSwapping) {
        buttonText = "Swapping...";
    } else if (tokenA && parseFloat(tokenA) > 0) {
        buttonText = "Swap Tokens";
        isButtonDisabled = false;
    }

    return (
        <div style={{ maxWidth: '440px', margin: '4rem auto' }}>
            <h1 className="title">Swap Tokens</h1>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>You Pay</label>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', padding: '12px', border: '1px solid transparent', transition: 'border-color 0.2s', ...(tokenA ? { borderColor: 'rgba(99, 102, 241, 0.5)' } : {}) }}>
                        <input
                            type="number"
                            className="input-field"
                            style={{ flex: 1, background: 'transparent', border: 'none', padding: '0', fontSize: '1.5rem', outline: 'none' }}
                            placeholder="0.0"
                            value={tokenA}
                            onChange={(e) => handleInputChange(e.target.value)}
                        />
                        <button className="glass-panel" style={{ border: 'none', padding: '8px 16px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{isReversed ? 'B' : 'A'}</button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                    <div className="glass-panel" onClick={toggleReverse} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', transition: 'transform 0.3s ease', ...(tokenA ? { transform: 'rotate(180deg)' } : {}) }}>
                        <ArrowDown size={20} color="#a78bfa" />
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>You Receive</label>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', padding: '12px', opacity: 0.8 }}>
                        <input
                            type="number"
                            className="input-field"
                            readOnly
                            style={{ flex: 1, background: 'transparent', border: 'none', padding: '0', fontSize: '1.5rem', color: '#e2e8f0', outline: 'none' }}
                            placeholder="0.0"
                            value={tokenB}
                        />
                        <button className="glass-panel" style={{ border: 'none', padding: '8px 16px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{isReversed ? 'A' : 'B'}</button>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    style={{
                        width: '100%',
                        fontSize: '1.2rem',
                        padding: '16px',
                        opacity: isButtonDisabled && account ? 0.5 : 1,
                        cursor: isButtonDisabled && account ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
                    onClick={handleSwap}
                    disabled={isButtonDisabled && !!account}
                >
                    {isSwapping && <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>}
                    {buttonText}
                </button>
            </div>

            {account && (
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontSize: '0.9rem', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '20px', width: 'fit-content', margin: '1.5rem auto 0' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></div>
                    Wallet {account.substring(0, 6)}... Connected
                </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                <p>1 A ≈ 0.98 B (Mock Rate)</p>
                {account && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={handleMint}
                            disabled={isMinting}
                            className="btn-primary"
                            style={{ background: 'transparent', border: '1px solid #a78bfa', color: '#a78bfa', padding: '8px 16px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            {isMinting && <div style={{ width: '14px', height: '14px', border: '2px solid #a78bfa', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>}
                            Claim 1000 Free A & B
                        </button>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', marginTop: '8px' }}>
                            <button className="glass-panel" onClick={() => addTokenToWallet(contracts.TokenA, "A")} style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                + Add 'A' to Wallet
                            </button>
                            <button className="glass-panel" onClick={() => addTokenToWallet(contracts.TokenB, "B")} style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                + Add 'B' to Wallet
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
