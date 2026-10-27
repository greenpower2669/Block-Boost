# 🧩 Block Boost — intégration du logo approuvé (27 octobre 2026)

Mission autorisée par Fab : conserver le carré à coins arrondis, ses effets néon, les quatre grands blocs colorés et la patte dorée ; fond extérieur **transparent**.

- Source : image approuvée durant la conversation du 27 octobre, conservée dans le fichier image original de la conversation.
- Copie légère intégrée au dépôt : `assets/blockboost-logo.webp`, RGBA 192×192, sans fond opaque ajouté, préservant le dessin.
- Web/PWA : favicon `index.html`, icône `manifest.webmanifest`, cache versionné `sw.js`.
- Android : `drawable-nodpi/blockboost_logo.webp` (octets identiques), `drawable/ic_launcher_foreground.xml` et icône adaptative à fond transparent.
- Le raster est placé au centre de la zone sûre adaptative (inset 18dp), pour éviter l'écrêtage par le masque Android.
- Test automatisé : `tests/icon-assets.test.mjs` (format, dimensions, transparence, cohérence assets et références).
- Package `fr.greenpower.blockboost`, signature Google Play, versionCode et code du jeu **inchangés**.
- Aucune fusion sur `main` ni Release GitHub/Google Play sans accord spécifique.
- Validation visuelle réelle sur Samsung restant à effectuer. Version 192 px compacte : prévoir source haute résolution 512 px sur une prochaine mise à jour si nécessaire.

Le fond transparent s'applique à l'image fournie et au fond de l'icône adaptative ; le lanceur Android peut appliquer son propre masque selon le thème.
