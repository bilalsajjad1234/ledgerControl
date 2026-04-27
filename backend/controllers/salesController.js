const { db, admin, docToObj } = require('../config/firebase');
const FieldValue = admin.firestore.FieldValue;

exports.create = async (req, res) => {
  try {
    const { items, amount, paymentType, customerId } = req.body;

    // Validate stock
    for (const item of items) {
      const doc = await db.collection('products').doc(item.productId).get();
      if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
      const product = doc.data();
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${product.name}". Available: ${product.quantity}` });
      }
    }

    // Deduct stock
    for (const item of items) {
      await db.collection('products').doc(item.productId).update({
        quantity: FieldValue.increment(-item.quantity),
      });
    }

    const now = new Date();
    const saleData = {
      items,
      amount,
      paymentType,
      customerId: paymentType === 'credit' ? customerId : null,
      returned: false,
      createdAt: now,
      updatedAt: now,
    };

    const saleRef = await db.collection('sales').add(saleData);

    if (paymentType === 'credit' && customerId) {
      const customerDoc = await db.collection('customers').doc(customerId).get();
      const customer = customerDoc.data();
      await db.collection('credits').add({
        customerId,
        customerName: customer.name,
        amount,
        paid: false,
        saleId: saleRef.id,
        createdAt: now,
        updatedAt: now,
      });
      await db.collection('customers').doc(customerId).update({
        totalDue: FieldValue.increment(amount),
      });
    }

    res.status(201).json({ _id: saleRef.id, id: saleRef.id, ...saleData, createdAt: now.toISOString(), updatedAt: now.toISOString() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const [salesSnap, productsSnap, customersSnap] = await Promise.all([
      db.collection('sales').orderBy('createdAt', 'desc').get(),
      db.collection('products').get(),
      db.collection('customers').get(),
    ]);

    const productsMap = {};
    productsSnap.docs.forEach(doc => { productsMap[doc.id] = docToObj(doc); });

    const customersMap = {};
    customersSnap.docs.forEach(doc => { customersMap[doc.id] = docToObj(doc); });

    const sales = salesSnap.docs.map(doc => {
      const data = docToObj(doc);
      return {
        ...data,
        items: (data.items || []).map(item => ({
          ...item,
          productId: productsMap[item.productId] || item.productId,
        })),
        customerId: data.customerId ? (customersMap[data.customerId] || data.customerId) : null,
      };
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnSale = async (req, res) => {
  try {
    const saleRef = db.collection('sales').doc(req.params.id);
    const doc = await saleRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Sale not found' });

    const sale = doc.data();
    if (sale.returned) return res.status(400).json({ message: 'Sale already returned' });

    // Restore stock
    for (const item of sale.items) {
      await db.collection('products').doc(item.productId).update({
        quantity: FieldValue.increment(item.quantity),
      });
    }

    // Reverse credit
    if (sale.paymentType === 'credit' && sale.customerId) {
      const customerRef = db.collection('customers').doc(sale.customerId);
      const customerDoc = await customerRef.get();
      if (customerDoc.exists) {
        const customer = customerDoc.data();
        await customerRef.update({ totalDue: Math.max(0, customer.totalDue - sale.amount) });
      }
      const creditSnap = await db.collection('credits').where('saleId', '==', req.params.id).get();
      if (!creditSnap.empty) {
        await creditSnap.docs[0].ref.update({ paid: true });
      }
    }

    await saleRef.update({ returned: true });
    res.json({ message: 'Sale returned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
