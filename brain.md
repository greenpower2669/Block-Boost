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

## 2026-10-16 — Bonus vitesse visibles et EXTRA sans rotation (0.3.0)

Demande explicite après test audio 0.2.0 : rendre visibles et fonctionnels « VITESSE ×2 / ×4 » et « EXTRA SANS ROTATION », avec célébration type combo, annonce vocale et nouveau test tactile.

- Branche `feature/fast-bonus-no-rotation-030`, sans merge `main`.
- `src/bonus.mjs` : chrono `performance.now()` depuis la sélection ; paliers ×4 (≤2s), ×3 (≤4s), ×2 (≤7s), ×1 (≤11s), ×0 (>11s).
- **Score** : points traditionnels inchangés (5 par case + 80 × lignes² × combo). Bonus vitesse additionnel : `5 × casesPièce × coefficient`. À ×0, les points normaux restent. Bonus **EXTRA sans rotation** additionnel : `5 × casesPièce`, y compris à ×0 ; aucune rotation permise, quatre rotations qui redonnent le même angle ne comptent pas comme zéro.
- `src/main.mjs` : prise, chrono, suivi des rotations, pose valide seulement, petit HUD permanent en jeu + gros flash « VITESSE ×N / EXTRA SANS ROTATION / +points » ; voix variées et FX dédiés.
- Tests 22 scénarios Node, puis test Chrome tactile simulant deux doigts suivi d'une pose sans rotation + sauvegarde : run [38958540023](https://github.com/greenpower2669/Block-Boost/actions/runs/38958540023) vert.
- APK debug [run 38958540134](https://github.com/greenpower2669/Block-Boost/actions/runs/38958540134) vert, branche temporaire `temp/blockboost-bonus-0.3.0`, fichier [BlockBoost-0.3.0-bonus-debug.apk](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bonus-0.3.0/temp/android/BlockBoost-0.3.0-bonus-debug.apk), 42 688 octets, SHA256 `e14696954dbf30b17fb006fb34ab72daf9a131da1e4e4f27cf319110faf72b65`.
- App ID de test **distinct** `fr.greenpower.blockboost.bonuslab` pour ne pas écraser 0.1/0.2 ; sauvegarde et record distincts. Test réel Samsung encore à faire.
- Spécification : [docs/bonus-vitesse-extra-sans-rotation-030.md](docs/bonus-vitesse-extra-sans-rotation-030.md). Aucun merge ni Play Store.

## 16/10/2026 — Audio/Haptiques 0.4.0, phrases nombreuses

**Demande :** « Ok code rajoute des phrase en quantité », après constat de dialogue trop répétitif, de l'absence de son de décrochage, de « dring-biling » à la pose prête et des retours haptiques.

**Implémentation validée en CI** sur `feature/audio-haptics-variety-040` :
- `src/phrase-bank.mjs` : 388 nouvelles phrases françaises écrites pour les six compagnons (288 propres aux mascottes et 100 communes) **en supplément** des anciennes répliques.
- `src/voice-director.mjs` : tirage contextuel avec exclusion des 48 dernières phrases persistant en local ; sélection de répliques mentionnant explicitement la vitesse obtenue ou le bonus sans rotation.
- `src/feedback.mjs` : silence volontaire (au moins 7 secondes entre interventions ordinaires et 17 s entre deux annonces du même type), sons `grab`, `valid` (deux notes) et `validRotate`. Sons non spam : automate `PlacementCueGate` avec passage invalide → valide et délai ≥540 ms ; ne rejoue pas le son en glissant dans la même zone valide.
- Vibrations haptiques optionnelles indépendantes de la voix/des FX, activées par défaut ; pont natif Android `AndroidBridge.haptic` → `WebView.performHapticFeedback`, sans permission VIBRATE, respect du réglage système ; PWA : `navigator.vibrate` si pris en charge.
- Les gestes à deux doigts et bonus vitesse ×4→×0 / EXTRA sans rotation restent inchangés.
- Test Node/browser vert : https://github.com/greenpower2669/Block-Boost/actions/runs/38962905329 ; APK CI verte : https://github.com/greenpower2669/Block-Boost/actions/runs/38962905413.
- APK 0.4.0 `fr.greenpower.blockboost.audiolab`, distincte des trois versions précédentes, scores séparés : [APK directe sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-audio-0.4.0/temp/android/BlockBoost-0.4.0-audio-debug.apk), **52 067 octets**, SHA-256 `304e962393c98a2e356bf5b976e4c74aed55d492ddb1b6b7514a11f22773ed0a`.
- Démonstration physique sur Samsung à faire : confirmer force des vibrations, volume des deux notes et fréquence de parole. Aucun merge de `main`, aucune release Play.

Voir `docs/audio-haptics-phrases-040.md`.

## 16 octobre 2026 — Haptique spatiale et bonus 0.5.0

Fab souhaite que le **gain des bonus déclenche réellement une vibration** et que le téléphone vibre progressivement plus fort, de manière prolongée et graduée, à l'approche d'un emplacement permettant d'effacer une ligne / faire un combo.

Réalisation sur `feature/haptic-sonar-combo-bonus-050`, sans toucher à main :
- `src/haptic-sonar.mjs` cherche uniquement les **poses légales qui effacent immédiatement une ligne** pour la forme et l'orientation courantes ; calcule une proximité 0…4 au fil du doigt. Le combo est un effacement consécutif, donc ces cibles peuvent prolonger le combo existant.
- `src/main.mjs` maintient le guidage seulement durant le geste, recalculé après rotation ; affichage discret « LIGNE À PORTÉE / COMBO À PORTÉE » ; arrêt si annulation, dépose, redémarrage, arrière-plan ou option éteinte.
- `HapticWaveEngine.java` : moteur de vibration dédié sur `HandlerThread`, quatre motifs continus cycliques avec puissance/cadence graduées et **watchdog de 750 ms** si plus de requêtes ; arrêt via pont natif `guidance / stopHaptics` et au cycle Android.
- `rewardHaptic` fait maintenant vibrer les bonus vitesse, EXTRA sans rotation, ligne et combo via des motifs bornés dédiés, séparés de la voix et des FX.
- Permission normale `android.permission.VIBRATE` (nécessaire pour les formes d'ondes continues) ; **aucune permission INTERNET**. Respect du réglage haptique système, de `haptics` et de la nouvelle préférence `hapticGuidance`.
- 0.5.0 debug lab `fr.greenpower.blockboost.hapticlab`, s'installe à côté de 0.4.0 avec **scores séparés**.
- [Tests Node + Chrome réussis](https://github.com/greenpower2669/Block-Boost/actions/runs/38970378913), [Compilation Android réussie](https://github.com/greenpower2669/Block-Boost/actions/runs/38970267717).
- [APK directe sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-haptic-0.5.0/temp/android/BlockBoost-0.5.0-haptic-debug.apk) (57 692 octets, SHA-256 `94f44de8f569841a5ce91061dda22cb73b6cca0e6d035c7c5ed1213c598ee790`). À essayer réellement sur le Samsung pour calibrer force, cadence, autonomie et arrêt.
- Spécification `docs/haptic-sonar-050.md`. Aucun merge main ni publication Play.
