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
| Version précédente 0.8.0 : voix réactivables, boule mono-axe en 20 frames, halos sans cadre** | [docs/voice-toggle-disco-sprites-080.md](docs/voice-toggle-disco-sprites-080.md) |

Statut 17/10/2026 : **code Web/PWA et APK Android debug 0.8.0 testés en CI sur branche de travail**, sans merge main, sans publication Play ni test humain Samsung. Les voix sont désactivées par défaut, mais activables par le joueur. Ne pas confondre mémoire du projet et méta-mémoire Djipie.

## État actuel (prototype Web/PWA)

Le code vivant est réparti dans `src/engine.mjs` (règles/rotation), `src/main.mjs` (tactile), `src/storage.mjs` (score local), `src/feedback.mjs` (voix/animaux/FX), `index.html`, `styles.css`, `sw.js`, `manifest.webmanifest` et `assets/icon.svg`. Les tests vivent dans `tests/` et `.github/workflows/tests.yml`.

Branche courante `feature/voice-toggle-disco-sprites-080`, non fusionnée ; voix à la demande, six univers lumineux, boule disco mono-axe et 12 effets Kenney CC0 depuis Djipie, hors ligne. Lire brain.md/todo.md pour détails. La médiathèque n’est pas une mémoire à parcourir automatiquement.

| **Version actuelle Concert 0.9.0 : texte avant boule, spots, sons, Android** | [docs/concert-bonus-audio-safearea-090.md](docs/concert-bonus-audio-safearea-090.md) |

État au 17/10/2026 : prototype Concert 0.9.0 sur branche `feature/concert-bonus-audio-safearea-090`, tests Node/Chrome et Android verts ; APK brute directe sur `temp/blockboost-concert-0.9.0`. Voix OFF par défaut réactivables ; 24 courts OGG Kenney depuis Djipie ; ne pas parcourir automatiquement la médiathèque. Aucun merge main, aucun test matériel Samsung encore.

## Version actuelle 0.10 — Bulles et croisement

Voir exclusivement [docs/bubbles-cross10-licensed-audio-100.md](docs/bubbles-cross10-licensed-audio-100.md) pour le contrat de la branche `feature/bubbles-cross10-licensed-audio-100` : croisement ×10, bulles et projecteurs au sol. Les 11 Sonniss sont intégrés **seulement à une APK privée compilée via Djipie**, jamais dans le code public. La médiathèque Djipie n'est pas la mémoire du projet ; aucun accès automatique aux WAV. Statuts de CI privée à vérifier avant d'annoncer l'APK. Aucun merge main.


## Livraison finale corrigée 17/10/2026 — le jeu reste dans SON dépôt

Contrat permanent : **Djipie est uniquement source/médiathèque de sons, Block Boost doit livrer son propre APK directement en `.apk` téléchargeable SANS ZIP et sans extraire quoi que ce soit sur le téléphone/PC de Fab.** L'erreur de livrer dans Djipie a été corrigée par transfert binaire Git (SHA de blob identique), sans changer le code ni fusionner main.

[**APK COMPLÈTE 0.10.0 avec 11 sons Sonniss, dans Block Boost**](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bubbles-full-apk-010/temp/android/BlockBoost-0.10.0-bubbles-full-debug.apk) — 438 375 octets ; SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`, commit `e06be4274978d0cd978c90196b1b94876f531dd0` sur branche de livraison `temp/blockboost-bubbles-full-apk-010`. Aucun ZIP à décompresser. Les contenus originaux séparés demeurent dans Djipie ; seule l'APK du jeu compilé est dans Block Boost. Pour les livraisons suivantes, produire dès le départ la version avec sons sur une branche TEMP de **Block-Boost**, pas de Djipie. Aucune fusion main, aucun déploiement Play.


**LIVRAISON VALIDÉE 0.11 (17 octobre 2026) :** APK Android COMPLÈTE avec onze sons Sonniss incorporés au jeu, **439 203 octets**, SHA256 `de6c6330d8a3d0c33488c8fdd392a009eeb6a35fb530df36bc51e30ce59b9c09`, [APK directe sans ZIP sur Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-bubbles-full-0.11.0/temp/android/BlockBoost-0.11.0-disco-bubbles-full-debug.apk). CI privée Djipie [39072037738](https://github.com/greenpower2669/Djipie/actions/runs/39072037738) **success** : réutilisation strictement des 11 effets validés déjà encapsulés dans APK 0.10 (SHA vérifié) après indisponibilité des Releases source ; recompilation 0.11, présence des 11 fichiers dans l'APK. Le blob Git binaire `46075377c90e920ed0b55b733d590eb779cfddc1` a été contrôlé identique lors du transfert de Djipie vers la branche de livraison propre à Block Boost `temp/blockboost-disco-bubbles-full-0.11.0` (commit `82fc7fd126d608a9016d2581cc8676ddf55ea6b6`). **Jamais de ZIP ni de sons Sonniss autonomes à installer**, seulement le jeu fini. CI Android public [39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411) et tests Node/Chrome [39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406) **verts**. Les APK debug peuvent avoir des signatures distinctes : sauvegarder données avant désinstallation/remplacement. Aucun merge `main` ni publication Play, test Samsung encore nécessaire.

## Actuel 0.12 — chance quand loin du record + fanfare disco 4s

Lire [docs/comeback-score-victory-music-012.md](docs/comeback-score-victory-music-012.md). Source: `feature/score-comeback-victory-music-012`. APK finale complète avec 11 effets Sonniss dans **Block Boost** sur `temp/blockboost-comeback-victory-full-0.12.0` (442949 octets, SHA-256 `d4ff4b8509c1a840cf3258cc9b31c586acbdfc1aae51b220d8ae065a1e35dd67`). Toujours aucun merge main. Pour la suite utiliser les tiroirs du brain et de cette mission, Djipie reste seulement médiathèque sonore complémentaire.

## Travail actuel (18 octobre) : Block Boost v0.13 pré-release

Branche `feature/final-result-fireworks-013`, effets score 1000/2000… par partie et écran nouveau record : **disco → bulles → fireworks**, jingle guitare Djipie et mix 7 bang + 2 ambiances chacun limité à six secondes ; 21 sons synchronisés uniquement dans APK final privée Djipie, sans fichier sonore séparé dans public. Nouveau package Google Play prévu `fr.greenpower.blockboost`. Voir `brain.md`, `ordres-de-mission.md`, `todo.md`, `debughistorical.md`. Pas encore de fusion main ni de nouvelle release.
