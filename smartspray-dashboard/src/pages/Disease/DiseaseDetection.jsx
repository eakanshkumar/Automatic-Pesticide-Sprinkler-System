import React from 'react';
import DiseaseDetection from '../../components/disease/DiseaseDetection';

const DiseaseDetectionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Crop Disease Detection</h1>
        <p className="text-gray-600 mb-8">
          Upload or capture an image of your crops to detect diseases and receive 
          treatment recommendations. Our system will automatically trigger appropriate 
          responses on your farming equipment.
        </p>
        <DiseaseDetection />
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;