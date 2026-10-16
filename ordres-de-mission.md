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
