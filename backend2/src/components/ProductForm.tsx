import React, { useState } from 'react';
import { Product, ProductFeatures, ProductSize } from '../types';
import Compressor from 'compressorjs';
import { X, Upload, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, onCancel }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Lifestyle');
  const [price, setPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [details, setDetails] = useState('');
  const [features, setFeatures] = useState<ProductFeatures>({
    cashOnDelivery: false,
    lowestPrice: false,
    fiveDayReturns: false,
    freeDelivery: false,
  });
  const [size, setSize] = useState<ProductSize>({
    US7: false,
    US8: false,
    US9: false,
    US10: false,
    US11: false,
    US12: false,
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const compressImages = (images: File[]) => {
    return Promise.all(
      images.map(image => {
        return new Promise((resolve, reject) => {
          new Compressor(image, {
            quality: 0.6,
            success(result) {
              resolve({
                url: URL.createObjectURL(result),
                file: result
              });
            },
            error(err) {
              reject(err);
            }
          });
        });
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }

    try {
      const compressedImages = await compressImages(images);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('sellingPrice', sellingPrice);
      formData.append('details', details);
      formData.append('features', JSON.stringify(features));
      formData.append('size', JSON.stringify(size));

      compressedImages.forEach((image: any) => {
        formData.append('images', image.file);
      });

      const response = await fetch('http://localhost:5000/api/product/uploadProduct', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Product uploaded successfully');
        onAddProduct(result);
        onCancel();
      } else {
        toast.error('Failed to upload product');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while uploading the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureChange = (feature: keyof ProductFeatures, value: boolean) => {
    setFeatures(prevFeatures => ({
      ...prevFeatures,
      [feature]: value,
    }));
  };

  const handleSizeChange = (size: keyof ProductSize, value: boolean) => {
    setSize(prevSize => ({
      ...prevSize,
      [size]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Upload New Product</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Images (Max 5)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-gray-400 mx-auto" />
                      <span className="text-sm text-gray-500 mt-2">Add Image</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Two Column Layout for Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Airmax">Airmax</option>
                    <option value="Running">Running</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Details
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Features
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(features).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleFeatureChange(key as keyof ProductFeatures, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(size).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSizeChange(key as keyof ProductSize, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed at Bottom */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Uploading...' : 'Upload Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;