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

## 17 octobre 2026 — Lumières 0.6.0, voix suspendues

Fab demande avec l'avis de son fils de mettre **toutes les voix en pause**, sans supprimer les 388 phrases ni les effets sonores. Le moteur Feedback.speak est neutralisé, l'option de voix est grisée.

Le module src/solve-preview.mjs prédit uniquement des effacements réels et légaux (rangées/colonnes, union des cases, sans double compter les intersections). La grille illumine **avant la pose** les cases concernées en arc-en-ciel, puis anime les blocs effectivement effacés. Les effets deviennent plus intenses selon nombre de blocs/lignes, combo actif, vitesse et EXTRA. Six niveaux de vibration, motifs enrichis pour doubles lignes et cascades, animation réduite respectée. Scores et rotation inchangés.

5 ZIP Sonniss GDC 2026 repérés en Release privée Djipie « Sons » (environ 6,9 Go). Références légères dans Djipie/RESSOURCES_PARTAGEES/AUDIO/RELEASES/INDEX.md (branche proposition). Licence : utilisation en jeux finis autorisée, pas de redistribution brute ni entraînement IA. Aucun fichier ZIP/son réintégré en 0.6.0.

CI Node+Chrome run 39026234986 verte, Android 39026190674 vert ; APK debug indépendante 61 018 octets SHA256 09b53fce4a63379e4a5cf0d6369c22f7c926b61897838508fb2efe390fa5f494 : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-rainbow-0.6.0/temp/android/BlockBoost-0.6.0-rainbow-debug.apk. Aucun merge main ni validation sensorielle Samsung. Voir docs/rainbow-solves-silent-060.md.

## 17 octobre 2026 — Festival 0.7.0 : six familles d'effets + sons Kenney Djipie

Sur accord de Fab, implémentation des styles **forêt nocturne/lucioles**, **cristal/aurore**, **néon/électrique**, **feux d'artifice de points**, **galaxie** et **boule à facettes disco**. `src/festival.mjs` sélectionne selon le gain réellement acquis, nombre de lignes, combo, vitesse et EXTRA, avec réduction des répétitions. La boule à facettes apparaît physiquement dans l'overlay CSS `.festival-disco-ball`, tombe, **grossit selon intensité, tourne** et projette des rayons pour les gros jackpots (p. ex. 2 lignes+combo ou ≥500 pts, 3 lignes, combo≥4, ≥850 pts). Durée bornée 3 s, limite 58 particules, modes animations réduites, pas de stroboscope ; interactions tactiles inchangées.

Les tons **des cases prévisualisant une suppression réelle** changent selon la famille (vert lucioles, cristaux violets, électrique cyan, etc.), et non seulement le halo. Aucun faux effacement ni changement de score.

Sons Djipie : découverte de `feature/bibliotheque-audio-inventaire-v1` avec **447 entrées indexées (100 Kenney, 347 Sonniss)** ; aucune écoute individuelle encore validée. Action `39035758824` sur branche Djipie `feature/export-kenney-blockboost-v1` a produit un petit module réutilisable de **12 vrais effets OGG Kenney CC0**, avec manifestes et empreintes. Copie sélective sous `src/kenney-audio.mjs` (data URI OGG) et `assets/kenney-manifest.json` ; les effets sons du jeu privilégient Kenney, la synthèse audio Web constitue un fallback. Hors ligne, sans dépendance réseau. **Aucun son Sonniss téléchargé/extrait/copé** ; les cinq gros ZIP restent dans la Release Djipie. Licence Kenney CC0 annoncée, provenance/sha conservés ; sélection artistique à valider à l'écoute.

**Voix toujours en pause** sur demande familiale, y compris records ; les 388 phrases restent en code. Les six familles sont sans voix, avec FX/haptiques distincts. Documentation `docs/festival-themes-djipie-audio-070.md`.
- Tests `tests/festival.test.mjs` et Chrome multigestes validés : familles, vraies signatures OggS, logique jackpot, **boule disco DOM** sur double ligne/combinaison.
- Nouvelle APK labo `fr.greenpower.blockboost.festivallab` 0.7.0, sauvegardes séparées de 0.6.0 ; build CI Android à contrôler pour lien et SHA exact. Aucune fusion main ni publication Play.

