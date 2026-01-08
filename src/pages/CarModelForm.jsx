import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import carModelApi from '../api/carModelApi';

const CarModelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    car_class: '',
    model_name: '',
    model_code: '',
    description: '',
    features: '',
    price: '',
    date_of_manufacturing: '',
    is_active: true,
    sort_order: 0
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [errors, setErrors] = useState({});

  const brandOptions = [
    { value: 'Audi', label: 'Audi' },
    { value: 'Jaguar', label: 'Jaguar' },
    { value: 'Land Rover', label: 'Land Rover' },
    { value: 'Renault', label: 'Renault' }
  ];

  const classOptions = [
    { value: 'A-Class', label: 'A-Class' },
    { value: 'B-Class', label: 'B-Class' },
    { value: 'C-Class', label: 'C-Class' }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchCarModel();
    }
  }, [id]);

  const fetchCarModel = async () => {
    try {
      const response = await carModelApi.getById(id);
      const model = response.data;
      
      setFormData({
        brand: model.brand || '',
        car_class: model.carClass || '',
        model_name: model.modelName || '',
        model_code: model.modelCode || '',
        description: model.description || '',
        features: model.features || '',
        price: model.price?.toString() || '',
        date_of_manufacturing: model.dateOfManufacturing 
          ? new Date(model.dateOfManufacturing).toISOString().slice(0, 16)
          : '',
        is_active: model.isActive ?? true,
        sort_order: model.sortOrder || 0
      });
      
      setExistingImages(model.images || []);
    } catch (error) {
      toast.error('Failed to load car model');
      navigate('/car-models');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.car_class) newErrors.car_class = 'Class is required';
    if (!formData.model_name) newErrors.model_name = 'Model name is required';
    
    if (!formData.model_code) {
      newErrors.model_code = 'Model code is required';
    } else if (!/^[A-Za-z0-9]{10}$/.test(formData.model_code)) {
      newErrors.model_code = 'Model code must be exactly 10 alphanumeric characters';
    }

    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.features) newErrors.features = 'Features is required';
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.date_of_manufacturing) {
      newErrors.date_of_manufacturing = 'Date of manufacturing is required';
    }

    if (!isEditing && images.length === 0 && existingImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Append new images
      images.forEach(img => {
        formDataToSend.append('images', img.file);
      });

      // Append delete image IDs for edit mode
      if (isEditing && deleteImageIds.length > 0) {
        formDataToSend.append('deleteImageIds', JSON.stringify(deleteImageIds));
      }

      if (isEditing) {
        await carModelApi.update(id, formDataToSend);
        toast.success('Car model updated successfully');
      } else {
        await carModelApi.create(formDataToSend);
        toast.success('Car model created successfully');
      }

      navigate('/car-models');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save car model';
      toast.error(message);
      
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setDeleteImageIds(prev => [...prev, imageId]);
  };

  const handleSetDefaultImage = async (imageId) => {
    if (isEditing) {
      try {
        await carModelApi.setDefaultImage(id, imageId);
        setExistingImages(prev => prev.map(img => ({
          ...img,
          isDefault: img.id === imageId
        })));
        toast.success('Default image updated');
      } catch (error) {
        toast.error('Failed to update default image');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/car-models')}>
          ← Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-display gradient-text">
            {isEditing ? 'Edit Car Model' : 'Add New Car Model'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isEditing ? 'Update car model details' : 'Fill in the details for the new car model'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Brand"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              options={brandOptions}
              error={errors.brand}
              required
            />

            <Select
              label="Class"
              value={formData.car_class}
              onChange={(e) => handleChange('car_class', e.target.value)}
              options={classOptions}
              error={errors.car_class}
              required
            />

            <Input
              label="Model Name"
              value={formData.model_name}
              onChange={(e) => handleChange('model_name', e.target.value)}
              error={errors.model_name}
              placeholder="e.g., Q7 Premium"
              required
            />

            <Input
              label="Model Code"
              value={formData.model_code}
              onChange={(e) => handleChange('model_code', e.target.value.toUpperCase())}
              error={errors.model_code}
              placeholder="10-character alphanumeric"
              maxLength={10}
              required
            />

            <Input
              label="Price ($)"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              error={errors.price}
              placeholder="e.g., 75000"
              min="0"
              step="0.01"
              required
            />

            <Input
              label="Date of Manufacturing"
              type="datetime-local"
              value={formData.date_of_manufacturing}
              onChange={(e) => handleChange('date_of_manufacturing', e.target.value)}
              error={errors.date_of_manufacturing}
              required
            />

            <Input
              label="Sort Order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              min="0"
            />

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-electric-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric-500"></div>
                <span className="ml-3 text-sm font-medium text-slate-300">Active</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Rich Text Content */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Description & Features</h2>
          
          <div className="space-y-6">
            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              error={errors.description}
              placeholder="Enter car model description..."
              required
            />

            <RichTextEditor
              label="Features"
              value={formData.features}
              onChange={(value) => handleChange('features', value)}
              error={errors.features}
              placeholder="Enter car model features..."
              required
            />
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Images</h2>
          
          <ImageUpload
            images={images}
            existingImages={existingImages}
            onImagesChange={setImages}
            onRemoveImage={handleRemoveImage}
            onRemoveExistingImage={handleRemoveExistingImage}
            onSetDefault={handleSetDefaultImage}
            error={errors.images}
          />
        </Card>

        {/* Submit */}
        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/car-models')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            loading={submitting}
          >
            {isEditing ? 'Update Car Model' : 'Create Car Model'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarModelForm;



