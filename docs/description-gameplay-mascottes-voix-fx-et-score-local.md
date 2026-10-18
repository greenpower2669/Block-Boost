# Block Boost — gameplay, animaux compagnons, voix, effets FX et sauvegarde locale

> **Statut : spécification de conception (proposition), 16 octobre 2026.** Aucun des ajouts ci-dessous n'est déclaré implémenté. La référence visuelle est la vidéo fournie par Fab, `Blck.mp4`. Ses règles internes et sa bande vocale n'ont pas été vérifiées au niveau du code ; ne pas inventer des mécanismes de score ou des répliques prétendument extraites du jeu.

## 1. Vision et ambiance

**Block Boost** est un jeu de réflexion tactile en portrait : un puzzle de blocs colorés, un plateau 8 × 8, trois formes proposées simultanément et une grande satisfaction lorsqu'une ligne ou une colonne est entièrement remplie puis libérée. Sa signature originale sera un petit animal compagnon adorable qui observe le plateau, réagit au contexte et encourage le joueur avec des expressions animées et une voix douce, chaleureuse, parfois espiègle. Il joue le rôle d'un commentateur bienveillant, **jamais d'un assistant qui triche**, jamais d'un obstacle visuel.

Le jeu recherche un équilibre : réflexion calme pendant les placements ; récompenses lumineuses et sonores progressives lors des effacements ; émotion et humour grâce aux animaux. Les réussites sont célébrées sans saturer l'écran ni l'audio. Une erreur n'entraîne ni honte ni moquerie. On peut jouer intégralement hors ligne, conserver ses records et reprendre des sessions.

### Éléments constatés dans la référence, à conserver comme socle fonctionnel

- Plateau stable 8 × 8, fond bleu nuit, cellules délimitées, blocs vivement colorés et légèrement biseautés.
- Trois pièces disponibles, saisie tactile, glisser-déposer, accrochage aux cellules libres.
- Suppression d'une ligne horizontale ou colonne verticale complétée, y compris des suppressions croisées.
- Aucun comportement général de gravité des blocs restants ; les cases vidées restent libres.
- Score numérique au-dessus du plateau, animations de comptage et bonus ponctuels.
- Combos affichés, notamment « Combo 2 », « Combo 3 », « Combo 9 » ; messages à l'écran « Excellent! », « Perfect! », « Good! », « Unstoppable! ».
- FX existants dans la vidéo : halos cyan, croix lumineuses multicolores, particules, éclats, cadres brillants, texte animé, étincelles, décorations du score, célébration finale violette et dorée.
- Fin de session si les pièces proposées ne peuvent plus entrer dans la grille : « No Space Left », puis écran de score avec invitation à rejouer.
- La formule exacte des points, la règle de maintien des combos, l'algorithme de distribution des pièces et le détail de la piste vocale **ne sont pas connus**. Ne pas les présenter comme acquis. Les définir et les tester à l'implémentation.

## 2. Boucle de gameplay détaillée

1. **Accueil** : bouton Jouer, meilleur score local, choix du compagnon, accès aux paramètres sonores, éventuel bouton Reprendre si une session sauvegardée existe.
2. **Début de partie** : grille vide, score 0, trois formes dans la réserve, compagnon visible dans une petite zone périphérique. Une salutation très courte peut se jouer si les voix sont activées.
3. **Observation** : aucune pression temporelle obligatoire ; le joueur examine les vides, les colonnes et les formes disponibles. La mascotte observe calmement, sans parler à chaque seconde.
4. **Prise de pièce** : suivi sous le doigt avec offset garantissant que la forme reste visible ; aperçu de la projection sur cellules. Les couleurs du plateau restent suffisamment contrastées.
5. **Position valide** : pose complète dans des cases libres, sans débordement ; blocage et retour visuel discret si emplacement impossible. Ne jamais consommer la pièce lors d'un placement invalide.
6. **Résolution** : détecter toutes les lignes/colonnes complètes issues du coup ; effacer toutes les cellules concernées une seule fois, même à l'intersection ; afficher l'animation avant retour à l'état libre.
7. **Récompenses** : faire évoluer les points, afficher les bonus et éventuellement un qualificatif, mettre à jour le compteur de combo selon la règle de score retenue. La mascotte réagit sans interrompre les commandes.
8. **Réserve** : retirer la pièce utilisée, renouveler la réserve au moment prévu par les règles finales ; ne pas modifier silencieusement la géométrie d'une pièce proposée.
9. **Contrôle d'impasse** : tester tous les placements possibles de toutes les pièces restantes ; terminer uniquement si aucune pièce ne rentre légalement.
10. **Résultat** : geler le score final, le comparer au record local, enregistrer le résultat avant de présenter le récapitulatif, puis afficher Rejouer / Accueil. Aucun réseau nécessaire.

