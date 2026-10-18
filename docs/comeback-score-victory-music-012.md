# Mission Block Boost 0.12 — Retour vers le record et disco musicale de 4 secondes

## Demande du 18 octobre 2026
Fab : « Si le joueur est loin de son dernier highscore il faut aider la chance avec des suites à gros point probable et la boule à facettes doit jouer une musique de victoire longue de 4 s gaie et drôle ainsi que complexe ». Autorisation de développement déduite de la continuité du projet ; développement sur branche `feature/score-comeback-victory-music-012`, jamais main.

## Chance de rattrapage, pas de score truqué
- La cible est le **record personnel au lancement de cette partie**, stocké déjà dans `runStartBest` (pas un record externe). Les scores restent réels, aucune modification du plateau, du combo, du ×10 ni du multiplicateur vitesse.
- Activation seulement si le record historique atteint **800 points**, au moins **3 poses** ont été réalisées et l'écart au record dépasse **max(450, 40 % de ce record)**.
- Dans cet état, probabilités de **38 à 73 %**, selon écart, que le *prochain trio* fasse l'objet d'un choix chanceux. Sinon la génération des trois pièces est inchangée.
- Générer un trio aléatoire ordinaire, puis, quand la chance s'active, simuler cinq autres trios, toutes les rotations autorisées, les meilleurs emplacements du premier coup et les possibilités d'effacement du **deuxième** coup ; sélectionner uniquement si le potentiel du trio est meilleur.
- Ne simuler qu'une anticipation de deux placements et ne pas inventer de pose ni garantir un gros score. La stratégie vise à rendre **plus probables** des suites de coups gagnants, surtout quand le joueur est en retard, sans retirer la réflexion.
- Le moteur expose `assistedBatch` pour afficher une discrète annonce « Coup de pouce : des pièces prometteuses ! », seulement quand un trio objectivement plus prometteur a été choisi. Les nouvelles parties sans record ou proches de leur record gardent leurs chances ordinaires.

## Musique de victoire de la boule disco
- `src/victory-music.mjs` : score **entièrement original**, construit en mémoire, 4.0 secondes, tempo 126 bpm, musique gaie / loufoque : ligne mélodique brillante à 16 notes, accords de cuivres syncopés, basse, tintements, deux glissandi cartoonesques et finale aiguë.
- `Feedback.playVictoryMusic` programme 67 notes/chords/percussions WebAudio en oscillateurs natifs, avec enveloppes de gain, compression douce et bus master. Aucun fichier musical externe ni nouvelle dépendance, pas d'entraînement IA.
- `festival-disco` joue cette partition à la place du Bass Drop 3 **lorsque WebAudio est disponible**. Le son Bass Drop privé Djipie n'est conservé qu'en secours si le moteur audio n'est pas accessible.
- **4 s exactes** de musique, et spectacle disco à 4,2 s pour ne plus se terminer trop tôt ; répéter le jackpot ne crée pas deux fanfares concurrentes. L'audio suit la case FX (ON/OFF). Réinitialiser, quitter la page ou désactiver FX coupe la musique doucement.
- Maintenir toutes les règles précédentes : doubles ordinaires = bulles ; gros jackpot = boule à facettes ; croisement ligne+colonne ×10 = boule + bulles ; pop et 11 Sonniss restent synchronisés.

## Sécurité, APK et tests
- La source publique Block Boost n'incorpore **aucun** fichier Sonniss, ni une archive à décompresser. GitHub privé Djipie ne sert qu'à compiler les 11 sons choisis en OGG synchronisés **dans l'APK du jeu**, jamais comme banque d'effets. Le fichier APK doit être transféré sur **une branche TEMP Block-Boost**, pas livré à Fab via Djipie.
- APK expérimentale 0.12 (ID `fr.greenpower.blockboost.bubbleslab` conservé pour éviter une désinstallation inutile, sous réserve de signature de debug différente). ZIP interdit pour livraison : lien direct vers un fichier `.apk` dans le dépôt Block Boost.
- Tests Node : aucune aide sans record, retard suffisant, trio réel, points inchangés, composition de 4 secondes cinq voix reproductible. Tests Chrome tactile existants maintenus ; ci Android public et privé à vérifier avant remise.
- Pas de merge main, pas de release Play, pas d'affirmation de validation musicale sur vrai Samsung avant l'écoute de Fab.
