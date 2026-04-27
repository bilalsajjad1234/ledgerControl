const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db, docToObj } = require('../config/firebase');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await db.collection('admins').where('email', '==', email).get();
    if (!existing.empty) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const now = new Date();
    const adminData = { email, password: hash, name: name || 'Admin', createdAt: now, updatedAt: now };
    const docRef = await db.collection('admins').add(adminData);
    const admin = { id: docRef.id, _id: docRef.id, ...adminData };

    const token = generateToken(admin);
    res.status(201).json({
      user: { id: admin.id, _id: admin.id, email: admin.email, name: admin.name },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const snapshot = await db.collection('admins').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const doc = snapshot.docs[0];
    const admin = docToObj(doc);

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin);
    res.json({
      user: { id: admin.id, _id: admin.id, email: admin.email, name: admin.name },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const snapshot = await db.collection('admins').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await snapshot.docs[0].ref.update({ password: hash, updatedAt: new Date() });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const docRef = db.collection('admins').doc(req.user.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Admin not found' });

    const admin = docToObj(doc);
    const updates = { updatedAt: new Date() };

    if (name) updates.name = name;

    if (currentPassword && newPassword) {
      const valid = await bcrypt.compare(currentPassword, admin.password);
      if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    await docRef.update(updates);
    res.json({ user: { id: admin.id, _id: admin.id, email: admin.email, name: updates.name || admin.name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
