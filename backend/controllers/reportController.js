const { db, docToObj } = require('../config/firebase');

exports.summary = async (req, res) => {
  try {
    const [salesSnap, productsSnap] = await Promise.all([
      db.collection('sales').get(),
      db.collection('products').get(),
    ]);

    const productsMap = {};
    productsSnap.docs.forEach(doc => { productsMap[doc.id] = doc.data(); });

    const now = new Date();
    const sales = salesSnap.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      return { ...data, createdAt };
    });

    const dailySales = sales
      .filter(s => s.createdAt.toDateString() === now.toDateString())
      .reduce((sum, s) => sum + s.amount, 0);

    const monthlyRevenue = sales
      .filter(s => s.createdAt.getMonth() === now.getMonth() && s.createdAt.getFullYear() === now.getFullYear())
      .reduce((sum, s) => sum + s.amount, 0);

    const productSales = {};
    for (const sale of sales) {
      for (const item of sale.items || []) {
        const id = typeof item.productId === 'object' ? item.productId.id : item.productId;
        productSales[id] = (productSales[id] || 0) + item.quantity;
      }
    }

    let topProduct = 'N/A';
    if (Object.keys(productSales).length > 0) {
      const topId = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0][0];
      topProduct = productsMap[topId]?.name || 'N/A';
    }

    const recentSales = sales
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);

    res.json({ dailySales, monthlyRevenue, topProduct, recentSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
