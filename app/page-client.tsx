'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Award, CheckCircle, Download, GitBranch, Globe, GraduationCap, Mail, MapPin } from 'lucide-react';

interface Profile {
  name?: string; title?: string; description?: string; email?: string;
  linkedin?: string; github?: string; website?: string; location?: string; available?: boolean;
}
interface Experience { id: number; period: string; type: string; title: string; company: string; location: string; badge: string; points: string[]; techs: string[] }
interface Project { id: number; title: string; category: string; description: string; stack: string[] }
interface Skill { id: number; category: string; items: string[] }
interface Certification { id: number; name: string; issuer: string }
interface PageData { profile: Profile; experiences: Experience[]; projects: Project[]; skills: Skill[]; certifications: Certification[] }

const techConfig: Record<string, { color: string; bg: string; short: string }> = {
  AWS:        { color: '#FF9900', bg: '#fff3e0', short: 'AWS' },
  Docker:     { color: '#2496ED', bg: '#e3f2fd', short: 'DKR' },
  Kubernetes: { color: '#326CE5', bg: '#e8eaf6', short: 'K8s' },
  Proxmox:    { color: '#E57000', bg: '#fff3e0', short: 'PVE' },
  Prometheus: { color: '#E6522C', bg: '#fce4ec', short: 'PRM' },
  Grafana:    { color: '#F46800', bg: '#fff8e1', short: 'GRF' },
  Loki:       { color: '#F5A623', bg: '#fffde7', short: 'LKI' },
  Terraform:  { color: '#7B42BC', bg: '#f3e5f5', short: 'TF'  },
  Ansible:    { color: '#EE0000', bg: '#ffebee', short: 'ANS' },
  GitLab:     { color: '#FC6D26', bg: '#fff3e0', short: 'GL'  },
  Linux:      { color: '#444',    bg: '#f5f5f5', short: 'LNX' },
  PostgreSQL: { color: '#336791', bg: '#e3f2fd', short: 'PG'  },
};

function TechBadge({ name }: { name: string }) {
  const cfg = techConfig[name] ?? { color: '#6366f1', bg: '#eef2ff', short: name.slice(0,3).toUpperCase() };
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition"
      style={{ borderColor: cfg.color + '30' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[9px] font-bold"
        style={{ background: cfg.bg, color: cfg.color }}>{cfg.short}</div>
      <span className="text-[10px] font-medium text-slate-500">{name}</span>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{label}</span>;
}

function Heading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-12">
      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{label}</span>
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h2>
    </div>
  );
}

function TypingTitle({ words }: { words: string[] }) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (!words.length) return;
    const cur = words[idx % words.length];
    const t = setTimeout(() => {
      if (!del && sub < cur.length) { setText(cur.slice(0, sub + 1)); setSub(v => v + 1); }
      else if (del && sub > 0) { setText(cur.slice(0, sub - 1)); setSub(v => v - 1); }
      else if (!del) setDel(true);
      else { setDel(false); setIdx(v => (v + 1) % words.length); }
    }, del ? 35 : sub === cur.length ? 1800 : 75);
    return () => clearTimeout(t);
  }, [del, idx, sub, words]);
  return (
    <span className="text-slate-500 text-xl font-medium">
      {text}<span className="ml-0.5 inline-block w-[2px] h-5 bg-slate-400 align-middle animate-pulse" />
    </span>
  );
}

