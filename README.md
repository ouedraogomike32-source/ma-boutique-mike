# MIKE ODG 🇧🇫 DIRECT — Guide de mise en ligne

Boutique en ligne avec paiement par Orange Money (dépôt manuel) ou à la
livraison, et contact client via WhatsApp.

## Étape 1 — Installer le projet sur votre ordinateur

1. Installez [Node.js](https://nodejs.org) si ce n'est pas déjà fait.
2. Ouvrez un terminal dans ce dossier et lancez :
   ```
   npm install
   ```

## Étape 2 — Créer la base de données (Supabase, gratuit)

1. Allez sur https://supabase.com et créez un compte + un nouveau projet.
2. Dans l'onglet **SQL Editor**, collez et exécutez le code SQL qui se
   trouve en commentaire dans le fichier `lib/supabase.js` (crée les
   tables `products` et `orders`).
3. Dans **Project Settings > API**, copiez :
   - `Project URL` → à coller dans `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → à coller dans `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Étape 3 — Configurer les variables d'environnement

1. Renommez `.env.local.example` en `.env.local`.
2. Remplissez les 2 valeurs récupérées à l'étape 2.

## Étape 4 — Tester en local

```
npm run dev
```
Ouvrez http://localhost:3000 — vous devriez voir votre boutique
"MIKE ODG 🇧🇫 DIRECT".

**Pour ajouter des produits** : allez dans l'onglet **Table Editor** de
Supabase, table `products`, et ajoutez une ligne avec `name`, `price`,
`description`, `image_url`. (On peut ajouter une vraie page
d'administration protégée par mot de passe dans une prochaine étape si
vous préférez ne pas passer par Supabase à chaque fois.)

## Étape 5 — Mettre le site en ligne (Vercel, gratuit)

1. Créez un compte sur https://vercel.com (connexion possible avec GitHub).
2. Poussez ce projet sur GitHub (voir section Git plus bas).
3. Dans Vercel, importez le projet, puis dans **Environment Variables**,
   ajoutez les 2 mêmes variables que dans `.env.local`.
4. Cliquez sur **Deploy**. Après quelques minutes, votre site sera en
   ligne avec une adresse du type `mike-odg.vercel.app`.

## Étape 6 — Ajouter votre propre nom de domaine

1. Achetez un nom de domaine (ex. Namecheap, OVH — environ 10-15 €/an).
2. Dans Vercel, allez dans **Settings > Domains** de votre projet et
   suivez les instructions pour connecter votre domaine.

## Paiement et contact client

- **Orange Money** : le numéro +226 67 97 41 06 s'affiche automatiquement
  au client au moment de la commande.
- **WhatsApp** : bouton flottant + bouton sur chaque produit, tous liés
  au même numéro (+226 67 97 41 06).
- **Paiement à la livraison** : disponible en option, sans configuration
  supplémentaire.

---

**Besoin d'aide pour une étape (ex. mise sur GitHub, page d'admin avec
mot de passe) ?** Demandez, on avance étape par étape.
