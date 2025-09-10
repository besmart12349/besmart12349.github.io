import React, { useContext } from 'react';
import { WifiIcon, BluetoothIcon, BrightnessIcon } from './Icons';
import { MusicContext } from '../contexts/MusicContext';

interface ControlCenterProps {
  visible: boolean;
  onClose: () => void;
  brightness: number;
  onBrightnessChange: (value: number) => void;
  wifiOn: boolean;
  onWifiToggle: () => void;
  bluetoothOn: boolean;
  onBluetoothToggle: () => void;
}

const Slider: React.FC<{ icon: React.ReactNode; value: number; onChange: (value: number) => void }> = ({ icon, value, onChange }) => (
    <div className="flex items-center space-x-2">
        <div className="bg-black/20 dark:bg-white/20 p-1.5 rounded-full">{icon}</div>
        <input
            type="range"
            min="20"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-500/50 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);

const Toggle: React.FC<{ icon: React.ReactNode; label: string; isOn: boolean; onToggle: () => void }> = ({ icon, label, isOn, onToggle }) => (
    <div className="flex items-center space-x-3">
        <button onClick={onToggle} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOn ? 'bg-blue-500 text-white' : 'bg-black/20 dark:bg-white/20'}`}>
            {icon}
        </button>
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{isOn ? 'On' : 'Off'}</p>
        </div>
    </div>
);


const ControlCenter: React.FC<ControlCenterProps> = ({
  visible,
  onClose,
  brightness,
  onBrightnessChange,
  wifiOn,
  onWifiToggle,
  bluetoothOn,
  onBluetoothToggle,
}) => {
  const musicContext = useContext(MusicContext);

  if (!visible) return null;

  return (
    <div
      className="fixed top-8 right-4 w-80 bg-white/50 dark:bg-black/50 backdrop-blur-2xl rounded-2xl shadow-lg p-4 z-[60] text-black dark:text-white animate-fade-in-down"
      onClick={e => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/40 dark:bg-black/40 p-3 rounded-xl">
           <Toggle icon={<WifiIcon className="w-5 h-5"/>} label="Wi-Fi" isOn={wifiOn} onToggle={onWifiToggle} />
        </div>
        <div className="bg-white/40 dark:bg-black/40 p-3 rounded-xl">
           <Toggle icon={<BluetoothIcon className="w-5 h-5"/>} label="Bluetooth" isOn={bluetoothOn} onToggle={onBluetoothToggle} />
        </div>
      </div>
      
      <div className="bg-white/40 dark:bg-black/40 p-3 rounded-xl mb-3">
        <h3 className="font-semibold text-xs mb-2">Display</h3>
        <Slider icon={<BrightnessIcon className="w-4 h-4"/>} value={brightness} onChange={onBrightnessChange} />
      </div>

      {musicContext && (
        <div className="bg-white/40 dark:bg-black/40 p-3 rounded-xl flex items-center space-x-3">
          <div className="w-12 h-12 bg-pink-500 rounded-lg flex-shrink-0"></div>
          <div className="flex-grow overflow-hidden">
            <p className="font-bold truncate">{musicContext.currentTrack.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{musicContext.currentTrack.artist}</p>
          </div>
          <button onClick={musicContext.togglePlayPause} className="text-2xl">
            {musicContext.isPlaying ? '❚❚' : '▶'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlCenter;