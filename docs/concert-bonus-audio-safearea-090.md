# BLOCK BOOST 0.9 — CONCERT, SONS, ANDROID 16

## Mission 17 octobre 2026 (Fab, autorisée)
> « Et texte bonus devant boule à facette. Utilise plus de sont block boost stp aussi rajoute des waouh!! Hooo, whaa! ... rajoute des spot lignt comme dans les concerts en animation. »
> « Ok, code ça et des petit dons dring bling cool courtement musicale ».

Le précédent audit sans code montrait également le bouton « Nouvelle partie » recouvert par les boutons de navigation de son Samsung Android 16. La mission 0.9 regroupe les améliorations visuelles et sonores **et** ce correctif d'accessibilité.

### Animations
- Calque Festival 0.8 conservé hors grille, plein écran, boule sphérique animée de 20 frames sur un seul axe vertical.
- Texte central **au-dessus** des facettes : `JACKPOT`, `COMBO`, `+N POINTS`, multiplicateur vitesse et EXTRA **uniquement si gagnés**, à partir de `jackpotBanner(event, bonus)`. Les scores proviennent du moteur existant (pas d'invention).
- **Six faisceaux de spotlights** alternant en balayage avec teintes de concert et dégradés transparents ; version allégée (3 spots) pour galaxie, feu d'artifice et électrique. Toujours en arrière-plan du texte.
- Pas d'image supplémentaire externe ni de modification des règles du jeu ; `pointer-events:none`, arrêt après spectacle, désactivation automatique des mouvements/éclairages intenses si animations réduites.

### Sons et interjections
- `greenpower2669/Djipie` est la médiathèque canonique (dépôt privé). Catalogue `RESSOURCES_PARTAGEES/AUDIO/CATALOGUE/catalogue_direct.json` sur `main` : **447 sons à accès individuel privé, 100 Kenney CC0 + 347 Sonniss**, 14 Releases privées, mais **0 description validée à l'écoute**. Les ZIP originaux Sonniss restent inchangés.
- Branche d'export Kenney `feature/export-kenney-blockboost-24-v2` : workflow extrait **24** effets OGG uniquement du ZIP Kenney CC0, contrôle chaque signature `OggS`, archive, empreinte SHA-256 et taille ; crée `src/kenney-audio.mjs` dans Block Boost et le manifeste `assets/kenney-manifest.json`. Aucun WAV Sonniss ni contenu brut de la sonothèque privée copié dans le dépôt public.
- Les sons Kenney alternent selon prise, validité, rotation, pose, ligne, combo, vitesse, EXTRA et familles d'animation, avec volume réduit en cas de superposition.
- `src/concert-cues.mjs` : **motifs synthétisés courts originaux de 1–4 notes**, ~55–440 ms, « dring-biling » cristallins avec enveloppe douce, jamais musique de fond continue, activation indépendante de la voix.
- Banque d'interjections facultatives **« Waouh ! », « Hooo ! », « Whaa ! »** + variantes ; discours **seulement si l'utilisateur active la case Voix** (OFF par défaut), avec anti-répétition et espacement conservés. La voix ne revient jamais de manière inattendue.
- Le filtre déjà codé de passage invalide→valide / refroidissement 540 ms évite de refaire sonner la clochette à chaque pixel de déplacement.

### Bas d'écran Samsung Android 16
- Le CSS `body.android-host` (détecte `AndroidBridge` dans l'APK) garantit un espace intérieur bas d'au moins **78 px** au-dessus de la zone système et un pied de page de taille tactile lisible.
- `body` peut défiler ; `game-surface` autorise **pan-y** pour retrouver le pied de page, tandis que `.board` et `.piece-slot` gardent `touch-action:none` pour ne pas casser le pilotage tactile ni la rotation à deux doigts. Contrairement à un simple décalage, permet d'atteindre réellement « Nouvelle partie » lorsque le contenu est plus haut que l'écran.
- L'Android Activity existante conserve le listener d'insets et l'affichage natif. La capture réelle du Samsung reste la référence finale (la simulation navigateur ne reproduit pas la vraie barre Android).

### Gouvernance
- Branche : `feature/concert-bonus-audio-safearea-090`, dérivée de `feature/voice-toggle-disco-sprites-080`.
- APK lab **0.9.0** : `fr.greenpower.blockboost.concertlab` — scores isolés des versions précédentes.
- Tests Node/Chrome : liste des 24 OGG, durée des jingles, description exacte bonus, interjections, six projecteurs/foreground du disco, Android bridge simulé et marge CSS, gestes deux doigts.
- CI Android : APK directe sans ZIP sur `temp/blockboost-concert-0.9.0`, seulement après build et vérification SHA. Aucune fusion `main`, aucune release Play, aucune opération sur l'original Djipie `main` sans validation.
