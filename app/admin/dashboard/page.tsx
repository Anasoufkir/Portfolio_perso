'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, LogOut, Plus, Trash2, CheckCircle, User, Briefcase, Code, FolderOpen, Award } from 'lucide-react';

interface Profile {
  name: string; title: string; description: string; email: string;
  linkedin: string; github: string; website: string; location: string; available: boolean;
}
interface Exp { id: string; period: string; type: string; title: string; company: string; location: string; badge: string; points: string[]; techs: string[] }
interface Proj { id: string; title: string; category: string; description: string; stack: string[] }
interface Skill { id: string; category: string; items: string[] }
interface Cert { id: string; name: string; issuer: string }

function Inp({ label, value, onChange, type='text', placeholder='' }: { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition" />
    </div>
  );
}

function Txt({ label, value, onChange, rows=3 }: { label:string; value:string; onChange:(v:string)=>void; rows?:number }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition resize-none" />
    </div>
  );
}

function Card({ icon, title, children }: { icon:React.ReactNode; title:string; children:React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <span className="text-slate-500">{icon}</span>
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

const emptyProfile: Profile = { name:'', title:'', description:'', email:'', linkedin:'', github:'', website:'', location:'', available:true };

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [experiences, setExperiences] = useState<Exp[]>([]);
  const [projects, setProjects] = useState<Proj[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Cert[]>([]);
  const [tab, setTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/data')
      .then(r => r.json())
      .then(d => {
        if (d.hero) setProfile({ ...emptyProfile, ...d.hero });
        if (d.experiences) setExperiences(d.experiences.map((e: Exp) => ({ ...e, id: String(e.id), points: e.points||[], techs: e.techs||[] })));
        if (d.projects) setProjects(d.projects.map((p: Proj) => ({ ...p, id: String(p.id), stack: p.stack||[] })));
        if (d.skills) setSkills(d.skills.map((s: Skill) => ({ ...s, id: String(s.id), items: s.items||[] })));
        if (d.certifications) setCertifications(d.certifications.map((c: Cert) => ({ ...c, id: String(c.id) })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: profile, experiences, projects, skills, certifications }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else alert('Erreur lors de la sauvegarde');
    } catch { alert('Erreur réseau'); }
    finally { setSaving(false); }
  };

  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin'); };

  const tabs = [
    { id:'hero', label:'Profil', icon:<User size={15}/> },
    { id:'experience', label:'Expériences', icon:<Briefcase size={15}/> },
    { id:'projects', label:'Projets', icon:<FolderOpen size={15}/> },
    { id:'skills', label:'Compétences', icon:<Code size={15}/> },
    { id:'certifications', label:'Certifications', icon:<Award size={15}/> },
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto mb-4" />
        <p className="text-sm text-slate-500">Chargement depuis la base de données...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-bold text-white">AO</div>
            <div>
              <div className="text-sm font-bold text-slate-900">Administration</div>
              <div className="text-xs text-slate-400">Modifications appliquées immédiatement sur le site</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700">
                <CheckCircle size={13}/> Sauvegardé en base de données
              </div>
            )}
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
              <Save size={15}/> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <LogOut size={15}/> Déconnexion
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${tab===t.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">

        {/* PROFIL */}
        {tab === 'hero' && (
          <Card icon={<User size={18}/>} title="Informations personnelles">
            <div className="grid gap-5 sm:grid-cols-2">
              <Inp label="Nom complet" value={profile.name} onChange={v=>setProfile(p=>({...p,name:v}))} />
              <Inp label="Titre / Poste" value={profile.title} onChange={v=>setProfile(p=>({...p,title:v}))} />
              <Inp label="Email" value={profile.email} onChange={v=>setProfile(p=>({...p,email:v}))} type="email" />
              <Inp label="Localisation" value={profile.location} onChange={v=>setProfile(p=>({...p,location:v}))} placeholder="Paris · Île-de-France" />
              <Inp label="LinkedIn URL" value={profile.linkedin} onChange={v=>setProfile(p=>({...p,linkedin:v}))} />
              <Inp label="GitHub URL" value={profile.github} onChange={v=>setProfile(p=>({...p,github:v}))} />
              <Inp label="Site web" value={profile.website} onChange={v=>setProfile(p=>({...p,website:v}))} />
              <div className="flex items-center gap-3 pt-5">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={profile.available} onChange={e=>setProfile(p=>({...p,available:e.target.checked}))} className="sr-only peer" />
                  <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-green-500 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition after:peer-checked:translate-x-5" />
                </label>
                <span className="text-sm font-medium text-slate-700">Disponible immédiatement</span>
              </div>
            </div>
            <div className="mt-5">
              <Txt label="Description / Bio" value={profile.description} onChange={v=>setProfile(p=>({...p,description:v}))} rows={5} />
            </div>
          </Card>
        )}

        {/* EXPÉRIENCES */}
        {tab === 'experience' && (
          <div className="space-y-5">
            {experiences.map((exp,i) => (
              <Card key={exp.id} icon={<Briefcase size={18}/>} title={exp.title||`Expérience ${i+1}`}>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <Inp label="Titre du poste" value={exp.title} onChange={v=>setExperiences(es=>es.map(e=>e.id===exp.id?{...e,title:v}:e))} />
                  <Inp label="Entreprise" value={exp.company} onChange={v=>setExperiences(es=>es.map(e=>e.id===exp.id?{...e,company:v}:e))} />
                  <Inp label="Période (ex: 2024 — 2026)" value={exp.period} onChange={v=>setExperiences(es=>es.map(e=>e.id===exp.id?{...e,period:v}:e))} />
                  <Inp label="Type (CDI · 2 ans, Stage · 3 mois...)" value={exp.type} onChange={v=>setExperiences(es=>es.map(e=>e.id===exp.id?{...e,type:v}:e))} />
                  <Inp label="Localisation" value={exp.location} onChange={v=>setExperiences(es=>es.map(e=>e.id===exp.id?{...e,location:v}:e))} />
                  <Inp label="Badge résultat" value={exp.badge} onChange={v=>setExperiences(es=>es.map(e=>e.id===exp.id?{...e,badge:v}:e))} placeholder="+30% productivité" />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Points clés</label>
                  <div className="space-y-2">
                    {exp.points.map((pt,pi) => (
                      <div key={pi} className="flex gap-2">
                        <input value={pt} onChange={e=>setExperiences(es=>es.map(ex=>ex.id===exp.id?{...ex,points:ex.points.map((p,idx)=>idx===pi?e.target.value:p)}:ex))}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition" placeholder="Description de la mission..." />
                        <button onClick={()=>setExperiences(es=>es.map(ex=>ex.id===exp.id?{...ex,points:ex.points.filter((_,idx)=>idx!==pi)}:ex))}
                          className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-400 hover:bg-red-100 transition"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    <button onClick={()=>setExperiences(es=>es.map(ex=>ex.id===exp.id?{...ex,points:[...ex.points,'']}:ex))}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-white transition">
                      <Plus size={13}/> Ajouter un point
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Technologies (séparées par des virgules)</label>
                  <input value={exp.techs.join(', ')} onChange={e=>setExperiences(es=>es.map(ex=>ex.id===exp.id?{...ex,techs:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)}:ex))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition"
                    placeholder="AWS, Docker, Kubernetes..." />
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={()=>setExperiences(es=>es.filter(e=>e.id!==exp.id))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-100 transition">
                    <Trash2 size={13}/> Supprimer cette expérience
                  </button>
                </div>
              </Card>
            ))}
            <button onClick={()=>setExperiences(es=>[...es,{id:Date.now().toString(),period:'',type:'',title:'',company:'',location:'',badge:'',points:[],techs:[]}])}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
              <Plus size={16}/> Ajouter une expérience
            </button>
          </div>
        )}

        {/* PROJETS */}
        {tab === 'projects' && (
          <div className="space-y-5">
            {projects.map((p,i) => (
              <Card key={p.id} icon={<FolderOpen size={18}/>} title={p.title||`Projet ${i+1}`}>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <Inp label="Titre du projet" value={p.title} onChange={v=>setProjects(ps=>ps.map(pr=>pr.id===p.id?{...pr,title:v}:pr))} />
                  <Inp label="Catégorie" value={p.category} onChange={v=>setProjects(ps=>ps.map(pr=>pr.id===p.id?{...pr,category:v}:pr))} placeholder="IA · Recrutement" />
                </div>
                <div className="mb-4">
                  <Txt label="Description" value={p.description} onChange={v=>setProjects(ps=>ps.map(pr=>pr.id===p.id?{...pr,description:v}:pr))} />
                </div>
                <Inp label="Stack technique (séparée par des virgules)" value={p.stack.join(', ')}
                  onChange={v=>setProjects(ps=>ps.map(pr=>pr.id===p.id?{...pr,stack:v.split(',').map(t=>t.trim()).filter(Boolean)}:pr))}
                  placeholder="React, Node.js, MongoDB" />
                <div className="mt-4 flex justify-end">
                  <button onClick={()=>setProjects(ps=>ps.filter(pr=>pr.id!==p.id))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-100 transition">
                    <Trash2 size={13}/> Supprimer ce projet
                  </button>
                </div>
              </Card>
            ))}
            <button onClick={()=>setProjects(ps=>[...ps,{id:Date.now().toString(),title:'',category:'',description:'',stack:[]}])}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
              <Plus size={16}/> Ajouter un projet
            </button>
          </div>
        )}

        {/* COMPÉTENCES */}
        {tab === 'skills' && (
          <Card icon={<Code size={18}/>} title="Compétences techniques">
            <div className="space-y-4">
              {skills.map((s,i) => (
                <div key={s.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input value={s.category} onChange={e=>setSkills(ss=>ss.map((sk,idx)=>idx===i?{...sk,category:e.target.value}:sk))}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-400 flex-1" placeholder="Catégorie" />
                    <button onClick={()=>setSkills(ss=>ss.filter((_,idx)=>idx!==i))}
                      className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-400 hover:bg-red-100 transition"><Trash2 size={13}/></button>
                  </div>
                  <input value={s.items.join(', ')} onChange={e=>setSkills(ss=>ss.map((sk,idx)=>idx===i?{...sk,items:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)}:sk))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 transition"
                    placeholder="Docker, Kubernetes, GitLab CI/CD..." />
                </div>
              ))}
              <button onClick={()=>setSkills(ss=>[...ss,{id:Date.now().toString(),category:'Nouvelle catégorie',items:[]}])}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                <Plus size={14}/> Ajouter une catégorie
              </button>
            </div>
          </Card>
        )}

        {/* CERTIFICATIONS */}
        {tab === 'certifications' && (
          <Card icon={<Award size={18}/>} title="Certifications">
            <div className="space-y-4">
              {certifications.map((c,i) => (
                <div key={c.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
                  <div>
                    {i===0 && <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nom de la certification</label>}
                    <input value={c.name} onChange={e=>setCertifications(cs=>cs.map((cert,idx)=>idx===i?{...cert,name:e.target.value}:cert))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition" placeholder="AWS Solutions Architect..." />
                  </div>
                  <div>
                    {i===0 && <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Organisme</label>}
                    <input value={c.issuer} onChange={e=>setCertifications(cs=>cs.map((cert,idx)=>idx===i?{...cert,issuer:e.target.value}:cert))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition" placeholder="Amazon Web Services..." />
                  </div>
                  <button onClick={()=>setCertifications(cs=>cs.filter((_,idx)=>idx!==i))}
                    className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-400 hover:bg-red-100 transition mb-0.5"><Trash2 size={15}/></button>
                </div>
              ))}
              <button onClick={()=>setCertifications(cs=>[...cs,{id:Date.now().toString(),name:'',issuer:''}])}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                <Plus size={14}/> Ajouter une certification
              </button>
            </div>
          </Card>
        )}

      </div>
    </main>
  );
}
