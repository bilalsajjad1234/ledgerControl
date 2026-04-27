const { db, docToObj } = require('../config/firebase');

exports.list = async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    res.json(snapshot.docs.map(docToObj));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const now = new Date();
    const data = { ...req.body, createdAt: now, updatedAt: now };
    const docRef = await db.collection('products').add(data);
    res.status(201).json({ _id: docRef.id, id: docRef.id, ...req.body, createdAt: now.toISOString(), updatedAt: now.toISOString() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

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
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

    const product = docToObj(doc);
    await docRef.delete();
    res.json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
