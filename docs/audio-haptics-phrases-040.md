# Block Boost 0.4.0 — voix variées, décrochage, position valide et retour haptique

## Mission de Fab (16 octobre 2026)
« Ok code rajoute des phrase en quantité », faisant suite aux remarques :
- « discours ultra répétitif » dans Block Boost ;
- manque d'un petit son de **décrochage** lorsque l'on prend une pièce ;
- manque d'un petit **« dring-biling » lorsqu'une pièce est prête à être posée** ;
- retours haptiques (vibrations discrètes) pour prise, validation, rotation et pose.

## Banque de phrases
- `src/phrase-bank.mjs` : **388 phrases nouvelles originales**, dont 288 propres à six mascottes (6 × 8 types d'événements × 6 phrases) et 100 phrases partagées (10 thèmes × 10 phrases). Elles s'ajoutent aux anciennes répliques.
- Styles distincts : Pompom le panda roux rassurant, Plume le lapin vif, Lilo la loutre aquatique, Nox la chouette réfléchie, Moka le chaton et Biscotte le renardeau.
- `src/voice-director.mjs` : tirage dans les paroles propres au personnage + partagées + anciennes ; évite les **48 dernières** phrases enregistrées en local (au lieu des 8 dernières). En cas d'épuisement de toutes les variantes d'un événement, reprend la moins récemment utilisée.
- Les paroles de vitesse ×2/×3/×4 et de bonus sans rotation doivent **mentionner explicitement** l'événement obtenu ; la sélection est filtrée pour respecter ce contrat.
- `src/feedback.mjs` : les phrases sont volontairement espacées (7 s entre deux prises de parole non forcées, 17 s entre deux annonces de même nature), afin de préserver le plaisir des FX et du silence. Les annonces exceptionnelles forcées (record/fin) restent possibles.
- Le TTS Android conserve sa file audio sur **HandlerThread** dédié, sans attente sur le thread graphique. Les nouvelles phrases n'ont pas été enregistrées par des comédiens : ce sont des textes synthétisés par la voix locale et modulée du système.

## Sons et transitions de placement
- `feedback.fx("grab")` : **son doux distinct** de prise/décrochage, au premier contact sur la pièce dans la réserve.
- `feedback.fx("valid")` : **deux petites notes cristallines espacées** quand la proposition devient valide.
- `feedback.fx("validRotate")` : variantes de deux notes lorsque **la rotation** rend la position valide.
- `src/placement-cues.mjs` : automate `PlacementCueGate` pour empêcher le « dring-biling » de se répéter à chaque pixel ou changement de case tant que la pièce reste sur une zone valide. Il ne retentit qu'au **passage invalide → valide**, avec 540 ms de délai minimal entre deux annonces et réinitialisation à la nouvelle prise.
- Les FX sont synthétisés localement par Web Audio, sans réseau ni asset sous licence à télécharger.
- Les sons/FX restent désactivables par le réglage sonore existant.

## Haptiques
- `Feedback.haptic(kind)` : API indépendante des FX et de la voix ; réglage `haptics` activé par défaut et stocké dans les préférences locales avec migration sûre des sauvegardes v1.
- En APK Android : pont JavaScript `AndroidBridge.haptic`, paramètres whitelistés ; commande transférée vers le thread **UI** pour `WebView.performHapticFeedback`. Respecte les préférences d'haptique du téléphone ; n'ajoute pas de permission VIBRATE ni d'accès réseau.
- En PWA hors APK : tentative `navigator.vibrate` si le navigateur accepte, sans garantie sur tous les appareils.
- Demandes : prise/décrochage, zone valide, rotation, pose valide et effacement de ligne/combo. Limitation côté Android de 85 ms pour éviter les vibrations en rafale. Si le périphérique désactive les vibrations ou ne les fournit pas, jeu et sons continuent normalement.

## Sécurité, scores et livraison
- Aucun changement à la grille 8 × 8 ni aux règles du bonus vitesse ×4→×0 et EXTRA sans rotation.
- Nouvelle version labo Android **0.4.0**, applicationId `fr.greenpower.blockboost.audiolab`, installable à côté des précédentes ; **ses scores/sauvegardes sont indépendants**.
- Branche source `feature/audio-haptics-variety-040`; aucune fusion `main` ni publication officielle.
- Tests : banque 388, anti-répétition, expression des bonus, automate de validation/haptique, tests moteur, sauvegarde et Chrome multitactile.
- CI et APK directe (à confirmer après compilation) : `temp/blockboost-audio-0.4.0/temp/android/BlockBoost-0.4.0-audio-debug.apk`.
- La fluidité, qualité réelle du haut-parleur et force des vibrations sur Samsung doivent être validées par Fab.
