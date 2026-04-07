# Studeo — Ton admin, en clair.

Application de gestion administrative et financière pour étudiants belges.

## Fonctionnalités

- **Compteur d'heures** — Suivi du contingent 650h/an avec alertes
- **Revenus & dépenses** — Enregistrement et catégorisation
- **Documents** — Upload et classement de justificatifs
- **Obligations** — Checklist personnalisée selon statut et région
- **Simulateur fiscal** — Estimation d'impôts et cotisations
- **Guide pratique** — Fiscalité belge étudiante expliquée simplement
- **Rappels d'échéances** — Dates limites fiscales et administratives

## Architecture

Monorepo pnpm avec 3 applications :

```
packages/shared/    — Types, constantes belges, utilitaires de calcul
apps/api/           — API Express + Prisma + PostgreSQL
apps/web/           — Next.js 14 (landing page + web app)
apps/mobile/        — React Native / Expo (iOS)
```

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js, Express, TypeScript, Prisma, PostgreSQL |
| Web | Next.js 14, Tailwind CSS, React |
| Mobile | React Native, Expo |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Tests | Vitest, Supertest |
| Deploy | Docker, docker-compose |

## Démarrage rapide

### Prérequis
- Node.js 20+
- pnpm 9+
- PostgreSQL 16+ (ou Docker)

### Installation

```bash
git clone <repo-url>
cd account
cp .env.example .env
# Modifier .env avec vos valeurs

pnpm install
```

### Base de données

```bash
# Démarrer PostgreSQL via Docker
docker-compose up db -d

# Générer le client Prisma
pnpm db:generate

# Appliquer les migrations
cd apps/api && npx prisma migrate dev --name init

# Seed (obligations + articles)
pnpm db:seed
```

### Développement

```bash
# API (http://localhost:3001)
pnpm dev:api

# Web (http://localhost:3000)
pnpm dev:web

# Mobile
cd apps/mobile && npx expo start
```

### Build

```bash
pnpm build
```

### Tests

```bash
pnpm test
```

## Données réglementaires belges

Toutes les constantes réglementaires sont centralisées dans `packages/shared/src/constants/index.ts` avec sources vérifiées :

| Règle | Valeur | Source |
|-------|--------|--------|
| Heures étudiant/an | 650h | studentatwork.be |
| Cotisation solidarité | 2,71% | ONSS |
| Exonération fiscale | €10.910 | SPF Finances |
| Seuil indépendant | €8.687 | INASTI |
| Exemption TVA | €25.000 | SPF Finances |

Voir `docs/BELGIAN_COMPLIANCE.md` pour le détail complet.

## Documentation

- [Vision produit](docs/PRODUCT.md)
- [API](docs/API.md)
- [Déploiement](docs/DEPLOYMENT.md)
- [Conformité belge](docs/BELGIAN_COMPLIANCE.md)
- [App Store](docs/APP_STORE.md)

## Avertissement

Studeo fournit des estimations à titre indicatif. Il ne constitue pas un conseil fiscal, juridique ou comptable. Consultez un professionnel agréé pour votre situation personnelle.

## Licence

Propriétaire. Tous droits réservés.
