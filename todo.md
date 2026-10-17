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
