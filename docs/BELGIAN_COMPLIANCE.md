# Studeo — Conformité réglementaire belge

Ce document référence les règles belges intégrées dans Studeo et distingue entre obligations légales vérifiées, bonnes pratiques et décisions produit.

## Données réglementaires intégrées

### Étudiant jobiste (Obligation légale)

| Règle | Valeur | Source | Statut |
|-------|--------|--------|--------|
| Heures max/an avec cotisations réduites | 650h | L&E Global, studentatwork.be | Vérifié — permanent depuis 01/01/2025 |
| Cotisation solidarité (employé) | 2,71% | studentatwork.be, ONSS | Vérifié |
| Cotisation solidarité (employeur) | 5,42% | studentatwork.be, ONSS | Vérifié |
| Contrat étudiant obligatoire | Oui, avant début du travail | Code du travail belge | Vérifié |
| Déclaration Dimona | Avant le premier jour | ONSS | Vérifié |

### Fiscalité (Obligation légale)

| Règle | Valeur | Source | Statut |
|-------|--------|--------|--------|
| Montant exonéré d'impôts | €10.910 | SPF Finances (exercice 2026, revenus 2025) | Vérifié |
| Déduction forfaitaire frais | 30%, max €5.930 | SPF Finances | Vérifié |
| Revenu brut max sans impôt | ~€15.585 | Calcul basé sur données SPF | Estimation vérifiable |
| Tranches d'imposition | 25%/40%/45%/50% | SPF Finances | Vérifié |
| Déclaration papier | 30 juin 2026 | SPF Finances | Vérifié |
| Déclaration en ligne | 15 juillet 2026 | SPF Finances | Vérifié |
| Déclaration indépendant | 16 octobre 2026 | SPF Finances | Vérifié |

### Étudiant indépendant (Obligation légale)

| Règle | Valeur | Source | Statut |
|-------|--------|--------|--------|
| Âge | 18-25 ans | INASTI/RSVZ | Vérifié |
| Crédits ECTS minimum | 27 | INASTI/RSVZ | Vérifié |
| Seuil exemption cotisations | €8.687,04 net/an | INASTI/RSVZ | Vérifié (indexation annuelle) |
| Seuil cotisations réduites | €17.374,08 net/an | INASTI/RSVZ | Vérifié (indexation annuelle) |
| Exemption TVA | €25.000 CA/an | SPF Finances | Vérifié |
| Inscription BCE | Obligatoire | BCE | Vérifié |
| Affiliation caisse sociale | Obligatoire | INASTI | Vérifié |

### Personne à charge (Obligation légale)

| Règle | Valeur | Source | Statut |
|-------|--------|--------|--------|
| Seuil revenus nets (parents ensemble) | €7.290 | SPF Finances | Vérifié (indexation annuelle) |
| Exemption travail étudiant | €3.360 | SPF Finances | Vérifié |
| Limite allocations familiales (indép.) | €16.861,46 | Groeipakket | Vérifié |

## Hypothèses produit

| Hypothèse | Justification | Impact si incorrecte |
|-----------|---------------|---------------------|
| Les seuils ne changent pas significativement entre 2025-2026 | Indexation généralement faible | Mettre à jour les constantes annuellement |
| La taxe communale moyenne est de ~7% | Varie par commune (0-9%) | Impact mineur sur l'estimation |
| La majorité des étudiants belges francophones | Données démographiques | Support NL/EN en V2 |

## Décisions produit

| Décision | Choix | Alternative possible |
|----------|-------|---------------------|
| Disclaimer permanent | "Estimation à titre indicatif" sur tout calcul | Certification par comptable |
| Pas de conseil personnalisé | Information générale uniquement | Partenariat avec comptables |
| Conservation 7 ans | Obligation fiscale belge | Conservation plus courte avec avertissement |
| Régionalisation simplifiée | 3 régions avec règles différentes pour allocations | Granularité communale |

## Conformité RGPD

| Exigence | Implémentation | Statut |
|----------|---------------|--------|
| Base légale | Contrat + consentement | Implémenté |
| Droit d'accès | GET /profile + export | Implémenté |
| Droit de rectification | PUT /profile | Implémenté |
| Droit à l'effacement | Suppression de compte | Prévu |
| Droit à la portabilité | Export JSON des données | Prévu |
| Politique de confidentialité | Page dédiée + mentions | Implémenté |
| DPO | Contact privacy@studeo.be | Implémenté |
| APD/GBA référencée | Dans la politique | Implémenté |

## Sources officielles

- **SPF Finances** : https://fin.belgium.be
- **ONSS/RSZ** : https://www.rsz.fgov.be
- **INASTI/RSVZ** : https://www.rsvz-inasti.fgov.be
- **Student@work** : https://www.studentatwork.be
- **Groeipakket** : https://www.groeipakket.be
- **APD/GBA** : https://www.autoriteprotectiondonnees.be
