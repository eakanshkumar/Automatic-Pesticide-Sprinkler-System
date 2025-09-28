import React, { useState, useRef } from 'react';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { systemService } from '../../services/system';

const ImageUpload = ({ onUploadSuccess, uploadType = 'profile' }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const { user } = useAuth();

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  // Process the selected image
  const processImage = (file) => {
    // Check file type
    if (!file.type.match('image.*')) {
      setMessage({ text: 'Please select an image file', type: 'error' });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: 'File size must be less than 5MB', type: 'error' });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    setMessage({ text: '', type: '' });
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!selectedImage) {
      setMessage({ text: 'Please select an image first', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('image', selectedImage);
    
    // Add metadata based on upload type
    formData.append('uploadType', uploadType);
    if (user && user._id) {
      formData.append('userId', user._id);
    }

    try {
      const data = await systemService.uploadImage(formData);

      if (data.success) {
        setMessage({ text: 'Image uploaded successfully!', type: 'success' });
        setSelectedImage(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Call success callback if provided
        if (onUploadSuccess && data.imageUrl) {
          onUploadSuccess(data.imageUrl, data.imageId);
        }
      } else {
        setMessage({ text: data.message || 'Upload failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Network error. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessage({ 
          text: 'Camera access is not supported in your browser', 
          type: 'error' 
        });
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setMessage({ text: '', type: '' });
    } catch (error) {
      console.error('Camera error:', error);
      setMessage({ 
        text: `Cannot access camera: ${error.message || 'Permission denied'}`,
        type: 'error' 
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    setCameraActive(false);
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        setSelectedImage(file);
        setPreviewUrl(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }, 'image/jpeg', 0.8); // 0.8 quality compression
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage({ text: '', type: '' });
  };

  // Clean up camera stream on component unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [stream]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {uploadType === 'profile' ? 'Upload Profile Image' : 'Upload Image'}
      </h2>
      
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mb-6 hover:border-green-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !cameraActive && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-md object-contain"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(); }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : cameraActive ? (
          <div className="relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-48 object-cover rounded-md bg-black"
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); captureImage(); }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <CameraIcon className="h-5 w-5 mr-2" />
                Capture Image
              </button>
            </div>
          </div>
        ) : (
          <>
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop an image here, or click to select a file
            </p>
          </>
        )}
      </div>

      {/* Camera Controls */}
      <div className="flex justify-center mb-6">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            disabled={cameraActive}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors disabled:opacity-50"
          >
            <CameraIcon className="h-5 w-5 mr-2" />
            Use Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Stop Camera
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="text-center">
        <button
          onClick={uploadImage}
          disabled={isLoading || !selectedImage}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mt-4 p-3 rounded-md text-center ${
          message.type === 'error' 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-500">
        <p className="font-semibold">Supported formats: JPG, JPEG, PNG, GIF</p>
        <p>Maximum file size: 5MB</p>
        {uploadType === 'profile' && (
          <p className="mt-1 text-xs">Recommended: Square image, at least 200×200 pixels</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;