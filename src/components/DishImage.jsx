import { useState } from 'react';

function DishImage({ src, alt, name }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="dish-image image-fallback" role="img" aria-label={`No photo yet for ${name}`}>
        Photo coming soon
      </div>
    );
  }

  return <img className="dish-image" src={src} alt={alt} onError={() => setFailed(true)} />;
}

export default DishImage;
