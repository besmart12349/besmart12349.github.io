import React, { useState } from 'react';
import { useSecurity } from '../contexts/SecurityContext';

const NetworkInfo: React.FC = () => {
    const { proxy } = useSecurity();
    const [publicIp, setPublicIp] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkIp = async () => {
        setIsLoading(true);
        setError(null);
        setPublicIp(null);
        try {
            // Use the current proxy to fetch the IP
            const response = await fetch(`${proxy.url}https://api.ipify.org?format=json`);
            if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
            const data = await response.json();
            setPublicIp(data.ip);
        } catch (e) {
            console.error("IP Check error:", e);
            setError("Could not retrieve IP.");
        } finally {
            setIsLoading(false);
        }
    };

    const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
            <span className="text-gray-400">{label}</span>
            <span className="font-semibold text-right">{value}</span>
        </div>
    );

    return (
        <div className="w-full h-full bg-gray-800 text-white p-4 font-sans flex flex-col">
            <header className="text-center pb-3 border-b border-gray-700 mb-3">
                <h1 className="text-xl font-bold">Network Information</h1>
                <p className="text-sm text-gray-400">Live network status</p>
            </header>
            <div className="space-y-2">
                <InfoRow label="Active Proxy" value={proxy.name} />
                <InfoRow label="Public IP Address" value={
                    isLoading ? 'Checking...' : error ? <span className="text-red-400">{error}</span> : publicIp || 'N/A'
                } />
            </div>
            <button 
                onClick={checkIp}
                disabled={isLoading}
                className="mt-auto w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-600 transition-colors"
            >
                {isLoading ? 'Checking...' : 'Check Public IP'}
            </button>
        </div>
    );
}

export default NetworkInfo;
