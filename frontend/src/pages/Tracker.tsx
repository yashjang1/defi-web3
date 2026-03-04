import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface Coin {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    image: string;
}

export default function Tracker() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoins = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
            const data = await response.json();
            setCoins(data);
        } catch (error) {
            console.error('Failed to fetch coins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoins();
        const interval = setInterval(fetchCoins, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="title">Market Tracker</h1>
                <button onClick={fetchCoins} className="glass-panel" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                    <RefreshCw size={20} className={loading ? 'spinning' : ''} />
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                            <th style={{ padding: '16px 24px', fontWeight: '500' }}>Asset</th>
                            <th style={{ padding: '16px 24px', fontWeight: '500' }}>Price</th>
                            <th style={{ padding: '16px 24px', fontWeight: '500' }}>24h Change</th>
                            <th style={{ padding: '16px 24px', fontWeight: '500', textAlign: 'right' }}>Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && coins.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading market data...</td></tr>
                        ) : (
                            coins.map((coin) => (
                                <tr key={coin.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={coin.image} alt={coin.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{coin.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>{coin.symbol}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>
                                        ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                    </td>
                                    <td style={{ padding: '16px 24px', color: coin.price_change_percentage_24h > 0 ? '#10b981' : '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {coin.price_change_percentage_24h > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right', color: '#cbd5e1' }}>
                                        ${coin.market_cap.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
