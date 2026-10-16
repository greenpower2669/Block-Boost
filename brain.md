# Block Boost — mémoire vivante du projet

> État au 16 octobre 2026 : **conception documentaire uniquement**. Le dépôt `Block-Boost` ne contient encore aucun code de jeu ; n'annoncer aucune fonctionnalité comme développée, testée ou publiée.

## Intention

Créer un jeu de placement de blocs colorés en portrait, inspiré des comportements **visibles** dans la capture `Blck.mp4` : grille 8 × 8, trois pièces disponibles, pose tactile sur cellules, lignes/colonnes complètes libérées, score, combos et FX lumineux. Les algorithmes exacts non visibles (points, combos, tirage) restent à définir.

**Demande de Fab :** réécrire la description avec de **petits animaux adorables qui encouragent** le joueur, des **voix et animations soigneusement synchronisées aux FX**, et une **sauvegarde locale durable du score et du meilleur score**. Jeu fonctionnel hors ligne, sans compte ni classement mondial nécessaire.

## Contrat de conception

- Les mascottes sont décoratives et encourageantes : aucun impact sur les règles, la difficulté, la distribution des pièces ou les scores.
- Leurs bulles, voix et animations ne doivent jamais masquer la grille, monopoliser l'audio ou interrompre les gestes.
- Une seule voix à la fois, système de priorité/cooldown, réduction ponctuelle des FX sous la voix ; phrases françaises originales et tonalité bienveillante ; réglages sonores et accessibilité.
- Le meilleur score local survit à la fermeture et au redémarrage ; « Rejouer » n'écrase jamais le record ; sauvegarde robuste, versionnée, hors ligne.
- Distinguer scrupuleusement la référence filmée des propositions : aucune voix, formule exacte de score ou règle interne ne doit être inventée comme fait observé.
- Préserver la séparation moteur / événements / FX / mascottes / audio / stockage ; ne coder, fusionner ni publier sans décision explicite.

## Document canonique

- [Gameplay, animaux, voix, FX et sauvegardes locales](docs/description-gameplay-mascottes-voix-fx-et-score-local.md) — description complète, états d'animation, phrases, priorités audio, schéma de scores, phases et critères d'acceptation.
- [Carte mémoire](brainmap.md) — navigation légère.
- [Travaux à réaliser](todo.md) — toutes les phases sont non commencées.
- [Historique](debughistorical.md) ; [ordres de mission](ordres-de-mission.md).

## Décisions restant ouvertes

Moteur et technologie (Web/Android), règles de score et combo, tirage des formes, sélection et design définitif des personnages, ressources vocales, restitution de partie en cours et éventuel historique de scores. Le prototype **ne doit pas** être déclaré prêt sur la base des seules spécifications.
