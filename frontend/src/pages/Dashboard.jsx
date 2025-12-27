import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/orderService';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      color: 'bg-blue-600',
      icon: '📋'
    },
    {
      title: 'Pending Payments',
      value: stats?.pendingOrders || 0,
      color: 'bg-yellow-600',
      icon: '⏳'
    },
    {
      title: 'Partial Payments',
      value: stats?.partialOrders || 0,
      color: 'bg-orange-600',
      icon: '💰'
    },
    {
      title: 'Paid Orders',
      value: stats?.paidOrders || 0,
      color: 'bg-green-600',
      icon: '✅'
    },
    {
      title: "Today's Orders",
      value: stats?.todayOrders || 0,
      color: 'bg-purple-600',
      icon: '📅'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(stats?.monthlyRevenue || 0).toLocaleString('en-IN')}`,
      color: 'bg-indigo-600',
      icon: '💵'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      color: 'bg-teal-600',
      icon: '💳'
    },
    {
      title: 'Pending Revenue',
      value: `₹${(stats?.pendingRevenue || 0).toLocaleString('en-IN')}`,
      color: 'bg-red-600',
      icon: '📊'
    }
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium mb-2 leading-tight">{card.title}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl flex-shrink-0 shadow-lg`}>
                  {card.icon}
                </div>
              </div>
              <div className={`mt-4 h-1 rounded-full ${card.color} opacity-50`}></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

