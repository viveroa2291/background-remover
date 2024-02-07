import React, { useState } from 'react';
import './CSS/imageUploader.css';
const ImageUploader = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const makeBackgroundTransparent = () => {
    const img = new Image();
    img.src = image;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Define the color to make transparent (e.g., white)
    const targetColor = [255, 255, 255]; // [R, G, B]

    for (let i = 0; i < data.length; i += 4) {
      // Calculate the Euclidean distance between the target color and the current pixel color
      const distance = Math.sqrt(
        Math.pow(data[i] - targetColor[0], 2) +
        Math.pow(data[i + 1] - targetColor[1], 2) +
        Math.pow(data[i + 2] - targetColor[2], 2)
      );

      // Define a threshold distance (adjust as needed)
      const threshold = 50;

      // Check if the current pixel is close to the target color
      if (distance < threshold) {
        // Make the pixel transparent
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to data URL and set it as the new image
    const newImage = canvas.toDataURL('image/png');
    setImage(newImage);

    // Create a temporary link element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = newImage;
    downloadLink.download = 'transparent_logo.png';

    // Append the link to the document and trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the link from the document
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div>
          <img className='image-preview' src={image} alt="Uploaded" />
          <button onClick={makeBackgroundTransparent}>Make Background Transparent</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

