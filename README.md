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

## 🎙️ Block Boost Émotion 0.2.0 — labo audio Android (16/10/2026)

Nouvelle APK de test signée debug : [téléchargement direct, sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-emotion-0.2.0/temp/android/BlockBoost-0.2.0-emotion-debug.apk). SHA-256 : `49c5bce6a6edc4892b60f1505c5b06b321bd54819068e62dede7407cd4f9f6e0`.

Cette version utilise le moteur de voix locale Android sur un **thread audio dédié**, des profils d'intonation plus enthousiastes (encouragement, surprise, combo, record), et un historique anti-répétition de 48 répliques. Fonctionnement hors ligne si une voix française locale est disponible sur le système. Le modèle Qwen et les voix de VisionMaxRead ne sont pas intégrés.

**Important : ce n'est pas encore une voix émotionnelle neuronale !** Les profils changent la hauteur, le rythme et les phrases ; la lecture de vrais clips expressifs est préparée mais aucun clip n'est encore inclus. Application de test séparée `fr.greenpower.blockboost.emotionlab`, avec sauvegardes indépendantes de la 0.1.0. Pas de publication stable, pas de validation physique Samsung.

Plus d'informations : [spécification 0.2.0](docs/block-boost-emotion-multithread-020.md). [Compilation GitHub Actions réussie](https://github.com/greenpower2669/Block-Boost/actions/runs/38956309047).
