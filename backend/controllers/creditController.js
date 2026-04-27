const { db, docToObj } = require('../config/firebase');

exports.list = async (req, res) => {
  try {
    const [creditsSnap, customersSnap] = await Promise.all([
      db.collection('credits').get(),
      db.collection('customers').get(),
    ]);

    const customersMap = {};
    customersSnap.docs.forEach(doc => { customersMap[doc.id] = docToObj(doc); });

    const credits = creditsSnap.docs.map(doc => {
      const data = docToObj(doc);
      return {
        ...data,
        customerId: customersMap[data.customerId] || data.customerId,
      };
    });

    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.pay = async (req, res) => {
  try {
    const creditRef = db.collection('credits').doc(req.params.id);
    const doc = await creditRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Credit not found' });

    const credit = doc.data();
    const customerRef = db.collection('customers').doc(credit.customerId);
    const customerDoc = await customerRef.get();

    if (customerDoc.exists) {
      const customer = customerDoc.data();
      await customerRef.update({ totalDue: Math.max(0, customer.totalDue - credit.amount) });
    }

    await creditRef.update({ paid: true });
    res.json({ _id: doc.id, id: doc.id, ...credit, paid: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
