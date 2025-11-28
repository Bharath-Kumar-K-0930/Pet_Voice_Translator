import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch order details');
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered':
        return <Package className="text-blue-500" size={24} />;
      case 'shipped':
        return <Truck className="text-yellow-500" size={24} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusText = (order) => {
    if (order.isDelivered) return 'delivered';
    if (order.isPaid) return 'shipped';
    return 'pending';
  };

  const getStatusIndex = (order) => {
    const status = getStatusText(order);
    const statusMap = {
      'pending': 0,
      'shipped': 2,
      'delivered': 3
    };
    return statusMap[status] || 0;
  };

  const trackingSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-900">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-900">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-900">
        <div className="text-center">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-cyan-400 hover:text-cyan-300 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Order Details</h1>
            <p className="text-slate-400">Order #{order._id}</p>
          </div>

          {/* Order Status */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Order Status</h2>
              {getStatusIcon(getStatusText(order).toLowerCase())}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">{getStatusText(order)}</span>
              {order.trackingNumber && (
                <span className="text-cyan-400">Tracking: {order.trackingNumber}</span>
              )}
              {order.tracker && (
                <p className="text-slate-400 mt-2">{order.tracker}</p>
              )}
            </div>
            {order.isDelivered && order.deliveredAt && (
              <p className="text-slate-400 mt-2">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}

            {/* Order Tracking */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Order Tracking</h4>
              <div className="flex items-center justify-between">
                {trackingSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      index <= getStatusIndex(order)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {index < getStatusIndex(order) ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs text-center font-medium ${
                      index <= getStatusIndex(order) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step}
                    </p>
                    {index < trackingSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mt-2 ${
                        index < getStatusIndex(order) ? 'bg-green-500' : 'bg-gray-200'
                      }`} style={{ width: '100%', minWidth: '20px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-slate-400 text-sm">{item.product.description}</p>
                    <p className="text-cyan-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-slate-400 text-sm">${item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Address
              </h2>
              <div className="text-slate-300">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </h2>
              <div className="text-slate-300">
                <p>{order.paymentMethod}</p>
                {order.isPaid && order.paidAt && (
                  <p className="text-green-400 mt-2">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
