# Block Boost — TODO vivant

> 16/10/2026 : **prototype Web/PWA codé sur `feature/block-boost-playable-rotation-v1`**, non fusionné dans `main`. Ce n'est pas encore une application Android native.

## Réalisé — prototype initial
- [x] Décrire le gameplay, les animaux, les voix, les FX et la sauvegarde locale.
- [x] Créer `brain.md`, `brainmap.md`, `debughistorical.md`, `ordres-de-mission.md`.
- [x] Implémenter plateau 8 × 8, trois formes, glisser-déposer tactile et sélection par tap.
- [x] Ajouter rotation 90° par deuxième doigt, touche R et bouton de secours.
- [x] Implémenter validation de pose, suppression lignes/colonnes et croisements sans gravité.
- [x] Définir formule de score prototype et règle de combo ; tester leur cohérence.
- [x] Détecter une impasse seulement en l'absence de coup légal.
- [x] Effets visuels lumineux de réussite, score, combos et étincelles.
- [x] Six compagnons temporaires en emoji animés avec phrases en français.
- [x] Voix système `speechSynthesis`, sous-titres, petites notes FX locales, limitation des annonces.
- [x] Sauvegarde locale du record, de la partie en cours, des réglages et du compagnon.
- [x] Version installable comme PWA avec icône SVG et cache hors ligne.
- [x] CI tests moteur et test automatisé Chrome de la rotation à deux doigts, de la pose et de la persistance après reload.

## À faire — qualité et produit final
- [ ] Test manuel du geste à deux doigts, de la vitesse et du cadrage sur Samsung Android 16.
- [ ] Concevoir de vrais sprites et petites animations pour les six animaux (emoji actuels provisoires).
- [ ] Fournir des voix françaises embarquées/offline de qualité et enregistrer une politique de sélection vocale.
- [ ] Affiner le mixage avec ducking réel des FX et tester les cas de voix chevauchées.
- [ ] Réaliser des tests visuels de gameplay et des scénarios de longues parties sur téléphone.
- [ ] Ajouter éventuellement des animations de compteurs plus riches et un historique personnel consultable.
- [ ] Adapter ou empaqueter le jeu pour Android natif si souhaité ; fabriquer des `.apk` et `.aab` correctement nommés, icône définitive, signature contrôlée.
- [ ] Tester les sauvegardes sous forte contrainte (quota, éviction de cache, fermeture brusque) et les migrations futures.
- [ ] Faire valider la formule des points et les choix artistiques.
- [ ] Ne pas fusionner `main`, créer de release ou publier sans accord explicite.

## Source de vérité

Voir [docs/description-gameplay-mascottes-voix-fx-et-score-local.md](docs/description-gameplay-mascottes-voix-fx-et-score-local.md) et [brain.md](brain.md).
