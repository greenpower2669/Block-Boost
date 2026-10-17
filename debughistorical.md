# Block Boost — debughistorical

## 2026-10-16 — Initialisation documentaire
- Dépôt observé : README et licence uniquement, pas de code exécutable.
- Référence fonctionnelle : capture utilisateur `Blck.mp4`, analysée dans la conversation ; les règles internes non démontrables ne sont pas certifiées.
- Spécification proposée : gameplay, mascottes, voix/FX couplés et scores locaux.
- **Aucun bug logiciel identifié ou corrigé, aucun test exécuté, aucun APK/AAB construit.**
- Conserver ici les incidents réels, diagnostics, validations et correctifs seulement quand l'implémentation commencera.

## 2026-10-16 — Premier prototype jouable et validation GitHub

- Création de `feature/block-boost-playable-rotation-v1`, basée sur la branche de documentation précédente.
- Mise en place d'un moteur JavaScript, d'une interface PWA, de six mascottes emoji provisoires, voix de synthèse navigateur, FX et stockage local.
- Rotation : deuxième contact tactile pendant le maintien de la pièce = +90° dans le sens horaire ; le premier contact reste responsable de la dépose.
- Premier workflow rouge : 11/12 tests. Cause **dans le jeu de données du test de fin de partie**, qui remplissait une ligne et déclenchait sa suppression ; le cas ne représentait pas une véritable impasse.
- Deuxième workflow encore rouge : des cellules totalement pleines ailleurs dans le plateau déclenchaient à nouveau un effacement ; correction avec une disposition de trous isolés dans chaque rangée et colonne, y compris la ligne/colonne de pose.
- Puis **12/12 tests moteur verts**. CI de Chrome plus récente : simulation de deux contacts réussie, rotation effective, dépose, score et reprise après recharge. Résultat vert : https://github.com/greenpower2669/Block-Boost/actions/runs/38930799354.
- Correctif du son : ne pas appeler `SpeechSynthesis.speaking` comme une fonction (c'est un booléen).
- Réserves : pas de test physique sur Samsung, pas de sprites finaux ou voix embarquées, aucun build Android, aucune fusion `main`, aucune release.

## 2026-10-16 — Compilation APK et publication du fichier décompressé

- Première CI Android en échec : `android-actions/setup-android@v3` demandait le paquet SDK obsolète `tools`. Correction : utiliser directement le `sdkmanager` du SDK préinstallé GitHub.
- Deuxième CI en échec : `BuildConfig.DEBUG` non généré par la configuration AGP. Correction : détecter `ApplicationInfo.FLAG_DEBUGGABLE` pour activer uniquement le debug WebView.
- Troisième CI Android **verte** : https://github.com/greenpower2669/Block-Boost/actions/runs/38932973713. Compilation Gradle/Javac, tests moteur, vérification ressources APK et publication de l'artefact ZIP.
- Demande explicite : éviter le téléchargement ZIP sur Android. Nouvelle GitHub Action `.github/workflows/publish-apk-direct.yml` : récupère l'artefact du run vert par `gh run download`, l'extrait sur GitHub Actions, vérifie le SHA-256, commit l'APK natif dans le répertoire `temp/android/` sur une branche isolée `temp/blockboost-apk-0.1.0`.
- Action directe **verte** : https://github.com/greenpower2669/Block-Boost/actions/runs/38933516757.
- Fichier vérifié dans GitHub : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-apk-0.1.0/temp/android/BlockBoost-0.1.0-debug.apk. Taille 33307 octets ; SHA-256 `49e963e01c075a2014b1889c54a236fec86b56587b328bfede3e2bea0688b98c`.
- Aucun merge ni release ; APK debug non validée par test manuel Android 16.

## 16/10/2026 — Moteur vocal Android isolé, validation CI

- Besoin : voix Block Boost plus expressive et sans blocage UI durant les voix/combo.
- Solution : bridge JS → `ExpressiveVoiceEngine` utilisant HandlerThread, TTS Android local, validation des paramètres, priorité, annulation et préparation d'assets OGG vocaux (absents de cette version).
- Director JS : huit dernières phrases écartées du tirage, historique maximum 48 en stockage local, profils émotionnels et répliques supplémentaires ; tests Node.
- CI tests [38956309287](https://github.com/greenpower2669/Block-Boost/actions/runs/38956309287) **success** ; CI Android [38956309047](https://github.com/greenpower2669/Block-Boost/actions/runs/38956309047) **success**, APK et empreinte contrôlées, commit du binaire sur `temp/blockboost-emotion-0.2.0/temp/android/`.
- SHA-256 APK `49c5bce6a6edc4892b60f1505c5b06b321bd54819068e62dede7407cd4f9f6e0` ; 40 230 octets. App ID `fr.greenpower.blockboost.emotionlab`, indépendant de l'ancienne debug afin d'éviter conflit de clé.
- Test Samsung non effectué. Vraies voix émotionnelles préenregistrées / synthèse neuronale non livrées. Aucun merge main ni release.

## 2026-10-16 — Bonus vitesse visibles et EXTRA sans rotation (0.3.0)

- CI de développement initiale rouge : ancienne assertion Chrome attendait exactement 15 points et une bannière « EXTRA » après une rotation ; après ajout des points vitesse et du HUD il fallait adapter le scénario.
- Correction : calculer, afficher et effacer l'état de sélection après toute pose dans `paint()`. Tests de navigateur désormais orientés sur la valeur affichée et le score conservé, non sur la valeur de l'ancienne version.
- Test Chrome renforcé : un premier glisser à **deux doigts** gagne son coefficient vitesse mais **pas** d'extra. Une seconde pose **sans rotation** affiche `EXTRA SANS ROTATION`, augmente le score et reste sauvegardée après rechargement.
- Suite JavaScript 22 scénarios verte, CI globale [38958540023](https://github.com/greenpower2669/Block-Boost/actions/runs/38958540023) verte ; Android [38958540134](https://github.com/greenpower2669/Block-Boost/actions/runs/38958540134) vert ; APK directe https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bonus-0.3.0/temp/android/BlockBoost-0.3.0-bonus-debug.apk.
- 42 688 octets, SHA256 `e14696954dbf30b17fb006fb34ab72daf9a131da1e4e4f27cf319110faf72b65` stocké dans `temp/android/BlockBoost-0.3.0-bonus-debug.sha256`. APK signée debug, pas Google Play. Aucune validation humaine du rendu Samsung.

## 16/10/2026 — Retours sonores/haptiques et 388 répliques

- Premier build en cours d'implémentation : tests rouges à cause de la règle déjà présente dans `tests/bonus.test.mjs` exigeant que l'annonce du **sans rotation** contienne explicitement « rotation » ou « direct ». Certaines nouvelles phrases étaient grammaticalement appropriées mais pas explicites ; filtrage de la banque corrigé pour annoncer le bonus de façon vérifiable. Aucun contournement de test.
- GitHub Actions **validation finale verte** : run [38962905329](https://github.com/greenpower2669/Block-Boost/actions/runs/38962905329), tests Node + scénario tactile Chrome.
- **Compilation finale verte** : run [38962905413](https://github.com/greenpower2669/Block-Boost/actions/runs/38962905413), APK brute créée dans `temp/blockboost-audio-0.4.0/temp/android/`, taille 52 067 octets, SHA-256 `304e962393c98a2e356bf5b976e4c74aed55d492ddb1b6b7514a11f22773ed0a`.
- Le « dling-biling » est produit par deux oscillateurs Web Audio déclenchés uniquement à la transition invalide→valide avec refroidissement ; `PlacementCueGate` est testé indépendamment du DOM. L'API native haptique passe sur le thread UI. Aucune dépendance réseau.
- **Limite** : la CI ne valide ni sensation tactile ni volume réel sur le Samsung. La voix est un TTS expressif par modulation du système, pas un modèle vocal émotionnel neuronal.

## 16 octobre 2026 — Diagnostic : haptiques des bonus absentes

Sur 0.4.0, le pont `AndroidBridge.haptic` n'exposait que `grab / valid / rotate / drop / clear / combo`. Les événements `speed / extra` jouaient des sons mais n'invoquaient aucun retour haptique spécifique. Les commandes `clear` ou `drop` restaient des appels `WebView.performHapticFeedback` ponctuels, incapables d'émettre une vibration continue et d'amplitude contrôlée.

Correction 0.5.0 : ajout `HapticWaveEngine` (Android VibrationEffect, permission VIBRATE), `rewardHaptic` (motifs selon gain réel), `clearingTargets` + `proximityStrength` pour guidance selon positions qui complètent effectivement une ligne. Arrêt immédiat si état non guidable, plus garde-fou d'arrêt 750 ms sans message. Les tests JavaScript couvrent positions légales, doubles effacements, rotation, scores/bonus et appel natif de récompense.

Preuves : [Chrome / Node vert](https://github.com/greenpower2669/Block-Boost/actions/runs/38970378913), [APK Android vert](https://github.com/greenpower2669/Block-Boost/actions/runs/38970267717), binaire 57 692 octets, SHA-256 `94f44de8f569841a5ce91061dda22cb73b6cca0e6d035c7c5ed1213c598ee790`, [APK directe](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-haptic-0.5.0/temp/android/BlockBoost-0.5.0-haptic-debug.apk). L'app Android cible est `fr.greenpower.blockboost.hapticlab`, indépendante des anciennes. La validation sensorielle Samsung reste manuelle.

## 17 octobre 2026 — Test prévisualisation 0.6.0

Le premier test Chrome attendait huit cases brillantes mais en observait zéro. Le diagnostic a établi que page.reload déclenchait pagehide, qui écrasait la grille artificielle du test par l'ancienne sauvegarde. Correction du test : initialisation de la grille via page.addInitScript après pagehide et avant le chargement du jeu. Test réellement exécuté sur prévisualisation huit cases avant lâcher, puis animation des huit cases après pose, et devenu vert.

Test Node/Chrome 39026234986 et APK Android 39026190674 verts, taille 61 018 octets, SHA256 09b53fce4a63379e4a5cf0d6369c22f7c926b61897838508fb2efe390fa5f494. Aucun faux effacement visuel si pose invalide. Voix suspendues volontairement ; aucune archive Soniss copiée, uniquement lien de Release. Validation Samsung manuelle toujours à faire.

## 17/10/2026 — Audio Djipie + festivals 0.7

Source commune identifiée : branche Djipie `feature/bibliotheque-audio-inventaire-v1`, 447 références dont 100 Kenney et 347 Sonniss, analyses auditives individuelles à faire. Les cinq archives Sonniss ne sont pas redistribuées ; nous n'avons copié que 12 Kenney CC0 dans un export textuel indépendant à partir du ZIP d'origine SHA `f2193d072726d6758a5f7871b2dcc54dcce0d5c35c6f0a62f92549b327c81232`, workflow réussi `39035758824`. Copie dans Block Boost uniquement sur branche 0.7, pas dans la mémoire.

Première série de tests Festival rouge : un scénario de ligne simple simulée portait `noRotationBonus:5` sans l'annoncer explicitement, ce qui sélectionnait normalement la famille Cristal au lieu de Forêt. Corrigé **dans le scénario de test**, pas dans les règles de sélection : bonus EXTRA vaut désormais 0 dans le scénario neutre. Après correction, moteur et Chrome verts, y compris double ligne avec combo et sphère disco rendue.

Limiter à 58 particules et 3 s, pointer-events:none, réduire les animations si besoin. Sons réels OGG via WebView audio HTML, volume atténué en cas de superposition, fallback oscillateurs. Voix suspendues. Aucun test sensoriel Samsung ni fusion de branches.

**Incident de CI Gradle 0.7.0 résolu** : run [39036590807](https://github.com/greenpower2669/Block-Boost/actions/runs/39036590807) échoué en configurant le classpath Gradle (plus de 50 dépendances Maven introuvables simultanément, dont Kotlin/ASM) ; pas de défaut JS. Correctif `.github/workflows/android-apk.yml` : trois tentatives bornées espacées de 25 secondes et sauvegarde cache de branche. Run final [39036754874](https://github.com/greenpower2669/Block-Boost/actions/runs/39036754874) succès, vérification de `src/festival.mjs`, `src/kenney-audio.mjs` et du manifest audio **dans l'APK**, fichier brut sur branche temporaire, SHA256 `a87766eff2accb67ce139545563bb681c4c335c6eb068952a487924a04b13be5`. [Node/Chrome 39036754891](https://github.com/greenpower2669/Block-Boost/actions/runs/39036754891) vert.

## 17/10/2026 — Double rotation disco / rectangle FX / voix verrouillées : correctifs 0.8

Diagnostic 0.7 : `.festival-stage` était un enfant de `.board-wrap`, en `position:absolute; inset:0; overflow:hidden` avec `border-radius:14px`, créant un **cadre visible**. La sphère était un div utilisant le masque CSS de facettes et `rotateY(360deg) rotate(360deg)`, ce qui déformait l'objet 2D. Le checkbox vocal était `disabled` et `Feedback.speak` retournait sans condition ; impossible de réactiver les voix depuis le menu.

Corrections : reparentage de la couche lumineuse sous `body`, styles fixed/overflow visible et halos étendus, boule Canvas à 20 frames orthographiques de yaw mono-axe, option voix activable OFF par défaut et `stopVoice` séparé de l'haptique. Tests de non-régression réels sur Chrome.

**Anomalies découvertes par la CI et résolues :** première version `drawDiscoSpriteFrame` utilisait une signature `CanvasRenderingContext2D.drawImage` à laquelle manquait `sHeight` (7 arguments au lieu de 8 après l'image). Corrigé sans affaiblir le test. Un ancien test `rainbow-preview.test.mjs` vérifiait encore une désactivation forcée malgré `voice:true` ; adapté pour vérifier le nouveau comportement documenté `voice:false`. Validations finales [39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) vert et [39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) vert. Binaire [0.8.0](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk), 136 226 octets, SHA256 `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`. Validation matérielle Samsung restant à faire.

## 17/10/2026 — Correction disco 0.8 et validation CI

Audit 0.7 : couche `.festival-stage` absolute et `overflow:hidden` dans `.board-wrap`, donnant un rectangle FX visible ; rotation `rotateY(360deg) rotate(360deg)` sur une grille de facettes CSS 2D, produisant un effet aplati. Remplacé par overlay fixed sous body et planche réelle Canvas 2D de 20 frames à projections sphériques yaw unique.

Premiers tests rouges 0.8 : rectangle source/destination du blit `ctx.drawImage` incomplet ; corrigé pour 9 arguments ; ancien test qui exigeait silence même avec `voice:true` obsolète ; adapté au nouveau contrat (silence seulement sur OFF). Tests de navigateur vérifient le contrôle vocal et deux images de facettes aux pixels différents, plus disparition du découpage FX. Résultat [CI Node/Chrome 39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) **success**, [CI APK 39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) **success**. APK 136 226 octets, SHA256 `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`, lien https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk. Test physique non effectué. Aucun merge main.

## 17 octobre 2026 — Labo Concert 0.9, validation

Le pied de page (« Nouvelle partie ») de l'APK 0.8 était masqué derrière la barre système Android 16 sur capture Samsung. L'inset natif existait déjà, mais la mise en page WebView (100dvh, grand plateau, hauteur totale supérieure à l'écran) et `touch-action:none` du contenu empêchaient de retrouver le pied de page. En 0.9, `.app-shell` ajoute marge basse de sécurité >=78px seulement en APK (`AndroidBridge`), `body` scroll et `.game-surface` autorise le défilement `pan-y` ; la grille et les pièces restent `touch-action:none`. Le test Chrome contrôlant ce comportement est vert, mais **un appareil Android réel reste indispensable** pour confirmer la marge et l'absence de chevauchement.

Les 24 OGG Kenney sont vérifiés par signatures OggS et manifeste depuis Djipie ; Sonniss reste hors historique/public. Les ding jingles courts viennent du synthétiseur musical du jeu, pas d'un entraînement IA. La voix Waouh n'est jamais forcée si option voix OFF, le texte bonus ne prétend que les points vraiment gagnés.

Tests [39057514184](https://github.com/greenpower2669/Block-Boost/actions/runs/39057514184) et build [39057514186](https://github.com/greenpower2669/Block-Boost/actions/runs/39057514186) **success** ; APK https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-concert-0.9.0/temp/android/BlockBoost-0.9.0-concert-debug.apk, 216 071 octets, SHA256 `bfc9fe705b2e75c9e74709da423d61c498750ed8c1720742516761eca26db4a9`. Aucun merge main ni test physique.

## 17/10/2026 — Correctifs de CI audio 0.10

Pipeline d'intégration Sonniss lancé **dans Djipie privé** sur branche `feature/blockboost-bubbles-private-apk-100` ; la branche publique BlockBoost n'a qu'un manifest `PRIVATE_AUDIO_FILES={}` et 24 Kenney CC0 de remplacement. Les WAV sont récupérés et validés dans espace temporaire, convertis en OGG dans le jeu fini, et supprimés du workspace avant push d'une APK seule.

Premier problème : runner Ubuntu sans `ffmpeg` ; correction workflow installation apt. Deuxième problème : filtre `afade` rejette `d=.4` ; correction valeur explicite `d=0.4`. Aucun changement des sons d'origine / données source. Tests Node échouaient aussi car `tests/festival.test.mjs` attendait 6 familles alors que `bubbles` est la 7e ; corrigé à 7. Tests Node/Chrome et APK publique success le 17/10 : runs 39067278200 / 39067278164. Ne PAS inférer la réussite de la pipeline privée tant que son run n'a pas été constaté.
