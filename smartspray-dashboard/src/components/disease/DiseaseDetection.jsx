import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { diseaseService } from '../../services/diseaseService';
import { esp32Service } from '../../services/esp32Service';

const DiseaseDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [detectionResult, setDetectionResult] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null);

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            processImage(file);
        }
    };

    // Process the selected image
    const processImage = (file) => {
        if (!file.type.match('image.*')) {
            setMessage({ text: 'Please select an image file', type: 'error' });
            return;
        }

        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
        setMessage({ text: '', type: '' });
        setDetectionResult(null);
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

    // Analyze image with ML model
    const analyzeImage = async () => {
        if (!selectedImage) {
            setMessage({ text: 'Please select an image first', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: '' });
        setDetectionResult(null);

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            // Send to your ML API
            const result = await diseaseService.analyzeDisease(formData);

            setDetectionResult(result);
            setMessage({
                text: 'Analysis completed successfully!',
                type: 'success',
            });

            // Trigger actions based on disease type and severity
            handleDiseaseActions(result);
        } catch (error) {
            setMessage({
                text:
                    error.response?.data?.message ||
                    'Analysis failed. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle actions based on disease detection
    const handleDiseaseActions = (result) => {
        const { diseaseType, infectionLevel } = result;

        if (infectionLevel === 'severe') {
            esp32Service.triggerAction('urgent_spray');
            setMessage((prev) => ({
                ...prev,
                text: `${prev.text} Severe infection detected! Triggering emergency treatment.`,
            }));
        } else if (['moderate', 'severe'].includes(infectionLevel)) {
            esp32Service.triggerAction('schedule_spray');
        }

        if (diseaseType === 'powdery_mildew') {
            esp32Service.triggerAction('adjust_moisture');
        } else if (diseaseType === 'leaf_rust') {
            esp32Service.triggerAction('increase_ventilation');
        }
    };

    // Start camera
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            setStream(mediaStream);
            setCameraActive(true);
        } catch (error) {
            setMessage({ text: 'Cannot access camera: ' + error.message, type: 'error' });
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    // Attach stream to video when available
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(() => { });
            };
        }
    }, [stream]);

    // Capture image from camera
    const captureImage = () => {
        if (videoRef.current && videoRef.current.videoWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const file = new File([blob], 'camera-capture.jpg', {
                            type: 'image/jpeg',
                        });
                        setSelectedImage(file);
                        setPreviewUrl(canvas.toDataURL('image/jpeg'));
                        stopCamera();
                    } else {
                        setMessage({ text: 'Failed to capture image. Try again.', type: 'error' });
                    }
                },
                'image/jpeg',
                0.95
            );
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
        setDetectionResult(null);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Crop Disease Detection</h2>

            {/* Upload / Camera Area */}
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
                            className="max-h-64 mx-auto rounded-md"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
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
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    captureImage();
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
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
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <CameraIcon className="h-5 w-5 mr-2" />
                        Use Camera
                    </button>
                ) : (
                    <button
                        onClick={stopCamera}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                        Stop Camera
                    </button>
                )}
            </div>

            {/* Analyze Button */}
            <div className="text-center mb-6">
                <button
                    onClick={analyzeImage}
                    disabled={isLoading || !selectedImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Disease'}
                </button>
            </div>

            {/* Detection Results */}
            {detectionResult && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <span className="font-medium">Disease:</span>
                            <span className="ml-2 capitalize">
                                {detectionResult?.diseaseType
                                    ? detectionResult.diseaseType.replace(/_/g, ' ')
                                    : 'Unknown'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Infection Level:</span>
                            <span
                                className={`ml-2 font-bold ${detectionResult?.infectionLevel === 'severe'
                                        ? 'text-red-600'
                                        : detectionResult?.infectionLevel === 'moderate'
                                            ? 'text-orange-600'
                                            : 'text-green-600'
                                    }`}
                            >
                                {detectionResult?.infectionLevel || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Confidence:</span>
                            <span className="ml-2">
                                {detectionResult?.confidence
                                    ? `${(detectionResult.confidence * 100).toFixed(1)}%`
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>


                    {/* Treatment Recommendations */}
                    <div className="mt-4">
                        <h4 className="font-medium mb-2">Recommended Actions:</h4>
                        <ul className="list-disc list-inside text-sm">
                            {detectionResult.infectionLevel === 'severe' && (
                                <li className="text-red-600">Immediate treatment required</li>
                            )}
                            {detectionResult.infectionLevel === 'moderate' && (
                                <li>Schedule treatment within 48 hours</li>
                            )}
                            {detectionResult.infectionLevel === 'mild' && (
                                <li>Monitor closely and treat if condition worsens</li>
                            )}

                            {detectionResult.diseaseType === 'powdery_mildew' && (
                                <li>Apply sulfur-based fungicide</li>
                            )}
                            {detectionResult.diseaseType === 'leaf_rust' && (
                                <li>Apply copper-based fungicide</li>
                            )}
                            {detectionResult.diseaseType === 'blight' && (
                                <li>Remove affected leaves and apply appropriate fungicide</li>
                            )}
                        </ul>
                    </div>

                    {detectionResult.esp32Action && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <span className="font-medium">Device Control: </span>
                                {detectionResult.esp32Action}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Message Display */}
            {message.text && (
                <div
                    className={`mt-4 p-3 rounded-md text-center ${message.type === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Instructions */}
            <div className="mt-6 text-sm text-gray-500">
                <p className="font-semibold">
                    Capture a clear image of plant leaves for accurate disease detection
                </p>
                <p>Supported formats: JPG, JPEG, PNG</p>
            </div>
        </div>
    );
};

export default DiseaseDetection;
