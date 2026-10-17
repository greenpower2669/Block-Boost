# Block Boost — ordres de mission

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
