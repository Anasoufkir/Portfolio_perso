'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Identifiants incorrects.');
      }
    } catch {
      setError('Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white text-xl font-bold mb-4">AO</div>
          <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
          <p className="text-sm text-slate-500 mt-1">Portfolio Anas Oufkir</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Identifiant</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition"
                placeholder="admin"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mot de passe</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading || !form.username || !form.password}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">Accès réservé · anasoufkir.com</p>
      </div>
    </main>
  );
}