### Décisions à expliciter avant programmation

- Rotation : **non démontrée dans la vidéo de référence**, mais **ajoutée à Block Boost sur demande explicite de Fab le 16/10/2026**. Quand un doigt maintient une pièce en déplacement, chaque nouvel appui du deuxième doigt déclenche un quart de tour horaire ; le premier doigt conserve le contrôle de la dépose. Contrôle alternatif : touche R (ordinateur) et bouton ↻ ; une rotation n'accorde aucun point.
- Score : attribuer des points de placement et des bonus de suppression selon une formule stable, documentée et couverte par tests ; ne pas recopier des valeurs déduites d'un seul enregistrement.
- Combo : choisir et formaliser une seule définition (par exemple : coups consécutifs qui effacent au moins une ligne) ; réinitialiser le compteur dans les conditions explicitement documentées.
- Tirage : définir une génération reproductible en tests et éviter les distributions injouables non intentionnelles ; ne pas introduire d'avantage caché lié au choix de l'animal.
- Fin de partie : après traitement intégral des destructions et du renouvellement de la réserve, vérifier l'absence de placement possible.

## 3. Direction artistique et emplacement des animaux

Esthétique globale : plateau bleu-indigo sombre, blocs colorés à reflets doux, particules brillantes, comptage blanc lisible ; compagnons au dessin doux (grandes expressions, gestes simples, silhouette reconnaissable). Les animaux vivent **hors de la grille jouable** dans un petit espace en bas, à côté ou au-dessus de la réserve selon la place disponible. Leurs bulles ne couvrent jamais une case indispensable, le score ou les pièces saisies ; sur les petits écrans, les bulles deviennent des sous-titres dans une zone dédiée.

Animaux au choix, propositions de noms et de personnalité (noms modifiables) :

| Mascotte | Personnalité | Réaction graphique | Intention de voix |
| --- | --- | --- | --- |
| **Pompom, panda roux** | Calme, attendrissant, un peu gourmand | Petits bonds et mains sur les joues | Voix ronde, douce, émerveillée |
| **Plume, lapereau** | Enthousiaste, joueur, énergique | Oreilles qui se dressent, saut de joie | Voix vive et légère, débit intelligible |
| **Lilo, loutre** | Malicieuse mais toujours gentille | Battement de pattes et petite pirouette | Voix souriante, rythme chantant |
| **Nox, chouette** | Observatrice, maligne, apaisante | Clignement des yeux, déploiement d'ailes | Voix posée, encouragement précis |
| **Moka, chaton** | Curieux et affectueux | Queue qui dessine un cœur, ronron gestuel | Voix tendre, petits étonnements |
| **Biscotte, renardeau** | Drôle et motivant | Oreilles mobiles, célébration avec la queue | Voix pétillante, humour léger |

Chaque animal partage **exactement les mêmes règles du jeu**. Le choix de la mascotte n'affecte ni le score, ni le tirage, ni la difficulté. L'animal sélectionné et les préférences sont conservés localement. Possibilité de changer de compagnon depuis les options sans perdre sa session ni son record.

### États d'animation

- **Repos** : respiration légère, micro-mouvements et clignements naturels, animations espacées.
- **Curiosité** : regard suivant discrètement la pièce déplacée.
- **Placement valide** : hochement de tête rapide, sans voix systématique.
- **Belle suppression** : sourire et petites étoiles autour du personnage.
- **Double effacement / croix** : yeux brillants, joie plus expressive.
- **Combo élevé** : saut, ailes, oreilles ou queue animées, confettis à proximité du compagnon.
- **Record battu** : célébration exceptionnelle mais courte, sans masquer le score.
- **Impasse** : expression tendre et encourageante, jamais moqueuse.
- **Inactivité** : quelques mouvements subtils mais pas de relance vocale répétitive ; respecter le silence du joueur.

