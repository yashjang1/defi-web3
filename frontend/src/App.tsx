import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Swap from './pages/Swap';
import Tracker from './pages/Tracker';
import { LayoutDashboard, ArrowLeftRight, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const checkConnection = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
      }
    }
  };

  useEffect(() => {
    checkConnection();

    if (typeof (window as any).ethereum !== 'undefined') {
      ((window as any).ethereum).on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("User rejected request", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet to use this feature!");
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
      <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #6366f1, #a855f7)' }}></div>
          DefiCollege
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
            <ArrowLeftRight size={20} />
            Swap
          </Link>
          <Link to="/tracker" style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
            <LayoutDashboard size={20} />
            Coin Tracker
          </Link>
        </div>
        <div>
          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={connectWallet}
          >
            <Wallet size={16} />
            {isConnecting ? "Connecting..." : account ? formatAddress(account) : "Connect Wallet"}
          </button>
        </div>
      </nav>

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Swap account={account} />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        &copy; {new Date().getFullYear()} DefiCollege. All rights reserved.
      </footer>
    </>
  );
}

export default App;
