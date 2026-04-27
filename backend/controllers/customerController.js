const { db, docToObj } = require('../config/firebase');

exports.list = async (req, res) => {
  try {
    const snapshot = await db.collection('customers').get();
    res.json(snapshot.docs.map(docToObj));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const now = new Date();
    const data = { totalDue: 0, ...req.body, createdAt: now, updatedAt: now };
    const docRef = await db.collection('customers').add(data);
    res.status(201).json({ _id: docRef.id, id: docRef.id, ...req.body, totalDue: data.totalDue, createdAt: now.toISOString(), updatedAt: now.toISOString() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const docRef = db.collection('customers').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Customer not found' });

    const updates = { ...req.body, updatedAt: new Date() };
    await docRef.update(updates);
    const updated = await docRef.get();
    res.json(docToObj(updated));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const docRef = db.collection('customers').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Customer not found' });

    const customer = docToObj(doc);
    await docRef.delete();
    res.json({ message: 'Customer deleted', customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