function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const send = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const r = await fetch('https://formsubmit.co/ajax/' + email, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `[Portfolio] ${form.subject || 'Message de ' + form.name}` }),
      });
      setStatus(r.ok ? 'success' : 'error');
      if (r.ok) setForm({ name: '', email: '', subject: '', message: '' });
    } catch { setStatus('error'); }
  };
  const cls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-slate-400";
  if (status === 'success') return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-green-50 p-12 text-center">
      <CheckCircle size={40} className="mb-4 text-green-500" />
      <p className="text-lg font-semibold text-slate-800">Message envoyé !</p>
      <button onClick={() => setStatus('idle')} className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600">Nouveau message</button>
    </div>
  );
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom *</label><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} className={cls} placeholder="Votre nom" /></div>
        <div><label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label><input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} className={cls} placeholder="vous@entreprise.com" /></div>
      </div>
      <div className="mt-4"><label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Sujet</label><input value={form.subject} onChange={e => setForm({...form,subject:e.target.value})} className={cls} placeholder="Mission, recrutement..." /></div>
      <div className="mt-4"><label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Message *</label><textarea rows={5} value={form.message} onChange={e => setForm({...form,message:e.target.value})} className={cls} placeholder="Décrivez votre besoin..." /></div>
      {status === 'error' && <p className="mt-3 text-sm text-red-500">Erreur — écrivez directement à {email}</p>}
      <button onClick={send} disabled={status === 'loading'} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
        {status === 'loading' ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>Envoi...</> : <>Envoyer <ArrowRight size={15}/></>}
      </button>
    </div>
  );
}

const expertiseCards = [
  { num:'01', icon:'📊', title:'Monitoring & Observabilité', color:'border-orange-200 bg-orange-50', ibg:'bg-orange-100', desc:'Prometheus (PromQL, alertmanager, SLI/SLO/SLA), dashboards Grafana, centralisation des logs Loki.', techs:['Prometheus','Grafana','Loki','Alertmanager'] },
  { num:'02', icon:'🖥️', title:'Virtualisation & Cloud', color:'border-blue-200 bg-blue-50', ibg:'bg-blue-100', desc:'Proxmox : clusters HA, VMs KVM, LXC, Ceph. AWS haute disponibilité. Certifié SA.', techs:['Proxmox','AWS','Azure','EC2'] },
  { num:'03', icon:'⚡', title:'CI/CD & IaC', color:'border-violet-200 bg-violet-50', ibg:'bg-violet-100', desc:'GitLab CI/CD, Terraform, Ansible, Puppet. Résultat : +30% de productivité.', techs:['GitLab CI/CD','Terraform','Ansible','Puppet'] },
  { num:'04', icon:'📦', title:'Conteneurisation', color:'border-cyan-200 bg-cyan-50', ibg:'bg-cyan-100', desc:'Docker et Kubernetes en production. Clusters résilients, RBAC, rolling/canary.', techs:['Docker','Kubernetes'] },
  { num:'05', icon:'🗄️', title:'Bases de données', color:'border-green-200 bg-green-50', ibg:'bg-green-100', desc:'Optimisation PostgreSQL, MongoDB, MySQL. SonarQube intégré en CI/CD.', techs:['PostgreSQL','MongoDB','MySQL','SonarQube'] },
  { num:'06', icon:'💻', title:'Développement & ERP', color:'border-pink-200 bg-pink-50', ibg:'bg-pink-100', desc:'API REST, microservices, React/Angular. ERP OpenProd, Odoo v8→v15.', techs:['Python','Java','C#','React','Angular'] },
];

const expColors = ['bg-green-50 text-green-700 border-green-200','bg-blue-50 text-blue-700 border-blue-200','bg-slate-100 text-slate-600 border-slate-200'];
const expIcons = ['🏢','🔷','🌿'];
const projColors = ['border-violet-200 bg-violet-50','border-blue-200 bg-blue-50','border-green-200 bg-green-50'];
const projIcons = ['🤖','📋','🔗'];
const heroTechs = ['AWS','Docker','Kubernetes','Proxmox','Prometheus','Grafana','Loki','Terraform'];
const allTechs = ['AWS','Docker','Kubernetes','Proxmox','Prometheus','Grafana','Loki','Terraform','Ansible','GitLab','Linux','PostgreSQL'];

