# VOLT — Boutique Next.js

Boutique de materiel electrique en francais. Next.js 16 (App Router), React, TypeScript et CSS. Identite provisoire VOLT, illustrations vectorielles originales. Design guide par apple-design : hierarchie, controles familiers, focus clavier et animations reduites selon les preferences du visiteur.

## Demarrage local

Installer Node.js 22 LTS ou plus recent. Dans le dossier du projet :

```powershell
npm install
npm run dev
```

Ouvrir http://localhost:3000. Sans configuration Supabase, huit produits fictifs sont affiches, avec une mention de demonstration. Les prix et stocks de ce mode sont illustratifs.

Pour utiliser Supabase en local, copier `.env.example` en `.env.local` et renseigner les valeurs. Ne pas ajouter `.env.local` a Git.

## Deploiement Vercel

1. Creer un depot GitHub avec le contenu de ce dossier (pas node_modules ni .next).
2. Dans Vercel, choisir Add New > Project et importer ce depot.
3. Framework : Next.js. Garder les commandes standard.
4. Dans Environment Variables, ajouter :

| Variable | Valeur |
| --- | --- |
| `SUPABASE_URL` | URL HTTPS de votre projet Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Cle publique publishable ou ancienne cle anon |

5. Dans Supabase SQL Editor, executer `supabase/catalogue-public.sql` apres l'import du CSV du scrapeur. Le site utilise la table `public.produits` et les noms de colonnes du dernier scrapeur.
6. Cliquer Deploy. Apres un changement de variables, redeployer.

Les variables sont lues par la route serveur `/api/produits`. Aucune cle service_role ni mot de passe de base n'est necessaire. Les alias `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont aussi acceptes, mais preferer les noms ci-dessus.

Si les deux variables sont absentes : mode demonstration. Si une seule est presente ou si Supabase renvoie une erreur : un message d'erreur apparait ; le catalogue fictif ne remplace pas silencieusement les vraies donnees. Une table vide ou une policy RLS manquante peut produire zero resultat.

## Fonctionnement

- Recherche serveur par nom, marque, reference fabricant et reference du site ; saisie temporisee.
- Pagination serveur de 12 produits, tri alphabetique ou par prix TTC.
- Raccourcis d'univers par mots-cles dans les noms. Ce ne sont pas encore des categories metier classees : le CSV ne contient pas cette colonne. Adapter les termes dans `lib/catalogue.ts`.
- Affichage HT/TTC, quantites publiees et fiches detaillees avec galerie.
- Les URL d'images du CSV sont utilisees directement : aucun telechargement massif. Plusieurs URL peuvent etre separees par ` | ` ; les tableaux JSON sont egalement acceptes.
- Disponibilite InStock uniquement, quantites nulles ou positives. Une quantite non communiquee reste indiquee comme telle.
- Panier et favoris conserves dans le navigateur, export CSV de la selection. Le filtre favoris porte sur les resultats de la page courante.
- Les stocks sont ceux du dernier scraping, pas une reservation en temps reel.
- Dialogues natifs avec confinement du focus, fermeture par Echap, navigation au clavier, mise en page mobile et respect de prefers-reduced-motion, prefers-reduced-transparency et prefers-contrast.
- Les polices DM Sans et Manrope sont chargees depuis Google Fonts, avec repli Arial. Les remplacer par des fichiers locaux si necessaire.

## Avant l'ouverture commerciale

Cette livraison couvre le catalogue et le panier, pas l'encaissement. Le bouton du panier exporte la selection ; aucune commande ni aucun paiement ne sont crees.

Pour vendre, il reste a configurer un prestataire de paiement (par exemple Stripe), les commandes, la verification serveur des prix et stocks avant paiement, les frais de livraison, l'identite du vendeur et ses documents commerciaux. Les informations de boutique affichent clairement ce statut. Aucun delai, avis client, partenariat, garantie ni certification commerciale n'est invente.

Personnalisation : identite et textes dans `components/storefront.tsx`, couleurs et espacements dans `app/globals.css`, metadonnees dans `app/layout.tsx`.

## Verification

```powershell
npm run build
npm run typecheck
```

La compilation de production et TypeScript ont ete verifies lors de la livraison. Le parcours panier, recherche par reference et fiche produit a ete controle dans le navigateur. La connexion au vrai projet Supabase reste a verifier apres saisie des variables et execution du SQL.