Animations à prévoir avec sprites ou animations légères (idle, blink, listen, speak, happy, delighted, celebrate, encourage, sad-soft, return-idle). Limiter les boucles simultanées pour la batterie, prévoir un mode « animations réduites ».

## 4. Voix des animaux et répliques proposées

**Toutes les phrases suivantes sont des propositions originales pour Block Boost, pas des transcriptions de `Blck.mp4`.** Français par défaut. Les phrases sont courtes, naturelles, affectueuses et non infantilisantes. Chaque mascotte peut utiliser un sous-ensemble propre et des variations. Les répliques doivent être facilement désactivables.

| Déclencheur | Exemples de phrases possibles | Intensité |
| --- | --- | --- |
| Accueil (une fois) | « On joue ensemble ? » ; « Je suis prêt ! » ; « À nous deux ! » | Faible |
| Premier placement | « Joli départ ! » ; « C'est parti ! » | Très faible |
| Placement normal | « Bien vu ! » ; « Hop, là ! » ; « C'est posé. » | Rare |
| Ligne effacée | « Bravo, ça se libère ! » ; « Et une ligne de moins ! » | Moyenne |
| Deux lignes ou croix | « Oh, le beau coup ! » ; « Deux d'un coup, génial ! » | Forte |
| Combo 2–3 | « Tu enchaînes ! » ; « J'adore ce rythme ! » | Moyenne |
| Combo 4–6 | « Tu assures vraiment ! » ; « Quelle série ! » | Forte |
| Combo 7+ | « Incroyable, tu es lancé ! » ; « Ça, c'est du grand jeu ! » | Très forte |
| Bonus important | « Wouah, tous ces points ! » ; « Le compteur s'envole ! » | Forte |
| Nouveau record local | « Nouveau record ! Tu peux être fier ! » ; « C'est ton meilleur score ! » | Célébration exceptionnelle |
| Beaucoup de cases occupées | « On garde notre calme, il reste des possibilités. » ; « Regarde bien les petits espaces. » | Douce, très rare |
| Pose invalide | « Oups, pas ici ! » ; « Essayons ailleurs. » | Très rare et jamais répétée en boucle |
| Fin sans record | « Belle partie ! On retente ? » ; « On fera encore mieux ensemble ! » | Réconfort |
| Fin avec record | « Quel exploit ! On fête ton record ! » | Triomphante |

Exemples de tempéraments :
- **Pompom** : « Doucement, mais sûrement ! », « Ooh… c'est magnifique ! »
- **Plume** : « Hop hop, ça décolle ! », « Regarde-moi ce combo ! »
- **Lilo** : « Tu m'éclabousses de points ! », « Quel joli plongeon ! »
- **Nox** : « Bien observé. », « Quelle belle combinaison. »
- **Moka** : « Miaougnifique ! », « Je ronronne de bonheur ! »
- **Biscotte** : « Rusé comme un renard ! », « Ça, c'est bien joué ! »

Les phrases de risque **ne doivent pas révéler une solution ou mentir sur l'état du plateau**. Les commentaires d'inactivité ne doivent jamais culpabiliser. Pas de dialogue pendant une animation de saisie si cela parasite la concentration. Sous-titres synchronisés et option « uniquement bulles » pour profiter des animaux sans voix.

## 5. Couplage rigoureux des voix et des FX

### Priorité des événements

1. `game_over` et `new_high_score` : événements exclusifs prioritaires.
2. `mega_combo`, `multi_line_clear` : récompenses majeures.
3. `line_clear`, `combo` : récompenses ordinaires.
4. `valid_drop`, `invalid_drop`, `welcome` : événements secondaires.

**Une seule phrase parlée à la fois.** Les voix de bas niveau ne s'empilent pas ; supprimer les annonces devenues obsolètes. Une annonce prioritaire peut remplacer une phrase inférieure après une transition sonore courte, sans coupure agressive. Exemples de gardes : au plus une réplique de placement sur plusieurs coups, délai de récupération configurable pour la voix, aucune répétition immédiate d'une même phrase, et aucune annonce d'encouragement si un combo important est déjà en cours.

### Chronologie de référence d'une suppression

