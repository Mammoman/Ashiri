import React, { useState } from 'react';

const ImageWithSkeleton = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <>
      {!isLoaded && (
        <div 
          className="shimmer-bg" 
          style={{ 
            ...style, 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 1, 
            margin: 0,
            padding: 0 
          }} 
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 2,
          position: style?.position || 'relative'
        }}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
};

export default ImageWithSkeleton;
