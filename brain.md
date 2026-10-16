# Block Boost — mémoire vivante du projet

> **2026-10-16 : première implémentation Web/PWA sur `feature/block-boost-playable-rotation-v1`.** Prototype jouable, non fusionné dans `main`, APK debug 0.1.0 et 0.2.0 (labo voix), pas d'AAB, ni validation réelle sur téléphone. Ne pas confondre CI verte et publication.

## Mission et état réel

Fab veut un puzzle tactile joyeux : grille 8 × 8, trois pièces, suppression des lignes et colonnes, score, combos et FX. Six petits animaux encouragent avec bulles et voix françaises, sans changer les règles. Le record et la partie en cours se sauvegardent localement. **Extension explicitement demandée : rotation horaire de 90° lorsque le deuxième doigt touche l'écran pendant que le premier déplace une pièce.**

## Implémenté

- `index.html`, `styles.css` : interface responsive portrait, grille, palette et effets.
- `src/engine.mjs` : pose, forme, rotation, score déterministe, lignes/colonnes, combo, détection d'impasse, rechargement de 3 pièces.
- `src/main.mjs` : Pointer Events multitactiles ; premier doigt = déplacement et dépose, deuxième doigt = un quart de tour ; touche R et bouton ↻ alternatifs ; sélection par tap.
- `src/feedback.mjs` : six animaux provisoires en emoji, animations, phrases françaises de synthèse vocale si le navigateur dispose d'une voix, petites notes FX générées localement et anti-répétition. Sous-titres et réglages voix/FX.
- `src/storage.mjs` : localStorage versionné, record monotone, statistiques, dernier score, partie à reprendre, préférences et choix de mascotte ; gestion d'indisponibilité du stockage.
- PWA : `manifest.webmanifest`, `sw.js`, icône SVG ; cache local après première visite.
- Tests : `tests/engine.test.mjs` (12 scénarios) et `tests/touch.e2e.mjs` (Chrome : deux contacts, rotation, dépose, rechargement/score). CI GitHub Actions verte lors des contrôles initiaux.

## Règles spécifiques du prototype

- Rotation autorisée, absente de la vidéo de référence : quart de tour sans consommation de la pièce ni points.
- Effacement de lignes et colonnes simultanées ; intersection retirée une seule fois, sans gravité des blocs restants.
- Points : 5 par carré posé ; effacement : 80 × lignes² × combo. Combo = nombre de coups de placement consécutifs avec au moins une ligne effacée ; revient à zéro si aucun effacement.
- Le moteur n'attribue aucun bonus selon la mascotte.
- Chaque pose réussie déclenche une sauvegarde ; `Rejouer` conserve le record. Aucune synchronisation de scores en ligne.

## Limites et sécurité

- **Pas de voix enregistrées originales ni sprites animaux définitifs** : les mascottes sont des emoji animés ; la parole utilise les voix `speechSynthesis` disponibles localement dans le navigateur (qualité et fonctionnement hors ligne variables).
- APK Android debug 0.1.0 **compilée et disponible par lien direct GitHub** ; pas d'AAB ni de signature Google Play, pas de release, pas de fusion `main` ; test Samsung réel restant.
- Pas de publicité ni de collecte de données ; les informations sont dans le stockage privé du navigateur, que l'utilisateur peut effacer.
- Ne jamais prétendre que le jeu de référence possédait la rotation : c'est un ajout Block Boost.

## Carte et références

- [brainmap.md](brainmap.md)
- [Documentation exhaustive](docs/description-gameplay-mascottes-voix-fx-et-score-local.md)
- [todo.md](todo.md), [debughistorical.md](debughistorical.md), [ordres-de-mission.md](ordres-de-mission.md)

## 2026-10-16 — APK Android et téléchargement sans ZIP

- Une application Android Java/WebView autonome a été ajoutée dans `android/` : ressources Web embarquées, synthèse vocale Android, pas de permission INTERNET, portrait, applicationId `fr.greenpower.blockboost`.
- L'APK `BlockBoost-0.1.0-debug.apk` est compilée et signée **debug**, sans clé de publication. Build CI vert : https://github.com/greenpower2669/Block-Boost/actions/runs/38932973713.
- Demande de Fab : désarchiver l'artefact Github Actions et disposer du fichier **APK directement accessible sans ZIP** depuis GitHub. Action `.github/workflows/publish-apk-direct.yml` verte : https://github.com/greenpower2669/Block-Boost/actions/runs/38933516757.
- Branche isolée `temp/blockboost-apk-0.1.0`, répertoire `temp/android/` ; APK direct : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-apk-0.1.0/temp/android/BlockBoost-0.1.0-debug.apk.
- Fichier vérifié : 33 307 octets ; SHA-256 `49e963e01c075a2014b1889c54a236fec86b56587b328bfede3e2bea0688b98c`, confirmé par action avant commit ; sauvegarde du .sha256 au même endroit.
- Dépôt principal `main` non modifié. Test Android 16 réel toujours à faire ; livraison test uniquement, aucune release.

## 16/10/2026 — Block Boost Émotion 0.2.0 (voix sur thread dédié)

Demande explicite : intégrer dans **Block Boost**, pas dans VisionMaxRead, une voix plus joyeuse et émotionnelle, avec une exécution multithread pour préserver la fluidité du jeu.

**Réalisé sur** `feature/emotional-voice-multithread-020` : `src/voice-director.mjs` (profils `calm / encourage / surprise / combo / celebrate / consolation`, historique local de 48 interventions et évitement des 8 dernières), `src/feedback.mjs` (voix synchronisées avec réactions du jeu), `android/app/src/main/java/fr/greenpower/blockboost/ExpressiveVoiceEngine.java` (HandlerThread audio, TTS local français Android, priorité et annulation, prévision de lecture asynchrone de clips émotionnels embarqués), MainActivity reliée au nouveau pont JS.

**Nuance essentielle :** débit/hauteur/phrases rendent la voix Android plus vivante, mais ce n'est **pas une synthèse neuronale émotionnelle** ; aucun enregistrement vocal réellement joué ni modèle Qwen3-TTS ajouté dans l'APK. Ne jamais prétendre le contraire. Modèle Qwen de VisionMaxRead dédié à l'OCR ; non copié dans Block Boost.

APK **debug lab** `fr.greenpower.blockboost.emotionlab` distincte de la version 0.1.0 : évite conflit de signature, mais **les sauvegardes du labo restent indépendantes de celles de 0.1.0**. Build et tests GitHub Actions verts : https://github.com/greenpower2669/Block-Boost/actions/runs/38956309047 (APK) et https://github.com/greenpower2669/Block-Boost/actions/runs/38956309287 (Chrome).
APK directe sans ZIP sur branche `temp/blockboost-emotion-0.2.0` : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-emotion-0.2.0/temp/android/BlockBoost-0.2.0-emotion-debug.apk (40 230 octets, SHA-256 `49c5bce6a6edc4892b60f1505c5b06b321bd54819068e62dede7407cd4f9f6e0`).
Voir `docs/block-boost-emotion-multithread-020.md`. Aucune validation physique Samsung, aucun merge main ni publication Play.