| Phase | Visuel | Son |
| --- | --- | --- |
| T0, validation | La pièce s'enclenche, bloc bref de surbrillance | Petit « clic » mat, propre, bas en volume |
| T0 + courte latence | Les cellules complètes s'illuminent | Balayage électronique montant ou tintement bref |
| T0 + résolution | Les cellules s'effacent et libèrent la grille | Son cristallin de disparition, sans écraser le clic |
| T0 + récompense | Points flottants, combo éventuel | Petit jingle dont l'intensité dépend du niveau |
| Pendant récompense | Mascotte exprime sa joie et affiche sa bulle | Voix courte, prioritaire sur le jingle, FX atténués temporairement |
| Fin | Particules décroissantes et retour à l'état normal | Chute naturelle des FX, restitution du niveau sonore habituel |

Les délais sont **à régler sur appareils réels** ; ce tableau spécifie l'ordre causal, pas des millisecondes déjà mesurées. Les animations FX et les annonces utilisent le même objet d'événement de gameplay, avec `eventId`, `type`, `intensity`, `scoreDelta`, `comboCount`, `timestamp`, plutôt que des déclenchements dispersés dans l'interface.

### Mixage et qualité

- Canaux logiques : interface, pose, destruction, particules/jingles, voix, éventuelle musique.
- La voix est toujours intelligible et n'est jamais noyée sous un empilement d'explosions.
- Abaissement temporaire (« ducking ») du bus FX/jingles lors d'une annonce vocale ; retour progressif ensuite.
- Aucune voix dans un son d'effet par erreur ; fichiers FX et fichiers voix séparés.
- Variantes discrètes de timbre/hauteur pour les FX répétitifs, mais **pas de déformation extrême des voix**.
- Les FX importants ne doivent pas provoquer de saturation lorsque plusieurs lignes sont effacées simultanément : agréger les événements plutôt que superposer plusieurs sons identiques à pleine puissance.
- Préférer des ressources audio locales ; lecture hors ligne sans accès réseau et latence réduite.
- Réglages indépendants : volume général, voix des animaux, effets, musique éventuelle, vibrations, sous-titres.
- Prévoir modes silencieux, volume multimédia Android, accessibilité, et transition pause/reprise sans annonces obsolètes.

## 6. Système local de score : obligation fonctionnelle

La sauvegarde des scores est **locale, automatique, durable, indépendante d'un compte et disponible hors connexion**. Aucun serveur, classement mondial, formulaire nominatif ni permission réseau ne sont nécessaires pour la version initiale.

### Données locales minimales

```json
{
  "schemaVersion": 1,
  "bestScore": 0,
  "lastScore": 0,
  "gamesPlayed": 0,
  "bestCombo": 0,
  "lastGameAt": null,
  "selectedMascot": "pompom",
  "audioSettings": {
    "master": 1.0,
    "voice": 0.8,
    "fx": 0.8,
    "music": 0.5,
    "subtitles": true
  }
}
```

Ceci est un **exemple de schéma**, non un enregistrement déjà existant. Les scores, compteurs et combos doivent être des entiers non négatifs bornés ; le record est monotone (`newBest = max(oldBest, finalScore)`). Sauvegarder en plus, si désiré, les *N* derniers résultats (par exemple 20) et la partie en cours dans des clés distinctes. Ne jamais utiliser le score observé de 1 715 comme record préchargé de tous les joueurs.

### Moments de sauvegarde

1. **À l'ouverture** : lire, valider la version du schéma, migrer si nécessaire, afficher le meilleur score et les réglages.
2. **Pendant la partie** : sauvegarder par point de contrôle raisonnable (ex. après un coup validé et sa résolution), sans provoquer de saccades ; si une sauvegarde de partie est proposée, enregistrer la grille, les trois pièces, score courant et état du combo.
3. **À la fin** : écrire de manière robuste `lastScore`, `bestScore`, `gamesPlayed`, `bestCombo`, date et historique éventuel **avant** l'animation finale et la célébration de record ; garantir qu'un événement de fin n'est compté qu'une fois.
4. **À la fermeture ou mise en arrière-plan** : vider la file d'écriture si possible ; le record déjà validé doit survivre à l'arrêt brutal du processus.
5. **Au redémarrage** : restaurer les scores sans exiger de connexion.

