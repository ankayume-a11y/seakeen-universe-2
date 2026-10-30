import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

interface StatusBarProps {
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ dark = false }) => {
  const [time, setTime] = useState('23:20');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const textColor = dark ? 'text-black' : 'text-white';

  return (
    <div className={`h-11 w-full px-7 flex items-center justify-between text-xs font-semibold z-40 relative select-none ${textColor} drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
      {/* Time */}
      <div className="w-16 font-medium tracking-tight text-[13px]">{time}</div>

      {/* Center gap for Dynamic Island */}
      <div className="flex-1" />

      {/* Right icons: Signal, 5G, Wifi, Battery */}
      <div className="flex items-center gap-1.5 text-[11px]">
        <SignalHigh className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="text-[10px] font-bold tracking-tighter">5G</span>
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold">98%</span>
          <div className="w-5 h-2.5 rounded-[4px] border border-current p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-current rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
