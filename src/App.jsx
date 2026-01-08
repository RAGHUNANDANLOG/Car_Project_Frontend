import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CarModelList from './pages/CarModelList';
import CarModelForm from './pages/CarModelForm';
import CarModelDetail from './pages/CarModelDetail';
import CommissionReport from './pages/CommissionReport';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/car-models" element={<CarModelList />} />
        <Route path="/car-models/new" element={<CarModelForm />} />
        <Route path="/car-models/:id" element={<CarModelDetail />} />
        <Route path="/car-models/:id/edit" element={<CarModelForm />} />
        <Route path="/commission-report" element={<CommissionReport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;



