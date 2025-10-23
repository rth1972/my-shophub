// ============================================
// FILE: components/OrdersPage.jsx
// ============================================
'use client';

function OrdersPage({ orders, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Shop
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">My Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.order_id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Order #{order.order_id}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.order_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-lg">${order.total_amount}</p>
                    <p className="text-sm text-gray-500">{order.items_count} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;