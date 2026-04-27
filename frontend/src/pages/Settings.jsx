import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

export default function Settings() {
  const { user, login, logout } = useAuth();
  const toast = useToast();

  const [nameForm, setNameForm] = useState({ name: user?.name || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingName, setSavingName] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!nameForm.name.trim()) return toast.error('Name cannot be empty');
    setSavingName(true);
    try {
      await authService.updateProfile({ name: nameForm.name });
      toast.success('Name updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match');
    setSavingPass(true);
    try {
      await authService.updateProfile({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed. Please login again.');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => logout(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Account Info */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Account Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your admin name and credentials.</p>

        <div className="mt-3 sm:mt-4 rounded-2xl bg-slate-50 px-3 sm:px-4 py-2 sm:py-3">
          <p className="text-xs sm:text-sm text-slate-500">Logged in as</p>
          <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{user?.email}</p>
        </div>

        {/* Change Name */}
        <form onSubmit={handleNameSave} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-semibold text-slate-800">Change Display Name</h3>
          <Input
            label="Name"
            value={nameForm.name}
            onChange={(e) => setNameForm({ name: e.target.value })}
            placeholder="Your name"
            required
          />
          <Button type="submit" disabled={savingName} className="text-sm">
            {savingName ? 'Saving...' : 'Update Name'}
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft">
        <h3 className="text-sm sm:text-base font-semibold text-slate-900">Change Password</h3>
        <p className="mt-1 text-sm text-slate-500">You will be logged out after changing your password.</p>
        <form onSubmit={handlePasswordSave} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passForm.currentPassword}
            onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
            placeholder="Enter current password"
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passForm.newPassword}
            onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
            placeholder="Min 6 characters"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passForm.confirmPassword}
            onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
            placeholder="Repeat new password"
            required
          />
          <Button type="submit" disabled={savingPass} className="bg-rose-600 hover:bg-rose-500 text-sm">
            {savingPass ? 'Saving...' : 'Change Password'}
          </Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl sm:rounded-3xl border border-rose-200 bg-white p-4 sm:p-6 shadow-soft">
        <h3 className="text-sm sm:text-base font-semibold text-rose-600">Danger Zone</h3>
        <p className="mt-1 text-sm text-slate-500">Log out from the current session.</p>
        <button
          onClick={() => { if (window.confirm('Are you sure you want to logout?')) logout(); }}
          className="mt-3 sm:mt-4 rounded-2xl bg-rose-50 px-3 sm:px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
