# ProspectHunter

CRM de prospection pour freelance web — trouve les entreprises locales sans site web et gère ton pipeline client.

## Fonctionnalités

- Recherche d'entreprises par secteur (code NAF) et département via l'API SIRENE officielle
- Détection automatique de site web via Google Places API
- Récupération du numéro de téléphone via Google Places API
- Gestion des prospects avec statuts (Nouveau, Contacté, Intéressé, Client, Perdu)
- Dashboard avec statistiques et taux de contact
- Authentification par mot de passe

## Stack

- Next.js 15 (App Router)
- TypeScript
- Prisma 5 + SQLite
- Tailwind CSS v4
- API SIRENE (data.gouv.fr)
- Google Places API (New)

## Installation

### Prérequis
- Node.js 20+
- Clé API Google Places
- Compte Fly.io (pour le déploiement)

### Lancer en local

1. Cloner le repo
2. Installer les dépendances :
```bash
   npm install
```
3. Créer le fichier `.env` :
```env
   DATABASE_URL="file:./dev.db"
```
4. Créer le fichier `.env.local` :
```env
   DATABASE_URL="file:./dev.db"
   GOOGLE_PLACES_API_KEY="votre_cle"
   APP_PASSWORD="votre_mot_de_passe"
   SESSION_SECRET="chaine_aleatoire_32_caracteres_minimum"
```
5. Initialiser la base de données :
```bash
   npx prisma migrate dev
```
6. Lancer le serveur :
```bash
   npm run dev
```

## Déploiement Fly.io
```bash
fly auth login
fly launch
fly volumes create data --size 1
fly secrets set DATABASE_URL="file:/data/prospect.db"
fly secrets set GOOGLE_PLACES_API_KEY="votre_cle"
fly secrets set APP_PASSWORD="votre_mot_de_passe"
fly secrets set SESSION_SECRET="votre_secret"
fly deploy
```

## APIs utilisées

- **SIRENE** : `recherche-entreprises.api.gouv.fr` 
- **Google Places (New)** : `places.googleapis.com` 