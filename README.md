# Portfolio — Anas Oufkir

Ingénieur DevOps & Cloud AWS | Consultant ERP | Architecte infrastructure

Site personnel développé from scratch avec Next.js, TypeScript et PostgreSQL. Toutes les données sont dynamiques et modifiables via un panel d'administration que j'ai conçu et développé moi-même.

---

## Ce que j'ai construit

Un portfolio full-stack avec deux parties distinctes :

**Le site public** — une interface moderne qui présente mon parcours, mes compétences et mes projets. Les données sont lues depuis PostgreSQL à chaque visite, ce qui permet une mise à jour instantanée sans redéploiement.

**Le panel d'administration** — une interface sécurisée accessible uniquement avec mes credentials, qui me permet de modifier toutes les informations affichées sur le site en temps réel : profil, expériences, projets, compétences, certifications. Chaque sauvegarde utilise des transactions PostgreSQL pour garantir l'intégrité des données.

---

## Stack technique

**Frontend**
- Next.js 16 avec App Router et TypeScript
- Tailwind CSS v4 pour le styling
- Framer Motion pour les animations
- Architecture Server Components + Client Components

**Backend & Base de données**
- API Routes Next.js pour les endpoints admin
- PostgreSQL 16 comme base de données principale
- Authentification par cookie httpOnly sécurisé
- Transactions SQL pour éviter tout état incohérent

**Infrastructure**
- Ubuntu 24.04 LTS sur VPS
- Nginx comme reverse proxy avec SSL/TLS
- Let's Encrypt pour les certificats SSL
- Systemd pour la gestion du service Node.js
- Fail2ban pour la protection contre les attaques
- UFW comme firewall

---

## Architecture

```
Internet (HTTPS)
      |
   Nginx
   - Reverse proxy
   - SSL termination
   - Rate limiting
   - Security headers (HSTS, CSP, X-Frame-Options...)
      |
   Next.js (port interne)
   - /              → Portfolio public (Server Component)
   - /admin         → Login admin
   - /admin/dashboard → Panel d'administration
   - /api/admin/*   → API sécurisée
      |
   PostgreSQL
   - portfolio_profile
   - experiences
   - projects
   - skills
   - certifications
   - admin_users
```

---

## Base de données

Six tables conçues pour couvrir l'ensemble du contenu du portfolio :

```sql
portfolio_profile  -- Profil principal (nom, titre, bio, contact, disponibilité)
experiences        -- Expériences professionnelles avec points clés et technologies
projects           -- Projets avec description et stack technique
skills             -- Compétences regroupées par catégorie
certifications     -- Certifications professionnelles
admin_users        -- Utilisateurs admin avec mot de passe hashé (bcrypt)
```

---

## Sécurité

Plusieurs couches de sécurité ont été mises en place :

- **Authentification** — cookie `httpOnly`, `secure`, `sameSite=lax` avec expiration 7 jours
- **Protection des routes** — middleware Next.js (proxy.ts) qui vérifie le cookie sur `/admin/dashboard`
- **Mots de passe** — hashés avec bcryptjs, cost factor 12
- **Nginx** — headers de sécurité complets, rate limiting, server_tokens off
- **Fail2ban** — bannissement automatique après tentatives répétées
- **Firewall** — UFW avec uniquement les ports 22, 80, 443 ouverts
- **PostgreSQL** — utilisateur dédié avec permissions minimales

---

## Fonctionnement du panel admin

```
1. Connexion sur /admin avec credentials
2. Cookie de session créé (httpOnly, 7 jours)
3. Redirection vers /admin/dashboard
4. Chargement des données depuis PostgreSQL via GET /api/admin/data
5. Modification des informations dans l'interface
6. Clic "Sauvegarder" → POST /api/admin/data
7. Transaction PostgreSQL : UPDATE profil + DELETE/INSERT autres tables
8. Portfolio public mis à jour immédiatement au prochain chargement
```

---

## Installation locale

```bash
# Cloner le projet
git clone https://github.com/anasoufkir/portfolio.git
cd portfolio

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Initialiser la base de données
psql -d votre_base -f reset-db.sql

# Lancer en développement
npm run dev
```

---

## Variables d'environnement

```env
# Admin
ADMIN_USERNAME=
ADMIN_PASSWORD=

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/database

# Node
NODE_ENV=production
PORT=3001
```

---

## Structure du projet

```
portfolio/
├── app/
│   ├── page.tsx                     # Server Component — lecture PostgreSQL
│   ├── page-client.tsx              # Client Component — UI portfolio
│   ├── layout.tsx                   # Layout + métadonnées SEO
│   ├── globals.css                  # Tailwind v4
│   ├── admin/
│   │   ├── page.tsx                 # Page login
│   │   └── dashboard/
│   │       └── page.tsx             # Panel d'administration
│   └── api/
│       └── admin/
│           ├── login/route.ts       # Authentification
│           ├── logout/route.ts      # Déconnexion
│           └── data/route.ts        # CRUD données portfolio
├── public/
│   ├── photo.jpg                    # Photo de profil
│   └── Anas_Oufkir_CV.pdf          # CV téléchargeable
├── proxy.ts                         # Middleware protection routes admin
├── .env.example                     # Template variables d'environnement
├── .env.local                       # Variables locales (ignoré par git)
├── reset-db.sql                     # Script initialisation base de données
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Déploiement

Le site tourne sur un VPS Ubuntu 24.04 géré manuellement.

```bash
# Build et déploiement
npm run build
systemctl restart portfolio

# Logs
journalctl -u portfolio -f

# Statut
systemctl status portfolio
```

---

## Ce que ce projet démontre

Au-delà du portfolio lui-même, ce projet illustre ma capacité à :

- Concevoir et déployer une application full-stack de A à Z
- Gérer une infrastructure Linux en production (Nginx, systemd, PostgreSQL)
- Mettre en place des mécanismes de sécurité adaptés (SSL, headers, auth, firewall)
- Écrire du TypeScript propre avec Next.js App Router
- Administrer PostgreSQL et concevoir un schéma de données cohérent
- Automatiser et maintenir un service en production

---

Anas Oufkir — [anasoufkir.com](https://anasoufkir.com) — Anasoufkir94@gmail.com
