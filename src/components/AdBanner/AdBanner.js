import React, { useEffect } from 'react';
import './AdBanner.css';

const AdBanner = ({ format = 'auto', className = '' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <div className="ad-label">Advertisement</div>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-3390302526393146"
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdBanner;
