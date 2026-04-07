# Studeo — Guide de déploiement

## Prérequis

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Docker & Docker Compose (optionnel, recommandé)

## Développement local

### 1. Cloner et installer

```bash
git clone <repo-url>
cd account
cp .env.example .env
# Modifier .env avec vos valeurs
pnpm install
```

### 2. Démarrer la base de données

```bash
docker-compose up db -d
```

### 3. Initialiser la base de données

```bash
pnpm db:generate
cd apps/api && npx prisma migrate dev --name init
pnpm db:seed
```

### 4. Lancer en développement

```bash
# Terminal 1 : API
pnpm dev:api

# Terminal 2 : Web
pnpm dev:web
```

- API : http://localhost:3001
- Web : http://localhost:3000

### 5. Application mobile

```bash
cd apps/mobile
npx expo start
```

## Build de production

### Build complet

```bash
pnpm build
```

### Docker

```bash
docker-compose up --build
```

## Variables d'environnement

| Variable | Description | Requis |
|----------|------------|--------|
| `DATABASE_URL` | URL PostgreSQL | Oui |
| `JWT_SECRET` | Secret JWT (min 32 chars) | Oui |
| `JWT_REFRESH_SECRET` | Secret refresh token | Oui |
| `API_PORT` | Port de l'API (défaut: 3001) | Non |
| `NEXT_PUBLIC_API_URL` | URL de l'API pour le frontend | Oui |
| `UPLOAD_DIR` | Répertoire d'upload (défaut: ./uploads) | Non |
| `NODE_ENV` | Environnement (development/production) | Non |

## Déploiement en production

### Option 1 : Railway / Render

1. Créer un service PostgreSQL
2. Déployer l'API (apps/api) avec les variables d'environnement
3. Déployer le Web (apps/web) avec `NEXT_PUBLIC_API_URL` pointant vers l'API
4. Exécuter les migrations : `npx prisma migrate deploy`
5. Exécuter le seed : `npx tsx prisma/seed.ts`

### Option 2 : Docker sur VPS

```bash
# Sur le serveur
docker-compose -f docker-compose.yml up -d
```

### Option 3 : Vercel (Web) + Railway (API)

1. API sur Railway avec PostgreSQL
2. Web sur Vercel avec `NEXT_PUBLIC_API_URL` configuré
3. Configurer le domaine studeo.be

## Application mobile (App Store)

### Prérequis
- Compte Apple Developer (99€/an)
- Expo EAS CLI : `npm install -g eas-cli`

### Build iOS

```bash
cd apps/mobile
eas build --platform ios --profile production
```

### Soumission App Store

```bash
eas submit --platform ios
```

## Monitoring

- Logs API : `docker-compose logs -f api`
- Santé API : `GET /api/health`
- Base de données : `npx prisma studio`

## Sauvegardes

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20260407.sql
```
