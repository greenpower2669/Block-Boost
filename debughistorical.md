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

**Résolution pipeline privé** : run [39067423786](https://github.com/greenpower2669/Djipie/actions/runs/39067423786) **SUCCESS** après installation explicite ffmpeg et correction `afade d=0.4`. SHA du fichier privé `fc8ff2bb0ab94784f9f506a7a240912b00d29afdd041d3a8a4f03b1a3de9a9a0`, APK 438355 octets ; workflow contrôlé `unzip` les 11 OGG dans l'APK. Public version sans Sonniss 219209 octets, SHA `dddacdfd9099d4ff82be2175c720a00e55f4a245666065ab62da5f0ee7c44c5a`. Les sons authentifiés n'existent pas dans la branche publique. Les APK de même ID signées par deux runners distincts peuvent provoquer `INSTALL_FAILED_UPDATE_INCOMPATIBLE` si installation l'une sur l'autre ; ne pas dire que scores survivent sans vérification physique.


**BILAN FINAL ACTUALISÉ (17/10/2026) :** après correction des pops audio dans src/main.mjs, tests Node/Chrome [39067717083](https://github.com/greenpower2669/Block-Boost/actions/runs/39067717083) **verts** et APK publique [39067712581](https://github.com/greenpower2669/Block-Boost/actions/runs/39067712581) **verte**. Quota de stockage d'artifacts GitHub atteint sur Djipie ; upload-artifact rendu facultatif, la publication de l'APK .apk seule en branche privée n'en dépend plus. CI Djipie privée finale [39068208556](https://github.com/greenpower2669/Djipie/actions/runs/39068208556) **SUCCESS**. [APK PRIVÉE FINALE 0.10 avec 11 sons](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk), **438375 octets**, SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`. Ce SHA remplace tous les SHA antérieurs des compilations d'essai. Lien privé (connexion GitHub requise). Aucun merge main ni Play release.

## 17/10 — boule disco invisibilisée par priorité bulles

Dans `src/festival.mjs` v0.10 : `if(lines>=2)theme="bubbles"; else if(jackpot)theme="disco"` rendait la boule pratiquement inaccessible pour les grandes récompenses multi-lignes. Correction 0.11 : `cross` détecté par lignes/colonnes réellement effacées avec `crossMultiplier=10` ; choisir disco quand croisement **ou** jackpot ; choisir bulles seulement quand double simple. Croisement active à la fois `theme:disco` et `bubbles:true` ; `festival-cross` conserve texte devant les décors et espace les sons. Tests dédiés et mobile Chrome verts : [39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406), APK publique [39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411).

La compilation privée initiale 0.11 échouait `gh release download` avec `release not found` malgré l'APK 0.10 privée déjà compilée. Repli mis en place **dans Djipie branche privée** : récupérer l'ancienne APK terminée présente dans le dépôt Block Boost, contrôler son SHA-256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`, réintégrer **seulement dans la compilation privée** les 11 OGG déjà synchronisés (pas de pack redistribué). Statut du nouveau build privé à vérifier, ne jamais inventer un APK final.


**LIVRAISON VALIDÉE 0.11 (17 octobre 2026) :** APK Android COMPLÈTE avec onze sons Sonniss incorporés au jeu, **439 203 octets**, SHA256 `de6c6330d8a3d0c33488c8fdd392a009eeb6a35fb530df36bc51e30ce59b9c09`, [APK directe sans ZIP sur Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-bubbles-full-0.11.0/temp/android/BlockBoost-0.11.0-disco-bubbles-full-debug.apk). CI privée Djipie [39072037738](https://github.com/greenpower2669/Djipie/actions/runs/39072037738) **success** : réutilisation strictement des 11 effets validés déjà encapsulés dans APK 0.10 (SHA vérifié) après indisponibilité des Releases source ; recompilation 0.11, présence des 11 fichiers dans l'APK. Le blob Git binaire `46075377c90e920ed0b55b733d590eb779cfddc1` a été contrôlé identique lors du transfert de Djipie vers la branche de livraison propre à Block Boost `temp/blockboost-disco-bubbles-full-0.11.0` (commit `82fc7fd126d608a9016d2581cc8676ddf55ea6b6`). **Jamais de ZIP ni de sons Sonniss autonomes à installer**, seulement le jeu fini. CI Android public [39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411) et tests Node/Chrome [39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406) **verts**. Les APK debug peuvent avoir des signatures distinctes : sauvegarder données avant désinstallation/remplacement. Aucun merge `main` ni publication Play, test Samsung encore nécessaire.

## 18 octobre — Vérifications de rattrapage et nouvelle musique

Changement 0.12 sur branche `feature/score-comeback-victory-music-012` (main intacte). Le problème de design était une très grande distance au meilleur record pour laquelle des trios difficiles empêchent les enchaînements. Ajout d'une assistance **probabiliste et mesurée** avec fenêtre de record >=800, distance > max(450,40%), >=3 coups, et recherche de suites prometteuses de deux poses à partir de six propositions. Ne modifie pas scores, placements, ×10, ni règles de fin. Le score du record au lancement est le seul seuil, pas la valeur qui est enregistrée au milieu de la partie.

Musique disco : ancien Bass Drop 3 provisoire remplacé **en mode WebAudio** par création pure synthétisée 4 secondes, 67 notes de cinq familles, limiteur doux et fondu à l'arrêt ; Bass Drop Sonniss toujours en fallback. Pas de fichier musical licencié ajouté au dépôt public. Les tests de partition garantissent fin <=4s et densité de composition.

[Node/Chrome 39084934741](https://github.com/greenpower2669/Block-Boost/actions/runs/39084934741), [CI APK public 39084934816](https://github.com/greenpower2669/Block-Boost/actions/runs/39084934816), [CI APK privée 39085006124](https://github.com/greenpower2669/Djipie/actions/runs/39085006124) success. [Fichier APK complète Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-comeback-victory-full-0.12.0/temp/android/BlockBoost-0.12.0-comeback-victory-full-debug.apk) 442949 octets, SHA `d4ff4b8509c1a840cf3258cc9b31c586acbdfc1aae51b220d8ae065a1e35dd67` vérifié par binaire Git identique. Si un utilisateur a déjà la même application signée par une autre clé debug, Android peut exiger la désinstallation — **ne pas garantir la conservation des scores**. Test réel du son non effectué.

## 18 octobre — 0.13 avant dernière release

Ancien test Chrome de jackpot disco se déclenchait au-delà de 1000 points, ce qui est désormais correctement remplacé par le show FIREWORKS (priorité). Test revu : combo disco sous 1000 ; croisement ×10 au-delà de plusieurs seuils = feux d'artifice + score ×10 HUD inchangé ; record final = trois animations consécutives, guitare, replay accessible. Échec audio privé de première tentative dû à une assertion obsolète `COUNT == 11`, corrigée vers `COUNT == 21`; fichiers et build valides. Le nouveau package `fr.greenpower.blockboost` change l'espace de sauvegarde Android : ne pas supprimer le vieux proto tant que les scores ne sont pas sauvegardés. Tout reste en feature, main/release 0.12 non modifiées.

### Livraison effective 0.13 AVANT release (18 octobre 2026)

- **APK complète 21 sons Djipie dans le jeu entier**, livrée en un fichier **.apk direct sans ZIP** sur une branche temporaire de Block Boost : [Télécharger BlockBoost 0.13](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-fireworks-full-0.13.0/temp/android/BlockBoost-0.13.0-fireworks-full-debug.apk).
- Taille **606 101 octets**. SHA-256 `c2943324577d7014851890fe767321beb36c26fcc41ae57a06cb78ede0215ec3`. Blob Git `d29b69c09620f9fe0a8d11530bbc31da1203f0df` vérifié IDENTIQUE entre sortie privée Djipie et branche de livraison publique Block Boost `temp/blockboost-fireworks-full-0.13.0`, commit livraison `99453146c0e52b3061d16afccb5d2e03d816c1d8`.
- Tests Node/Chrome tactiles **SUCCESS** [39145851083](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851083), dernier contrôle source docs [39146091168](https://github.com/greenpower2669/Block-Boost/actions/runs/39146091168) **SUCCESS**, build Android public [39145851089](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851089) **SUCCESS**, build APK privée **21 FX intégrés** [39146050159](https://github.com/greenpower2669/Djipie/actions/runs/39146050159) **SUCCESS**.
- Code et APK prête à tester sur Samsung Android 16. **Ni main ni la release GitHub v0.12 ne sont modifiés**. PR Block Boost [#16](https://github.com/greenpower2669/Block-Boost/pull/16) et Djipie [#12](https://github.com/greenpower2669/Djipie/pull/12) laissées en brouillon. L'écoute physique et une éventuelle AAB signée Play avec nouveau package `fr.greenpower.blockboost` restent à valider.
- Important : applicationId passée de `fr.greenpower.blockboost.bubbleslab` au package Play confirmé `fr.greenpower.blockboost`, Android installe côte à côte et ne migre pas automatiquement les records de l'ancienne application.


## 19 octobre — Retour utilisateur avant toute modification : micro-glissement du doigt et halo 360°

Symptôme rapporté par Fab : lorsqu'un placement réellement gagnant est presque aligné, la très légère descente du doigt lors du relâchement peut déplacer le bloc et empêcher la pose attendue. **Observation du code, cause probable non encore prouvée par test Samsung :** dans `src/main.mjs`, `pointerup` recalcule `metrics(coords,e.clientX,e.clientY)` et ignore le dernier alignement gagnant du fantôme. Mission à réaliser ultérieurement : aimantation sélective d'un placement gagnant légal, petit biais supérieur et hystérésis ; jamais sur poses perdantes ; tests tactile/sensation requis.

Autre observation technique : les reflets des cellules `will-solve` dans `styles.css` ont un `conic-gradient` dont la phase reste figée, tandis que `rainbowWave` fait seulement `filter:hue-rotate`. Fab veut **rotation angulaire réelle des halos 360°**, en préservant couleurs et brillance, sans bouger le bloc ; mode réduit. Besoin d'un coin L 2×2 trois cases (carré 2×2 plein déjà existant), barres diagonales 2/3 cases à faible probabilité, gros blocs plus favorables en début si plaçables.

La nouvelle demande du 19/10 est une **passation sans code**, enregistrée au registre avec **IMMUTABLE** pour package Play `fr.greenpower.blockboost`, Upload Key RSA 4096 existante, PEM, alias, noms de secrets, AAB signée et livraisons. Aucun test/génération AAB nouveau effectué pour elle. [Détails](docs/passation-ultime-snap-pieces-lumiere-aab-014.md).

## BB-014 19/10/2026 : décalage de pose gagnante, cause code et correctif candidat
Observation Fab : le doigt redescend légèrement au lâcher, et une case annoncée gagnante peut être perdue. Code 0.13 : `pointerup` recalculait directement `metrics(clientX,clientY)`, indépendant du fantôme, laissant l'arrondi changer l'ancre. Nouveau chemin candidat : cible gagnante calculée une fois à partir des cibles légales, hystérésis courte et coordonnées exactes pour le rendu et la pose ; effacement sur rotation/cancel. Ancien `rainbowWave` ne changeait que la teinte, pas l'angle conique ; ajout d'une phase angulaire enregistrée. **Non vérifié encore physiquement** sur Samsung ni pour AAB : à inscrire en recette, pas annoncer comme validé.

- **CI initiale BB-014 du commit 9b947508** : 66/68 tests unitaires réussis ; échec `bonus.test` car `rng=()=>0` tirait exceptionnellement une diagonale (attendu historique : singleton), et assertion de seuil anti-snap incorrecte dans le nouveau test (0,54 moins biais 0,09 = 0,45, encore en acquisition). Correctifs : réserver le `rng=0` au chemin déterministe ordinaire, et placer l'assertion hors rayon à 0,59. Recontrôler en CI, ne pas prétendre tests verts avant résultat.

BB-014 : le premier build 0.14 était un fallback CC0 sans 21 sons. Correctif candidat : restauration depuis APK 0.13 complète vérifiée, puis test de présence 21 OGG avant toute livraison. Ne pas déclarer succès sans constat CI.

- 19/10 BB-014, incident pipeline : substitution JS naïve a interprété `$'` de la commande grep comme suffixe de chaîne, dupliquant les dernières étapes YAML. GitHub Actions a rejeté les deux workflows **sans jobs** sur c274430. Remise à plat depuis les versions saines du commit 02719c, réinjection via remplacement fonctionnel (ne traite pas les `$` comme spéciaux) et vérification de structure YAML. Aucun binaire erroné diffusé.

- BB-014, **preuve après reconstruction YAML** : GitHub Actions 39230344488 SUCCESS, tests Node/Chrome 39230344461 et 39230351456 SUCCESS ; restauration SHA-256 de l'APK 0.13 OK, comptage 21 FX dans APK 0.14 OK, dépôt .apk direct dans Block Boost OK (taille 608074, SHA 2f815dd0faf5a0db8a1526fdb8034b8a52f9330cf8c10c55cce9f3954ea619ca). Validation tactile Android 16 non réalisée. AAB signée non construite ; PEM public référent absent des sources courantes, validité des secrets non encore testée, NE PAS régénérer JKS.

## BB-015 — Mix musical, tests et limites (19/10/2026)
- Choix technique : atténuation temporelle de l'accompagnement, plutôt que filtrage spectral irréversible. Le ducking couvre SFX courts / longs, fanfare 4s, guitare, fireworks 6s et voix ; retour progressif.
- Reproductibilité : MP3 identique à main (SHA blob `ab73a2914ab6afe3c6b9f30093766053977dcc0e`), Android inclut `assets/www/Blockboostmusic.mp3`, service worker ne met pas le MP3 lourd en précache.
- CI et APK source 0.14 réussis (Android #39324826000 ; tests #39324826032 et #39324832287). Android matériel non encore écouté.
- Vérifications terrain attendues : décodage offline WebView, absence de coupure/artefact lors du fade, équilibre FX/TTS/musique, écran verrouillé, reprise, boucle MP3. Ne pas déclarer la qualité audio validée avant essai.

## BB-016 — Retour utilisateur sur la brutalité du volume
- Régression perceptive BB-015 : ducking fréquent de 85 ms provoquant un pompage abrupt, même en présence d'effets courts.
- Correctif demandé : éliminer toutes les baisses à l'exception de la guitare électrique de record ; facteur modéré 0,55 et rampes 1200/2000 ms ; conserver la musique en boucle à faible niveau et volume réglable.
- Tests d'écoute obligatoires : vérifier transition après capture de score, effet guitare manquant (fallback sans ducking), interruption prématurée, reprise Android, et stabilité au cours des parties riches en effets.

## BB-017 — Contrôles publication & signature (20/10/2026)
- Derniers tests branche PR #16 : Node/Chrome verts sur commits 2b4a998..., APK source 0.14 musique stable (21 sons) vérifiée par Actions 39326900698, SHA256 `3e27f2abc081328feca400f80ff086cb4869257977cb17a102ad9bf1eea923e1`.
- Avant release : fusion autorisée le 20/10, nouveau workflow de GitHub Release 0.14 à déclenchement contrôlé lors de l'intégration `main`. Ne pas publier l'ancienne APK avec ducking violent (SHA `8fe7dec...`) ; utiliser exclusivement la dernière APK `3e27f2...`.
- AAB release signée : branche actuelle ne contient pas `android/certificates/BlockBoost-upload-certificate.pem`; secrets impossibles à vérifier depuis le simple contenu du dépôt. Les gardes PEM et 4 secrets ne doivent pas être désactivées. Toute tentative doit échouer proprement en absence des prérequis. AAB non encore fabriquée et Play non confirmé.

## BB-017 — PREUVES DE LIVRAISON (20/10/2026)
- Merge PR #16 → `main` = `1e4386e761acdc0152c39253914fe250403a9835` confirmé sur GitHub.
- Workflow Release v0.14.0 [39389652039](https://github.com/greenpower2669/Block-Boost/actions/runs/39389652039) SUCCESS (tests/MP3/21 FX/versionCode14/SHA). Tests `main` [39389652065](https://github.com/greenpower2669/Block-Boost/actions/runs/39389652065) SUCCESS.
- GitHub [Release v0.14.0](https://github.com/greenpower2669/Block-Boost/releases/tag/v0.14.0) est une **pré-release** comportant l'APK de test et son SHA. APK 18 160 892 octets, SHA-256 `3e27f2abc081328feca400f80ff086cb4869257977cb17a102ad9bf1eea923e1`.
- Aucun certificat PEM public `android/certificates/BlockBoost-upload-certificate.pem` dans `main` ni dans historique de commits de ce chemin. Un vrai AAB signé ne peut être attesté ; aucune exécution réussie du workflow AAB. Quatre secrets non audités en runner. Play non publiée.
- La 0.14 debug n'assure pas une installation de mise à jour Play. Préserver l'identité `fr.greenpower.blockboost` et la clé JKS RSA4096 alias `blockboost-upload` existante, surtout éviter génération de nouvelles clés.

## BB-018 — Réception et validation locale certificat X.509 (20/10/2026)
- Fichier fourni par Fab : `BlockBoost-upload-certificate.pem`, 1 923 octets. `openssl x509` le reconnaît comme certificat public valide au format PEM, RSA **4096 bits**, du 18/10/2026 au 05/03/2054. Aucun marqueur PRIVATE KEY. Fingerprint SHA256 `D7:73:E8:88:80:EF:A7:28:A0:16:D7:A7:E1:DF:A3:AE:29:6A:A3:0B:2E:DD:33:18:8A:04:50:DD:A6:1E:76:0F`.
- Règle immuable approuvée : copie permanente sous `android/certificates/BlockBoost-upload-certificate.pem` sur `main`, réutilisée automatiquement à chaque version ; jamais besoin de redemander ce PEM. Comparaison avec certificat réel de la JKS via quatre secrets sur runner obligatoire pour juger sa correspondance.
- Déclenchement automatique sécurisé du workflow `.github/workflows/android-play-candidate.yml` lors de l'ajout du PEM. Examiner son résultat avant d'affirmer qu'une AAB signée existe. Le PEM seul ne certifie pas la présence des secrets.

## BB-018 — Certificat IMMUTABLE installé ET signature AAB vérifiée (20/10/2026)
- [Certificat public canonique](https://github.com/greenpower2669/Block-Boost/blob/main/android/certificates/BlockBoost-upload-certificate.pem) ajouté sur `main` par commit `48b34aa53d98baff74d214685892813bb2584967`. Le PEM transmis avait des fins de lignes mixtes/CRLF ; seules les fins de lignes ont été normalisées en LF lors de l'ajout, **aucune modification du certificat X.509 sous-jacent**.
- [GitHub Actions signé #39394294446](https://github.com/greenpower2669/Block-Boost/actions/runs/39394294446) **COMPLETED/SUCCESS**. Étapes toutes réussies : restauration JKS via les **quatre secrets existants**, comparaison stricte `cmp` des DER du PEM et de l'Upload Key, construction `:app:assembleRelease` / `:app:bundleRelease`, vérification `apksigner` / `jarsigner`, identité `fr.greenpower.blockboost` code14/version0.14.0, 21 OGG et `Blockboostmusic.mp3`, nettoyage JKS et PEM temporaires.
- **AAB signée produite** dans l'artefact GitHub Actions `BlockBoost-0.14.0-signed-candidate` (artifact ID `12250912694` ; rétention 30 jours, expiration prévue le **19/11/2026**). Artefact contient AAB signée, APK release signée et `SHA256SUMS`. À conserver durablement ailleurs avant expiration si publication Play non terminée.
- Le certificat PUBLIC reste durable dans `main` et sera réutilisé lors des futures signatures ; secrets et clé privée **ne doivent jamais être publiés**. Préserver le workflow et le PEM. Pour les versions suivantes, lancement manuel sécurisé du workflow AAB, sans redemander le PEM.
- **Google Play Console non publiée** : cette étape implique encore l'envoi de l'AAB à la Play Console et vérification du statut d'examen/publication. Ne pas confondre artefact signé et diffusion Play.