export default function PageClient({ data }: { data: PageData }) {
  const { profile, experiences, projects, skills, certifications } = data;
  const typingWords = useMemo(() => [profile.title || 'Ingénieur DevOps & Cloud AWS', 'Expert Prometheus · Grafana · Loki', 'Consultant ERP & Architecture'], [profile.title]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <Image src="/photo.jpg" alt={profile.name || 'Anas Oufkir'} fill className="object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{profile.name}</div>
              <div className="text-xs text-slate-400">{profile.title}</div>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-slate-500 md:flex">
            {[['#expertise','Expertise'],['#experience','Expériences'],['#projets','Projets'],['#formation','Formation'],['#contact','Contact']].map(([h,l]) => (
              <a key={h} href={h} className="font-medium transition hover:text-slate-900">{l}</a>
            ))}
          </nav>
          <a href="/Anas_Oufkir_CV.pdf" download className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 shadow-sm">
            <Download size={14} /> CV
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              {profile.available && (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Disponible immédiatement · CDI
                </div>
              )}
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">{profile.name}</h1>
              <div className="mt-2 min-h-[36px]"><TypingTitle words={typingWords} /></div>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">{profile.description}</p>
              <div className="mt-7 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {heroTechs.map(t => <TechBadge key={t} name={t} />)}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/Anas_Oufkir_CV.pdf" download className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 shadow-sm">
                  <Download size={16}/> Télécharger le CV
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm">
                  <Mail size={16}/> Me contacter
                </a>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2,duration:0.6}}
              className="hidden lg:flex flex-col items-center gap-4">
              <div className="relative h-64 w-64 overflow-hidden rounded-3xl border-4 border-white shadow-xl ring-1 ring-slate-200">
                <Image src="/photo.jpg" alt={profile.name||'Anas Oufkir'} fill className="object-cover object-top" />
              </div>
              <div className="w-72 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-slate-900">{profile.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{profile.title}</div>
                  </div>
                  {profile.available && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"/> Open to work
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
                  {profile.email && <div className="flex items-center gap-2"><Mail size={12} className="text-slate-400"/>{profile.email}</div>}
                  {profile.location && <div className="flex items-center gap-2"><MapPin size={12} className="text-slate-400"/>{profile.location}</div>}
                  {profile.website && <div className="flex items-center gap-2"><Globe size={12} className="text-slate-400"/>{profile.website.replace('https://','')}</div>}
                  {profile.github && <div className="flex items-center gap-2"><GitBranch size={12} className="text-slate-400"/>{profile.github.replace('https://','')}</div>}
                </div>
                {certifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Certifications</div>
                    {certifications.slice(0,2).map(c => (
                      <div key={c.id} className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0"/>{c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[['2+ ans','Kazacube — CDI','🏢'],['AWS','Solutions Architect','☁️'],['+30%','Productivité CI/CD','⚡'],['Expert','Proxmox & Monitoring','📊']].map(([v,l,e]) => (
              <div key={v} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center hover:shadow-md transition">
                <div className="text-2xl mb-2">{e}</div>
                <div className="text-lg font-bold text-slate-900">{v}</div>
                <div className="mt-1 text-xs text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise" className="mx-auto max-w-6xl px-6 py-24">
        <Heading label="Expertise" title="Domaines de maîtrise" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {expertiseCards.map((zone,i) => (
            <motion.div key={zone.num} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06,duration:0.5}}
              className={`rounded-2xl border ${zone.color} p-6 hover:shadow-md transition`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl ${zone.ibg} flex items-center justify-center text-xl`}>{zone.icon}</div>
                <span className="text-xs font-mono text-slate-300">{zone.num}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{zone.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{zone.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">{zone.techs.map(t => <Pill key={t} label={t}/>)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPÉRIENCES */}
      <section id="experience" className="bg-white border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Heading label="Expériences" title="Parcours professionnel" />
          <div className="space-y-5">
            {experiences.map((exp,i) => (
              <motion.div key={exp.id} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05,duration:0.5}}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">{expIcons[i]||'💼'}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{exp.period}</span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500">{exp.type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{exp.title}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-0.5">
                        {exp.company} <span className="text-slate-200">·</span> <MapPin size={11}/> {exp.location}
                      </div>
                    </div>
                  </div>
                  {exp.badge && <span className={`self-start rounded-full border px-3 py-1 text-xs font-semibold ${expColors[i]||expColors[0]}`}>{exp.badge}</span>}
                </div>
                <ul className="space-y-2 mb-5">
                  {(exp.points||[]).map((p,pi) => (
                    <li key={pi} className="flex items-start gap-3 text-sm text-slate-500">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"/>{p}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                  {(exp.techs||[]).map(t => <Pill key={t} label={t}/>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPÉTENCES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Heading label="Compétences" title="Stack technique" />
        <div className="mb-8 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {allTechs.map(t => <TechBadge key={t} name={t}/>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((block,i) => (
            <motion.div key={block.id} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05,duration:0.45}}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">{block.category}</h3>
              <div className="flex flex-wrap gap-2">{(block.items||[]).map(s => <Pill key={s} label={s}/>)}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">🌍 Langues</h3>
          <div className="flex flex-wrap gap-6">
            {[['🇫🇷','Français','Courant'],['🇬🇧','Anglais','Professionnel'],['🇲🇦','Arabe','Natif']].map(([flag,l,v]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-lg">{flag}</span>
                <span className="text-sm font-semibold text-slate-700">{l}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJETS */}
      <section id="projets" className="bg-white border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Heading label="Projets" title="Réalisations" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p,i) => (
              <motion.div key={p.id} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06,duration:0.45}}
                className={`group rounded-2xl border ${projColors[i]||projColors[0]} p-6 hover:shadow-md transition`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{projIcons[i]||'📁'}</span>
                  <span className="text-xs font-medium text-slate-400">{p.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{(p.stack||[]).map(s => <Pill key={s} label={s}/>)}</div>
                <a href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
                  En savoir plus <ArrowRight size={12}/>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATION */}
      <section id="formation" className="mx-auto max-w-6xl px-6 py-24">
        <Heading label="Formation & Certifications" title="Parcours académique" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-600"><GraduationCap size={18} className="text-slate-400"/> Diplômes</div>
            <div className="space-y-3">
              {[
                {period:'2019 — 2023',degree:"Diplôme d'ingénieur",field:'Ingénierie Informatique et Réseaux',school:"École Marocaine des Sciences de l'Ingénieur",icon:'🎓'},
                {period:'2016 — 2018',degree:'Diplôme Universitaire',field:'Génie Informatique',school:'École Supérieure de Technologie Meknès',icon:'📚'},
                {period:'2015 — 2016',degree:'Baccalauréat',field:'Sciences Physique et Chimie',school:'Lycée Toulouj',icon:'🏫'},
              ].map((e,i) => (
                <motion.div key={i} initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.06}}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="text-2xl">{e.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-1">{e.period}</div>
                    <div className="text-sm font-bold text-slate-900">{e.degree}</div>
                    <div className="text-sm text-slate-600">{e.field}</div>
                    <div className="mt-1 text-xs text-slate-400">{e.school}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-600"><Award size={18} className="text-slate-400"/> Certifications</div>
            <div className="space-y-3">
              {certifications.map((c,i) => (
                <motion.div key={c.id} initial={{opacity:0,x:12}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.06}}
                  className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{c.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{c.issuer}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Heading label="Contact" title="Travaillons ensemble" />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-sm leading-7 text-slate-500 mb-8">Disponible immédiatement pour un poste DevOps/Cloud en CDI, une mission technique ou un échange autour d&apos;une architecture.</p>
              <div className="space-y-3">
                {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:bg-white hover:border-slate-300 hover:text-slate-900"><Mail size={15} className="text-slate-400 shrink-0"/>{profile.email}</a>}
                {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:bg-white hover:border-slate-300 hover:text-slate-900"><Globe size={15} className="text-slate-400 shrink-0"/>{profile.website.replace('https://','')}</a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:bg-white hover:border-slate-300 hover:text-slate-900"><GitBranch size={15} className="text-slate-400 shrink-0"/>{profile.linkedin.replace('https://www.','')}</a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:bg-white hover:border-slate-300 hover:text-slate-900"><GitBranch size={15} className="text-slate-400 shrink-0"/>{profile.github.replace('https://','')}</a>}
              </div>
              {profile.available && (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
                    Disponible immédiatement
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={11}/> {profile.location} · Permis B · Autorisé France
                  </div>
                </div>
              )}
            </div>
            <ContactForm email={profile.email||'Anasoufkir94@gmail.com'}/>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8 text-center text-xs text-slate-400">
        © 2026 {profile.name} · {profile.title} · Paris
      </footer>
    </main>
  );
}
