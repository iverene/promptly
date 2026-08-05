import { LogOut, Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Header, Page, SectionTitle } from '../components/ui';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from '../providers/ToastProvider';

export default function Profile() {
  const { displayName, signOut, updateDisplayName, user } = useAuth();
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => setName(displayName), [displayName]);

  const save = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await updateDisplayName(name);
    setSaving(false);
    if (error) toast(error.message || 'Unable to update profile', 'error');
    else toast('Profile updated');
  };
  const logout = async () => {
    queryClient.clear();
    const { error } = await signOut();
    if (error) toast('Unable to sign out', 'error');
  };

  return <Page className="max-w-4xl"><Header title="Profile" subtitle="Your private Promptly account" back />
    <section className="mt-8 overflow-hidden rounded-[32px] border border-black/8 bg-white/72 shadow-[0_20px_55px_rgba(17,17,17,.06)]"><div className="bg-black p-7 text-white sm:p-10"><span className="grid size-20 place-items-center rounded-full border border-white/20 bg-white/10 text-3xl font-medium uppercase">{displayName.charAt(0)}</span><p className="mt-7 text-[10px] uppercase tracking-[.2em] text-white/50">Promptly profile</p><h1 className="mt-2 text-4xl font-medium tracking-[-.065em]">{displayName}</h1><p className="mt-2 text-sm text-white/60">{user?.email}</p></div>
      <form onSubmit={save} className="grid gap-6 p-6 sm:p-9"><label><span className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-secondary">Display name</span><div className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-white/80 px-4"><UserRound size={18} className="text-muted" /><input value={name} onChange={(event) => setName(event.target.value)} maxLength="80" required className="h-13 min-w-0 flex-1 bg-transparent outline-none" placeholder="Your name" /></div></label><div className="flex justify-end"><Button type="submit" title="Save profile" icon={Save} loading={saving} disabled={!name.trim() || name.trim() === displayName} /></div></form>
    </section>
    <SectionTitle eyebrow="Session">Account</SectionTitle><div className="glass flex flex-col items-start justify-between gap-5 rounded-[26px] p-5 sm:flex-row sm:items-center"><div><p className="font-medium">Signed in on this device</p><p className="mt-1 text-sm leading-6 text-secondary">Your session is stored securely and refreshes automatically.</p></div><Button title="Sign out" icon={LogOut} variant="secondary" onClick={logout} /></div>
  </Page>;
}
