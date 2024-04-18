"use client"
import { useEffect } from 'react';

import { useStopwatch } from 'react-timer-hook';
interface TimerComponentProps {
    onStart: boolean;
    onPause: boolean;
    onReset: boolean;
}

function TimerComponent({ onStart, onPause, onReset }: TimerComponentProps) {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
      } = useStopwatch({ autoStart: false});
  
    const padNumber = (number:number) => {
    
        return String(number).padStart(2, '0');
      };
    useEffect(()=>{
        if(onStart){
            start();
        }else if(onPause){
            pause();
        }else if(onReset){
            reset();
        }
    },[onStart,onPause,onReset]);
    
  return (
    <div className="text-center">
        <div className="text-xl font-light">
            <span>{padNumber(minutes)}</span>:<span>{padNumber(seconds)}</span>
        </div>
    </div>
  );
}

export default TimerComponent;
