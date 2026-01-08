import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import LoadingSpinner from '../components/LoadingSpinner';
import commissionApi from '../api/commissionApi';

const CommissionReport = () => {
  const [report, setReport] = useState(null);
  const [salesmen, setSalesmen] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    salesmanId: '',
    sortBy: 'total_commission',
    sortOrder: 'desc'
  });

  const [expandedSalesmen, setExpandedSalesmen] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [salesmenRes, rulesRes] = await Promise.all([
        commissionApi.getSalesmen(),
        commissionApi.getRules()
      ]);
      setSalesmen(salesmenRes.data || []);
      setRules(rulesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await commissionApi.getReport(filters);
      setReport(response.data);
    } catch (error) {
      toast.error('Failed to fetch commission report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await commissionApi.exportCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commission_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const toggleSalesman = (salesmanId) => {
    setExpandedSalesmen(prev => ({
      ...prev,
      [salesmanId]: !prev[salesmanId]
    }));
  };

  const salesmanOptions = [
    { value: '', label: 'All Salesmen' },
    ...salesmen.map(s => ({ value: s.id.toString(), label: s.name }))
  ];

  const sortOptions = [
    { value: 'total_commission', label: 'Total Commission' },
    { value: 'salesman', label: 'Salesman Name' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display gradient-text">Commission Report</h1>
          <p className="text-slate-400 mt-2">Detailed salesman commission calculations</p>
        </div>
        <Button onClick={handleExport} loading={exporting} variant="secondary">
          📥 Export CSV
        </Button>
      </div>

      {/* Commission Rules Reference */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-4 font-display">Commission Rules</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Brand</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Fixed Commission</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Price Threshold</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Class A %</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Class B %</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Class C %</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white font-medium">{rule.brand}</td>
                  <td className="py-3 px-4 text-electric-400">${rule.fixedCommission}</td>
                  <td className="py-3 px-4 text-slate-300">&gt; ${rule.priceThreshold.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-neon-green">{rule.classAPercent}%</td>
                  <td className="py-3 px-4 text-center text-yellow-400">{rule.classBPercent}%</td>
                  <td className="py-3 px-4 text-center text-neon-orange">{rule.classCPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-midnight-800/50 border border-neon-pink/20">
          <p className="text-sm text-neon-pink">
            <span className="font-bold">Bonus Rule:</span> Salesmen with previous year sales exceeding $500,000 receive an additional 2% commission on Class A cars.
          </p>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <Select
            label="Salesman"
            value={filters.salesmanId}
            onChange={(e) => setFilters(prev => ({ ...prev, salesmanId: e.target.value }))}
            options={salesmanOptions}
            className="w-48"
          />
          <Select
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            options={sortOptions}
            className="w-48"
          />
          <Select
            label="Order"
            value={filters.sortOrder}
            onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
            options={[
              { value: 'desc', label: 'High to Low' },
              { value: 'asc', label: 'Low to High' }
            ]}
            className="w-36"
          />
        </div>
      </Card>

      {/* Report */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : !report || report.report.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-midnight-800 flex items-center justify-center text-4xl mb-6">
            📊
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No data available</h3>
          <p className="text-slate-400">Commission report data is not available yet.</p>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6" glow="blue">
              <p className="text-sm text-slate-400">Total Salesmen</p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {report.summary.totalSalesmen}
              </p>
            </Card>
            <Card className="p-6 col-span-2 bg-gradient-to-br from-electric-500/10 to-neon-pink/10" glow="pink">
              <p className="text-sm text-slate-400">Grand Total Commission</p>
              <p className="text-4xl font-bold text-white mt-1 font-display">
                {report.summary.grandTotalCommission}
              </p>
            </Card>
          </div>

          {/* Salesman Cards */}
          <div className="space-y-4">
            {report.report.map((salesman) => (
              <Card key={salesman.salesmanId} className="overflow-hidden">
                {/* Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleSalesman(salesman.salesmanId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500 to-neon-pink flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{salesman.salesmanName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-slate-400">{salesman.salesmanCode}</span>
                          <span className="text-sm text-slate-400">•</span>
                          <span className="text-sm text-slate-400">
                            Previous Year: {salesman.previousYearSales}
                          </span>
                          {salesman.qualifiesForBonus && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-neon-pink/20 text-neon-pink rounded-full">
                              +2% Bonus Eligible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Total Commission</p>
                        <p className="text-2xl font-bold text-electric-400">{salesman.totalCommission}</p>
                      </div>
                      <div className={`transform transition-transform ${expandedSalesmen[salesman.salesmanId] ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                {expandedSalesmen[salesman.salesmanId] && (
                  <div className="border-t border-white/5">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-midnight-800/50">
                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-400">Brand</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Class</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Units</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Base %</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Bonus %</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Fixed</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Percent</th>
                            <th className="text-right py-3 px-6 text-sm font-medium text-slate-400">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesman.commissions.map((comm, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-6 text-white font-medium">{comm.brand}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  comm.carClass === 'A-Class' ? 'bg-neon-green/20 text-neon-green' :
                                  comm.carClass === 'B-Class' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-neon-orange/20 text-neon-orange'
                                }`}>
                                  {comm.carClass}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center text-white">{comm.unitsSold}</td>
                              <td className="py-3 px-4 text-center text-slate-300">{comm.basePercent}%</td>
                              <td className="py-3 px-4 text-center">
                                {comm.bonusPercent > 0 ? (
                                  <span className="text-neon-pink">+{comm.bonusPercent}%</span>
                                ) : (
                                  <span className="text-slate-500">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-300">{comm.fixedCommission}</td>
                              <td className="py-3 px-4 text-right text-slate-300">{comm.percentCommission}</td>
                              <td className="py-3 px-6 text-right text-electric-400 font-medium">{comm.totalCommission}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-midnight-800/30">
                            <td colSpan={7} className="py-3 px-6 text-right text-sm font-medium text-slate-400">
                              Subtotal:
                            </td>
                            <td className="py-3 px-6 text-right text-lg font-bold text-electric-400">
                              {salesman.totalCommission}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommissionReport;



