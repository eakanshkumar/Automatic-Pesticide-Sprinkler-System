import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CROP_TYPES } from '../../utils/constants';
import FormInput from '../common/FormInput';
import ImageUpload from '../common/ImageUpload';

const FarmForm = ({ initialData, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      size: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
      },
      crops: [],
      images: [],
    },
  });

  const [uploadedImages, setUploadedImages] = useState(initialData?.images || []);
  const selectedCrops = watch('crops') || [];

  const handleCropToggle = (crop, onChange) => {
    const newCrops = selectedCrops.includes(crop)
      ? selectedCrops.filter(c => c !== crop)
      : [...selectedCrops, crop];
    
    onChange(newCrops);
  };

  const handleImageUploadSuccess = (imageUrl, imageId) => {
    const newImage = {
      url: imageUrl,
      cloudinaryId: imageId,
      uploadedAt: new Date().toISOString()
    };
    
    const updatedImages = [...uploadedImages, newImage];
    setUploadedImages(updatedImages);
    setValue('images', updatedImages);
  };

  const removeImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setValue('images', updatedImages);
  };

  const handleFormSubmit = (data) => {
    // Ensure images array is included in the submitted data
    const formData = {
      ...data,
      images: uploadedImages
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormInput
        label="Farm Name"
        {...register('name', { required: 'Farm name is required' })}
        error={errors.name?.message}
        placeholder="Enter farm name"
      />

      <FormInput
        label="Farm Size (hectares)"
        type="number"
        step="0.1"
        {...register('size', {
          required: 'Farm size is required',
          min: { value: 0.1, message: 'Minimum size is 0.1 hectares' },
        })}
        error={errors.size?.message}
        placeholder="Enter farm size"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Address"
          {...register('location.address', { required: 'Address is required' })}
          error={errors.location?.address?.message}
          placeholder="Street address"
        />

        <FormInput
          label="City"
          {...register('location.city', { required: 'City is required' })}
          error={errors.location?.city?.message}
          placeholder="City"
        />

        <FormInput
          label="State/Province"
          {...register('location.state', { required: 'State/Province is required' })}
          error={errors.location?.state?.message}
          placeholder="State or province"
        />

        <FormInput
          label="Country"
          {...register('location.country', { required: 'Country is required' })}
          error={errors.location?.country?.message}
          placeholder="Country"
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Farm Images
        </label>
        <div className="mb-4">
          <ImageUpload 
            uploadType="farm"
            onUploadSuccess={handleImageUploadSuccess}
          />
        </div>
        
        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Farm image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Crops Grown
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CROP_TYPES.map((crop) => (
            <label key={crop} className="flex items-center">
              <input
                type="checkbox"
                value={crop}
                checked={selectedCrops.includes(crop)}
                onChange={(e) => {
                  handleCropToggle(crop, (newCrops) => {
                    register('crops').onChange({
                      target: {
                        name: 'crops',
                        value: newCrops,
                      },
                    });
                  });
                }}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{crop}</span>
            </label>
          ))}
        </div>
        {errors.crops && (
          <p className="mt-1 text-sm text-red-600">{errors.crops.message}</p>
        )}
      </div>

      {/* Additional Farm Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Farm Description (Optional)
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe your farm, soil type, irrigation methods, etc."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update Farm' : 'Create Farm'}
        </button>
      </div>
    </form>
  );
};

export default FarmForm;