import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import carModelApi from '../api/carModelApi';
import commissionApi from '../api/commissionApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCarModels: 0,
    activeModels: 0,
    totalSalesmen: 0,
    totalCommission: '$0'
  });
  const [recentModels, setRecentModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [carModelsRes, commissionRes] = await Promise.all([
        carModelApi.getAll({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
        commissionApi.getReport()
      ]);

      setRecentModels(carModelsRes.data || []);
      setStats({
        totalCarModels: carModelsRes.pagination?.totalItems || 0,
        activeModels: carModelsRes.data?.filter(m => m.isActive).length || 0,
        totalSalesmen: commissionRes.data?.summary?.totalSalesmen || 0,
        totalCommission: commissionRes.data?.summary?.grandTotalCommission || '$0'
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Car Models',
      value: stats.totalCarModels,
      icon: '🚗',
      color: 'from-electric-500 to-electric-600',
      glow: 'blue'
    },
    {
      title: 'Active Models',
      value: stats.activeModels,
      icon: '✓',
      color: 'from-neon-green to-emerald-600',
      glow: 'green'
    },
    {
      title: 'Total Salesmen',
      value: stats.totalSalesmen,
      icon: '👤',
      color: 'from-neon-pink to-rose-600',
      glow: 'pink'
    },
    {
      title: 'Total Commission',
      value: stats.totalCommission,
      icon: '💰',
      color: 'from-neon-orange to-amber-600',
      glow: 'blue'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display gradient-text">Dashboard</h1>
          <p className="text-slate-400 mt-2">Welcome to AutoPrime Management System</p>
        </div>
        <Link to="/car-models/new">
          <Button>
            <span className="mr-2">+</span> Add New Car Model
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
        {statCards.map((stat, index) => (
          <Card key={index} hover glow={stat.glow} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2 font-display">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Car Models */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display text-white">Recent Car Models</h2>
          <Link to="/car-models">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        {recentModels.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-xl bg-midnight-800 flex items-center justify-center text-3xl mb-4">
              🚗
            </div>
            <p className="text-slate-400">No car models yet</p>
            <Link to="/car-models/new">
              <Button className="mt-4">Add Your First Car Model</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Image</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Class</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentModels.map((model) => (
                  <tr key={model.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-midnight-800">
                        {model.defaultImage ? (
                          <img
                            src={model.defaultImage}
                            alt={model.modelName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🚗
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link 
                        to={`/car-models/${model.id}`}
                        className="text-white hover:text-electric-400 transition-colors font-medium"
                      >
                        {model.modelName}
                      </Link>
                      <p className="text-xs text-slate-500">{model.modelCode}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{model.brand}</td>
                    <td className="py-3 px-4 text-slate-300">{model.carClass}</td>
                    <td className="py-3 px-4 text-electric-400 font-medium">
                      ${model.price?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        model.isActive 
                          ? 'bg-neon-green/10 text-neon-green' 
                          : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        {model.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover className="p-6 group cursor-pointer" onClick={() => window.location.href = '/car-models'}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-electric-500/20 to-electric-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ◎
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Car Models</h3>
              <p className="text-sm text-slate-400">Manage all car models with images and details</p>
            </div>
          </div>
        </Card>

        <Card hover className="p-6 group cursor-pointer" onClick={() => window.location.href = '/commission-report'}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-pink/20 to-rose-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ◉
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Commission Report</h3>
              <p className="text-sm text-slate-400">View detailed salesman commission reports</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;



