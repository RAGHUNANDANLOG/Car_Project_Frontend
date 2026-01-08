import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import carModelApi from '../api/carModelApi';

const CarModelList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [carModels, setCarModels] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, model: null });
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  const fetchCarModels = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: parseInt(searchParams.get('page')) || 1,
        limit: 10,
        search: searchParams.get('search') || '',
        sortBy: searchParams.get('sortBy') || 'created_at',
        sortOrder: searchParams.get('sortOrder') || 'desc'
      };

      const response = await carModelApi.getAll(params);
      setCarModels(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 10, totalItems: 0 });
    } catch (error) {
      toast.error('Failed to fetch car models');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCarModels();
  }, [fetchCarModels]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', search);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (field, order) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', field);
    newParams.set('sortOrder', order);
    newParams.set('page', '1');
    setSortBy(field);
    setSortOrder(order);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleDelete = async () => {
    if (!deleteModal.model) return;
    
    try {
      setDeleting(true);
      await carModelApi.delete(deleteModal.model.id);
      toast.success('Car model deleted successfully');
      setDeleteModal({ open: false, model: null });
      fetchCarModels();
    } catch (error) {
      toast.error('Failed to delete car model');
    } finally {
      setDeleting(false);
    }
  };

  const sortOptions = [
    { value: 'created_at', label: 'Latest Added' },
    { value: 'date_of_manufacturing', label: 'Manufacturing Date' },
    { value: 'sort_order', label: 'Sort Order' },
    { value: 'price', label: 'Price' },
    { value: 'model_name', label: 'Model Name' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display gradient-text">Car Models</h1>
          <p className="text-slate-400 mt-2">Manage your car model inventory</p>
        </div>
        <Link to="/car-models/new">
          <Button>
            <span className="mr-2">+</span> Add New Model
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <form onSubmit={handleSearch} className="flex-1 min-w-[300px]">
            <Input
              placeholder="Search by model name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </form>

          <div className="flex gap-4">
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value, sortOrder)}
              options={sortOptions}
              className="w-48"
            />
            <Select
              value={sortOrder}
              onChange={(e) => handleSortChange(sortBy, e.target.value)}
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' }
              ]}
              className="w-36"
            />
            <Button type="submit" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : carModels.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-midnight-800 flex items-center justify-center text-4xl mb-6">
            🚗
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No car models found</h3>
          <p className="text-slate-400 mb-6">
            {search ? 'Try adjusting your search criteria' : 'Get started by adding your first car model'}
          </p>
          <Link to="/car-models/new">
            <Button>Add Car Model</Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carModels.map((model, index) => (
              <Card 
                key={model.id} 
                hover 
                glow="blue"
                className="overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-midnight-800">
                  {model.defaultImage ? (
                    <img
                      src={model.defaultImage}
                      alt={model.modelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🚗
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      model.isActive 
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                    }`}>
                      {model.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-electric-500/20 text-electric-400 border border-electric-500/30 backdrop-blur-sm">
                      {model.brand}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-electric-400 transition-colors">
                        {model.modelName}
                      </h3>
                      <p className="text-sm text-slate-500">{model.modelCode}</p>
                    </div>
                    <span className="text-sm text-slate-400 bg-midnight-800 px-2 py-1 rounded-lg">
                      {model.carClass}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-electric-400">
                      ${model.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(model.dateOfManufacturing).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <Link to={`/car-models/${model.id}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Link to={`/car-models/${model.id}/edit`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => setDeleteModal({ open: true, model })}
                    >
                      🗑
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={pagination.page}
            totalPages={Math.ceil(pagination.totalItems / pagination.limit)}
            totalItems={pagination.totalItems}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, model: null })}
        title="Delete Car Model"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-3xl mb-4">
            🗑
          </div>
          <p className="text-slate-300 mb-6">
            Are you sure you want to delete <span className="text-white font-medium">{deleteModal.model?.modelName}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setDeleteModal({ open: false, model: null })}
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

export default CarModelList;



