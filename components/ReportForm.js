'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getContract } from '../utils/web3';
import { uploadToIPFS, uploadToPublicIPFS } from '../utils/ipfs';

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setSelectedFile(acceptedFiles[0]);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload image to IPFS
      setUploadProgress(25);
      const imageResult = await uploadToIPFS(selectedFile);
      
      setUploadProgress(50);
      
      // Create metadata
      const metadata = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        imageHash: imageResult.cid,
        timestamp: Date.now(),
        reporter: 'anonymous' // Will be replaced with actual address
      };

      // Upload metadata to IPFS
      const metadataResult = await uploadToPublicIPFS(metadata);
      
      setUploadProgress(75);

      // Submit to blockchain
      const contract = getContract();
      const tx = await contract.submitReport(
        formData.title,
        formData.description,
        formData.location,
        imageResult.cid,
        metadataResult.cid
      );

      await tx.wait();
      setUploadProgress(100);

      // Reset form
      setFormData({ title: '', description: '', location: '' });
      setSelectedFile(null);
      
      alert('Report submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Crisis Report</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Report Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="input-field"
            placeholder="Brief title describing the crisis situation"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="input-field"
            placeholder="Detailed description of the crisis situation, people affected, immediate needs..."
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="input-field"
            placeholder="City, State, Country or specific coordinates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image *
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-crisis-red bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <div>
                <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="mt-2 max-h-32 mx-auto rounded"
                />
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, GIF</p>
              </div>
            )}
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-crisis-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
} 