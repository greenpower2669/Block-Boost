# Block Boost — TODO vivant

> 16/10/2026 : dépôt initial de **documents**, aucune fonctionnalité du jeu n'est encore implémentée. La branche de travail n'est pas fusionnée sur `main`.

## Priorité 0 — cadrage
- [x] Écrire la description fonctionnelle détaillée (référence vidéo + propositions).
- [x] Créer une mémoire courte `brain.md` et un index `brainmap.md`.
- [ ] Confirmer la technologie cible et la structure du projet.
- [ ] Spécifier et valider mathématiquement la formule des points, les conditions de combo, le tirage et la gestion de l'impasse.

## Priorité 1 — gameplay
- [ ] Programmer et tester le plateau 8 × 8.
- [ ] Programmer la réserve de trois formes, la saisie et la pose tactile.
- [ ] Tester collisions, alignements horizontaux/verticaux, croix et absence de gravité.
- [ ] Tester la détection réelle de l'impasse et le calcul du score.

## Priorité 2 — FX et voix couplés
- [ ] Concevoir les ressources visuelles originales (blocs, halo, particules, couronne).
- [ ] Créer et intégrer les animaux choisis ; idle, réaction, parole, fête, déception douce.
- [ ] Produire les phrases audio originales en français, stockées localement, et leurs sous-titres.
- [ ] Synchroniser GameplayEvent → FX + masque sonore + texte + parole de mascotte.
- [ ] Ajouter priorités, cooldown, anti-répétition, une voix à la fois, ducking audio.
- [ ] Ajouter options voix/FX/musique, accessibilité et réduction des animations.

## Priorité 3 — progression hors ligne
- [ ] Implémenter un stockage local durable avec schéma versionné.
- [ ] Sauvegarder le record personnel, le score précédent, statistiques minimales et compagnon choisi.
- [ ] Option : checkpoint et restauration de partie, petit historique.
- [ ] Tester fermeture forcée, redémarrage, jeu en mode avion, sauvegarde corrompue et absence de régression du meilleur score.
- [ ] Afficher score final, record et mention « Nouveau record » seulement si exact.

## Priorité 4 — qualité et publication
- [ ] Vérifier ergonomie portrait Android : navigation système, gros textes, zones tactiles.
- [ ] Tester les performances et le son sur téléphone réel.
- [ ] Si distribution Android autorisée : générer des fichiers `.apk` et `.aab` correctement nommés avec icône cohérente.
- [ ] Obtenir validation expresse avant merge vers `main`, release ou publication.

## Référence

Voir [description canonique](docs/description-gameplay-mascottes-voix-fx-et-score-local.md).
