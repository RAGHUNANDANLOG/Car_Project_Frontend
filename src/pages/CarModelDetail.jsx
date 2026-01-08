import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import carModelApi from '../api/carModelApi';

const CarModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carModel, setCarModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCarModel();
  }, [id]);

  const fetchCarModel = async () => {
    try {
      const response = await carModelApi.getById(id);
      setCarModel(response.data);
    } catch (error) {
      toast.error('Failed to load car model');
      navigate('/car-models');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await carModelApi.delete(id);
      toast.success('Car model deleted successfully');
      navigate('/car-models');
    } catch (error) {
      toast.error('Failed to delete car model');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!carModel) {
    return null;
  }

  const defaultImage = carModel.images?.find(img => img.isDefault) || carModel.images?.[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/car-models')}>
            ← Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display text-white">
                {carModel.modelName}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                carModel.isActive 
                  ? 'bg-neon-green/20 text-neon-green' 
                  : 'bg-slate-700/50 text-slate-400'
              }`}>
                {carModel.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-slate-400 mt-1">{carModel.modelCode}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/car-models/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => setDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-midnight-800">
              {defaultImage ? (
                <img
                  src={defaultImage.path}
                  alt={carModel.modelName}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(defaultImage)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🚗
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {carModel.images?.length > 1 && (
              <div className="p-4 flex gap-3 overflow-x-auto">
                {carModel.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      image.isDefault ? 'border-electric-500' : 'border-transparent hover:border-white/30'
                    }`}
                  >
                    <img
                      src={image.path}
                      alt={image.originalName}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 font-display">Description</h2>
            <div 
              className="prose prose-invert prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: carModel.description }}
            />
          </Card>

          {/* Features */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 font-display">Features</h2>
            <div 
              className="prose prose-invert prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: carModel.features }}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="p-6 bg-gradient-to-br from-electric-500/10 to-neon-pink/10">
            <p className="text-sm text-slate-400">Price</p>
            <p className="text-4xl font-bold text-white mt-1 font-display">
              ${carModel.price?.toLocaleString()}
            </p>
          </Card>

          {/* Details */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 font-display">Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-slate-400">Brand</span>
                <span className="text-white font-medium">{carModel.brand}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-slate-400">Class</span>
                <span className="text-white font-medium">{carModel.carClass}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-slate-400">Model Code</span>
                <span className="text-white font-mono">{carModel.modelCode}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-slate-400">Manufacturing Date</span>
                <span className="text-white">
                  {new Date(carModel.dateOfManufacturing).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-slate-400">Sort Order</span>
                <span className="text-white">{carModel.sortOrder}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-400">Status</span>
                <span className={carModel.isActive ? 'text-neon-green' : 'text-slate-400'}>
                  {carModel.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>

          {/* Timestamps */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 font-display">Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Created</p>
                <p className="text-white">
                  {new Date(carModel.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Last Updated</p>
                <p className="text-white">
                  {new Date(carModel.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.originalName || 'Image Preview'}
        size="xl"
      >
        {selectedImage && (
          <div className="flex items-center justify-center">
            <img
              src={selectedImage.path}
              alt={selectedImage.originalName}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Car Model"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-3xl mb-4">
            🗑
          </div>
          <p className="text-slate-300 mb-6">
            Are you sure you want to delete <span className="text-white font-medium">{carModel.modelName}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="flex-1"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CarModelDetail;



