# Block Boost — TODO vivant

> 16/10/2026 : **prototype Web/PWA codé sur `feature/block-boost-playable-rotation-v1`**, non fusionné dans `main`. Ce n'est pas encore une application Android native.

## Réalisé — prototype initial
- [x] Décrire le gameplay, les animaux, les voix, les FX et la sauvegarde locale.
- [x] Créer `brain.md`, `brainmap.md`, `debughistorical.md`, `ordres-de-mission.md`.
- [x] Implémenter plateau 8 × 8, trois formes, glisser-déposer tactile et sélection par tap.
- [x] Ajouter rotation 90° par deuxième doigt, touche R et bouton de secours.
- [x] Implémenter validation de pose, suppression lignes/colonnes et croisements sans gravité.
- [x] Définir formule de score prototype et règle de combo ; tester leur cohérence.
- [x] Détecter une impasse seulement en l'absence de coup légal.
- [x] Effets visuels lumineux de réussite, score, combos et étincelles.
- [x] Six compagnons temporaires en emoji animés avec phrases en français.
- [x] Voix système `speechSynthesis`, sous-titres, petites notes FX locales, limitation des annonces.
- [x] Sauvegarde locale du record, de la partie en cours, des réglages et du compagnon.
- [x] Version installable comme PWA avec icône SVG et cache hors ligne.
- [x] CI tests moteur et test automatisé Chrome de la rotation à deux doigts, de la pose et de la persistance après reload.

## À faire — qualité et produit final
- [ ] Test manuel du geste à deux doigts, de la vitesse et du cadrage sur Samsung Android 16.
- [ ] Concevoir de vrais sprites et petites animations pour les six animaux (emoji actuels provisoires).
- [ ] Fournir des voix françaises embarquées/offline de qualité et enregistrer une politique de sélection vocale.
- [ ] Affiner le mixage avec ducking réel des FX et tester les cas de voix chevauchées.
- [ ] Réaliser des tests visuels de gameplay et des scénarios de longues parties sur téléphone.
- [ ] Ajouter éventuellement des animations de compteurs plus riches et un historique personnel consultable.
- [x] Empaqueter le prototype Web dans une app Android Java/WebView avec icône adaptative et créer `BlockBoost-0.1.0-debug.apk` signée debug.
- [x] Par GitHub Actions, dézipper l'artefact et publier l'APK brut dans `temp/android/` sur la branche `temp/blockboost-apk-0.1.0` pour accès direct sans ZIP.
- [ ] Tester l'installation et le gameplay de l'APK sur Samsung Android 16.
- [ ] Si publication Play décidée ensuite, produire un `.aab` de release avec signature de publication validée séparément ; ne jamais utiliser la clé debug pour Play.
- [ ] Remplacer l'icône provisoire et compléter les tests d'ergonomie réelle.
- [ ] Tester les sauvegardes sous forte contrainte (quota, éviction de cache, fermeture brusque) et les migrations futures.
- [ ] Faire valider la formule des points et les choix artistiques.
- [ ] Ne pas fusionner `main`, créer de release ou publier sans accord explicite.

## Source de vérité

Voir [docs/description-gameplay-mascottes-voix-fx-et-score-local.md](docs/description-gameplay-mascottes-voix-fx-et-score-local.md) et [brain.md](brain.md).

## Lien de test Android direct

