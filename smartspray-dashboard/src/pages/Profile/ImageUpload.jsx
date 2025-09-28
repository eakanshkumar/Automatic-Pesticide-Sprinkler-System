import React from 'react';
import ImageUpload from '../../components/common/ImageUpload';

const ProfileImageUpload = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Profile Image</h1>
        <ImageUpload />
      </div>
    </div>
  );
};

export default ProfileImageUpload;