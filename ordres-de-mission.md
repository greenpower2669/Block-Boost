# Block Boost — ordres de mission


## IMMUTABLE / À PRÉSERVER — BLOCK BOOST PLAY (FAB-IMMUTABLE-001, 19/10/2026)

**Ce socle est contractuel et ne se modifie qu'avec accord explicite de Fab.** Mission intégrale : [passation 19 octobre, nouvelle finition et signature](docs/passation-ultime-snap-pieces-lumiere-aab-014.md).

- **Application Android définitive :** `applicationId fr.greenpower.blockboost` (namespace `fr.greenpower.blockboost`), validé par Fab pour sa première publication sur Google Play ; conserver exactement cet identifiant dans toute mise à jour. L'ancienne application de laboratoire `fr.greenpower.blockboost.bubbleslab` est **distincte** et ses scores ne sont pas automatiquement transférés. À la dernière confirmation de Fab, **aucune fiche Block Boost créée dans Google Play Console** : vérifier cette étape ; ne jamais inventer la création d'un compte ou une publication.
- **Upload Key Google Play permanente :** JKS **déjà générée par GitHub Actions**, clé RSA 4096, alias exact `blockboost-upload`, certificat public `.pem`. Fab confirme avoir récupéré sa clé. **Ne pas générer une nouvelle clé, ne jamais confondre l'Upload Key avec la clé App Signing gérée par Google Play, ni utiliser la signature debug pour la publication.** Valider la sauvegarde privée durable et le certificat, sans redemander de communiquer la clé en conversation. L'archive temporaire et ses branches ont été supprimées de GitHub ; cette suppression n'efface pas forcément instantanément les objets historiques Git.
- **Quatre secrets GitHub normalisés, NOMS SEULEMENT :** `ANDROID_UPLOAD_KEYSTORE_BASE64`, `ANDROID_UPLOAD_KEYSTORE_PASSWORD`, `ANDROID_UPLOAD_KEY_ALIAS`, `ANDROID_UPLOAD_KEY_PASSWORD`. Valeurs **jamais** enregistrées dans le dépôt, documentation, logs, Actions, PR, Releases, historique ou chat. Vérifier leur présence et leur bon fonctionnement sur runner CI protégé. Le fait que Fab ait récupéré la clé **n'atteste pas à lui seul** que les quatre secrets sont complets ni que l'AAB est déjà signée.
- **AAB Play & mise à jour :** générer le véritable **AAB release** signé avec la même Upload Key sur runner temporaire, après vérification de l'identifiant, du `versionCode` strictement croissant, de la signature et de l'empreinte correspondant au PEM, des assets/sons embarqués, du SHA-256 et des tests. Une **APK de test** est un autre binaire : ni debug APK ni ZIP ne remplacent un AAB valide. Les mises à jour Play conservent package, Upload Key et historique des codes/versionnements ; aucun reset de signature sans demande expresse et procédure Play.
- **Livraison FAB-APK-TEMP-001 :** rendre à Fab son **APK complet directement téléchargeable en `.apk` sans extraction ZIP sur son téléphone**, dans une branche `temp/` du dépôt `greenpower2669/Block-Boost`, puis Release GitHub APK/AAB distincts et vérifiés quand autorisés. `Djipie` = bibliothèque / préparation audio **privée seulement** ; les sons tiers restent synchronisés **dans le jeu compilé**, pas publiés en packs ou fichiers WAV/OGG séparés dans le dépôt source public.
- **Méthode FabCopilot :** suivre `https://github.com/greenpower2669/FAB-Copilot-forWorkspacegpt`, lire `ordres-de-mission.md` puis `brain.md`, `brainmap.md`, `debughistorical.md`, `todo.md` ; les synchroniser durant les évolutions. Ne jamais supprimer une demande de Fab, même « code pas ». PR/feature, tests Node/Chrome, tactile réel Samsung Android 16 et contrôles de signature **avant** merge/release. **Aucune nouvelle fusion `main`, nouvelle GitHub Release ou publication Google Play sans accord explicite de Fab**.
- **Référence à préserver avant prochaine étape :** GitHub Release v0.12.0 déjà publiée ; développement **0.13.0** sur `feature/final-result-fireworks-013`, PR [#16](https://github.com/greenpower2669/Block-Boost/pull/16) brouillon, APK complète de test livrée, **non fusionnée**. Les feux d'artifice de 6 secondes à chaque millier de points de partie, les 21 effets intégrés, le jingle guitare du record et les 3 animations successives du résultat ne doivent pas disparaître. Le prochain numéro de version et `versionCode` devront évoluer après inspection, avant une nouvelle release.

## Mission ouverte 19/10/2026 — Ultime finition gameplay AVANT Play (sans code à ce stade)

**Instruction explicite de Fab : « Code pas, prompt de passation »**. Ne coder aucune des demandes suivantes à ce stade ; les consigner puis attendre une autorisation ultérieure de développement. Source détaillée : [passation complète](docs/passation-ultime-snap-pieces-lumiere-aab-014.md).

1. **Aimantation gagnante et doigt qui redescend :** près d'une case qui **efface réellement** ligne/colonne/combo, aligner le fantôme parfaitement, petit biais de détection vers le haut, conservation temporaire de la cible malgré la légère descente au `pointerup`. **Pas d'aimantation vers une pose perdante**, pas de rotation/pose artificielle, ni de déplacement hors de la vraie grille. Position annoncée, haptique, lumière et pose identiques.
2. **Formes oubliées :** ajouter un **coin 2×2 en L de trois cases** (différent du carré plein 2×2 déjà existant). Ajouter des **barres diagonales de 2 et 3 cases** pour chacune des deux pentes, avec tirage **très rare**. Conserver rotations, légalité, anti-répétition et scores.
3. **Gros blocs en début de partie :** tirage plus fréquent des grandes formes **seulement si plaçables** quand la grille est vide/ouverte, puis fréquence progressivement réduite selon occupation/progression. Préserver l'aide highscore / la chance conditionnelle et l'équité des trios.
4. **Halo tournant à 360° :** conserver arcs-en-ciel, dégradés, force des halos et éclairage gagnant, **faire tourner réellement la phase lumineuse** autour du bloc plutôt que seulement changer les teintes. Le bloc ne tourne pas avec la lumière. Pas de stroboscope, respect des animations réduites et performance Samsung.
5. **Livraison finale ultérieure :** une fois autorisé, tests ciblés + Android/Samsung, vraie APK directe dans Block Boost, AAB Play signé **avec la JKS et quatre secrets déjà prévus**, signature/PEM et identifiant vérifiés, PR/Release uniquement avec validation de Fab. Aucune publication Play déclarée à cette date.

---

## IMMUTABLE / À PRÉSERVER — BLOCKBOOST-IMMUTABLE-001 (19 octobre 2026)

**Contrat approuvé / ne jamais modifier silencieusement. Tout changement exige l'accord explicite de Fab et un avenant daté.**

1. **Dépôts et méthode.** Source du jeu : `greenpower2669/Block-Boost` ; bibliothèque audio et compilation audio privée : `greenpower2669/Djipie` ; méthode canonique : `greenpower2669/FAB-Copilot-forWorkspacegpt` (FAB-MISSION-001, FAB-MEM-001, FAB-IMMUTABLE-001, FAB-ANDROID-SIGN-001, FAB-APK-TEMP-001). Lecture obligatoire en ouverture de mission : ce registre + `brain.md`, `brainmap.md`, `debughistorical.md`, `todo.md`. Aucune fusion `main`, publication GitHub Release ou Play Store sans validation explicite de Fab pour CETTE version ; l'accord antérieur de fusion v0.12 ne vaut pas pour une version future. « Code pas » = **ne pas changer le code** et conserver la mission non réalisée.
2. **Identité Play pérenne.** Identifiant d'application définitivement retenu par Fab : `fr.greenpower.blockboost`. Version de travail avant cette nouvelle mission : `0.13.0` / `versionCode 13`, APK debug expérimentale ; tout nouveau paquet à publier doit avoir un `versionCode` strictement supérieur à tout code déjà diffusé sur Play. Ancien prototype `fr.greenpower.blockboost.bubbleslab` = application Android **distincte** : ne pas promettre de migration automatique de ses scores. Play Console **non créée** au dernier état confirmé. Ne jamais remplacer l'identifiant sans accord.
3. **Clé de signature Google Play à conserver.** Upload Key **existante** : JKS créée une seule fois via GitHub Actions, RSA 4096, alias `blockboost-upload`, certificat public `BlockBoost-upload-certificate.pem`. Fab a récupéré sa JKS privée ; l'artifact temporaire de récupération et les branches publiques temporaires ont été supprimés. **NE JAMAIS régénérer une seconde clé**, demander/exposer une valeur de secret, committer la JKS (en clair ou chiffrée), publier un ZIP contenant la clé ou afficher des clés/mots de passe dans les logs. L'App Signing Key utilisée chez les utilisateurs est gérée par **Google Play**, distincte de notre Upload Key utilisée pour envoyer les AAB.
4. **Quatre secrets GitHub attendus pour Block Boost, noms exacts issus de la mise en place réelle :** `ANDROID_UPLOAD_KEYSTORE_BASE64` (JKS privée encodée en Base64), `ANDROID_UPLOAD_KEYSTORE_PASSWORD` (mot de passe du JKS), `ANDROID_UPLOAD_KEY_ALIAS` (alias stable `blockboost-upload`), `ANDROID_UPLOAD_KEY_PASSWORD` (mot de passe de la clé). Ne jamais écrire leurs **valeurs** ici. La référence FabCopilot cite aussi `ANDROID_UPLOAD_STORE_PASSWORD` pour le mot de passe du keystore : **attention à cette variante de nom !** Le workflow du projet doit utiliser explicitement le nom réellement configuré dans Block Boost (`...KEYSTORE_PASSWORD`), ou prévoir une migration vérifiée et validée ; ne pas présumer que les deux secrets existent. Vérifier uniquement présence/non-vacuité par CI, sans divulgation, et vérifier que Base64 est bien enregistré (action humaine éventuellement nécessaire).
5. **Fabrication et preuve de signature AAB.** Futur workflow Android : restaurer la JKS dans un fichier éphémère du runner à partir de `ANDROID_UPLOAD_KEYSTORE_BASE64`, configurer la signature *release* sans persistance du fichier, construire `:app:bundleRelease` avec les médias autorisés intégrés au jeu, tester la présence du vrai package `fr.greenpower.blockboost`, `versionCode` et contenu, vérifier réellement la signature du `.aab` avec le certificat public `.pem` (empreintes et contrôles appropriés `jarsigner`/`bundletool`), tester gradle et contenu, calculer SHA-256, supprimer les fichiers temporaires. Générer **AAB Play signée avec l'Upload Key existante** + **APK directement téléchargeable** pour les tests ; ne jamais déclarer le build/la signature terminés sans preuve. Certificat `.pem` public à enregistrer/vérifier dans Play Console lorsque l'application y sera créée. Ne jamais envoyer l'AAB à Google Play sans accord explicite.
6. **Audio et distribution.** Djipie = bibliothèque audio et compilateur privé, **jamais dépôt final de téléchargement du jeu**. Les sons tiers Djipie/Sonniss ne sont intégrés qu'à l'application complète compilée, déclenchés par les événements du gameplay ; ne pas committer des WAV/OGG tiers bruts dans la source publique ni fabriquer une médiathèque autonome téléchargeable. Tout **APK finale doit être déposée en .apk direct (SANS ZIP) dans une branche `temp/` de `Block-Boost`**, avec SHA-256 contrôlé et lien direct utilisable par Fab sur Android. Le `.aab` signé est un artefact distinct pour Play, pas une APK décompressée. Sauvegarde du keystore faite par Fab hors dépôt. Éviter toute action qui écrase les scores.
7. **0.13 = base validée CI, non encore validée physiquement.** Branche `feature/final-result-fireworks-013` et PR Block Boost #16, branche Djipie `feature/blockboost-fireworks-assets-private-013` et PR #12 (brouillons). Résultat nouveau record = trois animations **séquentielles** boule disco (3,2 s) → bulles (2,8 s) → feux d'artifice (6 s), guitare Djipie ; en cours de partie feux d'artifice au passage des seuils **1 000, 2 000, ... points de la partie seulement**, remise à zéro au démarrage, avec 7 bangs + 2 ambiances, durée sonore totale ≤6 s. **21 effets intégrés** à l'APK complète. Livraison témoin `temp/blockboost-fireworks-full-0.13.0/temp/android/BlockBoost-0.13.0-fireworks-full-debug.apk`, 606101 octets, SHA-256 `c2943324577d7014851890fe767321beb36c26fcc41ae57a06cb78ede0215ec3`. CI Node/Chrome/Android publiques + compilation privée vertes le 18/10 ; **ne pas confondre avec validation physique ni AAB signée.** `main`/GitHub Release v0.12 demeurent antérieures à cette branche.
8. **Règles produit à préserver.** Score persistant local et high score ; bonus vitesse ×0…×4, sans rotation, rotations à deux doigts (second doigt tourne mais ne pose pas), coup de pouce probabiliste si loin du record, croisement ligne+colonne ×10 limité aux points d'effacement, 2+ lignes ordinaires = bulles, gros jackpot = disco, franchissement 1000 en partie = fireworks, voix OFF par défaut mais réactivables, FX/haptique contrôlables, mode mouvement réduit, performance Android 16. Les changements de placement ne doivent jamais autoriser une pose illégale ou dégrader le geste intentionnel.

## Demande du 16 octobre 2026 : description et mémoire
**Demande de Fab :** refaire une description détaillée du gameplay avec des animaux mignons qui encouragent, une voix couplée aux FX et une sauvegarde locale du score, puis enregistrer dans son dépôt GitHub Block-Boost et dans le brain du projet.

**Périmètre autorisé ici :** création de la documentation de conception, de `brain.md`, de l'index des mémoires, et du TODO sur une branche de proposition.

**Non autorisé par cet ordre :** affirmer l'implémentation, générer des assets sans demande, modifier un code de jeu inexistant, fusionner sur `main`, déclencher une release, produire ou signer un APK/AAB.

Référence détaillée : [spécification canonique](docs/description-gameplay-mascottes-voix-fx-et-score-local.md).

Toute évolution substantielle des règles ou passage à l'implémentation doit être explicitement décidé ; garder les mémoires vivantes du projet distinctes de Djipie et des autres projets.

## Nouvelle demande du 16 octobre 2026 — passage au code et rotation à deux doigts

**Demande explicite de Fab :** « Super tu te sent de le coder? Et y inclure rotation possible si dexieme doigt détecter? »

**Autorisation exercée :** construire un prototype jouable complet dans le dépôt `Block-Boost`, intégrer la rotation au deuxième doigt pendant le déplacement avec le premier, effectuer les tests et tenir à jour les mémoires propres au projet.

**Choix d'implémentation :** Web/PWA HTML/CSS/JavaScript, sans dépendance d'exécution, afin d'obtenir vite une interface mobile testable et une sauvegarde locale.

**Règle tactile centrale :** un premier contact saisit/déplace la pièce ; chaque `pointerdown` d'un autre doigt pendant ce geste déclenche exactement une rotation de 90° ; le deuxième doigt ne peut pas déposer la pièce ; seules la fin du premier doigt et la validité du placement déclenchent la pose. Fallback touche R / bouton ↻.

**Limite d'autorisation conservée :** ne pas merger `main`, ne pas publier de release ni signer d'APK/AAB sans nouvel accord ; les réalisations sont livrées sur branche de développement et PR de validation. Les tests dans Chrome ne prouvent pas l'ergonomie physique Samsung.

Voir `brain.md`, `todo.md`, et la spécification complète.

## Demande complémentaire du 16 octobre 2026 — dézipper l'APK sur GitHub

**Instruction de Fab :** « Demande à Git de faire un dézipage directement dans un répertoire temporaire sur le Git lui-même. Donc fais-le par action Git [...] directement accessible par un lien. »

**Réalisation autorisée et exécutée :** GitHub Actions a téléchargé puis décompressé l'artefact APK déjà validé, vérifié son empreinte SHA-256, et créé une branche temporaire dédiée `temp/blockboost-apk-0.1.0` comportant le vrai fichier binaire `temp/android/BlockBoost-0.1.0-debug.apk`.

- Téléchargement direct : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-apk-0.1.0/temp/android/BlockBoost-0.1.0-debug.apk
- Workflow vert : https://github.com/greenpower2669/Block-Boost/actions/runs/38933516757
- Branche source `main` inchangée ; pas de release, pas de fusion, pas de signature d'édition Play.

## Demande du 16 octobre 2026 — voix expressives multithread

Instruction actuelle : « Integre le son de la voix mais dans block boost avec une voix émotionnelle de suite mais en miltithread ça marché mieux comme ça ».

**Périmètre :** agir dans Block Boost (et pas dans VisionMaxRead) ; rendre les réactions plus vivantes, introduire une orchestration audio asynchrone séparée de l'UI, préserver jeu hors ligne et anti-répétition, préparer une APK debug test directement téléchargeable par lien GitHub. Une vraie voix émotionnelle neuronale ou des clips joués demanderaient une génération et une validation distinctes ; ne pas déclarer cette partie réalisée par des variations de pitch/rate seules.

**Livré :** branche `feature/emotional-voice-multithread-020`, APK debug 0.2.0, Actions vérifiées et publication temporaire directe `temp/blockboost-emotion-0.2.0`. Ne pas fusionner main ni publier une release stable. L'app de labo a une identité Android séparée et ses propres scores. Voir `docs/block-boost-emotion-multithread-020.md`.

## 2026-10-16 — Bonus vitesse visibles et EXTRA sans rotation (0.3.0)

Instruction de Fab après essai du prototype 0.2.0 : « Oui ça mieux mais on ne voit pas de x2 vitess ou * x4 ou extra, bonus de non rotation! Tu vois, viens on essaie avec des pieds main6 ».

**Autorisation concrète :** implémenter dans Block Boost des bonus vitesse **visibles**, bonus de pose sans rotation, annonces vocales couplées aux combos, valider via tests tactiles et livrer une nouvelle APK directe. Ne pas modifier VisionMaxRead ni les ressources Djipie. Ni merge main, ni release officielle sans accord.

**Réalisé :** branche `feature/fast-bonus-no-rotation-030`, suite test verte (GitHub run `38958540023`), build Android `38958540134` vert ; binaire signé debug `BlockBoost-0.3.0-bonus-debug.apk` publié sur `temp/blockboost-bonus-0.3.0/temp/android/`, SHA `e14696954dbf30b17fb006fb34ab72daf9a131da1e4e4f27cf319110faf72b65`. App de labo indépendante de 0.2.0 et de son score ; vérifier la sensation Samsung en vrai.

## Demande du 16 octobre 2026 — voix nombreuses et retours tactiles

Fab autorise le code : « Ok code rajoute des phrase en quantité », à la suite des demandes non codées de réduction radicale des répétitions, son de décrochage de la pièce, « dring-biling » quand elle est prête à être posée et retour haptique.

**Réalisation :** 388 nouvelles répliques, historiques de 48 et intervalles de silence ; sons de prise, de passage invalide→valide et retour spécifique de rotation ; vibrations natives Android activables, sans altérer la mécanique à deux doigts ni les bonus de 0.3.0. Branches de référence inchangées.

**Preuve :** CI Node/Chrome run `38962905329` et build APK run `38962905413` success ; version expérimentale `fr.greenpower.blockboost.audiolab` 0.4.0 signée debug, fichier `https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-audio-0.4.0/temp/android/BlockBoost-0.4.0-audio-debug.apk`, SHA `304e962393c98a2e356bf5b976e4c74aed55d492ddb1b6b7514a11f22773ed0a`. Aucune release stable ni fusion main ; test Samsung humain restant. Détails : `docs/audio-haptics-phrases-040.md`.

## 16 octobre 2026 — Haptique progressive et bonus (0.5.0)

Instruction : « Les bonus ne declenche pas d aptique et quand on va déclencher des compositions ou ligne bibre en continu et de plus en plus fort si de plus en plus près de sa place et .... ».

Interprétation fonctionnelle : vibration de bonus réellement déclenchée et prolongée/graduellement plus intense quand la pièce approche d'une pose qui effacera réellement une ligne ou prolongera une série. Ne pas rendre les vibrations permanentes sans raison, ne pas casser l'usage tactile à deux doigts, ne pas modifier les règles de score.

Réalisation sur branche `feature/haptic-sonar-combo-bonus-050` : guide 0..4 vers placements légaux gagnants, waveform Android gradué en boucle et arrêt <750 ms sans heartbeat, motifs pour vitesse/extra/ligne/combo, option indépendante, tests Node/Chrome et compilation APK verts. Livraison directe https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-haptic-0.5.0/temp/android/BlockBoost-0.5.0-haptic-debug.apk, SHA-256 `94f44de8f569841a5ce91061dda22cb73b6cca0e6d035c7c5ed1213c598ee790`. Aucun merge main, aucune release officielle, aucune validation physique Android annoncée.

## 17 octobre 2026 — Pause des voix et couleurs/haptiques des effacements

Fab demande que les voix, jugées trop bavardes par son fils, soient suspendues provisoirement. La grille doit s'illuminer de nombreuses couleurs lorsqu'une pièce est prête à finir une ligne/colonne, avec spectacle et haptique croissant selon le nombre de blocs, les combos et les bonus. Les archives Sonniss doivent rester en Release dans Djipie car dépôt depuis téléphone.

Implémenté sur feature/silent-rainbow-solves-060 : silence vocal, calcul prédictif légal, arc-en-ciel des cases réellement supprimables, effets après pose, six niveaux haptiques + motifs multi-lignes. Release « Sons » indexée uniquement, aucun ZIP/sound distribué. Tests verts Node/Chrome 39026234986 et Android 39026190674 ; APK https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-rainbow-0.6.0/temp/android/BlockBoost-0.6.0-rainbow-debug.apk, SHA 09b53fce4a63379e4a5cf0d6369c22f7c926b61897838508fb2efe390fa5f494. Aucune fusion main, aucune publication stable, test Samsung à réaliser.

## Mission du 17 octobre 2026 — animations variées et sons Djipie (0.7)

Fab confirme « Ok, go, les son djipie sont prêt. Sur ton autre dépôt », après son idée de familles de lumières dont forêt nocturne/lucioles, cristaux, néon, feu d'artifice de points, galaxie et une **boule à facettes pour gros bonus qui sort et tourne en grossissant**. Il attend un développement réel, pas seulement une rédaction théorique.

**Autorisé et livré en branche `feature/festival-animation-djipie-audio-070`** : scènes DOM/CSS sans images externes ni blocage tactile, choix selon jeu réel, bonus, combos, jackpot et alternance ; sons Kenney CC0 extraits **sélectivement depuis Djipie** via un workflow dédié dans une branche séparée, 12 effets authentiques dans l'APK hors ligne. **Sonniss en Release : ne pas republier les WAV/ZIP ni les utiliser pour entraîner une IA.** Voix restent suspendues conformément au souhait familial de la version 0.6.0.

Tests unitaires et navigateur y compris jackpot/ball, trace documentée et APK 0.7 expérimentale sans remplacer la précédente. Ne pas merger main, ne pas faire de release ni signer Play sans validation. Voir `docs/festival-themes-djipie-audio-070.md`.

**Trace de livraison** : branche `feature/festival-animation-djipie-audio-070` avec PR en brouillon, build Android final 39036754874 et validation 39036754891 réussis ; APK directe [0.7.0](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-festival-0.7.0/temp/android/BlockBoost-0.7.0-festival-debug.apk) de 132 604 octets et SHA256 `a87766eff2accb67ce139545563bb681c4c335c6eb068952a487924a04b13be5`. CI a retrouvé les dépendances Maven après retentatives, sans downgrade ni modification des règles du jeu. Ne pas fusionner `main` ni publier officiellement sans validation.

## 17/10/2026 — Accord « Ok gogogo » : correction boule disco / voix

Après l'audit de la 0.7, Fab approuve explicitement les trois changements précédemment discutés : **checkbox voix OFF par défaut mais réactivable**, **supprimer le rectangle visible des FX en les étendant au-delà de l'écran**, et **rotation unique de boule à facettes**, de préférence sprite animé représentant une sphère stable.

Branche `feature/voice-toggle-disco-sprites-080` : implémentation d'une planche Canvas de 20 frames précalculées (projection des miroirs sphériques, axe yaw vertical unique), calque FX fixed reparenté body et halos sans bord, commande vocale activable à volonté mais silencieuse à l'installation. Modes réduits, sons Kenney, haptique et gestuelle existants conservés.

Preuves finales : Node/Chrome [39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) success, Android [39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) success, [APK brute 0.8.0](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk), 136 226 octets, SHA-256 `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`. Pas de test sensoriel Samsung, fusion main ni publication officielle. Documentation `docs/voice-toggle-disco-sprites-080.md`.

## Mission du 17 octobre 2026 — Voix réactivables, boule mono-axe et cadre FX invisible

Fab valide « Ok gogogo » après trois précisions : voix **OFF par défaut mais case à cocher fonctionnelle pour les réactiver**, effet rectangulaire des FX supprimé/agrandi au-delà de l'écran, boule à facettes avec **une seule rotation sur axe**, préférence pour un sprite animé plutôt qu'une double rotation CSS.

Implémenté sur `feature/voice-toggle-disco-sprites-080`, base `feature/festival-animation-djipie-audio-070`. Option voix persistante, TTS silencieux par défaut / ON volontaire, arrêt vocal immédiat indépendant des FX/haptique. Planche de 20 images Canvas 2D à projection sphérique, mono-axe, scènes rayonnant sans clipping, respect animations réduites, scores et bonus inchangés. [CI tests 39040170369](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170369) et [APK 39040170375](https://github.com/greenpower2669/Block-Boost/actions/runs/39040170375) **verts** ; APK directe https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-0.8.0/temp/android/BlockBoost-0.8.0-disco-debug.apk (136 226 octets, SHA `2fb995699d1400f9c3081301e92732714e2dbb53a7d33eed6e839f8b0cc8850b`). Aucun merge main, aucune publication Play, validation sur Samsung à faire.

## Autorisation 17 octobre 2026 — Concert 0.9, sons + texte + spots + sécurité Android

Fab : « Et texte bonus devant boule à facette. Utilise plus de sont block boost stp aussi rajoute des waouh!! Hooo, whaa! ... rajoute des spot lignt comme dans les concerts en animation ^^ », puis « Ok, code ça et des petit dons dring bling cool courtement musicale, tu vois^^ ».

Contrat : vrai texte bonus en avant-plan des facettes, projecteurs de concert, interjections facultatives (respect de la case voix OFF par défaut), plus de sons Kenney CC0 de Djipie et quelques notes musicales courtes « dring-biling ». La capture Android montrait aussi « Nouvelle partie » recouvert par les boutons système : corriger l'accessibilité en bas sans casser le pilotage tactile.

Réalisé sur `feature/concert-bonus-audio-safearea-090`. Export de 24 OGG depuis Djipie `feature/export-kenney-blockboost-24-v2`; six spots disco/3 autres, score réel au premier plan, jingles originaux, waouh sous contrôle voix, marge basse Android et scrolling en dehors de la zone de jeu. Tests Chrome/Node et build Android verts (39057514184, 39057514186). APK brute https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-concert-0.9.0/temp/android/BlockBoost-0.9.0-concert-debug.apk, taille 216 071, SHA `bfc9fe705b2e75c9e74709da423d61c498750ed8c1720742516761eca26db4a9`. **Aucune fusion main ni publication Play**, validation physique Samsung à faire. Contrat complet `docs/concert-bonus-audio-safearea-090.md`.

## Ordre autorisé — 17/10/2026 : CODE Bulles et audio Djipie

Après sélection de sons Djipie et audit sans code, Fab : « Aller on code^^ et ça boule à facette en attendant des musicvplus cool ^^ [Bass Drop 3] ». Valide animation spécifique double effacement : projecteurs installés **en bas**, bulles translucides qui **montent puis pop**, deux sons dédiés (création puis éclats), **bonus ×10** si **ligne ET colonne** complétées au même coup. Valide aussi 11 sons de jeu préalablement listés : son simple, trio, décrocher/poser, séries gagnantes 1/2/3, perdu sans record, bass drop disco.

Livraison source sur `feature/bubbles-cross10-licensed-audio-100` uniquement ; sons sous licence intégrés seulement par pipeline PRIVÉ Djipie `feature/blockboost-bubbles-private-apk-100`, sans bibliothèque brute exposée publiquement. `docs/bubbles-cross10-licensed-audio-100.md` fait foi. Aucun merge main, aucune release Play. Test Samsung et choix d'une meilleure musique disco futurs.

**Livraison validée par CI le 17 octobre :** [PR source Block Boost #11](https://github.com/greenpower2669/Block-Boost/pull/11), [PR intégration privée Djipie #7](https://github.com/greenpower2669/Djipie/pull/7). CI privée succès `39067423786`, APK privée du jeu contenant onze effets Sonniss synchronisés, 438355 octets, SHA `fc8ff2bb0ab94784f9f506a7a240912b00d29afdd041d3a8a4f03b1a3de9a9a0` ; accès par GitHub authentifié Djipie [ouvrir fichier](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk). CI publique + tests succès `39067278164` et `39067278200`, [APK fallback sans Sonniss](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bubbles-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-debug.apk), 219209 octets, SHA `dddacdfd9099d4ff82be2175c720a00e55f4a245666065ab62da5f0ee7c44c5a`. Aucun merge main, aucune release officielle, aucune inspection sur matériel.


**BILAN FINAL ACTUALISÉ (17/10/2026) :** après correction des pops audio dans src/main.mjs, tests Node/Chrome [39067717083](https://github.com/greenpower2669/Block-Boost/actions/runs/39067717083) **verts** et APK publique [39067712581](https://github.com/greenpower2669/Block-Boost/actions/runs/39067712581) **verte**. Quota de stockage d'artifacts GitHub atteint sur Djipie ; upload-artifact rendu facultatif, la publication de l'APK .apk seule en branche privée n'en dépend plus. CI Djipie privée finale [39068208556](https://github.com/greenpower2669/Djipie/actions/runs/39068208556) **SUCCESS**. [APK PRIVÉE FINALE 0.10 avec 11 sons](https://github.com/greenpower2669/Djipie/blob/temp/blockboost-bubbles-private-0.10.0/temp/android/BlockBoost-0.10.0-bubbles-private-debug.apk), **438375 octets**, SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`. Ce SHA remplace tous les SHA antérieurs des compilations d'essai. Lien privé (connexion GitHub requise). Aucun merge main ni Play release.


## Livraison finale corrigée 17/10/2026 — le jeu reste dans SON dépôt

Contrat permanent : **Djipie est uniquement source/médiathèque de sons, Block Boost doit livrer son propre APK directement en `.apk` téléchargeable SANS ZIP et sans extraire quoi que ce soit sur le téléphone/PC de Fab.** L'erreur de livrer dans Djipie a été corrigée par transfert binaire Git (SHA de blob identique), sans changer le code ni fusionner main.

[**APK COMPLÈTE 0.10.0 avec 11 sons Sonniss, dans Block Boost**](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bubbles-full-apk-010/temp/android/BlockBoost-0.10.0-bubbles-full-debug.apk) — 438 375 octets ; SHA256 `99bbe28c08be72f8cf57d08a32457c0d9b7d2f7ced1f6ceeff22b44f601baa57`, commit `e06be4274978d0cd978c90196b1b94876f531dd0` sur branche de livraison `temp/blockboost-bubbles-full-apk-010`. Aucun ZIP à décompresser. Les contenus originaux séparés demeurent dans Djipie ; seule l'APK du jeu compilé est dans Block Boost. Pour les livraisons suivantes, produire dès le départ la version avec sons sur une branche TEMP de **Block-Boost**, pas de Djipie. Aucune fusion main, aucun déploiement Play.

## ORDRE AUTORISÉ 17/10 — Correction restitution boule disco

**Problème utilisateur** « La boule à facetre on ne l'a vois plus ? » ; réponse propose trois niveaux, acceptés « Ok ».
1. Deux lignes/colonnes ordinaires : bulles et projecteurs au sol.
2. Gros jackpot : boule à facettes sphérique et Bass Drop 3 provisoire.
3. Croisement ligne+colonne simultané ×10 : **les DEUX décors en même temps** (boule disco + bulles / projecteurs) ; titre et points au premier plan.

Coder sans changer la formule ×10, les sauvegardes, deux doigts, haptique et politique voix OFF par défaut. Tester Node/Chrome + Android puis livrer **APK direct .apk dans le dépôt Block Boost lui-même**, non ZIP, ni APK dans Djipie. Les 11 sons Sonniss restent seulement dans le **binaire APK du jeu fini**, jamais en médiathèque autonome sur dépôt public. Branche `feature/restore-disco-and-cross-bubbles-011` / PR #12 brouillon ; [docs/restore-disco-bubbles-cross-011.md](docs/restore-disco-bubbles-cross-011.md), `main` intouché. Aucun merge ni Play.


**LIVRAISON VALIDÉE 0.11 (17 octobre 2026) :** APK Android COMPLÈTE avec onze sons Sonniss incorporés au jeu, **439 203 octets**, SHA256 `de6c6330d8a3d0c33488c8fdd392a009eeb6a35fb530df36bc51e30ce59b9c09`, [APK directe sans ZIP sur Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-disco-bubbles-full-0.11.0/temp/android/BlockBoost-0.11.0-disco-bubbles-full-debug.apk). CI privée Djipie [39072037738](https://github.com/greenpower2669/Djipie/actions/runs/39072037738) **success** : réutilisation strictement des 11 effets validés déjà encapsulés dans APK 0.10 (SHA vérifié) après indisponibilité des Releases source ; recompilation 0.11, présence des 11 fichiers dans l'APK. Le blob Git binaire `46075377c90e920ed0b55b733d590eb779cfddc1` a été contrôlé identique lors du transfert de Djipie vers la branche de livraison propre à Block Boost `temp/blockboost-disco-bubbles-full-0.11.0` (commit `82fc7fd126d608a9016d2581cc8676ddf55ea6b6`). **Jamais de ZIP ni de sons Sonniss autonomes à installer**, seulement le jeu fini. CI Android public [39071874411](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874411) et tests Node/Chrome [39071874406](https://github.com/greenpower2669/Block-Boost/actions/runs/39071874406) **verts**. Les APK debug peuvent avoir des signatures distinctes : sauvegarder données avant désinstallation/remplacement. Aucun merge `main` ni publication Play, test Samsung encore nécessaire.

## Ordre 18 octobre 2026 — Coup de pouce derrière high score, musique disco gaie 4s

Fab : « Si le joueur est loin de son dernier highscore il faut aider la chance avec des suites à gros point probable et la boule à facettes doit jouer une musique de victoire longue de 4 s gaie et drôle ainsi que complexe. »

Interprétation canonique : favoriser probabilistiquement des trios permettant **plusieurs gros coups successifs**, via évaluation réelle de la grille, mais **sans cadeaux de points, sans prédire avec certitude, sans accélérer artificiellement le score ni casser le gameplay**. Record personnel historique au départ comme cible, aide désactivée proche du record et sans record. Musique de **victoire disco 4 secondes** entièrement originale, joyeuse, loufoque, riche en instruments/couches, contrôlée par les FX et non par la case voix, qui reste OFF par défaut. Conserver jackpot boule, double=projecteurs/bulles, croisement x10=les deux.

Exécuté sur `feature/score-comeback-victory-music-012`, spécification `docs/comeback-score-victory-music-012.md`, tests Node/Chrome et builds Android verts, [APK complète dans Block Boost](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-comeback-victory-full-0.12.0/temp/android/BlockBoost-0.12.0-comeback-victory-full-debug.apk) 442949 octets SHA `d4ff4b8509c1a840cf3258cc9b31c586acbdfc1aae51b220d8ae065a1e35dd67`. Djipie est médiathèque et constructeur audio privé seulement, jamais dépôt de livraison finale du jeu. Aucune fusion main ni release Play.

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

## Mission NON CODÉE — 19 octobre 2026 : aide à la pose gagnante + formes rares + lumière 360° (FAB-MISSION-BB-014)

**Statut : demandée, PAS CODÉE, à reprendre lors de la prochaine passation.** Fab a expressément demandé « Code pas, prompt passation ». Cette section enregistre ses critères ; elle **n'autorise aucune modification du code** pendant la phase de passation.

- **Alignement aimanté seulement sur les vrais placements gagnants.** Lorsqu'une pièce approche d'une position légalement admissible qui effacerait une ligne ou une colonne, l'aperçu doit se centrer exactement sur ces cases avec une petite préférence vers le haut (compensation d'un léger recul du doigt au relâchement). Zone de capture et hystérésis modestes, paramétrables et testées ; conserver la dernière cible gagnante pendant `pointerup` malgré la micro-dérive, sauf départ intentionnel net ; tout placement final doit repasser `canPlace` et le vrai calcul `clearingTargets` / `evaluateSolvePreview`. Aucun aimant artificiel vers une pose perdante, aucun déplacement sur case occupée, aucun auto-placement. Préserver l'orientation, le décalage du fantôme et la rotation au second doigt.
- **Formes.** Carré compact **2×2** explicitement demandé : **déjà présent** dans `src/engine.mjs/SHAPES` ; auditer ses tirages/fréquences/affichage et favoriser sa présence si utile, sans créer un doublon. Ajouter **les deux pentes de diagonale** (↗, ↘), longueur **2 ou 3 cellules**, **très rares**, car risquent de bloquer le plateau ; vérification des rotations/normalisation/pose/preview et de l'unicité de la solution de placement. Les grosses formes **déjà plaçables** doivent apparaître davantage **au début** de la partie (grille libre et score initial), pour progresser plus vite ; réduire progressivement leurs probabilités sur une grille chargée tout en laissant du hasard et le mode comeback fonctionnel. Pondérations adaptatives tests anti-plateau condamné ; ne pas inventer de points.
- **Effet 360° en anticipation.** Conserver les couleurs graduées et le halo gagnant existants et superposer une **rotation continue du gradient lumineux / reflet** sur 360° dans chaque cellule concernée (ou halo commun), sans faire tourner physiquement les pièces. Impression de lumière qui jaillit et traverse les couleurs ; léger/fluide, sans flash stroboscopique, off ou statique en mode « animations réduites », ne pas masquer cases ni textes.
- **Tests obligatoires à la future exécution.** Simuler le doigt qui glisse de quelques pixels vers le bas lors de `pointerup` : conserver pose gagnante ; déplacer volontairement hors capture : ne pas forcer ; cibles perdantes et illégales non aimantées ; second doigt rotation intacte ; échantillonnage déterministe des pondérations de formes au début/fin, 2×2 réellement proposé, deux diagonales rares ; visualisation lumière 360°, pause et reducedMotion ; scoring x10, high score, spectacles 0.13, sauvegardes et sons inchangés ; tests Node, Chrome tactile et Samsung réel. Tenir les cinq fichiers vivants et respecter les invariants Play/APK ci-dessus.
- **Release future.** Bumper le `versionCode` et `versionName` au-dessus de 0.13.0 avant build, fournir la nouvelle APK complète dans `Block-Boost/temp/`, puis préparer AAB `fr.greenpower.blockboost` signée avec les 4 secrets de l'Upload Key EXISTANTE ; vérifier signature et certificat, sans exposer la JKS. **Aucun merge main, aucune nouvelle release ni soumission Play avant nouvel accord explicite de Fab.**


## 19/10/2026 — BB-014, développement candidat sur la PR #16
La précédente passation documentaire (« code pas ») reste historiquement valide pour son tour ; la nouvelle mission de développement du 19/10 demande l'exécution des finitions. Les sections IMMUTABLE en tête ne changent pas. En attente de validation Samsung et binaires : aucun merge main, Release ni Play.
- Snap uniquement placements gagnants légaux, hystérésis anti-descente, halo/fantôme/pose identiques, annulation à la rotation.
- Coin L 3 cases, 4 diagonales 2/3 cases à 1,5 % paramétrable, gros blocs selon occupation et formes légales ; coup de pouce highscore conservé.
- Rotation réelle de phase lumineuse à 360° par `--rainbow-phase`, blocs fixes, mouvements réduits conservés.
- Android candidat 0.14.0/code14 même identifiant ; workflow manuel pour vraie AAB signée avec JKS existante seulement si quatre secrets fonctionnels et PEM public de référence présent.
- Les 21 sons complets de la 0.13 ne se trouvent PAS dans la build publique de secours 0.14. AAB et APK complète 0.14 non validées à la date de ce commit.

### BB-014 19/10 — Production du jeu complet
Le workflow 0.14 utilise uniquement en CI les 21 sons du jeu complet 0.13 après vérification SHA-256, sans publication de sons séparés. APK directe prévue sous temp/blockboost-full-0.14.0 après tests. AAB manuel signé toujours conditionné à JKS existante, quatre secrets fonctionnels et PEM public historique. Aucun merge, Release ni Play.

### Livraison effective 0.14 BB-014 — 19/10/2026, vérifiée en CI
- Branch feature/final-result-fireworks-013, PR #16 **non fusionnée**. Compilation réussie [Actions 39230344488](https://github.com/greenpower2669/Block-Boost/actions/runs/39230344488), Node/Chrome [39230344461](https://github.com/greenpower2669/Block-Boost/actions/runs/39230344461) et [39230351456](https://github.com/greenpower2669/Block-Boost/actions/runs/39230351456) **SUCCESS**.
- **APK Android 0.14.0 complète avec 21 sons Djipie intégrés au jeu**, 608 074 octets, SHA-256 `2f815dd0faf5a0db8a1526fdb8034b8a52f9330cf8c10c55cce9f3954ea619ca`, Git blob f92e3c3a13c70752f732d5b7387f3a5c7e5220a9, commit livraison `456c53de878ba97fcbcf787b6ee7ecca8c654553` sur branche `temp/blockboost-full-0.14.0`. [APK directe sans ZIP](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-full-0.14.0/temp/android/BlockBoost-0.14.0-full-debug.apk).
- **Statut : livré en APK de TEST DEBUG, À VALIDER physiquement.** Tests Samsung Android 16 et signature/certificat/AAB Play encore ouverts ; rien n'a été fusionné, publié en Release ni envoyé à Google Play. Le PEM PUBLIC historique `android/certificates/BlockBoost-upload-certificate.pem` n'est pas dans la branche actuelle et aucun accès à la vérification des valeurs des quatre secrets n'est confirmé : **ne pas déclarer AAB signée tant que ces prérequis ne sont pas vérifiés en CI.** Clé JKS existante conservée, non régénérée.

## Mission exécutée BB-015 — Musique de fond prioritaire (19/10/2026)
- Instruction de Fab : intégrer son fichier `Blockboostmusic.mp3` au jeu et laisser **tous les effets sonores et la voix au premier plan**. Solution implémentée : niveau de base discret et ducking temporel, plutôt que filtre passe-bande permanent.
- Branche `feature/final-result-fireworks-013` et PR #16 conservées, sans fusion. Les assets 21 FX et le mécanisme AAB/JKS **IMMUTABLE** ne sont pas modifiés.
- Résultat source testé CI et APK debug complète 0.14 : [téléchargement direct .apk](https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-full-0.14.0/temp/android/BlockBoost-0.14.0-full-debug.apk), SHA256 `8fe7dec4de78c620e9ae12e14932dba43d792735120def761e22e5ce94a53a89`. Écoute Samsung encore requise.
