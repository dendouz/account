import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed obligations
  const obligations = [
    {
      title: "Déclaration fiscale annuelle",
      description:
        "Vous devez remplir votre déclaration d'impôts chaque année, même si vos revenus sont inférieurs au montant exonéré. Utilisez Tax-on-web (MyMinfin) pour soumettre en ligne avant la date limite.",
      deadline: new Date("2026-07-15"),
      category: "fiscal",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR", "OTHER"],
      regions: [],
    },
    {
      title: "Déclaration fiscale (indépendant)",
      description:
        "En tant qu'étudiant indépendant, vous avez une date limite étendue pour votre déclaration fiscale via Tax-on-web. Vous devez déclarer tous vos revenus professionnels.",
      deadline: new Date("2026-10-16"),
      category: "fiscal",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      regions: [],
    },
    {
      title: "Vérifier son compteur d'heures",
      description:
        "Consultez régulièrement votre solde d'heures sur studentatwork.be. Vous disposez de 650 heures par an avec cotisations réduites. Au-delà, les cotisations sociales complètes s'appliquent.",
      deadline: null,
      category: "social",
      studentStatuses: ["JOBISTE"],
      regions: [],
    },
    {
      title: "Affiliation à une caisse d'assurances sociales",
      description:
        "En tant qu'étudiant indépendant, vous devez vous affilier à une caisse d'assurances sociales (comme Partena, Acerta, Securex...) dès le début de votre activité. C'est une obligation légale.",
      deadline: null,
      category: "social",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      regions: [],
    },
    {
      title: "Inscription à la BCE",
      description:
        "Vous devez obtenir un numéro d'entreprise auprès de la Banque-Carrefour des Entreprises (BCE) et, si nécessaire, un numéro de TVA. Passez par un guichet d'entreprises agréé.",
      deadline: null,
      category: "admin",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      regions: [],
    },
    {
      title: "Paiement des cotisations sociales trimestrielles",
      description:
        "Si vos revenus nets dépassent €8.687,04 par an, vous devez payer des cotisations sociales trimestrielles à votre caisse d'assurances sociales. Vérifiez votre situation chaque trimestre.",
      deadline: null,
      category: "social",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      regions: [],
    },
    {
      title: "Vérifier le statut de personne à charge",
      description:
        "Si vos revenus nets dépassent un certain seuil, vous ne serez plus considéré comme personne à charge de vos parents. Cela peut augmenter leurs impôts. Surveillez vos revenus.",
      deadline: null,
      category: "fiscal",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR", "OTHER"],
      regions: [],
    },
    {
      title: "Déclaration TVA trimestrielle",
      description:
        "Si vous êtes assujetti à la TVA (chiffre d'affaires > €25.000 ou choix volontaire), vous devez soumettre une déclaration TVA chaque trimestre via Intervat.",
      deadline: null,
      category: "fiscal",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      regions: [],
    },
    {
      title: "Conserver ses justificatifs",
      description:
        "Gardez tous vos justificatifs (fiches de paie, factures, reçus, contrats) pendant au moins 7 ans. Ils peuvent être demandés en cas de contrôle fiscal.",
      deadline: null,
      category: "admin",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR", "OTHER"],
      regions: [],
    },
    {
      title: "Vérifier l'impact sur les allocations familiales",
      description:
        "Vos revenus d'activité peuvent impacter vos allocations familiales. Les règles varient selon votre région (Flandre, Wallonie, Bruxelles). Vérifiez les seuils applicables.",
      deadline: null,
      category: "social",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR"],
      regions: [],
    },
  ];

  for (const obligation of obligations) {
    await prisma.obligation.create({ data: obligation as any });
  }
  console.log(`Created ${obligations.length} obligations`);

  // Seed knowledge articles
  const articles = [
    {
      slug: "etudiant-jobiste-101",
      title: "Étudiant jobiste : les bases",
      content: `## Qu'est-ce qu'un étudiant jobiste ?

Un étudiant jobiste est un étudiant qui travaille sous un **contrat de travail étudiant**. Ce statut vous donne droit à des cotisations sociales réduites.

### Les règles essentielles

- **650 heures par an** : Vous pouvez travailler jusqu'à 650 heures par année civile avec des cotisations réduites (2,71% au lieu de 13,07%).
- **Contrat obligatoire** : Votre employeur doit établir un contrat de travail étudiant écrit AVANT le début du travail.
- **Déclaration Dimona** : Votre employeur doit vous déclarer à l'ONSS via une déclaration Dimona avant votre premier jour.

### Comment suivre vos heures ?

Utilisez le site **studentatwork.be** pour consulter votre compteur d'heures en temps réel. Studeo vous aide aussi à suivre vos heures facilement.

### Que se passe-t-il après 650 heures ?

Au-delà de 650 heures, vous payez les cotisations sociales normales (13,07% au lieu de 2,71%). Votre salaire net sera donc plus bas.

**Source** : studentatwork.be, L&E Global`,
      category: "statut",
      studentStatuses: ["JOBISTE"],
      sortOrder: 1,
    },
    {
      slug: "etudiant-independant-101",
      title: "Étudiant indépendant : les bases",
      content: `## Qu'est-ce qu'un étudiant indépendant ?

Le statut d'étudiant indépendant permet aux étudiants de 18 à 25 ans de lancer une activité indépendante tout en bénéficiant de conditions sociales avantageuses.

### Conditions

- Avoir entre **18 et 25 ans**
- Être inscrit dans un établissement d'enseignement reconnu
- Suivre au minimum **27 crédits ECTS** (ou 17h de cours/semaine)

### Cotisations sociales

Vos cotisations dépendent de vos revenus nets annuels :

| Revenus nets annuels | Cotisations |
|---|---|
| Moins de €8.687 | Aucune cotisation |
| €8.687 à €17.374 | Cotisations réduites |
| Plus de €17.374 | Cotisations complètes |

### Démarches obligatoires

1. S'inscrire auprès d'un **guichet d'entreprises** (Partena, Acerta, Liantis...)
2. Obtenir un **numéro d'entreprise** à la BCE
3. S'affilier à une **caisse d'assurances sociales**
4. Activer votre **numéro de TVA** si nécessaire

**Sources** : INASTI/RSVZ, Partena Professional`,
      category: "statut",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      sortOrder: 2,
    },
    {
      slug: "impots-etudiants",
      title: "Comprendre les impôts quand on est étudiant",
      content: `## La déclaration d'impôts

Tout étudiant qui a travaillé en Belgique doit en principe remplir une **déclaration d'impôts** (ou vérifier sa proposition de déclaration simplifiée).

### Montant exonéré

Pour les revenus de 2025 (déclaration 2026), le montant exonéré d'impôts est de **€10.910**. Avec la déduction forfaitaire de frais professionnels (30%, max €5.930), vous pouvez gagner environ **€15.585 brut** sans payer d'impôts.

### Dates limites

- **30 juin 2026** : déclaration papier
- **15 juillet 2026** : déclaration en ligne (Tax-on-web)
- **16 octobre 2026** : revenus d'indépendant

### Personne à charge

Pour rester à charge de vos parents, vos revenus nets ne doivent pas dépasser un certain seuil (environ €7.290 nets après déduction de €3.360 d'exemption pour travail étudiant). Si vous dépassez ce seuil, vos parents perdent l'avantage fiscal lié à votre charge.

### Conseil Studeo

Utilisez le simulateur fiscal de Studeo pour estimer votre situation en temps réel et éviter les mauvaises surprises.

**Sources** : SPF Finances (fin.belgium.be), centenvoorstudenten.be`,
      category: "fiscal",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR", "OTHER"],
      sortOrder: 3,
    },
    {
      slug: "tva-etudiants",
      title: "TVA : ce que les étudiants doivent savoir",
      content: `## La TVA pour les étudiants indépendants

Si vous êtes étudiant indépendant, la TVA est un sujet important.

### Régime d'exemption

Si votre chiffre d'affaires annuel ne dépasse pas **€25.000**, vous pouvez bénéficier du **régime de franchise de TVA**. Cela signifie :

- Vous ne facturez **pas de TVA** à vos clients
- Vous ne pouvez **pas récupérer** la TVA sur vos achats
- Vous devez mentionner sur vos factures : *"Petite entreprise soumise au régime de franchise de la taxe. TVA non applicable."*

### Quand devez-vous facturer la TVA ?

- Si votre chiffre d'affaires dépasse €25.000
- Ou si vous choisissez volontairement d'être assujetti à la TVA

### Déclarations TVA

Si vous êtes assujetti, vous devez soumettre des **déclarations TVA trimestrielles** via le portail Intervat.

**Source** : SPF Finances, jobbers.io`,
      category: "fiscal",
      studentStatuses: ["INDEPENDENT", "ENTREPRENEUR"],
      sortOrder: 4,
    },
    {
      slug: "allocations-familiales",
      title: "Impact sur les allocations familiales",
      content: `## Allocations familiales et travail étudiant

Vos allocations familiales (ou Groeipakket en Flandre) peuvent être impactées par votre activité professionnelle.

### Étudiant jobiste (650 heures)

Si vous travaillez dans le cadre de votre contingent de 650 heures avec cotisations réduites, vos allocations familiales ne sont **généralement pas impactées**.

### Étudiant indépendant

Pour les étudiants indépendants, vos revenus nets annuels ne doivent pas dépasser **€16.861,46** pour conserver vos allocations familiales.

### Attention : les règles varient par région

La Belgique étant un État fédéral, les règles des allocations familiales sont gérées au niveau régional :

- **Flandre** : Groeipakket (groeipakket.be)
- **Wallonie** : Famiwal / AVIQ
- **Bruxelles** : Iriscare

Vérifiez les conditions spécifiques à votre région.

**Sources** : Groeipakket, Famiwal, Iriscare`,
      category: "social",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR"],
      sortOrder: 5,
    },
    {
      slug: "documents-conserver",
      title: "Quels documents conserver ?",
      content: `## Les documents à garder

En tant qu'étudiant qui travaille, vous devez conserver certains documents importants.

### Documents essentiels

- **Fiches de paie** : chaque mois, votre employeur vous fournit une fiche de paie. Gardez-les toutes.
- **Contrats de travail** : conservez chaque contrat étudiant signé.
- **Factures** (si indépendant) : toutes les factures émises et reçues.
- **Reçus et tickets** : pour vos dépenses professionnelles déductibles.
- **Attestations fiscales** : fiches 281.10, 281.50, etc.
- **Déclarations d'impôts** : gardez une copie de chaque déclaration soumise.

### Combien de temps ?

En Belgique, vous devez conserver vos documents fiscaux pendant **7 ans minimum**.

### Conseil Studeo

Photographiez vos documents avec Studeo dès que vous les recevez. Ils seront classés automatiquement et toujours accessibles.`,
      category: "admin",
      studentStatuses: ["JOBISTE", "INDEPENDENT", "ENTREPRENEUR", "OTHER"],
      sortOrder: 6,
    },
  ];

  for (const article of articles) {
    await prisma.knowledgeArticle.create({ data: article as any });
  }
  console.log(`Created ${articles.length} knowledge articles`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
