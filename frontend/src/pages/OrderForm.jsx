import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, updateOrder, getOrderById } from '../services/orderService';
import Layout from '../components/Layout';

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    size: '',
    totalAmount: '',
    advanceAmount: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const order = await getOrderById(id);
      setFormData({
        customerName: order.customerName || '',
        phone: order.phone || '',
        size: order.size || '',
        totalAmount: order.totalAmount || '',
        advanceAmount: order.advanceAmount || '',
        orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '',
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : '',
        notes: order.notes || ''
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Ensure advance amount doesn't exceed total amount
    if (name === 'advanceAmount' && formData.totalAmount) {
      const maxAdvance = parseFloat(formData.totalAmount);
      const enteredAdvance = parseFloat(value);
      if (!isNaN(enteredAdvance) && enteredAdvance > maxAdvance) {
        newValue = maxAdvance.toString();
      }
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        advanceAmount: parseFloat(formData.advanceAmount) || 0
      };

      if (isEdit) {
        await updateOrder(id, orderData);
      } else {
        await createOrder(orderData);
      }
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order');
    } finally {
      setSubmitting(false);
    }
  };

  const remainingAmount = (parseFloat(formData.totalAmount) || 0) - (parseFloat(formData.advanceAmount) || 0);
  let paymentStatus = 'Pending';
  if (remainingAmount === 0 && parseFloat(formData.advanceAmount) > 0) {
    paymentStatus = 'Paid';
  } else if (parseFloat(formData.advanceAmount) > 0) {
    paymentStatus = 'Partial';
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {isEdit ? 'Edit Order' : 'Add New Order'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Payment Summary Card */}
          {formData.totalAmount && (
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              paymentStatus === 'Paid' 
                ? 'bg-green-50 dark:bg-green-500/10 border-green-500/50' :
              paymentStatus === 'Partial' 
                ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-500/50' :
                'bg-red-50 dark:bg-red-500/10 border-red-500/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Summary</h3>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Total Amount</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">₹{parseFloat(formData.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Advance Paid</p>
                      <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">₹{parseFloat(formData.advanceAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Remaining</p>
                      <p className={`text-lg font-bold ${remainingAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        ₹{remainingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    paymentStatus === 'Paid' 
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50' :
                    paymentStatus === 'Partial' 
                      ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/50' :
                      'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50'
                  }`}>
                    {paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Customer Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="e.g., 10x5 feet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Total Amount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Advance Amount
                <span className="text-xs text-slate-400 ml-2">(Update when payment received)</span>
              </label>
              <input
                type="number"
                name="advanceAmount"
                value={formData.advanceAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                max={formData.totalAmount || 999999999}
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="0.00"
              />
              {formData.totalAmount && parseFloat(formData.advanceAmount) > parseFloat(formData.totalAmount) && (
                <p className="text-red-400 text-xs mt-1">Advance cannot exceed total amount</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Remaining Amount
              </label>
              <input
                type="text"
                value={`₹${remainingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                disabled
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-slate-600 dark:text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Payment Status
                <span className="text-xs text-slate-400 ml-2">(Auto-calculated)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentStatus}
                  disabled
                  className={`w-full px-4 py-2 bg-slate-600 border-2 rounded-lg font-semibold cursor-not-allowed ${
                    paymentStatus === 'Paid' 
                      ? 'text-green-400 border-green-500/50 bg-green-500/10' :
                    paymentStatus === 'Partial' 
                      ? 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10' :
                      'text-red-400 border-red-500/50 bg-red-500/10'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {paymentStatus === 'Paid' && '✓'}
                  {paymentStatus === 'Partial' && '⚠'}
                  {paymentStatus === 'Pending' && '!'}
                </div>
              </div>
              {isEdit && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  💡 Tip: Update "Advance Amount" to match total amount to mark as Paid
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Order Date
              </label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Order' : 'Create Order'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default OrderForm;

