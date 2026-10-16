# Block Boost 0.3.0 — BONUS VITESSE et EXTRA sans rotation

## Besoin confirmé (16/10/2026)
La version 0.2.0 parlait mieux mais Fab ne voyait **aucun multiplicateur de vitesse ni EXTRA sans rotation**. Implémenter et montrer réellement `×4`, `×3`, `×2`, `×1`, `×0` avec de grands messages type combo et annonce vocale; tester avec un ou deux doigts.

## Règles de gameplay 0.3.0

- Chrono monotone `performance.now()` démarré **à la prise ou à la sélection d'une pièce**, maintenu si elle est relâchée sans pose puis ressaisie. Arrêt uniquement à sa pose valide. Chaque nouvelle pièce choisie crée un nouveau chrono.
- Multiplicateur de **bonus vitesse**, pas de l'ensemble du score :
  - `<= 2,0 s` : **×4 ÉCLAIR**;
  - `2,0–4,0 s` : **×3 FUSÉE**;
  - `4,0–7,0 s` : **×2 TURBO**;
  - `7,0–11,0 s` : **×1 RAPIDE**;
  - `> 11,0 s` : **×0 RÉFLEXION**.
- Score ordinaire inchangé : **5 points par case posée + 80 × lignes² × combo** si une ou plusieurs lignes sont effacées. Le bonus vitesse s'ajoute : **nombre de cases de la pièce × 5 × multiplicateur vitesse**. Ainsi `×0` ne retire **aucun** point de pose ou de ligne, seulement le bonus vitesse.
- **EXTRA SANS ROTATION :** + `5 × nombre de cases` à la pose valide si la pièce a été placée **sans aucune demande de rotation** (zéro quart de tour, même si la pièce termine à l'orientation de départ après 4 rotations). Ce supplément fonctionne même à vitesse ×0.
- Une pose invalide ne consomme pas la pièce ni ne donne de points.
- Les rotations à deuxième doigt et bouton R incrémentent le même compteur. La sélection/touche de la grille fonctionne aussi.
- À chaque pose : bannière lumineuse centrale **VITESSE ×N** + **EXTRA SANS ROTATION !** si applicable + **+points**, combinable avec l'annonce de COMBO. Sous le plateau : barre lisible du multiplicateur pendant la sélection et détail des bonus gagnés après.
- Voix émotionnelle (thread audio Android de la 0.2.0) : annonces distinctes pour `×2`, `×3`, `×4`, et `EXTRA SANS ROTATION`, avec sélection anti-répétition. Pas d'annonce systématique à ×0 ; prioritisation de combo.
- Les effets sonores `speed` et `extra` s'ajoutent aux FX habituels et restent désactivables.

## Fichiers

- `src/bonus.mjs` : paliers et calculs purs.
- `src/engine.mjs` : gain additionné de manière atomique à une pose valide; évènements détaillés.
- `src/main.mjs`, `index.html`, `styles.css` : chronomètre, rotation, HUD et animations.
- `src/feedback.mjs`, `src/voice-director.mjs` : FX + annonce vocale.
- `tests/bonus.test.mjs` : limites des paliers et scoring, rotations/non rotations, voix.
- `tests/touch.e2e.mjs` : gestes 2 doigts, bonus vitesse sans EXTRA, puis placement **sans rotation avec EXTRA**, sauvegarde.
- `.github/workflows/android-apk.yml` : compilation d'une APK **debug 0.3.0**, dépôt du vrai `.apk` sans ZIP sur branche temporaire.

## Isolation et limites

- Nouvelle identité Android de laboratoire `fr.greenpower.blockboost.bonuslab`, coexistant avec 0.1.0 et Émotion 0.2.0. **Les records/sauvegardes sont donc séparés** ; aucune migration entre APK test à ce stade.
- Test automatique Chrome/Java/Node + compilation Android, mais **pas de preuve d'un geste réel sur Samsung** avant essai utilisateur.
- Pas de fusion sur `main`, pas de release Google Play, pas d'AAB signé pour publication.

## Livraison

- Branche source `feature/fast-bonus-no-rotation-030`.
- Branche APK directe `temp/blockboost-bonus-0.3.0`, fichier `temp/android/BlockBoost-0.3.0-bonus-debug.apk`.
- GitHub Actions : https://github.com/greenpower2669/Block-Boost/actions/runs/38958540134 (vérifier l'état terminal avant de qualifier de succès).