**Livraison finale 0.7.0 vérifiée** : tests Node/Chrome [run 39036754891](https://github.com/greenpower2669/Block-Boost/actions/runs/39036754891) et compilation APK [run 39036754874](https://github.com/greenpower2669/Block-Boost/actions/runs/39036754874) **success**. Le runner Gradle a d'abord rencontré une indisponibilité de dépendances Maven puis réussi grâce à une procédure de trois retentatives et un cache de branche. APK directe sans ZIP [BlockBoost-0.7.0-festival-debug.apk](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-festival-0.7.0/temp/android/BlockBoost-0.7.0-festival-debug.apk) — **132 604 octets**, SHA-256 `a87766eff2accb67ce139545563bb681c4c335c6eb068952a487924a04b13be5`, publiée sur `temp/blockboost-festival-0.7.0`. Aucun test manuel Samsung encore.

## 17/10/2026 — Block Boost Disco 0.8.0 : voix réactivables, halo plein écran, sphère à 20 frames

Instruction explicite de Fab, après essai Festival 0.7 : la **case voix doit rester activable mais décochée par défaut** ; la boule à facettes ne doit plus révéler de rectangle d'effets, ses rayons doivent largement dépasser l'écran et la sphère ne doit tourner que sur **un seul axe vertical**, par vraies images successives plutôt que fausse rotation CSS 3D.

**Implémenté** sur `feature/voice-toggle-disco-sprites-080` :
- `settings.voice=false` reste la valeur par défaut ; `index.html` rétablit un checkbox activable, `src/main.mjs` respecte le choix enregistré, `Feedback.speak` ne parle que si le choix est vrai. `Feedback.stopVoice()` annule immédiatement la voix Android/navigateur **sans couper les FX/haptiques**.
- `src/disco-sprites.mjs` calcule une **planche de 20 frames de 168×168 pixels** au premier jackpot : sphère à miroirs projetée en orthographique, phase variable uniquement en yaw autour de l'axe vertical. `src/festival.mjs` affiche les sprites sur Canvas à ~13 FPS, plus de `rotateY/rotateZ` CSS et plus de déformation de boule aplatie ; une seule animation translation/échelle pour apparition/disparition.
- Effets déportés de `board-wrap` à `document.body`, panneau transparent `position:fixed; inset:0; overflow:visible; border-radius:0`. Halos radiaux sans bords et rayons `160vmax` au-delà du viewport, `pointer-events:none`. Les six familles d'effets et 12 sons Kenney CC0 Djipie sont conservés.
- Mode animations réduites : boule ronde statique, aucun rayon dynamique. FPS borné, frames réutilisées et RAF annulé à la fermeture pour préserver la fluidité.
- [Tests Node/Chrome 39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) **verts** après correction d'un appel `drawImage` manquant d'une dimension et adaptation d'un ancien test imposant un verrou vocal incompatible avec l'option réactivable. Test tactile : OFF → ON → OFF, vérification d'appel TTS puis arrêt, haptique inchangée ; scène double-ligne/combos, Canvas sphérique mono-axe, pixels différents entre frames, couche FX hors plateau.
- [Compilation Android 39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) **verte** ; [APK directe 0.8.0](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk) 136 226 octets, SHA-256 `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`.
- App labo `fr.greenpower.blockboost.discolab` avec scores distincts ; aucun merge main, aucun AAB Play, test humain Samsung restant. Document `docs/voice-toggle-disco-sprites-080.md`.

## 17 octobre 2026 — Disco 0.8.0, voix librement activables et lumière sans cadre

Suite au retour de Fab sur la 0.7 : les voix sont **OFF par défaut mais la case est maintenant activable/désactivable**, y compris en partie. Le blocage inconditionnel de `Feedback.speak` et le forçage `disabled=true` ont été retirés ; arrêt immédiat du TTS Android/navigateur via `stopVoice()`, sans arrêter l'haptique. Paramètre `settings.voice` conservé en local.

La boule à facettes ne fait plus de fausse double rotation CSS : `src/disco-sprites.mjs` génère **20 images sphériques 2D** orthographiques, représentant les miroirs tournant autour d'un unique axe vertical (longitude/yaw). `FestivalDirector` affiche successivement ces sprites Canvas sur un cercle toujours rond, ~13 images/s, et arrête la boucle après la scène. En mode animations réduites, une image fixe remplace la rotation.

**Bord rectangulaire corrigé** : `#festival-stage` est déplacé sous `body` avec `position:fixed;inset:0;overflow:visible;border-radius:0;pointer-events:none`, halo radial jusqu'à transparence et rayons disco pouvant déborder du viewport. La grille reste l'interface tactile et la preview garde son `board-wrap` propre.

Tests Node+Chrome [39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) **succès** : OFF→ON→OFF, évitement de la coupure haptique, rendu Canvas mono-axe et changement réel de pixels entre deux frames ; build APK [39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) **succès**. APK debug directe [0.8.0](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk) 136 226 octets, SHA256 `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`, application `fr.greenpower.blockboost.discolab` séparée, records indépendants. **Test Samsung non effectué** ; pas de merge main ni Play. Contrat : `docs/voice-toggle-disco-sprites-080.md`.

## 17 octobre 2026 — Block Boost Concert 0.9.0 : 24 sons, dring-biling, spots et Android 16

Fab autorise le code des **textes réels de bonus DEVANT la boule à facettes**, spots de concert, interjections « Waouh ! », « Hooo ! », « Whaa ! », **sons plus nombreux depuis Djipie** et **petits jingles courts, musicaux, cristallins**. L'audit précédent signalait aussi la barre Android masquant « Nouvelle partie » ; la correction est comprise dans le labo 0.9.

- `src/festival.mjs`, `styles.css` : **six spots** en dégradé sur les jackpots disco, trois dans plusieurs autres scènes, avec balayage alternatif doux et arrêt à la fin ; balisage au premier plan `festival-bonus-front` (titre jackpot / COMBO, **+N POINTS réels**, lignes, vitesse et EXTRA si gagnés), z-index au-dessus de la boule 20 frames et des rayons. Animations réduites préservées ; pas de gestes interceptés.
- `src/concert-cues.mjs` : motifs **originaux** de 1–4 notes synthétisées, de moins de 0,46 s, attaques/retombées douces « dring-biling », + garde-fou temporel contre superpositions. `Feedback` répartit les vrais effets Kenney en rotation pour prise, pose, validité, bonus, lignes, scènes.
- `Djipie` branche `feature/export-kenney-blockboost-24-v2` : workflow [39057014722](https://github.com/greenpower2669/Djipie/actions/runs/39057014722) **vert** pour 24 sons OGG Kenney CC0 et empreintes ; intégrés hors ligne dans `src/kenney-audio.mjs` avec `assets/kenney-manifest.json`. **Aucun WAV Sonniss ni archive de la sonothèque privée copié** vers Block Boost public.
- `src/voice-director.mjs` : nouvelle famille de 16 interjections « Waouh », « Hooo », « Whaa » et variantes, uniquement sur jackpots lorsque case voix **activée**. Le système de silence par défaut, d'anti-répétition et de voix TTS indépendante reste intact.
- **Android 16** : `body.android-host` réserve une marge basse de >=78px ; `body` défile, `.game-surface` accepte `pan-y` tout en gardant `touch-action:none` sur les pièces et la grille, donc le pied de page est atteignable sans sacrifier la rotation à deux doigts.
- Tests [Node/Chrome 39057514184](https://github.com/greenpower2669/Block-Boost/actions/runs/39057514184) **verts** ; compilation Android [39057514186](https://github.com/greenpower2669/Block-Boost/actions/runs/39057514186) **verte**. APK labo indépendante `fr.greenpower.blockboost.concertlab` **0.9.0**, **216 071 octets**, SHA-256 `bfc9fe705b2e75c9e74709da423d61c498750ed8c1720742516761eca26db4a9`, [APK directe sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-concert-0.9.0/temp/android/BlockBoost-0.9.0-concert-debug.apk).
- Fichier de mission `docs/concert-bonus-audio-safearea-090.md`. **Aucun merge main, aucune Play release, aucun essai physique Samsung encore**. Scores de laboratoire isolés des variantes précédentes.

## 17/10/2026 — Block Boost Bulles 0.10.0, croisement ×10, intégration sonore PRIVÉE

Fab confirme le code (« Aller on code^^ ») après choix de 11 sons Sonniss Djipie, notamment deux pour bulles et `DSGNBass Jump Start Drop 3` pour la boule disco en attendant meilleure musique.

`src/engine.mjs` : bonus **croisement ligne + colonne ×10**, calculé uniquement quand la même pose complète au moins une ligne ET une colonne ; facteur uniquement sur `80 × lignes² × combo` (points d'effacement), vitesse et EXTRA inchangés, intersection comptée une seule fois ; événement enrichi de `crossMultiplier`, `crossBonus`, `clearPoints`, `newBatch`. Test croisement simple 3205 points avant vitesse/EXTRA (contre 325). Une double ligne sans colonne garde ×1.

`src/festival.mjs` et `styles.css` : septième famille **bubbles** prioritaire sur disco à partir de deux lignes/colonnes effacées sur une pose ; cinq projecteurs ancrés en bas, rayons vers le haut, 12–32 bulles semi-transparentes montant et éclatant en étoiles, musique de création puis série de pops (~1,1s plus tard), présentation des vrais points au premier plan avec titre **CROISEMENT ×10** si éligible. Respect animations réduites / tactile. L'ancien disco mono-axe est préservé pour ses autres déclenchements.

**11 sons Sonniss choisis et vérifiés dans Djipie privé**, synchronisés à des événements précis : `grab`, `drop`, `lineSingle`, `newBatch`, `streak1`, `streak2` (annonceur), `streak3` (annonceur), `loss`, `festival-bubbles-create`, `bubbles-pop`, `festival-disco`. Les annonces enregistrées obéissent à la case **Voix OFF par défaut**, `stopVoice` les coupe. Record utilise les anciens jingles faute de son personnalisé. Les 24 Kenney CC0 restent en fallback.

**Protection de licence** : branche PUBLIC BlockBoost `feature/bubbles-cross10-licensed-audio-100` contient SEULEMENT l'architecture avec `src/private-audio.mjs` vide, jamais les fichiers Sonniss. Branche PRIVÉE Djipie `feature/blockboost-bubbles-private-apk-100` rassemble les WAV originaux via GitHub Actions, vérifie SHA/taille dans le catalogue, convertit en courts OGG au moment de construire l'APK complet et **ne publie que le jeu compilé sur une branche temporaire PRIVÉE**. Aucun extrait audio autonome sur le dépôt public ni entraînement IA. Contrat et tests : `docs/bubbles-cross10-licensed-audio-100.md`.

Tests du moteur et de Chrome avec 5 spots au sol et bulles : [validation 39067278200](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278200) verte, compilation Android publique fallback [39067278164](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278164) verte. L'APK sonore privée est séparée et son build doit être explicitement vérifié avant remise. Pas de fusion main, pas de release Play, pas de test physique Samsung.

**Bilan de livraison constaté** : CI PRIVÉE Djipie [run 39067423786](https://github.com/greenpower2669/Djipie/actions/runs/39067423786) **success** après correction FFmpeg ; source 11 WAV vérifiés, 11 OGG déclenchables et présents dans le **jeu APK fini**, aucun WAV autonome commité. APK PRIVÉE [BlockBoost-0.10.0-bubbles-private-debug.apk](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk), **438 355 octets**, SHA-256 `fc8ff2bb0ab94784f9f506a7a240912b00d29afdd041d3a8a4f03b1a3de9a9a0` dans `temp/blockboost-bubbles-private-0.10.0` de Djipie. Le lien est privé : authentification GitHub Djipie nécessaire ; page fichier GitHub avec contrôle Download. CI PUBLIC BlockBoost [39067278164](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278164) success, tests Node/Chrome [39067278200](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278200) success ; [APK publique CC0 fallback](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bubbles-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-debug.apk) **219 209 octets**, SHA-256 `dddacdfd9099d4ff82be2175c720a00e55f4a245666065ab62da5f0ee7c44c5a`. Les deux builds partagent l'ID de laboratoire `fr.greenpower.blockboost.bubbleslab` ; clés debug générées séparément, donc passer de l'une à l'autre peut exiger de désinstaller l'ancienne. Ne pas promettre la conservation des scores lors de cet échange. Toujours aucun test Samsung ni merge main.


**BILAN FINAL ACTUALISÉ (17/10/2026) :** après correction des pops audio dans src/main.mjs, tests Node/Chrome [39067717083](https://github.com/greenpower2669/Block-Boost/actions/runs/39067717083) **verts** et APK publique [39067712581](https://github.com/greenpower2669/Block-Boost/actions/runs/39067712581) **verte**. Quota de stockage d'artifacts GitHub atteint sur Djipie ; upload-artifact rendu facultatif, la publication de l'APK .apk seule en branche privée n'en dépend plus. CI Djipie privée finale [39068208556](https://github.com/greenpower2669/Djipie/actions/runs/39068208556) **SUCCESS**. [APK PRIVÉE FINALE 0.10 avec 11 sons](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk), **438375 octets**, SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`. Ce SHA remplace tous les SHA antérieurs des compilations d'essai. Lien privé (connexion GitHub requise). Aucun merge main ni Play release.


## Livraison finale corrigée 17/10/2026 — le jeu reste dans SON dépôt

Contrat permanent : **Djipie est uniquement source/médiathèque de sons, Block Boost doit livrer son propre APK directement en `.apk` téléchargeable SANS ZIP et sans extraire quoi que ce soit sur le téléphone/PC de Fab.** L'erreur de livrer dans Djipie a été corrigée par transfert binaire Git (SHA de blob identique), sans changer le code ni fusionner main.

[**APK COMPLÈTE 0.10.0 avec 11 sons Sonniss, dans Block Boost**](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bubbles-full-apk-010/temp/android/BlockBoost-0.10.0-bubbles-full-debug.apk) — 438 375 octets ; SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`, commit `e06be4274978d0cd978c90196b1b94876f531dd0` sur branche de livraison `temp/blockboost-bubbles-full-apk-010`. Aucun ZIP à décompresser. Les contenus originaux séparés demeurent dans Djipie ; seule l'APK du jeu compilé est dans Block Boost. Pour les livraisons suivantes, produire dès le départ la version avec sons sur une branche TEMP de **Block-Boost**, pas de Djipie. Aucune fusion main, aucun déploiement Play.

## 17/10/2026 — 0.11.0 : la boule disco est revenue

Fab constate « La boule à facetre on ne l'a vois plus ? » ; cause 0.10 : `bubbles` prioritaire sur `jackpot` dès deux lignes. Fab valide par « Ok » la correction des récompenses à trois niveaux : (1) double simple → bulles et projecteurs bas, (2) gros jackpot → boule disco et Bass Drop 3, (3) croisement ligne + colonne ×10 → **boule disco + bulles simultanées** et score au premier plan.

Branche de travail `feature/restore-disco-and-cross-bubbles-011`; `src/festival.mjs` distingue `cross` (`crossMultiplier===10`, lignes et colonnes réelles), gros jackpot (`gained`, combo, 3 lignes...) et double simple. `cross` renvoie `theme:disco` avec `bubbles:true` ; le spectacle déclenche Bass Drop, création des bulles décalée de 460 ms, pops après 1540 ms. Les projecteurs en bas restent visibles et les timers s'annulent. La boule 20 sprites est conservée sur un seul axe. CSS `festival-cross` pour hiérarchie de profondeur : score premier plan. `previewTheme` et l'aperçu tactile prévoient le même tri de récompenses, y compris le ×10. **Aucune nouvelle règle de score, pas de changement des vibrations ni de la case voix OFF par défaut.**

Tests Node et Chrome mobiles [verts](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406), APK Android publique [compilée](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411) ; [PR #12 brouillon](https://github.com/greenpower2669/Block-Boost/pull/12). APK complète avec 11 sons Sonniss à livrer **directement dans Block Boost, jamais dans Djipie** (Djipie = source des sons). La Release Djipie des sons a été indisponible dans une CI ; le pipeline privé de repli reprend uniquement les 11 effets OGG **déjà incorporés dans l'APK validée 0.10**, dont le SHA source est fixé. Aucun pack isolé, aucun merge main/Play. Voir [contrat complet](docs/restore-disco-bubbles-cross-011.md).


**LIVRAISON VALIDÉE 0.11 (17 octobre 2026) :** APK Android COMPLÈTE avec onze sons Sonniss incorporés au jeu, **439 203 octets**, SHA256 `de6c6330d8a3d0c33488c8fdd392a009eeb6a35fb530df36bc51e30ce59b9c09`, [APK directe sans ZIP sur Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-bubbles-full-0.11.0/temp/android/BlockBoost-0.11.0-disco-bubbles-full-debug.apk). CI privée Djipie [39072037738](https://github.com/greenpower2669/Djipie/actions/runs/39072037738) **success** : réutilisation strictement des 11 effets validés déjà encapsulés dans APK 0.10 (SHA vérifié) après indisponibilité des Releases source ; recompilation 0.11, présence des 11 fichiers dans l'APK. Le blob Git binaire `46075377c90e920ed0b55b733d590eb779cfddc1` a été contrôlé identique lors du transfert de Djipie vers la branche de livraison propre à Block Boost `temp/blockboost-disco-bubbles-full-0.11.0` (commit `82fc7fd126d608a9016d2581cc8676ddf55ea6b6`). **Jamais de ZIP ni de sons Sonniss autonomes à installer**, seulement le jeu fini. CI Android public [39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411) et tests Node/Chrome [39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406) **verts**. Les APK debug peuvent avoir des signatures distinctes : sauvegarder données avant désinstallation/remplacement. Aucun merge `main` ni publication Play, test Samsung encore nécessaire.

## 18 octobre 2026 — Chance de rattrapage / fanfare disco 4 secondes, Block Boost 0.12

Fab souhaite « Si le joueur est loin de son dernier highscore il faut aider la chance avec des suites à gros point probable et la boule à facettes doit jouer une musique de victoire longue de 4 s gaie, drôle et complexe. »

**Implémenté**, branche `feature/score-comeback-victory-music-012`, contrat `docs/comeback-score-victory-music-012.md` :
- `src/engine.mjs` expose `comebackChance`, `comebackBatch`, `batchProspect`. Quand ancien record >=800, >=3 poses, écart > max(450, 40% du record), 38–73% de chances de sélectionner un meilleur trio parmi six candidats selon une simulation réelle de deux coups et toutes rotations. **Aucune modification de points, placements ou probabilités à proximité du record.** Le `runStartBest` du lancement de partie est la cible de rattrapage stable. `assistedBatch` peut annoncer une chance accrue.
- `src/victory-music.mjs` compose une **musique synthétisée originale exactement 4 secondes**, 126 bpm, 67 événements, mélodie, cuivres syncopés, basse, clochettes, glissandi cartoonesques. `Feedback` lit via WebAudio + limiteur doux sur `festival-disco`, au lieu du court Bass Drop Sonniss quand AudioContext est disponible ; le son privé reste un fallback. Musique coupée quand on désactive FX, change de partie ou cache l'app, sans réactiver les voix (OFF par défaut).
- Le spectacle disco est étendu à 4,2s pour couvrir la fin musicale. Anciennes règles intactes : double ordinaire=bulles, jackpot=disco, croisement x10=disco+bulles, voix optionnelles, 11 sons Sonniss privés synchronisés dans le jeu.
- [CI Node + Chrome 39084934741](https://github.com/greenpower2669/Block-Boost/actions/runs/39084934741), [APK publique 39084934816](https://github.com/greenpower2669/Block-Boost/actions/runs/39084934816), [APK SONNISS PRIVÉE 39085006124](https://github.com/greenpower2669/Djipie/actions/runs/39085006124) : **success**.
- **Livraison unique du jeu sur Block Boost** [APK COMPLÈTE directement téléchargeable](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-comeback-victory-full-0.12.0/temp/android/BlockBoost-0.12.0-comeback-victory-full-debug.apk), **442949 octets** SHA256 `d4ff4b8509c1a840cf3258cc9b31c586acbdfc1aae51b220d8ae065a1e35dd67`, binaire identique blob Git `106ff3be43b25007ec9d7bd5618a551e961b30cc` à celui généré via CI privée, commit de livraison `e80a73efaf66580b4995945126e6525c2891761e` sur `temp/blockboost-comeback-victory-full-0.12.0`, sans ZIP.
- Pas de merge main, pas de release Play, son rendu sur Samsung réel pas encore écouté/validé.

## 18 octobre 2026 — 0.13, nouvelle scène FIREWORKS, résultat record en trois temps
Demande explicite : « Avant la release » ; ne pas fusionner `main` ni publier sur Google Play sans validation finale.

**Gameplay :** à chaque fois que le score de **la partie en cours** franchit 1000, 2000, 3000… points, déclencher UN spectacle de feux d'artifice de **6 secondes** ; le seuil est naturellement réinitialisé à 1000 quand `newGame()` remet le score à zéro. Si un mouvement dépasse plusieurs seuils, ne pas lancer plusieurs spectacles concurrents. Le ×10 du croisement et le High Score historique restent inchangés.

**Visuel :** nouvelle couche `src/fireworks.mjs` (fusées colorées sur la surface, 9 éclatements maximum, animation non stroboscopique, 4 étoiles fixes en animations réduites) ; priorité sur la disco ordinaire pour le mouvement qui franchit le palier. Sur `end-dialog`, **uniquement si meilleur score battu**, jouer **successivement** : (1) boule disco 3,2 s, (2) bulles et cinq projecteurs 2,8 s, (3) fireworks 6 s. `src/result-celebration.mjs` conserve le score et le bouton Rejouer au premier plan, annule les timers si la partie redémarre ou le dialog est fermé.

**Sons choisis par Fab depuis Djipie :**
- Jingle de guitare électrique `Musique_electrique_guitare_jingle_001.wav` en musique de résultat record.
- Sept explosions `bang_01.ogg`…`bang_07.ogg` à déclenchements étalés en feu d'artifice.
- Fond ambiance `SON-0d763008d5a403c7c3c5349a__sbfa-fireworks-001.wav`.
- Fond explosions proches `SON-0a0461aae77465f5b1f28eaf__13-fireworks-powerful-explosions-multiples-in-a-row-near.wav`.
Les deux grands WAV sont coupés + fondus **à six secondes maximum** via FFmpeg lors du build privé Djipie ; le contrôleur audio coupe la totalité du son fireworks à 6000 ms même si un fichier est plus long. Les 11 effets validés antérieurement sont conservés : **21 OGG synchronisés au total**. AUCUN WAV brut dans le dépôt source public ; seulement l'APK de jeu complète pourra être livrée. Les options FX et animation réduite sont respectées, et des effets synthétiques de secours existent pour la build publique sans Sonniss.

**Production future :** package Android confirmé précédemment avec Fab, désormais `fr.greenpower.blockboost`, version `0.13.0`/code 13, ce qui crée une application distincte du prototype `fr.greenpower.blockboost.bubbleslab`; scores anciens non migrés automatiquement. AAB Play signé après validation des secrets GitHub, distinct de l'APK debug de test. **Ne pas publier de release Google Play ni fusionner main tant que Fab n'a pas testé.**

Source `feature/final-result-fireworks-013`. Workflow public Android `.github/workflows/android-apk.yml`; build privé Djipie `feature/blockboost-fireworks-assets-private-013`. Tests Node + tactile Chrome en CI. Prendre soin des sons seulement dans l'APK du jeu ; livraison `.apk` directe dans Block Boost sans ZIP selon ordre immuable FabCopilot.

### Livraison effective 0.13 AVANT release (18 octobre 2026)

- **APK complète 21 sons Djipie dans le jeu entier**, livrée en un fichier **.apk direct sans ZIP** sur une branche temporaire de Block Boost : [Télécharger BlockBoost 0.13](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-fireworks-full-0.13.0/temp/android/BlockBoost-0.13.0-fireworks-full-debug.apk).
- Taille **606 101 octets**. SHA-256 `c2943324577d7014851890fe767321beb36c26fcc41ae57a06cb78ede0215ec3`. Blob Git `d29b69c09620f9fe0a8d11530bbc31da1203f0df` vérifié IDENTIQUE entre sortie privée Djipie et branche de livraison publique Block Boost `temp/blockboost-fireworks-full-0.13.0`, commit livraison `99453146c0e52b3061d16afccb5d2e03d816c1d8`.
- Tests Node/Chrome tactiles **SUCCESS** [39145851083](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851083), dernier contrôle source docs [39146091168](https://github.com/greenpower2669/Block-Boost/actions/runs/39146091168) **SUCCESS**, build Android public [39145851089](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851089) **SUCCESS**, build APK privée **21 FX intégrés** [39146050159](https://github.com/greenpower2669/Djipie/actions/runs/39146050159) **SUCCESS**.
- Code et APK prête à tester sur Samsung Android 16. **Ni main ni la release GitHub v0.12 ne sont modifiés**. PR Block Boost [#16](https://github.com/greenpower2669/Block-Boost/pull/16) et Djipie [#12](https://github.com/greenpower2669/Djipie/pull/12) laissées en brouillon. L'écoute physique et une éventuelle AAB signée Play avec nouveau package `fr.greenpower.blockboost` restent à valider.
- Important : applicationId passée de `fr.greenpower.blockboost.bubbleslab` au package Play confirmé `fr.greenpower.blockboost`, Android installe côte à côte et ne migre pas automatiquement les records de l'ancienne application.


## Mission 19 octobre 2026 — Passation, SANS NOUVEAU CODE, avant dernière release Play

Fab demande de ne pas coder pour l'instant, mais de préparer une passation et de préserver dans la **section IMMUTABLE de `ordres-de-mission.md`** la chaîne complète de **mise à jour et signature AAB avec la JKS déjà récupérée**. La mission est détaillée dans [docs/passation-ultime-snap-pieces-lumiere-aab-014.md](docs/passation-ultime-snap-pieces-lumiere-aab-014.md). 

Nouveau comportement voulu : aimantation **UNIQUEMENT** d'un placement effaçant réellement des lignes/colonnes/combos, biais de prise de cible très légèrement **vers le haut** et stabilisation au `pointerup` si le doigt descend un peu ; jamais de snap sur pose perdante. Coin **en L de trois cases dans un 2×2** à ajouter (**carré plein 2×2 déjà présent**) ; diagonales 2/3 cases pour les 2 orientations à tirage très rare ; grands blocs plus fréquents **si plaçables** au début, moins en grille encombrée. Lumière arc-en-ciel tournant **réellement** à 360° autour des cases pré-gagnantes, sans tourner le bloc et sans casser les dégradés, respect animations réduites.

Invariants publication : identifiant Play validé `fr.greenpower.blockboost`, JKS upload RSA 4096 déjà générée/récupérée, alias `blockboost-upload`, PEM public, **4 secrets nommés** sans leurs valeurs (`ANDROID_UPLOAD_KEYSTORE_BASE64`, `ANDROID_UPLOAD_KEYSTORE_PASSWORD`, `ANDROID_UPLOAD_KEY_ALIAS`, `ANDROID_UPLOAD_KEY_PASSWORD`), signer AAB via CI sécurisée et contrôler certificat/sha/versionCode. **Ne pas régénérer JKS, ne pas toucher au code, main, release ou Play sans accord**. 

Conserver la 0.13 en brouillon sur PR #16, tests verts et APK avec 21 sons synchronisés livrée en lien direct sur Block Boost, 0.12 restant la seule GitHub Release actuellement publiée. Ancien package labo `fr.greenpower.blockboost.bubbleslab` distinct du nouveau : scores non migrés automatiquement. Tests Samsung de la nouvelle mission non effectués.

## BB-014 — candidat de finition 19/10/2026
Snap vers ancre légale gagnante seule : acquisition 0,46 cellule, maintien spatial 0,70, biais supérieur 0,09, coordonnée unique fantôme/preview/haptique/pose ; changement de rotation et annulation réinitialisent le snap. Tirage `DRAW_CONFIG` : diagonales 1,5 %/pièce max 1/trio, L3 distinct du carré plein, grands blocs en début si plaçables, diminution avec densité. `comebackBatch` toujours indépendant du score. Animation conique 360° des reflets via `--rainbow-phase` avec mouvement réduit. Version Android 0.14/code14/id fr.greenpower.blockboost. Les 21 sons complets et l'AAB signée restent à prouver par builds, avant toute publication.

Son BB-014 : restauration éphémère des 21 effets du jeu APK 0.13 SHA-vérifiée, empaquetage dans le jeu 0.14 complet uniquement. Aucune diffusion de sons autonomes.
