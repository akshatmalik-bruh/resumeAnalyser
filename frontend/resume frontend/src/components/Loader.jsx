import React from 'react';

const Loader = ({ text = "Processing", fullPage = true }) => {
  const content = (
    <div className={fullPage ? "loader-overlay" : "loader-inline"}>
      <div className="cyber-load-box">
        <div className="load-ring"></div>
        <div className="load-scan"></div>
        <div className="load-pulse"></div>
      </div>
      <div className="load-text">{text}...</div>
    </div>
  );


  return content;
};

export default Loader;
