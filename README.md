# 🐾 Block Boost — première version jouable

Un **puzzle tactile de blocs colorés** avec six compagnons adorables, des voix d'encouragement, des FX lumineux et un record personnel sauvegardé localement.

**Statut : prototype Web/PWA, branche de développement, sans APK/AAB.** Le dépôt `main` n'a pas été fusionné et il ne s'agit pas d'une release Android.

## 🎮 Jouer

- Grille **8 × 8** et **trois pièces** disponibles.
- **Premier doigt** : maintenir puis glisser une pièce sur la grille.
- **Deuxième doigt** : tourner la pièce maintenue de **90° vers la droite**, sans la déposer ; plusieurs appuis successifs produisent plusieurs rotations.
- Sur ordinateur : sélectionner la pièce et appuyer sur **R**, ou cliquer sur « ↻ Tourner ». Il est aussi possible de sélectionner une pièce et de toucher une cellule pour la poser.
- Lignes ou colonnes remplies : suppression + bonus + combo + effets lumineux.
- La partie s'achève lorsqu'aucune des pièces disponibles ne peut être posée.
- Score courant, meilleur score, choix d'animal et partie en cours conservés dans le stockage du navigateur.

## 🐰 Compagnons

Pompom 🦊, Plume 🐰, Lilo 🦦, Nox 🦉, Moka 🐱 et Biscotte 🦊.

Ils encouragent par des messages français, des animations simples et la synthèse vocale du téléphone/navigateur lorsque disponible. **Les emoji sont des graphismes provisoires** ; les sprites et voix françaises embarquées définitifs restent à réaliser. Les FX sont de petites notes générées par Web Audio. Voix, effets et animations sont réglables.

## ▶️ Lancer le prototype

Depuis cette branche (ou après téléchargement du code), lancer un petit serveur Web statique à la racine :

```bash
python3 -m http.server 8080
```

Ouvrir `http://localhost:8080` dans un navigateur moderne. Depuis un téléphone sur le même réseau, utiliser l'adresse réseau du PC ; pour bénéficier d'une installation PWA et du service worker hors `localhost`, un site HTTPS est nécessaire.

Le jeu ne nécessite pas de serveur pour les données ni de compte. Après chargement initial et installation du cache PWA, le gameplay peut fonctionner hors connexion. Une voix française système n'est pas garantie en mode hors ligne sur tous les navigateurs.

## 🧪 Tests

```bash
node --test tests/*.test.mjs
npm install
npm run test:touch
```

Le second test demande Google Chrome installé ; il simule deux contacts tactiles via le protocole Chrome DevTools, puis vérifie la rotation, la dépose et la reprise du score après rechargement.

[Workflow de validation GitHub Actions](.github/workflows/tests.yml).

## 🧠 Mémoires du projet

- [Description ultra-détaillée](docs/description-gameplay-mascottes-voix-fx-et-score-local.md)
- [brain.md](brain.md) et [brainmap.md](brainmap.md)
- [todo.md](todo.md) — travail achevé vs restant
- [debughistorical.md](debughistorical.md)
- [ordres-de-mission.md](ordres-de-mission.md)

Les ressources de la vidéo de référence ne sont **pas copiées** : les règles connues inspirent le prototype, qui utilise ses propres visuels et effets.
