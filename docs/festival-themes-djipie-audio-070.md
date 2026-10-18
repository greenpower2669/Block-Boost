# Block Boost Festival 0.7.0 — six animations, boule à facettes, sons CC0 de Djipie

## Origine de la mission (17 octobre 2026)

Fab donne son accord pour coder les familles d'animations envisagées et indique que les sons Djipie sont prêts sur un autre dépôt/branche. Attentes : lumières de caractère différent, notamment **lucioles/forêt nocturne**, cristal, arcade électrique, feu d'artifice de points, galaxie et **boule à facettes qui surgit, tourne, grossit et projette des reflets pour les gros jackpots**.

**Voix des mascottes : restent suspendues** conformément à l'instruction familiale 0.6.0. Les petits FX et l'haptique continuent.

## Familles & déclencheurs

| Famille | Visuel | Exemple de déclencheur |
| --- | --- | --- |
| Forêt nocturne | Lucioles, halos turquoise/vert nuit, douce respiration | Ligne simple calme, sans bonus dominant |
| Cristal/aurore | Prismes violet/cyan/rose, particules géométriques | EXTRA sans rotation, pose élégante |
| Électrique/arcade | Néon bleu électrique, stries d'énergie | Vitesse ×3 ou ×4 |
| Feu d'artifice | Particules orange/rose/violet, points en envol | Double ligne non-jackpot |
| Galaxie | Spirale cosmique bleu/violet, petites étoiles | Combo avancé ou variante de très gros gain |
| Boule à facettes | Sphère mosaïque qui **descend, tourne et grossit**, plus rayons projetés | Jackpot réel : 2 lignes + combo ou ≥500 points, 3 lignes, combo ≥4 ou ≥850 points |

Le sélecteur pur `chooseFestival(event, bonus, previousTheme)` choisit une famille selon le score **vraiment gagné**, lignes effacées, combo, vitesse et EXTRA. Les passages consécutifs évitent certains thèmes répétés. L'intensité va de **1 à 5** ; budget limité à **58 particules**. Aucun thème ne modifie le moteur de score, les règles de grille ou le placement.

`previewTheme` adapte aussi la **couleur même des cellules qui vont être effacées avant la pose** : forêt verte, cristal cyan/violet, néon bleu, etc. Pas de fausse anticipation sur une pose illégale.

`FestivalDirector` utilise des éléments CSS légers, `pointer-events:none`, arrêt automatique sous 3 s, arrêt au redémarrage/quand l'application part en arrière-plan. Les animations fortes restent relativement courtes, sans stroboscope. Si animations réduites : nombre de particules abaissé à 5, pas de rotation ni de rayons, scène statique brève.

## Banque sonore réelle depuis Djipie

Source **canonique** : `greenpower2669/Djipie`, branche `feature/bibliotheque-audio-inventaire-v1`, sous le **dossier parent média** `RESSOURCES_PARTAGEES/AUDIO/`. Cette médiathèque est **hors mémoire**, à ouvrir seulement à l'occasion d'une mission qui l'exige.

- Catalogue vérifié : **447 sons individuellement indexés** (100 Kenney OGG et 347 Sonniss en références virtuelles), *aucune écoute/acoustique humaine validée à ce stade*.
- Source réelle des 12 effets sélectionnés : `RESSOURCES_PARTAGEES/AUDIO/kenney_interface-sounds.zip` (SHA256 `f2193d072726d6758a5f7871b2dcc54dcce0d5c35c6f0a62f92549b327c81232`).
- **Export dédié** de 12 OGG Kenney via une GitHub Action sur la branche Djipie `feature/export-kenney-blockboost-v1`. Origines, empreintes individuelles et tailles dans `assets/kenney-manifest.json` de Block Boost. Formats data URI OGG dans `src/kenney-audio.mjs` : **fonctionnement totalement hors ligne** dans WebView, sans télécharger Djipie à chaque partie.
- Familles : prise (pluck), validation (confirmation), rotation (switch), pose (drop), ligne (glass), combo (maximize), vitesse (tick), EXTRA (bong), cristal (glass), disco (maximize), forêt (select), galaxie (open).
- Licence : [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) déclarée **CC0** ; conserver provenance et checksum. Ne pas prétendre avoir écouté/sélectionné artistiquement les 12 sons : choix selon leurs noms/familles, à valider à l'oreille.
- Les cinq archives **Sonniss GDC 2026** (Release privée Djipie/Sons, environ 6,92 Go) sont **exclues de l'APK et des exports**. Elles restent référencées seulement par métadonnées ; pas de copie/republication d'archives ni des sons, pas d'entraînement IA.
- `Feedback.fx` préfère jouer un des 12 vrais sons Kenney, et conserve la synthèse Web Audio comme solution de repli si le terminal ne décode pas le format. Le « dring-biling » garde sa petite seconde note synthétique.

## Validation

- `tests/festival.test.mjs` : 6 familles, seuil jackpot, alternance, absence de scène sur move invalide, 12 flux Kenney OggS réels après décodage base64.
- `tests/touch.e2e.mjs` : tactile deux doigts, vitesse+EXTRA, simulation prévisualisation ligne et **double ligne avec combo** ; la boule disco existe réellement dans le DOM après la pose. Aucun appel vocal.
- GitHub Actions : Node + Chrome et Android debug. Résultats à mettre à jour uniquement après succès constaté, jamais prétendre qu'une CI en cours est verte.
- APK distincte `fr.greenpower.blockboost.festivallab` version **0.7.0**, scores séparés de 0.6.0. Aucun merge main, aucune release stable, ni publication Play sans validation.
- À tester sur Samsung : qualité réelle de chaque son, volume global pendant une cascade, diversité perceptible des scènes, performance GPU, douceur de la boule à facettes, arrêt des animations, haptique simultanée. CI Chrome ne mesure pas le ressenti sur mobile.
