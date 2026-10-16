# Block Boost — carte centrale

Index léger du projet. Ouvrir **uniquement** les tiroirs utiles.

| Tiroir | Fichier |
| --- | --- |
| Mémoire vivante / état du projet | [brain.md](brain.md) |
| Spécification du gameplay, mascottes, voix, FX et scores locaux | [docs/description-gameplay-mascottes-voix-fx-et-score-local.md](docs/description-gameplay-mascottes-voix-fx-et-score-local.md) |
| Liste des travaux non terminés | [todo.md](todo.md) |
| Anomalies et validations historiques | [debughistorical.md](debughistorical.md) |
| Consignes et autorisations de mission | [ordres-de-mission.md](ordres-de-mission.md) |

Statut : **documents de conception proposés sur une branche de travail ; ni code, ni tests, ni APK/AAB.** Ne pas confondre cette mémoire de projet avec la méta-mémoire Djipie ni les mémoires des autres jeux.

## État actuel (prototype Web/PWA)

Le code vivant est réparti dans `src/engine.mjs` (règles/rotation), `src/main.mjs` (tactile), `src/storage.mjs` (score local), `src/feedback.mjs` (voix/animaux/FX), `index.html`, `styles.css`, `sw.js`, `manifest.webmanifest` et `assets/icon.svg`. Les tests vivent dans `tests/` et `.github/workflows/tests.yml`.

La branche `feature/block-boost-playable-rotation-v1` est un prototype non fusionné. Pour l'état précis, toujours lire `brain.md` puis `todo.md`.
