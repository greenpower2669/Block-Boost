# Block Boost — mémoire vivante du projet

> **2026-10-16 : première implémentation Web/PWA sur `feature/block-boost-playable-rotation-v1`.** Prototype jouable, non fusionné dans `main`, ni APK ni AAB, ni validation réelle sur téléphone. Ne pas confondre CI verte et publication.

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
- Pas d'APK/AAB, pas de signature, pas de release, pas de fusion `main` ; test Samsung réel restant.
- Pas de publicité ni de collecte de données ; les informations sont dans le stockage privé du navigateur, que l'utilisateur peut effacer.
- Ne jamais prétendre que le jeu de référence possédait la rotation : c'est un ajout Block Boost.

## Carte et références

- [brainmap.md](brainmap.md)
- [Documentation exhaustive](docs/description-gameplay-mascottes-voix-fx-et-score-local.md)
- [todo.md](todo.md), [debughistorical.md](debughistorical.md), [ordres-de-mission.md](ordres-de-mission.md)
