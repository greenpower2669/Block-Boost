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
