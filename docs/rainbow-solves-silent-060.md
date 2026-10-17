# Block Boost Lumières 0.6.0 — voix en pause, prévisualisation arc-en-ciel, haptiques de cascades

## Instruction du 17 octobre 2026

Fab rapporte que son fils trouve les mascottes trop bavardes : « désactive momentanément les voix ^^ on y réfléchira ». Il confirme avoir dû placer les archives Sonniss **en Release GitHub** depuis son téléphone et demande une **grille richement éclairée, multicolore, dès qu'une ligne/colonne va être supprimée**, avec un spectacle qui augmente selon **blocs supprimés, lignes/colonnes, combos, bonus et séquence haptique**.

## Voix temporairement suspendues

- `src/feedback.mjs` retourne immédiatement depuis `Feedback.speak` : **aucune demande TTS**, même pour record, combo ou annonce forcée. L'infrastructure expressive et la banque de 388 phrases restent en place, pour réactivation future après avis de Fab et de son fils.
- Le réglage **Voix en pause** est grisé et désactivé dans le menu ; nouvelles préférences locales `voice:false`. Les autres messages textuels, petits effets sonores et vibrations sont conservés.
- Aucun moteur neuronal importé, aucun téléchargement requis.

## Prévisualisation correcte des effacements

- `src/solve-preview.mjs` : `evaluateSolvePreview(board,coords,x,y,combo,reward)` vérifie une pose **réellement légale** puis calcule les lignes/colonnes complétées et l'union des cases qui seront supprimées. Pas de faux arc-en-ciel sur une zone occupée, une ligne incomplète ou une orientation incorrecte.
- `src/main.mjs` : avant le lâcher, si une pose légale supprime une ou plusieurs lignes, seules les **cases de ces lignes/colonnes** s'illuminent en arc-en-ciel ; le texte indique « EFFACEMENT POSSIBLE » ou « COMBO EN VUE », le nombre de lignes et les cases concernées.
- Intensité du spectre de **1 à 5**, selon : cases réellement effacées (croisements dédupliqués), nombre de lignes, série de combo déjà en cours, vitesse ×3/×4 et EXTRA sans rotation. En l'absence de pose gagnante, pas de halo spécial.
- À la pose, les cases effacées prennent un éclat multicolore temporaire avec particules dont la quantité augmente avec les blocs, la combinaison et les bonus.
- `styles.css` : dégradés arc-en-ciel évolutifs lents et non stroboscopiques, avec versions statiques si « Animations réduites » est activé ou si le système demande `prefers-reduced-motion`. CSS conservatrice compatible Android WebView.
- Ne modifie pas la simulation de jeu : score, combo, rotation au deuxième doigt et persistance restent identiques.

## Haptiques

- `enrichedGuidance(targets,x,y,combo,reward)` dans `src/solve-preview.mjs` combine la distance au **placement effaçant réellement une ligne** et la richesse attendue (plusieurs lignes, combo, vitesse et EXTRA).
- Le guidage natif `HapticWaveEngine` étend le pilotage à **6 niveaux**, limités (amplitudes 42 à 202 sur appareil compatible et cadence graduée), toujours avec permission VIBRATE, réglages système et watchdog d'arrêt.
- La récompense distingue désormais **ligne simple, double ligne, cascade de 3+ lignes, combo simple, combo double, combo cascade**, en plus des bonus vitesse/EXTRA ; vibrations de célébration **finies**, jamais en boucle après la pose.
- Maintien des options `haptics` et `hapticGuidance` indépendantes et de l'arrêt au lâcher/annulation/veille.

## Fichiers de sons Sonniss dans Djipie

- Release confirmée [Djipie / Sons](https://github.com/greenpower2669/Djipie/releases/tag/Sons), **cinq archives** `Sonniss.com-GDC2026-GameAudioBundle1of5.zip` jusqu'à `5of5.zip`, environ **6,9 Go**.
- Licence [Sonniss #GameAudioGDC](https://sonniss.com/gdc-bundle-license/) : usage dans les jeux finis autorisé ; distribution des fichiers/ZIP seuls non autorisée ; entraînement IA interdit.
- **Aucune copie, extraction, redistribution ni incorporation** de ces packs dans la version 0.6. Le registre `Djipie/RESSOURCES_PARTAGEES/AUDIO/RELEASES/INDEX.md` sur `proposal/ressources-partagees-audio-v1` pointe vers cette Release uniquement.
- Soniss reste exclusivement une médiathèque à consulter seulement sur mission nécessitant un son précis ; un upload par Release depuis Android est accepté.

## Validation et diffusion

- Tests `tests/rainbow-preview.test.mjs` : anticipation valide, croisement 15 cases et non 16, gradation selon nombre de blocs/bonus, niveau haptique, cascades et silence.
- Test Chrome à deux doigts, score, sauvegarde et cas synthétique **sept cases remplies + pièce finale** : les 8 cases prévues sont colorées **avant** la pose, puis la visualisation anticipée disparaît et la célébration réelle s'active.
- CI [Node/Chrome 39026234986](https://github.com/greenpower2669/Block-Boost/actions/runs/39026234986) : **succès**.
- CI [Android 39026190674](https://github.com/greenpower2669/Block-Boost/actions/runs/39026190674) : **succès**.
- APK `BlockBoost-0.6.0-rainbow-debug.apk` (61 018 octets, SHA-256 `09b53fce4a63379e4a5cf0d6369c22f7c926b61897838508fb2efe390fa5f494`) sur branche `temp/blockboost-rainbow-0.6.0` :
https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-rainbow-0.6.0/temp/android/BlockBoost-0.6.0-rainbow-debug.apk
- Application laboratoire `fr.greenpower.blockboost.rainbowlab`, installable en parallèle de 0.5.0, avec **scores locaux indépendants**.
- **À tester physiquement sur Samsung** : lisibilité des couleurs, vibrateur réel, consommation batterie, fidélité de silence des voix, sensation de double/cascade.
- **Aucun merge vers `main`, aucune release stable ni AAB Play, aucun secret/clé de production.**