- [APK sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-apk-0.1.0/temp/android/BlockBoost-0.1.0-debug.apk)
- [GitHub Action de décompression et publication](https://github.com/greenpower2669/Block-Boost/actions/runs/38933516757)
- SHA-256 : `49e963e01c075a2014b1889c54a236fec86b56587b328bfede3e2bea0688b98c`

## 16/10/2026 — Évolution vocale émotionnelle lab 0.2.0

- [x] Moteur `ExpressiveVoiceEngine` Android sur `HandlerThread` audio séparé des gestes tactiles/WebView.
- [x] Profils d'intervention joyeux, surpris, combo, record et consolation ; variations de vitesse/hauteur de la voix native.
- [x] Anti-répétition de 48 phrases et historique de voix persistant localement.
- [x] Priorités vocales, annulation et solution de repli TTS si aucun clip enregistré disponible.
- [x] Tests Node du directeur vocal, tests Chrome tactile, compilation APK debug et livraison GitHub sans ZIP : [run 38956309047](https://github.com/greenpower2669/Block-Boost/actions/runs/38956309047).
- [ ] Sur Samsung, tester la qualité de voix française réellement disponible, la fluidité du jeu pendant les combos et le mode avion.
- [ ] Fournir de **vrais clips préenregistrés émotionnels** originaux et licenciés / envisager génération Qwen3-TTS hors appareil. Actuellement seuls les profils TTS Android sont implémentés.
- [ ] Revoir le mixage et le volume des FX lorsqu'une parole commence.
- [ ] Ne pas merger main, publier release stable ou utiliser une clé Play sans autorisation.

**APK directe 0.2.0 :** https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-emotion-0.2.0/temp/android/BlockBoost-0.2.0-emotion-debug.apk.

## 2026-10-16 — Bonus vitesse visibles et EXTRA sans rotation (0.3.0)

- [x] Ajouter le calcul ×4→×0 et sa chronométrie à partir de la sélection.
- [x] Faire apparaître le multiplicateur de vitesse pendant la manipulation puis dans une grande annonce au placement.
- [x] Ajouter `EXTRA SANS ROTATION` même à vitesse ×0, sans modifier les points ordinaires.
- [x] Annoncer vocalement ×2/×3/×4 et l'extra avec anti-répétition.
- [x] Vérifier les paliers, l'absence d'extra après rotation, le score et la sauvegarde par tests Node + Chrome multitactile (run 38958540023 vert).
- [x] Compiler APK test 0.3.0, publier un fichier **APK sans ZIP** sur une branche temporaire et contrôler SHA256 (run 38958540134 vert).
- [ ] Tester à la main la lisibilité des annonces, fluidité, sons et détection du deuxième doigt sur Samsung.
- [ ] Équilibrer les durées et bonus en fonction des retours utilisateur.
- [ ] Garder main et publications stables intacts sans nouvel accord.

APK brute : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bonus-0.3.0/temp/android/BlockBoost-0.3.0-bonus-debug.apk

## 16/10/2026 — Audio, dialogue, retour tactile (version labo 0.4.0)

- [x] Ajouter **388 nouvelles phrases** réellement différentes : six animaux, plusieurs événements et bonus.
- [x] Éviter les **48 dernières** phrases et conserver cet historique après redémarrage.
- [x] Espacer les discours pour rendre de la place au silence et aux effets du jeu.
- [x] Ajouter son distinct de **décrochage** à la prise d'une pièce.
- [x] Ajouter deux petits sons **« dring-biling »** lors de l'entrée dans un emplacement valide, variante après rotation ; éviter les répétitions continues.
- [x] Ajouter vibrations haptiques Android depuis la WebView, PWA en repli, et un réglage indépendant.
- [x] Tester le moteur de dialogue, validité, vitesse, bonus et interaction Chrome multitactile : https://github.com/greenpower2669/Block-Boost/actions/runs/38962905329.
- [x] Compiler APK test et la publier directement sans ZIP sur GitHub : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-audio-0.4.0/temp/android/BlockBoost-0.4.0-audio-debug.apk ; SHA `304e962393c98a2e356bf5b976e4c74aed55d492ddb1b6b7514a11f22773ed0a`.
- [ ] Tester sur Samsung si les vibrations fonctionnent réellement et sont confortables.
- [ ] Vérifier au casque et sur haut-parleur les sons de prise/pose et l'équilibre avec les voix.
- [ ] Mesurer l'impression de répétition durant une longue partie et ajuster si nécessaire.
- [ ] Aucun merge main ni release officielle sans autorisation.

## 16 octobre 2026 — Guidage vibratoire progressif et célébration des bonus

- [x] Repérer les poses réelles qui effaceraient immédiatement une ligne sans fausses cibles bloquées.
- [x] Calculer la proximité 0 à 4 vers ces positions et recalculer après rotation.
- [x] Faire vibrer par cycles plus rapprochés et plus puissants à mesure que le joueur s'en approche.
- [x] Créer des motifs haptiques distincts pour VITESSE, EXTRA sans rotation, ligne et combo (y compris cumul).
- [x] Couper la vibration continue au lâcher, abandon, arrière-plan, changement de partie et coupure du réglage ; sécurité 750 ms sans heartbeat.
- [x] Ajouter l'option guidage haptique indépendamment du réglage vibrations ponctuelles.
- [x] Tests logique et Chrome / Android verts : [validation](https://github.com/greenpower2669/Block-Boost/actions/runs/38970378913) et [APK](https://github.com/greenpower2669/Block-Boost/actions/runs/38970267717).
- [x] APK directe GitHub publiée dans `temp/blockboost-haptic-0.5.0/temp/android/` : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-haptic-0.5.0/temp/android/BlockBoost-0.5.0-haptic-debug.apk.
- [ ] Vérifier sur le Samsung le niveau réellement perceptible de chaque vibration et le comportement batterie/température.
- [ ] Confirmer l'arrêt tactile lors de gestes annulés et d'un basculement d'application.
- [ ] Ajuster amplitudes/paliers après mesure humaine ; pas de merge main sans validation.

## 17 octobre 2026 — 0.6.0

- [x] Voix temporairement coupées même aux records, sans effacer les textes ni couper FX/haptique.
- [x] Grille arc-en-ciel en prévisualisation seulement pour un effacement réellement possible, avec intensité blocs/lignes/combos/bonus.
- [x] Effet lumineux après effacement, compatible mode animations réduites.
- [x] Six niveaux de guidage vibratoire et nouveaux motifs doubles lignes/cascades.
- [x] Tests unitaires, tactile Chrome (huit cases brillent avant de s'effacer), sauvegarde et build Android verts : runs 39026234986 et 39026190674.
- [x] Indexer la Release Djipie/Sons (5 ZIP Sonniss) sans extraction, copie ni redistribution.
- [ ] Tester sur Samsung : visibilité des halos, confort haptique, silence complet et stabilité.
- [ ] Revoir les voix avec Fab et son fils après nouvel accord.
- [ ] Pas de merge main ni publication Play. APK : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-rainbow-0.6.0/temp/android/BlockBoost-0.6.0-rainbow-debug.apk

## 17/10/2026 — Festival 0.7.0

- [x] Six univers lumineux distincts : forêt, cristal, électrique, feu d'artifice, galaxie, disco.
- [x] Tonalité des futures lignes réellement effaçables variable selon la famille, pas uniquement un arc-en-ciel permanent.
- [x] Objet boule à facettes autonome qui sort, grossit, tourne et projette des reflets sur vrai jackpot.
- [x] Intensité modulée par points, lignes, combos, vitesse et EXTRA ; alternance de certaines familles, sans stroboscope, avec mode animations réduites.
- [x] Utiliser la bibliothèque Djipie sur une mission sonore : exporter et intégrer **12 sons OGG Kenney CC0**, conserver provenance et empreintes, rester 100 % hors ligne.
- [x] Garder les voix suspendues ; sauvegarde, rotation deux doigts, guidage haptique et scores non modifiés.
- [x] Tests Node et Chrome avec apparition réelle de la boule pour double ligne / combo, sources sonores vérifiées par OggS.
- [ ] Tester sur Samsung la fluidité visuelle, la qualité des 12 effets, le mixage et le confort haptique/visuel.
- [ ] Confirmer l'état final de la CI Android, binaire direct, SHA et date de build.
- [ ] Aucun merge main ni release stable avant accord de Fab.

**Livraison CI 0.7.0 achevée (17 octobre)** : tests [39036754891](https://github.com/greenpower2669/Block-Boost/actions/runs/39036754891) verts ; Android [39036754874](https://github.com/greenpower2669/Block-Boost/actions/runs/39036754874) vert avec retentatives Maven. [APK brute sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-festival-0.7.0/temp/android/BlockBoost-0.7.0-festival-debug.apk), 132 604 octets, SHA-256 `a87766eff2accb67ce139545563bb681c4c335c6eb068952a487924a04b13be5`. La vérification physique et artistique sur Samsung reste ouverte. Le point « Confirmer l'état final de la CI Android » est **clos**.

## 17/10/2026 — Boule disco mono-axe et voix à la demande (0.8)

- [x] Rebrancher la case voix activable, **OFF par défaut**, avec choix persistant.
- [x] Assurer arrêt immédiat de la voix en décochant sans interrompre vibrations ou sons.
- [x] Déplacer la couche FX sous `body` en plein écran, supprimer ses bords/cadrages rectangulaires et allonger les rayons hors de l'écran.
- [x] Remplacer la fausse double rotation CSS de la boule par **20 sprites sphériques Canvas** à rotation uniquement verticale.
- [x] Conserver mode animations réduites (sphère fixe, peu de particules), six familles, 12 Kenney Djipie et les bonus.
- [x] Tester OFF→ON→OFF, deux gestes, cadres FX, pixels changeants, cache PWA, score/sauvegarde.
- [x] Tests [39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) et build [39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) **verts** ; [APK directe](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk), SHA `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`.
- [ ] Sur Samsung, vérifier apparence de la sphère, halo sans cadre, fluidité et réactivation de la voix française.
- [ ] Ajuster seulement après retour de Fab et son fils ; pas de merge ou Play sans accord.

## 17/10/2026 — Version 0.8.0 Disco

- [x] Case voix décochée par défaut mais librement réactivable ; états ON et OFF sauvegardés.
- [x] Couper toute voix en cours sans couper les vibrations/FX lorsque l'on décoche.
- [x] Remplacer l'effet de fausse double rotation 3D par 20 images sphériques calculées, tournant sur un seul axe vertical.
- [x] Faire sortir les halos et rayons du rectangle de grille, calque fixed plein écran transparent aux gestes et sans bords nets.
- [x] Respecter les animations réduites et arrêter les boucles de rendu après le jackpot.
- [x] Tests Node+Chrome [39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) et Android [39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) verts.
- [x] Fournir [APK brute 0.8.0 sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk) 136 226 octets, SHA256 `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`.
- [ ] Essayer sur le Samsung avec Fab et son fils : la profondeur de la boule, l'absence de rectangle, la fluidité, la voix et l'haptique.
- [ ] Pas de merge vers main ni de release officielle sans permission.

## 17 octobre 2026 — Concert 0.9.0

- [x] Placer « JACKPOT / COMBO / +POINTS / VITESSE / EXTRA » **devant** la boule disco, selon valeurs réellement gagnées.
- [x] Six spots de concert pour disco, trois pour autres scènes, balayage animé léger derrière le score ; respect du mode animations réduites.
- [x] Exporter **24** vrais effets Kenney CC0 depuis Djipie (au lieu de 12), avec vérification SHA et OggS, sans copier Sonniss ni publier une banque sonore commerciale.
- [x] Jouer des jingles « dring-biling » de 1 à 4 notes, courts, non agressifs et non déclenchés à chaque pixel.
- [x] Ajouter interjections Waouh/Hooo/Whaa variées avec l'anti-répétition, uniquement si voix réactivées par l'utilisateur.
- [x] Adapter Samsung Android 16 : marge basse >=78px, scroll vertical en dehors des cellules/pièces, commandes sous navigation accessibles.
- [x] Test des sons, bonus, spots, z-index et tactile : [CI 39057514184](https://github.com/greenpower2669/Block-Boost/actions/runs/39057514184) verte.
- [x] Compiler APK [CI 39057514186](https://github.com/greenpower2669/Block-Boost/actions/runs/39057514186) verte ; [APK directe](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-concert-0.9.0/temp/android/BlockBoost-0.9.0-concert-debug.apk), 216071 octets, SHA `bfc9fe705b2e75c9e74709da423d61c498750ed8c1720742516761eca26db4a9`.
- [ ] Vérifier sur le Samsung la hauteur de la barre système, accessibilité réelle du bouton Nouvelle partie, haptique et volume des sons.
- [ ] Ajuster les niveaux à l'oreille avec Fab et son fils ; aucune fusion main/Play sans validation.

## 17/10/2026 — Bulles / croisement / audio sous licence

- [x] Croisement ligne-colonne simultané ×10 sur points d'effacement uniquement, sans toucher vitesse/EXTRA ; intersection toujours unique.
- [x] Deux lignes ou colonnes → 5 projecteurs montant du sol, bulles translucides qui grimpent et éclatent, points lisibles, son création + pop.
- [x] Réserver `DSGNBass Jump Start Drop 3` à la boule à facettes temporairement, jusqu'à choix musical.
- [x] Route distincte pour 11 sons Sonniss de Djipie privé, avec 1/2/3 poses gagnantes, trio, prise, pose, défaite et bulles.
- [x] Case voix OFF par défaut, interjections vocales enregistrées de streak 2/3 seulement si ON.
- [x] Aucun WAV/OGG Sonniss dans le dépôt PUBLIC ; branche et pipeline d'APK sous Djipie privé, SHA contrôlés, binaires encapsulés dans le jeu fini.
- [x] Tests Node et Chrome, APK fallback public verts : [39067278200](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278200), [39067278164](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278164).
- [ ] Constater le résultat et le SHA du build privé Djipie avant d'offrir un lien de SON APK ; si échoue, corriger sans prétendre son terminé.
- [ ] Vérifier sur Samsung les sons vrais, le rythme, le bonus ×10, les bulles et la fin de partie.
- [ ] Aucun merge main, publication Google Play ou release stable sans validation.

- [x] **CI PRIVÉE SONNISS verte** : [Djipie 39067423786](https://github.com/greenpower2669/Djipie/actions/runs/39067423786) ; 11 OGG compilés dans APK privée seulement, [438355 octets](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk), SHA `fc8ff2bb0ab94784f9f506a7a240912b00d29afdd041d3a8a4f03b1a3de9a9a0`. GitHub login Djipie requis pour le téléchargement.
- [x] **CI PUBLIC et Chrome vertes** : [Android 39067278164](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278164), [Node/Chrome 39067278200](https://github.com/greenpower2669/Block-Boost/actions/runs/39067278200) ; [APK de secours CC0](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bubbles-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-debug.apk), 219209 octets, SHA `dddacdfd9099d4ff82be2175c720a00e55f4a245666065ab62da5f0ee7c44c5a`.
- [ ] Sur Samsung, vérifier si les deux APK (même applicationId mais clés debug CI distinctes) nécessitent de désinstaller la précédente : avertir avant, sauvegardes de labo potentiellement non conservées.


**BILAN FINAL ACTUALISÉ (17/10/2026) :** après correction des pops audio dans src/main.mjs, tests Node/Chrome [39067717083](https://github.com/greenpower2669/Block-Boost/actions/runs/39067717083) **verts** et APK publique [39067712581](https://github.com/greenpower2669/Block-Boost/actions/runs/39067712581) **verte**. Quota de stockage d'artifacts GitHub atteint sur Djipie ; upload-artifact rendu facultatif, la publication de l'APK .apk seule en branche privée n'en dépend plus. CI Djipie privée finale [39068208556](https://github.com/greenpower2669/Djipie/actions/runs/39068208556) **SUCCESS**. [APK PRIVÉE FINALE 0.10 avec 11 sons](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk), **438375 octets**, SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`. Ce SHA remplace tous les SHA antérieurs des compilations d'essai. Lien privé (connexion GitHub requise). Aucun merge main ni Play release.

## 17 octobre — Retour disco, 0.11
- [x] Gros jackpots → revenir à la boule à facettes même en cas de jackpot répété ; la galaxie ne l'évince plus.
- [x] Doubles effacements normaux sans jackpot → toujours bulles et cinq projecteurs au sol.
- [x] Croisement ligne+colonne ×10 → **boule + bulles + projecteurs** dans le même spectacle, texte score en avant, FX Bass Drop puis création puis pops décalés.
- [x] Aperçu valide fidèle au choix des récompenses.
- [x] Tests Node/Chrome [verts 39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406) et APK publique [CI verte 39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411).
- [ ] Terminer et constater la nouvelle compilation **privée 0.11 avec les 11 sons approuvés**, puis livrer directement l'APK brute sous **greenpower2669/Block-Boost**, pas sous Djipie.
- [ ] Vérifier sur Samsung visibilité de la boule, lisibilité du score, son et rythme, mode réduit.
- [ ] Pas de merge main ni sortie Play sans autorisation.


**LIVRAISON VALIDÉE 0.11 (17 octobre 2026) :** APK Android COMPLÈTE avec onze sons Sonniss incorporés au jeu, **439 203 octets**, SHA256 `de6c6330d8a3d0c33488c8fdd392a009eeb6a35fb530df36bc51e30ce59b9c09`, [APK directe sans ZIP sur Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-bubbles-full-0.11.0/temp/android/BlockBoost-0.11.0-disco-bubbles-full-debug.apk). CI privée Djipie [39072037738](https://github.com/greenpower2669/Djipie/actions/runs/39072037738) **success** : réutilisation strictement des 11 effets validés déjà encapsulés dans APK 0.10 (SHA vérifié) après indisponibilité des Releases source ; recompilation 0.11, présence des 11 fichiers dans l'APK. Le blob Git binaire `46075377c90e920ed0b55b733d590eb779cfddc1` a été contrôlé identique lors du transfert de Djipie vers la branche de livraison propre à Block Boost `temp/blockboost-disco-bubbles-full-0.11.0` (commit `82fc7fd126d608a9016d2581cc8676ddf55ea6b6`). **Jamais de ZIP ni de sons Sonniss autonomes à installer**, seulement le jeu fini. CI Android public [39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411) et tests Node/Chrome [39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406) **verts**. Les APK debug peuvent avoir des signatures distinctes : sauvegarder données avant désinstallation/remplacement. Aucun merge `main` ni publication Play, test Samsung encore nécessaire.

## 18 octobre — Comeback & Disco 0.12
- [x] Proposer plus souvent des **suites de 2 coups à bon potentiel** quand ancien record personnel très éloigné, avec simulation de six trios, probabilité maximale 73% et aucun score fabriqué.
- [x] Ne jamais assister automatiquement un joueur proche de son record ou sans record significatif, ni remplacer trois pièces existantes avant consommation du trio.
- [x] Composer et jouer 4 secondes de musique de victoire **originale** joyeuse et drôle, cinq couches WebAudio, limiteur, interdiction de doublons, option FX respectée.
- [x] Garder boules/disco/jackpots et croisements x10, musique et récompense synchronisées à 4,2 secondes d'animation.
- [x] Tests Node+Chrome [39084934741](https://github.com/greenpower2669/Block-Boost/actions/runs/39084934741) verts ; CI Android publique [39084934816](https://github.com/greenpower2669/Block-Boost/actions/runs/39084934816) verte ; CI privée avec 11 OGG [39085006124](https://github.com/greenpower2669/Djipie/actions/runs/39085006124) verte.
- [x] Livrer [APK COMPLÈTE 0.12 depuis SON repo Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-comeback-victory-full-0.12.0/temp/android/BlockBoost-0.12.0-comeback-victory-full-debug.apk), 442949 octets, SHA256 `d4ff4b8509c1a840cf3258cc9b31c586acbdfc1aae51b220d8ae065a1e35dd67`, sans ZIP ni upload du corpus sonore brut.
- [ ] Test physique sur Samsung : timbre drôle/chaleureux et complexe de la fanfare, mixage vis-à-vis bulles et annonces, performance du choix chanceux, conservation de l'installation / signature debug.
- [ ] Ne pas merger main ni lancer Google Play sans validation.

## 0.13 final avant release
- [x] Palier fireworks de la partie : 1000, 2000 etc ; reset partie zéro et priorité de 6 s.
- [x] Trois spectacles consécutifs UNIQUEMENT si High Score historique battu sur écran de résultat.
- [x] 7 bang + 2 ambiances limitées à 6 s, jingle guitare avec repli offline, 11 sons précédents maintenus.
- [x] Animation douce & respect animations réduites, bouton rejouer et score visibles.
- [x] Tests Node + Chrome tactiles verts.
- [ ] Compiler APK finale complète avec 21 effets à partir de TOUT DERNIER commit, puis transférer binaire vers branche TEMP Block Boost, SHA identique.
- [ ] Essais réels Android 16 son, score, 1000, pause/back, rejouer, persistance.
- [ ] Après validation expresse Fab : fusion main, AAB signée `fr.greenpower.blockboost` via clé GitHub de production et publication Play Console.

### Livraison effective 0.13 AVANT release (18 octobre 2026)

- **APK complète 21 sons Djipie dans le jeu entier**, livrée en un fichier **.apk direct sans ZIP** sur une branche temporaire de Block Boost : [Télécharger BlockBoost 0.13](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-fireworks-full-0.13.0/temp/android/BlockBoost-0.13.0-fireworks-full-debug.apk).
- Taille **606 101 octets**. SHA-256 `c2943324577d7014851890fe767321beb36c26fcc41ae57a06cb78ede0215ec3`. Blob Git `d29b69c09620f9fe0a8d11530bbc31da1203f0df` vérifié IDENTIQUE entre sortie privée Djipie et branche de livraison publique Block Boost `temp/blockboost-fireworks-full-0.13.0`, commit livraison `99453146c0e52b3061d16afccb5d2e03d816c1d8`.
- Tests Node/Chrome tactiles **SUCCESS** [39145851083](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851083), dernier contrôle source docs [39146091168](https://github.com/greenpower2669/Block-Boost/actions/runs/39146091168) **SUCCESS**, build Android public [39145851089](https://github.com/greenpower2669/Block-Boost/actions/runs/39145851089) **SUCCESS**, build APK privée **21 FX intégrés** [39146050159](https://github.com/greenpower2669/Djipie/actions/runs/39146050159) **SUCCESS**.
- Code et APK prête à tester sur Samsung Android 16. **Ni main ni la release GitHub v0.12 ne sont modifiés**. PR Block Boost [#16](https://github.com/greenpower2669/Block-Boost/pull/16) et Djipie [#12](https://github.com/greenpower2669/Djipie/pull/12) laissées en brouillon. L'écoute physique et une éventuelle AAB signée Play avec nouveau package `fr.greenpower.blockboost` restent à valider.
- Important : applicationId passée de `fr.greenpower.blockboost.bubbleslab` au package Play confirmé `fr.greenpower.blockboost`, Android installe côte à côte et ne migre pas automatiquement les records de l'ancienne application.

## À développer APRÈS passation 19/10 — mission BB-014 (Fab : « code pas »)
- [ ] Sur **placements réellement gagnants** : alignement aimanté exact, compensation légère vers le haut, hystérésis `pointerup` contre micro-recul ; aucun snap sur mauvais placements ni cases occupées. Débogage `metrics`, `drawGhost`, `previewRainbow`, `pointerup` et rotation second doigt ; tests tactiles Android.
- [ ] Favoriser 2×2 **déjà existant** ; intégrer 2 diagonales de longueurs 2 et 3 **très rares** ; augmenter fréquence des gros blocs uniquement quand ils sont plaçables en début de partie, diminuer en fin ; préserver sélections de `comebackBatch` et équilibre de difficulté.
- [ ] Ajouter sur les blocs prêts à gagner un **halo dégradé tournant 360°** sans faire tourner les cellules, mode mouvement réduit.
- [ ] Après développement futur : tests Android + APK directe jeu complet dans dépôt Block Boost, AAB Play `fr.greenpower.blockboost` signée avec **Upload Key existante** et 4 secrets GitHub, vrais contrôles de signature, sous réserve d'autorisation de Fab pour merge/release/Play.
- [x] Passation et protocole de signature préservés en **tête de `ordres-de-mission.md` — BLOCKBOOST-IMMUTABLE-001**, sans code ni release.
