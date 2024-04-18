"use client"
import React, { useEffect, useState } from 'react';

interface PopupProps {
  onClose: () => void; // Function to close the popup
  isPopupVisible:boolean;
  message1:string;
  message2:string;
}

const PopupComponent: React.FC<PopupProps> = ({ onClose,isPopupVisible,message1,message2 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to close the popup
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };
  useEffect(()=>{
    setIsVisible(isPopupVisible);
  },[isPopupVisible,message1,message2]);

  // Render the popup if it is visible
  return isVisible ? (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className='text-4xl font-bold'>{message1}</h2>
        <p className='text-xl font-normal mt-4'>{message2}</p>
        <button className='rounded border border-white p-px px-2 text-xl mt-8' onClick={handleClose}>Close</button>
      </div>
    </div>
  ) : null;
};

export default PopupComponent;
