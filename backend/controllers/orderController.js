import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const { search, paymentStatus, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    if (search) {
      query.customerName = { $regex: search, $options: 'i' };
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const orders = await Order.find(query).sort(sortOptions);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      size,
      totalAmount,
      advanceAmount,
      orderDate,
      deliveryDate,
      notes
    } = req.body;

    if (!customerName || !phone || !totalAmount) {
      return res.status(400).json({ message: 'Please provide customer name, phone, and total amount' });
    }

    const order = await Order.create({
      customerName,
      phone,
      size,
      totalAmount,
      advanceAmount: advanceAmount || 0,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      notes
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      size,
      totalAmount,
      advanceAmount,
      orderDate,
      deliveryDate,
      notes
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update fields only if provided
    if (customerName !== undefined) order.customerName = customerName;
    if (phone !== undefined) order.phone = phone;
    if (size !== undefined) order.size = size;
    if (totalAmount !== undefined) order.totalAmount = parseFloat(totalAmount);
    if (advanceAmount !== undefined) order.advanceAmount = parseFloat(advanceAmount);
    if (orderDate !== undefined) order.orderDate = orderDate ? new Date(orderDate) : order.orderDate;
    if (deliveryDate !== undefined) order.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    if (notes !== undefined) order.notes = notes;

    // Save will trigger pre-save hook to recalculate remainingAmount and paymentStatus
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    const pendingOrders = await Order.countDocuments({ paymentStatus: 'Pending' });
    const partialOrders = await Order.countDocuments({ paymentStatus: 'Partial' });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'Paid' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const paidRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const pendingRevenue = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['Pending', 'Partial'] } } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
    ]);
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: currentMonth }, paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalOrders,
      pendingOrders,
      partialOrders,
      paidOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      paidRevenue: paidRevenue[0]?.total || 0,
      pendingRevenue: pendingRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

