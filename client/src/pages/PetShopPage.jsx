import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Heart, User, Search, Package, FileText, Trash2, Plus, Minus, Check, CreditCard, Smartphone, Banknote } from 'lucide-react';

const PetShop = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedUPI, setSelectedUPI] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const categories = ['all', 'dog', 'cat', 'food', 'toys', 'grooming', 'health', 'dress options', 'equipments', 'pet furniture', 'beds', 'accessories', 'training tools', 'supplements'];

  const token = localStorage.getItem('authToken');
  const API_BASE = 'http://localhost:5000/api';

  // Authentication guard
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadProducts();
    if (token) {
      loadCart();
      loadFavorites();
      loadOrders();
    }
  }, [token]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log('Error loading products:', error);
    }
  };

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.log('Error loading cart:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.log('Error loading orders:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      loadCart();
    } catch (error) {
      console.log('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await fetch(`${API_BASE}/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
    } catch (error) {
      console.log('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, change) => {
    const item = cart.find(item => item.product._id === productId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity === item.quantity) return;

    try {
      await fetch(`${API_BASE}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      loadCart();
    } catch (error) {
      console.log('Error updating quantity:', error);
    }
  };

  const toggleFavorite = async (product) => {
    const isFavorite = favorites.find(fav => fav._id === product._id);
    try {
      if (isFavorite) {
        await fetch(`${API_BASE}/favorites/remove/${product._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await fetch(`${API_BASE}/favorites/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product._id })
        });
      }
      loadFavorites();
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const orderItems = cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          total: calculateTotal(),
          paymentMethod: paymentMethod
        })
      });
      const order = await response.json();
      setPlacedOrder(order);
      setShowOrderModal(true);

      // Clear cart items from server
      for (let item of cart) {
        await fetch(`${API_BASE}/cart/${item.product._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setCart([]);
      setPaymentMethod('');
      loadOrders();
      setActiveTab('orders');
    } catch (error) {
      console.log('Error placing order:', error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

  const handleDeleteOrder = async (orderId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to delete an order.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Order deleted successfully.');
        // Reload orders after deletion
        loadOrders();
      } else {
        const data = await response.json();
        alert(`Failed to delete order: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error deleting order. Please try again later.');
    }
  };

  const getOrderStatus = (order) => {
    if (order.isDelivered) return 'delivered';
    if (order.isPaid) return 'shipped';
    return 'pending';
  };

  const getStatusIndex = (order) => {
    const status = getOrderStatus(order);
    const statusMap = {
      'pending': 0,
      'shipped': 2,
      'delivered': 3
    };
    return statusMap[status] || 0;
  };

  const trackingSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">PetCare Store</h1>
                <p className="text-sm text-gray-600">Everything for your furry friends</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('favorites')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Heart className={`w-6 h-6 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowCartDropdown(!showCartDropdown)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>

                {showCartDropdown && cart.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4">
                    <h3 className="font-semibold mb-3">Shopping Cart</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item._id} className="flex items-center space-x-2 text-sm">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-gray-600">₹{item.product.price} x {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between font-semibold mb-2">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => { setActiveTab('checkout'); setShowCartDropdown(false); }}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Package className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex space-x-6 border-t pt-4">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'shop' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-gray-100'}`}
            >
              Shop
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-gray-100'}`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-gray-100'}`}
            >
              Orders
            </button>
          </nav>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'shop' && (
          <div>
            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for pet products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full capitalize transition ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-low">Price Low to High</option>
                  <option value="price-high">Price High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(product)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                    >
                      <Heart className={`w-5 h-5 ${favorites.find(fav => fav._id === product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                    <span className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm capitalize">
                      {product.petType}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Stock: {product.stock} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{color: 'blueviolet'}}>Your Favorites</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No favorites yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.map(product => (
                  <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'checkout' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Checkout</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">₹{item.product.price} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>Total:</span>
                    <span className="text-blue-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Place Order</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-xl p-8 border border-purple-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Payment Options</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">Select Payment Method</label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => setPaymentMethod('credit-card')}
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === 'credit-card'
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex space-x-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/64px-Visa.svg.png" alt="Visa" className="w-8 h-6 object-contain" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/64px-MasterCard_Logo.svg.png" alt="Mastercard" className="w-8 h-6 object-contain" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/RuPay.svg/64px-RuPay.svg.png" alt="RuPay" className="w-8 h-6 object-contain" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                        </div>
                        {paymentMethod === 'credit-card' && (
                          <div className="ml-auto">
                            <Check className="w-5 h-5 text-blue-500" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === 'upi'
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex space-x-4 justify-center">
                          <div className="flex flex-col items-center space-y-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/GooglePay_Logo.svg/64px-GooglePay_Logo.svg.png" alt="Google Pay" className="w-10 h-8 object-contain" />
                            <span className="text-xs font-medium text-gray-700 text-center">Google Pay</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/PhonePe_logo.svg/64px-PhonePe_logo.svg.png" alt="PhonePe" className="w-10 h-8 object-contain" />
                            <span className="text-xs font-medium text-gray-700 text-center">PhonePe</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Paytm_logo.svg/64px-Paytm_logo.svg.png" alt="Paytm" className="w-10 h-8 object-contain" />
                            <span className="text-xs font-medium text-gray-700 text-center">Paytm</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">UPI</p>
                          <p className="text-sm text-gray-600">G-Pay, PhonePe, Paytm</p>
                        </div>
                        {paymentMethod === 'upi' && (
                          <div className="ml-auto">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => setPaymentMethod('navi')}
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === 'navi'
                            ? 'border-orange-500 bg-orange-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${paymentMethod === 'navi' ? 'bg-orange-500' : 'bg-gray-100'}`}>
                          <Banknote className={`w-6 h-6 ${paymentMethod === 'navi' ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">Navi</p>
                          <p className="text-sm text-gray-600">Navi Account</p>
                        </div>
                        {paymentMethod === 'navi' && (
                          <div className="ml-auto">
                            <Check className="w-5 h-5 text-orange-500" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'credit-card' && (
                    <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Card Details</h4>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 text-lg bg-gray-50"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 text-lg bg-gray-50"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 text-lg bg-gray-50"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Select UPI App</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setSelectedUPI('gpay')}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedUPI === 'gpay'
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                          }`}
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/GooglePay_Logo.svg/64px-GooglePay_Logo.svg.png" alt="Google Pay" className="w-12 h-12 object-contain" />
                          <div className="text-center">
                            <p className="font-semibold text-gray-800 text-sm">Google Pay</p>
                          </div>
                          {selectedUPI === 'gpay' && (
                            <div className="mt-2">
                              <Check className="w-5 h-5 text-green-500" />
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => setSelectedUPI('phonepe')}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedUPI === 'phonepe'
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/PhonePe_logo.svg/64px-PhonePe_logo.svg.png" alt="PhonePe" className="w-12 h-12 object-contain" />
                          <div className="text-center">
                            <p className="font-semibold text-gray-800 text-sm">PhonePe</p>
                          </div>
                          {selectedUPI === 'phonepe' && (
                            <div className="mt-2">
                              <Check className="w-5 h-5 text-purple-500" />
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => setSelectedUPI('paytm')}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedUPI === 'paytm'
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Paytm_logo.svg/64px-Paytm_logo.svg.png" alt="Paytm" className="w-12 h-12 object-contain" />
                          <div className="text-center">
                            <p className="font-semibold text-gray-800 text-sm">Paytm</p>
                          </div>
                          {selectedUPI === 'paytm' && (
                            <div className="mt-2">
                              <Check className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'navi' && (
                    <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Navi Details</h4>
                      <input
                        type="text"
                        placeholder="Navi Account Number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-400 focus:border-orange-500 text-lg bg-gray-50"
                      />
                    </div>
                  )}

                  {paymentMethod && (
                    <div className="border-t-2 border-purple-300 pt-6 bg-white p-6 rounded-xl shadow-lg">
                      <h4 className="text-2xl font-bold mb-4 text-gray-800 text-center">Payment QR Code</h4>
                      <div className="text-center">
                        <img
                          src={`https://via.placeholder.com/250x250?text=QR+Code+for+${paymentMethod}`}
                          alt="Payment QR Code"
                          className="mx-auto mb-4 border-4 border-purple-300 rounded-xl shadow-lg"
                        />
                        <p className="text-lg text-gray-700 font-medium mb-2">
                          Scan this QR code to complete your payment
                        </p>
                        <p className="text-xl text-purple-600 font-bold">
                          Amount: ₹{calculateTotal().toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{color: 'blueviolet'}}>Your Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => {
                  const currentStep = getStatusIndex(order);
                  const orderStatus = getOrderStatus(order);
                  return (
                    <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">Order #{order._id}</h3>
                          <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Payment: {order.paymentMethod}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full font-medium ${
                          orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {orderStatus}
                        </span>
                      </div>

                      {/* Order Tracking */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4">Order Tracking</h4>
                        <div className="flex items-center justify-between">
                          {trackingSteps.map((step, index) => (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                index <= currentStep
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}>
                                {index < currentStep ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <span className="text-sm font-bold">{index + 1}</span>
                                )}
                              </div>
                              <p className={`text-xs text-center font-medium ${
                                index <= currentStep ? 'text-green-600' : 'text-gray-400'
                              }`}>
                                {step}
                              </p>
                              {index < trackingSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 mt-2 ${
                                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                }`} style={{ width: '100%', minWidth: '20px' }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="text-lg font-semibold mb-3">Order Items</h4>
                        {order.items.map(item => (
                          <div key={item._id} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center space-x-3">
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-blue-600">₹{order.total.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                          title="Delete Order"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Order Confirmation Modal */}
        {showOrderModal && placedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Order ID:</span>
                  <span className="text-gray-600">{placedOrder._id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-blue-600 font-bold">₹{placedOrder.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Payment Method:</span>
                  <span className="text-gray-600 capitalize">{placedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setActiveTab('orders');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PetShop;