### Implantation selon le moteur choisi

- **Android natif** : DataStore ou stockage applicatif transactionnel pour les préférences/records ; Room/SQLite si historique plus riche.
- **Web / WebView** : IndexedDB pour état/historique robustes, ou localStorage pour un état petit et simple ; encapsuler l'accès derrière une interface de stockage et gérer les échecs de quota.
- Toute implémentation doit être **atomique ou tolérante aux interruptions**, versionnée et testée ; ne pas supposer qu'effacer le cache ou désinstaller l'application préserve les données.

### Présentation des scores

- Sur accueil : « Meilleur score » suffisamment grand et lisible.
- Pendant la partie : score actuel toujours visible ; option de montrer un petit trophée record sans masquer le gameplay.
- À la fin : « Score de cette partie », « Record personnel » et badge « Nouveau record ! » uniquement si le record vient réellement d'être battu.
- Le score persiste d'une session à l'autre ; « Rejouer » remet le score courant à zéro sans jamais écraser le meilleur score.
- Aucun envoi réseau implicite des scores. Import/export local des résultats pourra être une option ultérieure, clairement distincte.

## 7. Ergonomie, accessibilité et confort

- Portrait adaptable, prise en compte de la navigation Android et des zones systèmes ; ne rien placer sous les boutons de navigation.
- Grille toujours dominante, cibles tactiles suffisantes, décalage de la pièce au-dessus du doigt si nécessaire.
- Textes et chiffres lisibles à grande taille ; ne pas identifier les blocs uniquement par couleur si un mode daltonien est proposé.
- Compagnon visible mais **jamais** placé au-dessus d'une case ou d'une pièce manipulée.
- Mode voix muette, mode FX atténués, option sous-titres, réduction d'animation/clignotement.
- Pas de flash plein écran brutal ou répétitif ; limiter les explosions blanches à forte intensité.
- L'animal ne doit ni imposer une réponse ni bloquer l'interaction pendant une célébration.
- Choix de mascotte et réglages accessibles sans sacrifier le record.

## 8. Écran de fin et expérience émotionnelle

À l'impasse, le jeu constate qu'aucune pièce disponible ne peut être posée. Les dernières interactions sont gelées proprement ; la mascotte affiche une expression douce. Le récapitulatif présente la performance et le meilleur score enregistré. Si record battu : halo doré et célébration joyeuse exceptionnelle ; sinon : encouragement bref. Garder la couronne, les confettis et une palette violette inspirée du rythme observé, sans reproduire à l'identique les ressources graphiques du jeu de référence. Boutons « Rejouer », « Accueil » ; éventuellement « Changer de compagnon ».

Le message final n'est **jamais** humiliant : « Belle partie ! On retente ensemble ? ». Aucune incitation punitive, aucun score inventé et aucun faux record.

## 9. Architecture cible (non codée)

Séparer nettement :
- **GameEngine** : grille, pièces, validation, score, suppressions, combo, détection de fin.
- **GameEvents** : publication des événements métier stables et déterministes, un seul événement logique par réussite.
- **PresentationFX** : particules, halos, textes, compteurs ; ne modifie jamais le score.
- **MascotDirector** : choix de l'animal, animation d'état, sélection d'une phrase, cooldown, priorité, file de lecture.
- **AudioMixer** : voix, FX, volume, ducking et interruption propre.
- **LocalProgressRepository** : préférences, high score, derniers résultats, migration, éventuellement snapshot de partie.
- **Screens/UI** : accueil, plateau, options, résultat et textes accessibles.

Le moteur ne doit **pas** dépendre du rendu, des mascottes ou de l'audio : jouer sans son et sans mascotte doit donner exactement les mêmes coups, le même score et les mêmes issues.

## 10. Plan de réalisation et validations attendues

**Phase A :** définir les règles de score/combos et construire un moteur de grille testable, sans reproduire des règles supposées.

**Phase B :** plateau tactile fonctionnel, aperçu de pose et destructions propres, y compris rangée + colonne simultanées.

**Phase C :** effet FX et score animé : un événement unique doit piloter à la fois les éléments visuels, les points et le son.

**Phase D :** animaux : sprites/animations à produire, bulles lisibles, choix du compagnon, états et premières répliques locales.

