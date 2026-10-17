# Block Boost 0.10 — Bulles iridescentes, croisement ×10 et 11 sons Sonniss synchronisés

## Ordre de mission confirmé le 17 octobre 2026

Après sélection de 11 sons Djipie en plusieurs messages et audit sans code, Fab donne « Aller on code^^ et ça boule à facette en attendant des musicvplus cool ^^ » en désignant le Bass Drop 3. La mission inclut tous les éléments approuvés : 2 lignes/colonnes → bulles translucides qui montent, éclatent et projettent des reflets ; cinq projecteurs **installés en bas** ; croisement ligne+colonne sur un seul coup → **bonus points d'effacement ×10**, sans multiplier vitesse/EXTRA ; FX par action ; jusqu'à trois poses gagnantes consécutives ; son grave provisoire pour la boule disco ; fin perdue distincte d'un nouveau record.

## Calcul de score exact (src/engine.mjs)

- Détecter `clearedRows.length>0 && clearedColumns.length>0` sur **la même pose** (les lignes et colonnes sont déjà calculées par le moteur).
- `crossMultiplier=10` seulement dans ce cas ; sinon 1.
- `clearPoints = 80 × lines² × combo × crossMultiplier`.
- `basePoints = 5 × nb_blocs_posés + clearPoints`.
- `gained = basePoints + speedBonus + noRotationBonus`.
- `crossBonus=80×lines²×combo×9` si croisement. Intersection physique éliminée **une seule fois** des `clearedCells`, inchangée.
- Exposer `crossMultiplier`, `crossBonus`, `clearPoints` et `newBatch` dans l'événement de pose pour interface/son sans recalcul caché. Le score final et la sauvegarde passent par le moteur existant.
- Ex. une pièce simple qui termine une ligne et une colonne : **3205 points avant éventuels bonus vitesse ou EXTRA**, 15 cellules effacées, contre 325 avant ×10.

## Animation

- **Deux lignes/colonnes ou plus effacées sur un seul geste**, indépendamment du nombre de combo : nouvelle famille `bubbles` prioritaire sur disco/galaxie.
- **5 projecteurs sur le sol** avec balayage orienté vers le haut, éclairage dégradé sans rectangle ; 12 à 32 bulles sphériques translucides qui apparaissent en bas, montent, dérivent, gonflent et font « pop » en étincelles.
- Sons distincts à la **création des bulles**, puis `bubbles-pop` **~1,1 s après**, timer annulé dès nouvelle scène.
- Texte **« PLUIE DE BULLES ! »** ou **« CROISEMENT ×10 ! »** et le score réel restent au premier plan de l'animation ; particules et projecteurs ne capturent jamais les gestes.
- Modes `Animations réduites` : 4 bulles statiques translucides, pas de balayage ; le score et les règles restent identiques.
- Boule disco existante : 20 sprites sphériques à axe vertical et projecteurs d'origine conservés pour les événements sélectionnés par le director ; Bass Drop 3 comme son provisoire jusqu'à choix d'une vraie musique de jeu.

## Audio sélectionné dans Djipie (11 WAV en 8 familles d'événements)

Les sons sont **Sonniss GDC 2026**, conservés en **Djipie PRIVATE** dans ses Releases individuelles ; catalogue `RESSOURCES_PARTAGEES/AUDIO/CATALOGUE/catalogue_direct.json` : ID, tag, nom, taille et SHA-256 exacts. Tous les originaux sont vérifiés avant conversion à la volée dans un job privé. Pas de distribution d'effets isolés.

| Événement | Identifiant Sonniss |
| --- | --- |
| `grab` — décrocher | SON-149783197b191973989490df |
| `drop` — poser sans effacement | SON-3e67b452377de95f5112ce0b |
| `lineSingle` — une ligne ou colonne | SON-a6d73c253e4099bf0f281c9a |
| `newBatch` — 3 nouvelles pièces | SON-ffe887547a6b06cdf2a87a89 |
| `streak1` — 1re pose gagnante | SON-67e84c0d6dded268b12a42f3 |
| `streak2` — 2e pose gagnante consécutive | SON-ead4f8615273ca878fcc1257 |
| `streak3` — 3e pose gagnante consécutive | SON-1f7bce584d5b45165f79bc58 |
| `loss` — fin sans nouveau record | SON-d95db17b9ae94009ff43e697 |
| `festival-bubbles-create` — apparition bulles | SON-44e4a6b34bd244fc3d993dbe |
| `bubbles-pop` — éclatements | SON-56bcab610e82af4b29f3bd63 |
| `festival-disco` — bass drop provisoire | SON-4370e5eb6ce207aa883c1005 |

Le joueur garde la **case Voix désactivée par défaut, réactivable** ; `streak2` et `streak3` sont des annonces vocales enregistrées et ne sont jouées que si la case est cochée. `stopVoice()` les interrompt. Les 24 Kenney CC0 et petits jingles restent des fallbacks dans la version Web et dans l'APK **publique**. Les files Sonniss ne sont jamais dans le GitHub public (ni sous forme OGG, ni data URI, ni pack séparé).

## Compilation privée sécurisée

- **Code du jeu PUBLIC :** `greenpower2669/Block-Boost`, branche `feature/bubbles-cross10-licensed-audio-100`. `src/private-audio.mjs` est **volontairement vide** dans la source publique.
- **CI d'intégration de sons PRIVÉE :** `greenpower2669/Djipie`, branche `feature/blockboost-bubbles-private-apk-100`. Elle clone la branche publique puis récupère 11 WAV via `gh release download`, contrôle chaque SHA-256/tailles du catalogue privé, transcode chaque son en **OGG court pour un événement du jeu** avec FFmpeg, place les fichiers dans `assets/licensed/*.ogg` **uniquement dans le répertoire temporaire de compilation**, et remplace le manifest audio temporairement.
- L'APK du **jeu fini** contient les 11 effets synchronisés aux animations du gameplay. La CI détruit le clone temporaire contenant les effets avant tout commit de livraison : **seule l'APK compilée** est publiée sur **branche temporaire privée Djipie**, sans release stable, sans merge main, sans pack de WAV ni samples distribués.
- Contrat officiel Sonniss applicable : https://sonniss.com/gdc-bundle-license/ (projets commerciaux synchronisés permis ; **pas de redistribution en banque d'effets autonomes, pas d'entraînement IA**).
- Les nouveaux sons étant sélectionnés sur la base des noms et fournis par Fab, leur **qualité sonore subjective sur Samsung reste à valider** après intégration, surtout longueur/mixage Bass Drop 3 et voix de shooters.
- APK privée `BlockBoost-0.10.0-bubbles-private-debug.apk`, APK publique de secours `BlockBoost-0.10.0-bubbles-debug.apk`; même ID expérimental, ne pas mélanger les deux signatures si elles diffèrent.

## Validation

Tests Node des calculs ×10, événements newBatch, doublons d'intersection, combos conservés, famille bubbles et comportement de l'ancien jeu ; tests Chrome tactile (double ligne → 5 projecteurs au sol, bulles et texte lisible). CI Android publique pour tester le gameplay et CI privée pour la vraie version avec **11 sons**. Résultats et liens APK à noter **uniquement après observation des builds et empreintes**, jamais anticiper leur statut.

**Gouvernance :** aucune fusion `main`, aucune sortie Google Play, fichiers mémoires vivants sur branche de mission uniquement. 