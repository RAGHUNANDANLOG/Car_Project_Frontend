import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '◈' },
    { name: 'Car Models', path: '/car-models', icon: '◎' },
    { name: 'Commission Report', path: '/commission-report', icon: '◉' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-midnight-950 bg-grid-pattern bg-grid">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 glass z-50">
        <div className="p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-400 to-neon-pink flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">AutoPrime</h1>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-electric-500/20 to-neon-pink/10 text-white border border-electric-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`text-lg ${isActive(item.path) ? 'text-electric-400' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-midnight-800/50 to-midnight-900/50 border border-white/5">
            <p className="text-sm text-slate-400">
              <span className="text-electric-400">●</span> System Online
            </p>
            <p className="text-xs text-slate-500 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 min-h-screen relative">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;



