# BLOCK BOOST 0.11.0 — Retour de la boule disco, trois récompenses distinctes

## Validation Fab
Contexte : Fab remarque « La boule à facetre on ne l'a vois plus ? ». Audit du mode bulles 0.10 : toutes les poses avec deux lignes ou colonnes choisissaient le thème `bubbles` **avant** le jackpot, ce qui masquait systématiquement la boule disco sur les gros coups. Proposition de réparer ainsi, acceptée par Fab : **« Ok »**.

### Contrat des trois spectacles

1. **Deux lignes ou colonnes ordinaires, sans gros jackpot :** seul le spectacle de bulles, cinq projecteurs **au sol**, bulles translucides montant puis éclatant ; effets création puis pop.
2. **Gros jackpot (lignes, combo ou points dépassant les seuils du code existant) sans croisement :** boule à facettes 20 sprites mono-axe vertical avec spots de concert et Bass Drop 3 provisoire. Même deux jackpots consécutifs gardent la boule : pas de substitution automatique par galaxie.
3. **Croisement simultané ligne ET colonne sur la même pose, multiplicateur ×10 :** **boule disco et bulles ensemble**, cinq projecteurs au sol **et** spots/rayons disco, titre « CROISEMENT ×10 ! » avec les **vrais points** devant tous les décors. Audio étagé : Bass Drop 3 immédiatement, création magique après 460 ms, pops vers 1540 ms. Un autre événement interrompt les timers précédents. Aucune multiplication supplémentaire du score : les règles ×10 de 0.10 demeurent strictement inchangées.

### Détails techniques

- `src/festival.mjs` : choix de la récompense selon `crossMultiplier`, `clearedRows` et `clearedColumns` réels du moteur, le montant `gained`, les lignes, le combo et les seuils déjà établis. Un `cross` retourne `theme:"disco"`, `cross:true`, `bubbles:true`, `jackpot:true`; un vrai double simple retourne `theme:"bubbles"`.
- `src/main.mjs` : aperçu anticipé fidèle calculé à partir des lignes, des colonnes et des valeurs du moteur, sans modifier le score, l'inertie tactile, les sauvegardes ou le double doigt.
- `styles.css` : classe `festival-cross`, la boule z=15, bulles z=11 et texte z=95 avec projecteurs derrière ; halo violet-bleu sans cadre ; respect animations réduites.
- `src/feedback.mjs` et `src/private-audio.mjs` sont inchangés : les 11 effets Sonniss sélectionnés restent uniquement dans l'APK synchronisée, compilée par le workflow privé Djipie, aucun fichier brut dans le dépôt public. Les effets Kenney CC0 restent en secours.
- Nouvelle version de laboratoire Android **0.11.0** (`fr.greenpower.blockboost.bubbleslab`), pas de merge main ; APK complète à livrer **dans le dépôt Block Boost** en branche temp, **directement .apk sans ZIP**.
- Tests moteurs + Chrome mobile : jackpot disco, double normal bulles, croisement ×10 combiné, score et voix OFF, deux doigts/safe-area préservés.
- Ne pas annoncer la livraison avant validation réelle CI Android privée et transfert binaire via les fonctions GitHub (vérifier taille, hash, blob identique) vers branche temp de Block Boost.

## Limites
La version reste à valider visuellement sur le Samsung ; conserver les sauvegardes avant remplacement de builds debug signées différemment. La version est expérimentale, pas une publication Play.
