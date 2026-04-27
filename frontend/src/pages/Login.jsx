import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const { login, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [form, setForm] = useState({ name: '', email: '', password: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      if (mode === 'register') {
        const { data } = await authService.register({ name: form.name, email: form.email, password: form.password });
        if (!data) throw new Error('Registration failed');
        await login({ email: form.email, password: form.password });
      } else if (mode === 'forgot') {
        if (form.newPassword !== form.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await authService.resetPassword({ email: form.email, newPassword: form.newPassword });
        setSuccess('Password reset successfully! You can now login.');
        switchMode('login');
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const titles = {
    login: 'Admin Login',
    register: 'Create Account',
    forgot: 'Reset Password',
  };

  const subtitles = {
    login: 'Sign in to access the inventory dashboard.',
    register: 'Register to access the inventory dashboard.',
    forgot: 'Enter your email and set a new password.',
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">{titles[mode]}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitles[mode]}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === 'register' && (
            <Input
              label="Name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@store.com"
            required
          />

          {mode === 'login' && (
            <div>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                required
              />
              <div className="mt-1 text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          )}

          {mode === 'forgot' && (
            <>
              <Input
                label="New Password"
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="New password"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
              />
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" disabled={loading || submitting} className="w-full">
            {loading || submitting
              ? 'Please wait...'
              : mode === 'register'
              ? 'Register'
              : mode === 'forgot'
              ? 'Reset Password'
              : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'forgot' ? (
            <button type="button" onClick={() => switchMode('login')} className="font-semibold text-blue-600 hover:underline">
              Back to Sign in
            </button>
          ) : (
            <>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="font-semibold text-blue-600 hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Sign in'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