**Phase E :** voix : variantes, anti-répétition, priorités, ducking et contrôle du volume.

**Phase F :** sauvegardes locales, migrations de schéma, écran de score final, conservation du record.

**Phase G :** tests sur Android réel, ergonomie verticale, accès hors ligne, crash/reprise, son muet, performances.

### Critères d'acceptation obligatoires

1. Une ligne complète et une colonne complète se libèrent exactement une fois chacune.
2. Une pièce mal placée ne consomme ni forme ni points.
3. Aucune bulle, animation ou animal ne masque les zones tactiles importantes.
4. Un combo important déclenche au maximum **une** réplique vocale prioritaire par événement, et le texte reste lisible.
5. Les répétitions de placements ne produisent pas un commentaire vocal à chaque coup.
6. La voix reste audible lors des FX forts grâce au mixage.
7. Avec les voix désactivées, le gameplay et les animations continuent normalement.
8. Après un score record, fermeture complète et réouverture : le record est toujours exact.
9. Une partie moins bonne, suivie de « Rejouer », ne réduit jamais le record.
10. Le jeu fonctionne en mode avion pour la totalité des fonctions locales.
11. Une sauvegarde invalide ne provoque pas de crash ; repli prudent et journal d'erreur non sensible.
12. Les paramètres et le compagnon choisi se restaurent après redémarrage.
13. Les tests vérifient l'impasse réelle : fin uniquement si aucune forme restante n'a d'emplacement légal.
14. Les nouvelles fonctions n'introduisent ni régression tactile, ni effets de lumière agressifs, ni ralentissement visible.
15. Si une application Android est produite : artefacts correctement nommés `.apk` (installation/test) et `.aab` (publication), icône adaptée ; **aucune build ni publication n'est autorisée par ce document**.

## 11. Première implémentation Web/PWA (16 octobre 2026)

L'implémentation de cette spécification a commencé sur la branche `feature/block-boost-playable-rotation-v1`. C'est un **prototype Web/PWA en HTML/CSS/JavaScript**, sans framework d'exécution et sans application Android native à ce stade.

- Code : `src/engine.mjs` (plateau, rotations et score), `src/main.mjs` (interface et Pointer Events multitactiles), `src/storage.mjs` (stockage local), `src/feedback.mjs` (six mascottes et feedback vocal/sonore).
- Fonctionnels dans cette première version : pose tactile, trois formes, lignes et colonnes, combo, bonus, rotation deuxième doigt de 90°, score et record local, reprise de partie, six mascottes emoji animées, sous-titres, parole de synthèse du navigateur si disponible, FX générés localement, options voix/FX/animations, PWA et cache hors ligne.
- **Règle effectivement programmée :** 5 points par carré posé, plus `80 × nombreDeLignes² × multiplicateurCombo` lors d'un effacement ; le multiplicateur vaut le nombre de coups consécutifs ayant effacé au moins une ligne, revient à zéro après un coup ordinaire. L'intersection ligne/colonne n'est retirée qu'une fois.
- **Limites :** illustrations finales de mascottes non créées (emoji temporaires), voix françaises dépendant des voix disponibles sur le téléphone/navigateur et non garanties hors ligne, aucun paquet Android `.apk` ou `.aab`, ergonomie Samsung non testée physiquement.
- Tests : moteur JavaScript via `node --test` et navigateur Chrome simulant deux doigts, la pose d'une pièce après rotation, puis la persistance après rechargement. Voir workflow CI.
- Pas de fusion vers `main`, pas de publication de release. Les ajouts ci-dessus ne modifient en rien les observations factuelles du jeu de référence.

## 12. Provenance et périmètre

- **Observé** : la référence vidéo `Blck.mp4`, fournie dans la conversation du 16 octobre 2026.
- **Proposé par Fab** : mascottes d'animaux mignons qui encouragent, voix liées aux FX et sauvegarde locale des scores.
- **Décisions de conception détaillées ici** : exemples de personnages et de phrases, architecture, hiérarchie audio, schéma de données et critères d'acceptation.
- **Non fait** : code, assets, voix synthétisées, tests, APK/AAB, release et fusion de la branche vers `main`.

Ce document est la description fonctionnelle de référence ; `brain.md` ne doit en contenir qu'une synthèse légère avec un pointeur vers ce fichier.
