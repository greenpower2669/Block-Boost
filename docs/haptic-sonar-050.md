# Block Boost Haptique 0.5.0 — guidage progressif des effacements et vibrations de récompense

## Motivation / demande du 16 octobre 2026

Fab signale : « Les bonus ne déclenche pas d'aptique et quand on va déclencher des compositions ou ligne bibre en continu et de plus en plus fort si de plus en plus près de sa place ».

Interprétation opérationnelle : lors du déplacement d'une pièce, guider par des vibrations croissantes vers une pose **valide qui efface réellement une ligne** (et peut donc prolonger un combo), puis donner une vibration de récompense propre au bonus obtenu. Éviter les vibrations permanentes injustifiées, les fausses pistes et les blocages du rendu.

## Nouveau détecteur spatial — `src/haptic-sonar.mjs`

- À la prise d'une pièce ou après sa rotation, énumérer au maximum 64 positions d'ancrage de la grille 8×8.
- Garder uniquement les positions **légales à l'orientation actuelle** et qui complètent immédiatement au moins une ligne ou colonne, par simulation locale de la pose.
- Pour chaque déplacement, calculer la distance euclidienne minimale dans les coordonnées de grille vers ces positions (aucun calcul coûteux de simulation à chaque pixel).
- Déclencher un niveau de puissance progressif :
  - Plus de 3,6 cellules : **niveau 0, silence** ;
  - 2,55–3,6 cellules : **niveau 1**, léger ;
  - 1,45–2,55 cellules : **niveau 2**, plus rapproché ;
  - 0,51–1,45 cellule : **niveau 3**, proche ;
  - Moins de 0,51 cellule : **niveau 4**, cible exacte.
- Si la grille ne contient aucune pose permettant d'effacer une ligne pour la pièce courante, aucun guidage.
- Quand `game.combo > 0`, l'interface indique **COMBO À PORTÉE** parce que l'effacement continue la série ; sinon **LIGNE À PORTÉE**.
- Le capteur de position ne place jamais la pièce et ne modifie ni le score, ni les règles de rotation, ni la grille.

## Pont Android natif et arrêt automatique

- Nouveau `android/app/src/main/java/fr/greenpower/blockboost/HapticWaveEngine.java`, indépendant des threads UI/voix.
- `VibrationEffect.createWaveform(..., repeat=0)` avec quatre formes d'ondes : les pulses passent de 55ms/300ms de repos à 140ms/55ms de repos, amplitudes limitées à 48–190 si le vibrateur contrôle l'amplitude (sinon la cadence reste progressive).
- Permission Android **`VIBRATE`** (permission normale sans écran de consentement), **pas de permission INTERNET**.
- Respect de `Settings.System.HAPTIC_FEEDBACK_ENABLED`, du réglage local `haptics` et du nouveau `hapticGuidance`.
- JS → `AndroidBridge.guidance(level)` avec maintien d'un heartbeat ; **arrêt automatique si plus de heartbeat pendant 750ms**.
- Arrêt demandé à la dépose, l'annulation du doigt, la fermeture, la mise en arrière-plan, le redémarrage d'une partie et la désactivation des réglages.
- En PWA, secours `navigator.vibrate` en impulsions courtes et bornées : la régularité et l'amplitude dépendent du navigateur, la continuité n'est pas garantie.

## Célébrations haptiques à la pose

- `rewardHaptic(event,bonus)` sélectionne un **seul** motif pour ne pas empiler plusieurs vibrations : `drop`, `extra`, `speed`, `speedHigh`, `speedExtra`, `line`, `lineBonus`, `combo`, `comboBonus`.
- Les combinaisons (exemple vitesse ×4 + EXTRA + ligne) donnent un motif plus riche ; la voix et les FX d'origine ne changent pas.
- La récompense interrompt le guidage et **se termine** : pas de boucle à la pose.

## Préférences, affichage et garanties

- En plus de l'interrupteur général « Petites vibrations haptiques », nouvelle option « Guidage vibratoire progressif vers les lignes et combos ». Activée par défaut pour les nouvelles installations ; désactivable sans perdre les vibrations de bonus.
- `src/storage.mjs` conserve scores/records existants et ajoute la nouvelle préférence sans casser les sauvegardes de version 1.
- `src/main.mjs` et `index.html` affichent brièvement « LIGNE À PORTÉE » / « COMBO À PORTÉE » et une indication de proximité.
- La synthèse vocale émotionnelle sur thread indépendant et la bibliothèque de 388 répliques sont conservées.

## Validation

- Tests purs `tests/haptic-sonar.test.mjs` : emplacements gagnants légaux, double ligne, orientation après rotation, distances/niveaux, bonus haptique distinct et conservation des réglages.
- Test tactile Chrome `tests/touch.e2e.mjs` : pose à 2 doigts, pose sans rotation, sauvegarde et vérification des commandes `AndroidBridge.reward`.
- CI moteur + navigateur **succès** : https://github.com/greenpower2669/Block-Boost/actions/runs/38970378913.
- CI Android **succès** : https://github.com/greenpower2669/Block-Boost/actions/runs/38970267717.
- APK expérimentale 0.5.0 : `fr.greenpower.blockboost.hapticlab`, **scores indépendants de 0.4.0** ; 57 692 octets, SHA-256 `94f44de8f569841a5ce91061dda22cb73b6cca0e6d035c7c5ed1213c598ee790` :
https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-haptic-0.5.0/temp/android/BlockBoost-0.5.0-haptic-debug.apk

**À vérifier physiquement sur le Samsung :** autorisation effective du moteur de vibration, intensités perçues, température/autonomie si plusieurs sessions, mise en pause et reprise, voix/FX pendant que le guidage est actif. CI verte ≠ validation physique. Aucun merge main, aucune signature Play ni release stable.
