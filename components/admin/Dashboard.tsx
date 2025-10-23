// ============================================
// FILE: components/admin/Dashboard.jsx
// Admin dashboard overview
// ============================================
'use client';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

function Dashboard({ stats }) {
  const cards = [
    { 
      title: 'Total Products', 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingBag, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Total Customers', 
      value: stats?.totalCustomers || 0, 
      icon: Users, 
      color: 'bg-purple-500' 
    },
    //{ 
    //  title: 'Total Revenue', 
    //  value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, 
    //  icon: DollarSign, 
    //  color: 'bg-yellow-500' 
    //},
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;