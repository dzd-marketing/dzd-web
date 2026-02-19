import React, { useState, useEffect } from 'react';

interface WhatsAppPopupProps {
  whatsappLink: string;
}

const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({ whatsappLink }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6 * 60); // 6 minutes in seconds

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('whatsapp_popup_seen_today');
    const today = new Date().toDateString();
    
    if (hasVisited !== today) {
      // Get popup count for today
      const popupCount = parseInt(localStorage.getItem('whatsapp_popup_count') || '0');
      
      if (popupCount < 3) {
        // Show popup after 2 seconds
        const timer = setTimeout(() => {
          setIsVisible(true);
          startTimer();
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    setIsClosing(true);
    
    // Update popup count
    const currentCount = parseInt(localStorage.getItem('whatsapp_popup_count') || '0');
    localStorage.setItem('whatsapp_popup_count', (currentCount + 1).toString());
    localStorage.setItem('whatsapp_popup_seen_today', new Date().toDateString());
    
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(100%) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(37, 211, 102, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(37, 211, 102, 0.6);
          }
        }
        
        .whatsapp-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .whatsapp-popup-card {
          max-width: 400px;
          width: 90%;
          margin: 20px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d1a3a 100%);
          border-radius: 32px;
          padding: 32px;
          position: relative;
          border: 1px solid rgba(37, 211, 102, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: ${isClosing ? 'slideOut 0.3s ease-in forwards' : 'slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'};
        }
        
        .whatsapp-popup-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 32px;
          padding: 2px;
          background: linear-gradient(135deg, #25d366, #128C7E);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          backdrop-filter: blur(4px);
        }
        
        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
          border-color: #25d366;
        }
        
        .whatsapp-icon-container {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #25d366, #128C7E);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite, glow 2s infinite;
        }
        
        .whatsapp-icon {
          width: 48px;
          height: 48px;
          color: white;
        }
        
        .popup-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 12px;
          background: linear-gradient(to right, #25d366, #128C7E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .popup-description {
          text-align: center;
          color: #a0a0a0;
          margin-bottom: 24px;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .timer-container {
          background: rgba(37, 211, 102, 0.1);
          border-radius: 50px;
          padding: 8px 16px;
          margin-bottom: 24px;
          text-align: center;
          border: 1px solid rgba(37, 211, 102, 0.2);
        }
        
        .timer-label {
          color: #a0a0a0;
          font-size: 14px;
          margin-right: 8px;
        }
        
        .timer-value {
          color: #25d366;
          font-weight: 600;
          font-size: 18px;
          font-family: monospace;
        }
        
        .join-button {
          display: block;
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #25d366, #128C7E);
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 18px;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        
        .join-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .join-button:hover::before {
          left: 100%;
        }
        
        .join-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -5px rgba(37, 211, 102, 0.5);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }
        
        .feature-item {
          text-align: center;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .feature-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }
        
        .feature-text {
          font-size: 12px;
          color: #a0a0a0;
        }
        
        .limited-offer {
          background: rgba(37, 211, 102, 0.15);
          border: 1px dashed #25d366;
          border-radius: 12px;
          padding: 10px;
          margin-top: 16px;
          text-align: center;
          font-size: 13px;
          color: #25d366;
          animation: pulse 2s infinite;
        }
      `}</style>

      <div className="whatsapp-popup-overlay" onClick={handleClose}>
        <div className="whatsapp-popup-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={handleClose}>×</button>
          
          <div className="whatsapp-icon-container">
            <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.077,4.928C17.191,3.041,14.683,2,12.006,2c-5.349,0-9.703,4.352-9.706,9.7c-0.001,1.703,0.444,3.371,1.286,4.846 L2,22l5.386-1.521c1.416,0.79,3.01,1.206,4.618,1.207h0.004c5.347,0,9.702-4.353,9.705-9.701C22,7.333,20.964,4.815,19.077,4.928z M16.661,15.278c-0.212,0.596-1.055,1.089-1.723,1.179c-0.444,0.06-1.002,0.106-2.886-0.622c-2.04-0.789-3.359-2.742-3.461-2.868c-0.102-0.126-0.826-1.099-0.826-2.096c0-0.997,0.521-1.487,0.705-1.69c0.184-0.203,0.402-0.254,0.535-0.254c0.133,0,0.266,0,0.381,0.007c0.122,0.006,0.286-0.046,0.447,0.342c0.167,0.402,0.569,1.389,0.619,1.49c0.05,0.101,0.083,0.22,0.017,0.354c-0.066,0.134-0.099,0.217-0.198,0.334c-0.099,0.117-0.208,0.262-0.298,0.352c-0.099,0.094-0.202,0.195-0.087,0.383c0.115,0.188,0.512,0.846,1.099,1.371c0.754,0.674,1.391,0.883,1.589,0.982c0.198,0.099,0.313,0.082,0.428-0.049c0.115-0.131,0.494-0.577,0.626-0.775c0.132-0.198,0.264-0.165,0.447-0.099c0.183,0.066,1.162,0.548,1.362,0.648c0.2,0.099,0.333,0.149,0.382,0.231C16.856,14.215,16.873,14.682,16.661,15.278z"/>
            </svg>
          </div>
          
          <h2 className="popup-title">Join WhatsApp Channel</h2>
          <p className="popup-description">
            Get instant updates, exclusive offers, and 24/7 support directly on WhatsApp!
          </p>
          
          <div className="timer-container">
            <span className="timer-label">Popup closes in:</span>
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="join-button"
            onClick={handleClose}
          >
            Join Now 🚀
          </a>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">Instant Updates</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <div className="feature-text">24/7 Support</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎁</div>
              <div className="feature-text">Exclusive Offers</div>
            </div>
          </div>
          
          <div className="limited-offer">
            ⏰ Limited time offer • Join today and get 20% off on first order!
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppPopup;
