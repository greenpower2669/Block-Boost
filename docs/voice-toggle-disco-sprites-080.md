# Block Boost Disco 0.8.0 — voix réactivables et boule sphérique mono-axe sans cadre

## Demande approuvée le 17 octobre 2026

Fab demande (après essai 0.7) que :
1. La **case Voix** ne soit plus grisée : **OFF par défaut**, ON/OFF à tout moment dans les réglages.
2. Les effets lumineux de la boule ne montrent **plus un rectangle net** autour de la grille et les rayons **dépassent largement les bords de l'écran**.
3. La boule ne tourne plus selon deux axes et ne se déforme plus comme une plaque 2D : préférer une **animation par images successives d'une sphère tournant autour d'un seul axe**.
4. Conserver les autres animations/FX/bonus/haptiques, puis APK directe sans ZIP sur une branche de proposition ; **aucun merge main ni release Play**.

## Réalisation

### Voix : activation volontaire sans bloquer les FX

- L'état initial reste `settings.voice=false` dans `src/storage.mjs`. Les choix du joueur, vrais ou faux, restent sauvegardés localement.
- `index.html` : case `voice-setting` **activable et non cochée** à l'installation ; texte d'aide explicite.
- `src/main.mjs` : suppression des forçages `checked=false` et `disabled=true` à chaque `showMascot()`. Affiche le vrai choix enregistré ; le joueur peut changer de mascotte sans réactiver les voix par surprise.
- `src/feedback.mjs` : annulation du blocage inconditionnel dans `speak` ; requête vocale **seulement si `getSettings().voice===true`**. Le moteur natif TTS Android en `HandlerThread` ainsi que les profils expressifs et l'anti-répétition sont conservés.
- Nouvelle `stopVoice()` : arrête immédiatement la voix Android et le navigateur, remet l'état vocal à zéro, **sans arrêter le guidage haptique**, les effets de son ou les animations.
- Le test tactile Chrome vérifie **OFF → ON (voix appelée) → OFF (arrêt réel de l'appel natif)**, avec les haptiques toujours actives.

### Boule à facettes : sprites sphériques 2D précalculés

- Nouveau `src/disco-sprites.mjs` : génère et met en cache une **planche de 20 frames de 168×168 px** sur Canvas2D **au premier jackpot uniquement** ; pas d'asset externe ou de bibliothèque 3D.
- Chaque frame projette une grille de petits miroirs en coordonnées sphériques orthographiques avec éclairage et reflets variables. La phase temporelle n'agit que sur la longitude : **rotation yaw autour d'un seul axe vertical**.
- Le composant visible `<canvas class="festival-disco-ball">` extrait successivement les vues de la planche à ~13 images/s ; il **ne reçoit aucun `rotateX`, `rotateY` ni `rotateZ` CSS**. Son entrée/sortie ne fait que translater et grossir uniformément la sphère.
- Les scènes respectent toujours le mode `Animations réduites` : **une image fixe sans rayons tournants**. Annulation de la boucle Canvas à la fin du jackpot et au redémarrage.
- La boule garde le déclenchement jackpot existant de la 0.7.0, son niveau d'intensité et le son disco Kenney, sans modifier les scores.

### Plus de rectangle FX visible

- `FestivalDirector` déplace `#festival-stage` sous `document.body` et conserve une référence explicite au `board-wrap` pour colorer les cases des effacements anticipés.
- `styles.css` : couche **`position:fixed; inset:0; overflow:visible; border-radius:0`**, transparente aux gestes (`pointer-events:none`), donc totalement détachée des dimensions du plateau.
- Ambiances radiales avec transitions jusqu'à la transparence, sans côté/cadre dur, sur une surface plus grande que le viewport (`inset:-80vmax`).
- Douze reflets lumineux disco possibles, faisceaux atténués en dégradé jusqu'à la transparence sur une longueur `160vmax` — ils peuvent sortir de l'écran au lieu de s'arrêter au bord du plateau.
- Le canevas sphérique visible conserve un fond alpha transparent et une silhouette arrondie ; le vieux calque CSS `festival-facets` et sa double rotation artificielle sont supprimés.
- Les commandes sont toujours utilisables puisque les effets ne capturent jamais le toucher.

## Tests et performance

- Test pur `tests/disco-sprites.test.mjs` : vingt vues, bande de sprites de bonne taille, facettes réellement déplacées par phase, `drawImage` avec rectangle source/destination complet (correction d'un défaut repéré par les tests).
- Test navigateur `tests/touch.e2e.mjs` : bascule des voix, gestuelle deux doigts, score, 8 cases qui s'allument, double ligne+combo, sphère CANVAS sans ancien calque, **deux frames affichées avec pixels réellement différents**, et surface FX plein écran sans clipping.
- Ancien test qui imposait le silence malgré `voice:true` adapté au nouvel objectif : silence **uniquement quand case décochée**, non un verrou permanent.
- Les 12 sons OGG Kenney CC0 déjà intégrés depuis Djipie restent intacts ; aucune archive Sonniss copiée/extraites.
- Tests Node/Chrome et compilation Android GitHub Actions requis avant qualification d'une APK « prête ».
- Reste à évaluer visuellement et tactilement sur Samsung : fluidité des 20 frames, sensation de profondeur, halo sans cadre, impact des rayons, confort, voix OFF par défaut.

## Distribution et gouvernance

- Branche : `feature/voice-toggle-disco-sprites-080` sur `greenpower2669/Block-Boost`, issue de `feature/festival-animation-djipie-audio-070`.
- APK de labo `fr.greenpower.blockboost.discolab`, version **0.8.0**, installable en parallèle des anciennes, avec **scores locaux séparés**.
- Pas de fusion de `main`, pas de nouvelle clé Play, aucune publication officielle.
