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

### Livraison effective 0.13 AVANT release (18 octobre 2026)

- **APK complète 21 sons Djipie dans le jeu entier**, livrée en un fichier **.apk direct sans ZIP** sur une branche temporaire de Block Boost : [Télécharger BlockBoost 0.13](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-fireworks-full-0.13.0/temp/android/BlockBoost-0.13.0-fireworks-full-debug.apk).
- Taille **606 101 octets**. SHA-256 `c2943324577d7014851890fe767321beb36c26fcc41ae57a06cb78ede0215ec3`. Blob Git `d29b69c09620f9fe0a8d11530bbc31da1203f0df` vérifié IDENTIQUE entre sortie privée Djipie et branche de livraison publique Block Boost `temp/blockboost-fireworks-full-0.13.0`, commit livraison `99453146c0e52b3061d16afccb5d2e03d816c1d8`.
- Tests Node/Chrome tactiles **SUCCESS** [39145851083](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851083), dernier contrôle source docs [39146091168](https://github.com/greenpower2669/Block-Boost/actions/runs/39146091168) **SUCCESS**, build Android public [39145851089](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851089) **SUCCESS**, build APK privée **21 FX intégrés** [39146050159](https://github.com/greenpower2669/Djipie/actions/runs/39146050159) **SUCCESS**.
- Code et APK prête à tester sur Samsung Android 16. **Ni main ni la release GitHub v0.12 ne sont modifiés**. PR Block Boost [#16](https://github.com/greenpower2669/Block-Boost/pull/16) et Djipie [#12](https://github.com/greenpower2669/Djipie/pull/12) laissées en brouillon. L'écoute physique et une éventuelle AAB signée Play avec nouveau package `fr.greenpower.blockboost` restent à valider.
- Important : applicationId passée de `fr.greenpower.blockboost.bubbleslab` au package Play confirmé `fr.greenpower.blockboost`, Android installe côte à côte et ne migre pas automatiquement les records de l'ancienne application.

## 19 octobre 2026 — Passation BB-014 / signature Play IMMUTABLE

Le registre `ordres-de-mission.md` comporte désormais en **tête** la section `BLOCKBOOST-IMMUTABLE-001` : identité Play `fr.greenpower.blockboost`, version 0.13 prérelease, package ancien distinct, JKS privée **existante** générée et récupérée (pas de régénération), certificat public `BlockBoost-upload-certificate.pem`, quatre noms de secrets GitHub, incompatibilité de nom `ANDROID_UPLOAD_STORE_PASSWORD` (générique FabCopilot) / `ANDROID_UPLOAD_KEYSTORE_PASSWORD` (projet réel) à traiter sans valeur dans les docs ; AAB release à produire et vérifier plus tard, APK directe sans ZIP dans Block Boost, Djipie audio uniquement. Mission **BB-014 non codée** ajoutée en fin du registre : snap gagnant contre recul du doigt, 2×2 déjà présent, diagonales 2-3 rares, gros blocs fréquents si plaçables en début de partie, reflet dégradé 360° sans rotation géométrique. Pas de merge `main` ni nouvelle release ; la 0.13 reste en PR #16 à valider.


## 19/10/2026 — Entrée canonique : passation gameplay + signature AAB (IMMUTABLE)

**Lire en premier** [`ordres-de-mission.md`](ordres-de-mission.md), section **IMMUTABLE / À PRÉSERVER — BLOCK BOOST PLAY** (système de publication à ne pas dériver), puis [passation complète 19/10](docs/passation-ultime-snap-pieces-lumiere-aab-014.md). **Aucun code créé pour cette nouvelle demande** ; 0.13 déjà existante avant passation, PR #16 brouillon, APK complète 0.13 testable.

Chemins à étudier à la reprise (pas encore corrigés) : `src/main.mjs` → `metrics`, `drawGhost`, `pointerup` (conversion répétée causant potentiellement glissement de cible), `src/haptic-sonar.mjs` → `clearingTargets`, `src/solve-preview.mjs` → cibles réellement gagnantes, `src/engine.mjs` → `SHAPES` (carré 2×2 plein déjà présent, coin L 2×2 et diagonales 2/3 manquantes) et `pieceBatch` / `comebackBatch` (pondération selon grille). `styles.css` → `conic-gradient` statique + `rainbowWave` actuellement `hue-rotate`, à transformer en orientation lumineuse réellement tournante 360°.

Publication : Android `fr.greenpower.blockboost` identifié dans 0.13, code 13, JKS récupérée RSA 4096 alias `blockboost-upload`/PEM public. 4 noms de secrets GitHub sans valeurs listés dans immutable ; vrai AAB release signé et vérifié à construire uniquement après approbation, ne pas confondre avec APK debug. Djipie privé = construction audio, **jeu fini toujours publié depuis Block Boost**. L'ancienne GitHub Release 0.12 reste en place ; aucun merge 0.13 ni Play confirmé.

## BB-014 — carte technique ajoutée le 19/10/2026
- `src/winning-snap.mjs` : fonction pure de sélection à hystérésis, seules les entrées de `clearingTargets` sont éligibles.
- `src/main.mjs` : `metrics` → coordonnées fractionnaires ; `dragPlacement` résout le verrouillage ; `drawGhost`, `previewRainbow`, `updateSonar` utilisent les coordonnées résolues ; `pointerup` réutilise la même sélection ; `computeSonar` annule cible à rotation ; `resetDrag` l'efface.
- `src/engine.mjs` : ajout L3 et quatre diagonales, `shapeFits`, `weightedIndex`, `DRAW_CONFIG`, `pieceBatch(rng,board,config)`, `comebackBatch` reçoit la grille.
- `styles.css` : `@property --rainbow-phase` + `rainbowWave` 360°, halos de toutes familles dont forêt/électrique ; respect animations réduites.
- `tests/finish-014.test.mjs` + `tests/touch.e2e.mjs` : tests de réception ; `.github/workflows/android-apk.yml` reste une APK CC0 de secours ; `.github/workflows/android-play-candidate.yml` vérifie PEM/JKS/secrets et signe un AAB candidat ; `android/app/build.gradle` code14 et signature env temporaire.

BB-014 : scripts/reuse_blockboost_013_audio.py vérifie le SHA complet 0.13, les 21 OGG et le mapping, restaure temporairement assets/licensed et src/private-audio.mjs. Workflow android-apk.yml fabrique APK 0.14 complète en temp/blockboost-full-0.14.0 ; android-play-candidate.yml utilise les mêmes sons, mais exige clé/signature.

- BB-014 bilan de build : Actions 39230344488 (APK 0.14 complète) et 39230344461/39230351456 (tests) vertes ; branche artifact-only `temp/blockboost-full-0.14.0` commit 456c53de…, `temp/android/BlockBoost-0.14.0-full-debug.apk`, SHA 2f815dd0faf5a0db8a1526fdb8034b8a52f9330cf8c10c55cce9f3954ea619ca. AAB Play passe exclusivement par `.github/workflows/android-play-candidate.yml` dispatch manuel protégé si PEM public historique et quatre secrets fonctionnels.

## BB-015 — Musique de fond du jeu (19/10/2026)
- Nouveau composant `src/music-bed.mjs` (ducking FX/voix, musique `Blockboostmusic.mp3` 16 % et réglages persistants). Documentation et livraison vérifiée : lire `brain.md`, rubrique **BB-015**.
- APK offline 0.14 avec musique + 21 FX, SHA/CI consignés dans `todo.md`. Test sonore Samsung requis. Les restrictions IMMUTABLE sur signature, merge et Play demeurent.

## BB-016 — Correction volume après test d'écoute
- Se référer au tiroir `brain.md` section BB-016 : le ducking global BB-015 a été supprimé sur demande de Fab, seul le jingle guitare électrique du record peut réduire très doucement le fond musical. `todo.md` contient validation CI/APK à terminer.

## BB-017 — Publication autorisée le 20/10/2026
- Fab autorise explicitement merge PR #16 et GitHub Release 0.14. Le workflow `.github/workflows/publish-blockboost-014.yml` vérifie le SHA de l'APK complète avant de créer une pré-release. Lire `ordres-de-mission.md` section BB-017.
- AAB Play : workflow manuel sur main, bloqué si PEM public historique ou secrets de l'Upload Key existante manquants. Les limitations ne sont pas levées par l'autorisation de publication ; voir `todo.md` et `brain.md`.

## BB-017 — Livraison GitHub 0.14 au 20/10/2026
- **main fusionnée et GitHub Release v0.14.0 effective**, APK complète debug avec musique stable, 21 sons ; point d'entrée [Release](https://github.com/greenpower2669/Block-Boost/releases/tag/v0.14.0). Lire `brain.md` section BB-017 pour détails et SHA.
- **AAB Google Play encore ouverte**, faute de PEM public de référence disponible et validation CI des quatre secrets. Référence d'état : `todo.md`, `ordres-de-mission.md` (BB-017). Ne jamais changer d'Upload Key.

## BB-018 — PEM public historique permanent
- `ordres-de-mission.md` → **FAB-IMMUTABLE-002** : certificat public de l'Upload Key versionné **une seule fois** sous `android/certificates/BlockBoost-upload-certificate.pem`. À conserver dans chaque version de `main`; ne pas redemander à Fab à chaque AAB.
- Contrôles SHA/validité et diagnostic pipeline AAB dans `brain.md`, `debughistorical.md`, `todo.md`. Ne jamais committer JKS ni mots de passe ; ne jamais substituer de nouvelle clé si les secrets échouent.

## BB-018 — Signatures désormais opérationnelles (20/10/2026)
- PEM public [déposé à demeure sur main](https://github.com/greenpower2669/Block-Boost/blob/main/android/certificates/BlockBoost-upload-certificate.pem), empreinte de référence dans `ordres-de-mission.md` FAB-IMMUTABLE-002.
- AAB **effectivement construite et signée** avec l'ancienne Upload Key, [Actions #39394294446](https://github.com/greenpower2669/Block-Boost/actions/runs/39394294446) SUCCESS ; l'artefact `BlockBoost-0.14.0-signed-candidate` expire le 19/11/2026 ; voir `brain.md` BB-018.
- Suite : téléchargement/transfert de cette AAB à la **Play Console**, publication encore non confirmée. Ne jamais régénérer JKS ni redemander le PEM.

## BB-018 — AAB signée archivée durablement
- L'Upload Key originale et le PEM canonique de `main` ont signé/contrôlé l'AAB (Actions #39394294446 et [#39395073250](https://github.com/greenpower2669/Block-Boost/actions/runs/39395073250), SUCCESS). [AAB signée directe](https://github.com/greenpower2669/Block-Boost/releases/download/v0.14.0/BlockBoost-0.14.0-release-candidate.aab) sur la GitHub Release v0.14.0, avec [SHA256SUMS](https://github.com/greenpower2669/Block-Boost/releases/download/v0.14.0/SHA256SUMS), sans archive ZIP.
- Contrat IMMUTABLE-002 conservé : PEM permanent, jamais redemandé à Fab ; Play Console restant à faire. Détails dans `brain.md` et `todo.md`.

## BB-019 — Faux game-over après rotation (20/10/2026)
- Correction dans `src/engine.mjs` : `hasLegalMove` appelle désormais `shapeFits` commun au tirage, donc 4 rotations vérifiées sur toute pièce restante. Test de régression dans `tests/engine.test.mjs`.
- Nouvelle candidate `0.15.0` code15 sur `feature/rotation-gameover-fix-015`, APK de test (21 sons + MP3) sur branche temporaire. **Version 0.14 Release signée GELÉE / pas de Play.** Continuer dans `todo.md` et `debughistorical.md`, sans toucher à la JKS et au PEM immuable.

## BB-019 — APK 0.15 corrigée et tests verts
- Correction du faux Game Over à rotation dans `src/engine.mjs`, PR [#17](https://github.com/greenpower2669/Block-Boost/pull/17) brouillon. [APK directe 0.15](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-rotation-fix-015/temp/android/BlockBoost-0.15.0-rotation-fix-debug.apk), SHA256 `483291a64335900cbeef9cc415e17d5e947f7ff46b93e4322a602f9d88ceb0e3`; CI Android #39404856807 et Node/Chrome #39404856825/#39404863168 réussies.
- **Pas de merge main ni publication Play sans validation** ; surtout ne pas envoyer l'AAB v0.14 bugguée. Détails, incidents et suivi dans `brain.md`, `debughistorical.md`, `todo.md`.

## BB-020 — Autorisation explicite de publier la 0.15
- Fusion `main`, GitHub Release et AAB signée 0.15 autorisées par Fab le 20/10/2026. Voir `ordres-de-mission.md` BB-020. Ancienne AAB 0.14 **interdite de Play**.
- Chaîne : sur passage `versionCode 15`, workflow AAB 0.15 (PEM/JKS historiques inchangés), puis après succès workflow GitHub Release 0.15 (APK/AAB signées directes). L'upload Play Console reste à confirmer séparément.

## BB-020 — Publication GitHub v0.15 TERMINÉE
- PR #17 fusionnée dans `main` le 20/10/2026 au commit `99522cfb412469b5c8485e770e55452ca055a968`. Version `0.15.0` code15, fausses défaites rotation corrigées.
- GitHub [Release v0.15.0](https://github.com/greenpower2669/Block-Boost/releases/tag/v0.15.0) publiée : [APK release **signée directe**](https://github.com/greenpower2669/Block-Boost/releases/download/v0.15.0/BlockBoost-0.15.0-release-candidate.apk) et [AAB Play **signée directe**](https://github.com/greenpower2669/Block-Boost/releases/download/v0.15.0/BlockBoost-0.15.0-release-candidate.aab), vérifiées par Actions #39414217190 et #39414355907. SHA256 détaillées `brain.md` BB-020, [SHA256SUMS](https://github.com/greenpower2669/Block-Boost/releases/download/v0.15.0/SHA256SUMS).
- Google Play Store non encore confirmé : envoi dans Console et validation Google restent à faire. Anciens assets v0.14 archivés seulement ; ne pas envoyer ancienne AAB à Play. PEM/JKS immuables inchangés.

## BB-022 — Politique de confidentialité Block Boost pour Play (21/10/2026)
- Fab demande une « Git page » pour répondre au champ « URL des règles de confidentialité » dans Play Console. Politique écrite d'après le manifeste Android sans INTERNET, sans AdMob/analytics, sauvegardes locales de scores et paramètres, sons/TTS Android et vibrations. Pas de domicile ni d'adresse privée publiée.
- Fichier source rendu publiquement : `docs/PRIVACY.md` ; site statique GitHub Pages prêt dans `docs/index.html` et `docs/privacy/index.html`. Si Pages du dépôt reste désactivé, ne pas présenter `https://greenpower2669.github.io/Block-Boost/privacy/` comme actif avant confirmation et configuration `main` / `/docs` dans Settings → Pages.
- Site public hébergé via GitHub Pages distinct de l'AAB, aucune signature ou versionCode modifiés. Vérifier que la politique est aussi accessible depuis l'application (exigence de Play) avant publication ; l'AAB 0.16 existante ne contient pas encore de lien vers cette nouvelle page. L'utilisateur garde le contrôle de ses coordonnées publiées.

## Icône transparente BB-016 — 27/10/2026

Travaux sur `feature/blockboost-transparent-logo-016` : icône Android et PWA remplacées par le logo approuvé (fond extérieur transparent). Lire `docs/logo-transparent-2026-10-27.md` et `todo.md`. Reste à valider sur Samsung ; aucun merge ni nouvelle Release.
