# Block Boost — carte centrale

Index léger du projet. Ouvrir **uniquement** les tiroirs utiles.

| Tiroir | Fichier |
| --- | --- |
| Mémoire vivante / état du projet | [brain.md](brain.md) |
| Spécification du gameplay, mascottes, voix, FX et scores locaux | [docs/description-gameplay-mascottes-voix-fx-et-score-local.md](docs/description-gameplay-mascottes-voix-fx-et-score-local.md) |
| Liste des travaux non terminés | [todo.md](todo.md) |
| Anomalies et validations historiques | [debughistorical.md](debughistorical.md) |
| Consignes et autorisations de mission | [ordres-de-mission.md](ordres-de-mission.md) |
| Dernière version de laboratoire 0.6.0 (voix en pause, arc-en-ciel, haptique) | [docs/rainbow-solves-silent-060.md](docs/rainbow-solves-silent-060.md) |

Statut 17/10/2026 : **code Web/PWA et APK Android debug 0.6.0 testés en CI sur branche de travail**, sans merge main, sans publication Play ni test humain Samsung. Les voix sont volontairement suspendues. Ne pas confondre mémoire du projet et méta-mémoire Djipie.

## État actuel (prototype Web/PWA)

Le code vivant est réparti dans `src/engine.mjs` (règles/rotation), `src/main.mjs` (tactile), `src/storage.mjs` (score local), `src/feedback.mjs` (voix/animaux/FX), `index.html`, `styles.css`, `sw.js`, `manifest.webmanifest` et `assets/icon.svg`. Les tests vivent dans `tests/` et `.github/workflows/tests.yml`.

Branche courante `feature/silent-rainbow-solves-060`, non fusionnée ; voix en pause, mode lumière et haptique. Lire brain.md/todo.md pour détails.
