# Block Boost — carte centrale

Index léger du projet. Ouvrir **uniquement** les tiroirs utiles.

| Tiroir | Fichier |
| --- | --- |
| Mémoire vivante / état du projet | [brain.md](brain.md) |
| Spécification du gameplay, mascottes, voix, FX et scores locaux | [docs/description-gameplay-mascottes-voix-fx-et-score-local.md](docs/description-gameplay-mascottes-voix-fx-et-score-local.md) |
| Liste des travaux non terminés | [todo.md](todo.md) |
| Anomalies et validations historiques | [debughistorical.md](debughistorical.md) |
| Consignes et autorisations de mission | [ordres-de-mission.md](ordres-de-mission.md) |
| Version précédente 0.6.0 (voix en pause, arc-en-ciel, haptique) | [docs/rainbow-solves-silent-060.md](docs/rainbow-solves-silent-060.md) |
| Version précédente 0.7.0 : six fêtes, boule à facettes et 12 sons Kenney de Djipie | [docs/festival-themes-djipie-audio-070.md](docs/festival-themes-djipie-audio-070.md) |
| **Version actuelle 0.8.0 : voix réactivables, boule mono-axe en 20 frames, halos sans cadre** | [docs/voice-toggle-disco-sprites-080.md](docs/voice-toggle-disco-sprites-080.md) |

Statut 17/10/2026 : **code Web/PWA et APK Android debug 0.8.0 testés en CI sur branche de travail**, sans merge main, sans publication Play ni test humain Samsung. Les voix sont désactivées par défaut, mais activables par le joueur. Ne pas confondre mémoire du projet et méta-mémoire Djipie.

## État actuel (prototype Web/PWA)

Le code vivant est réparti dans `src/engine.mjs` (règles/rotation), `src/main.mjs` (tactile), `src/storage.mjs` (score local), `src/feedback.mjs` (voix/animaux/FX), `index.html`, `styles.css`, `sw.js`, `manifest.webmanifest` et `assets/icon.svg`. Les tests vivent dans `tests/` et `.github/workflows/tests.yml`.

Branche courante `feature/voice-toggle-disco-sprites-080`, non fusionnée ; voix à la demande, six univers lumineux, boule disco mono-axe et 12 effets Kenney CC0 depuis Djipie, hors ligne. Lire brain.md/todo.md pour détails. La médiathèque n’est pas une mémoire à parcourir automatiquement.
