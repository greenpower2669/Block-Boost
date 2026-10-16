# Block Boost Émotion 0.2.0 — voix expressives asynchrones

## Demande
Fab souhaite que **Block Boost**, et non VisionMaxRead, produise immédiatement des encouragements plus joyeux et vivants, avec séparation multithread pour ne pas gêner le gameplay.

## Réalisation
- `src/voice-director.mjs` sélectionne des phrases adaptées à **calme, encouragement, surprise, combo, célébration, consolation**. 48 dernières répliques stockées en local, avec évitement des huit plus récentes, stratégie anti-répétition même après redémarrage.
- `src/feedback.mjs` déclenche humeur/intonation, gestes des animaux, sous-titres, FX et priorité des annonces. L'interface Web garde son moteur de synthèse si elle n'est pas lancée dans l'APK Android.
- `ExpressiveVoiceEngine.java` utilise un **HandlerThread dédié en priorité audio**, distinct du WebView et du thread UI. Annulation, génération invalidant les anciennes requêtes, limitation des files, et `TextToSpeech.QUEUE_FLUSH`. La synthèse est gérée par le système Android et ses propres threads.
- Priorité à une voix **française locale** si disponible ; aucune permission Internet.
- Préparation d'un emplacement `assets/www/voices/` pour de **véritables extraits préenregistrés expressifs** (OGG). S'ils sont fournis, Android peut les lire de façon asynchrone via `MediaPlayer.prepareAsync`, et retomber sur TTS si le fichier n'existe pas. **Aucun extrait émotionnel préenregistré n'est encore livré dans cette version.**
- `tests/voice-director.test.mjs` vérifie humeur, priorité, historique anti-répétition, corruption stockage et 48 entrées.

## Limite fondamentale : émotion de la voix
Les variations Android de hauteur/débit, la ponctuation et le choix des répliques créent une voix **plus vivante**, mais **ne constituent pas une véritable synthèse émotionnelle neuronale**. Pour de vrais rires, cris de joie et prosodie jouée, ajouter des enregistrements licenciés ou pré-générer des clips avec un moteur vocal spécialisé (p.ex. Qwen3-TTS). Le modèle Qwen de VisionMaxRead sert à lire les images/OCR ; il ne fournit pas directement de voix émotionnelle à Block Boost. Il serait déraisonnable d'intégrer un modèle vocal multi-Go dans ce petit APK de puzzle sans mesure de performance.

## Packaging et tests
- Nouvelle APK debug `BlockBoost-0.2.0-emotion-debug.apk`, applicationId de labo `fr.greenpower.blockboost.emotionlab` pour coexister avec la 0.1.0 sans conflit de clé debug. **Les sauvegardes du labo sont distinctes**.
- Workflow GitHub Actions construit le paquet, exécute les tests, vérifie la présence des assets, calcule SHA-256, puis publie le fichier APK **sans ZIP** dans la branche `temp/blockboost-emotion-0.2.0` sous `temp/android/`.
- Aucune fusion main, aucune signature Play Store et aucune release stable.
- Évaluation à réaliser sur Samsung : qualité réelle de la voix française, délai de première annonce, absence de ralentissement tactile, respect de l'arrêt et du silence, anti-répétition sur plusieurs parties.

## Référence de bibliothèque commune
Kenney `kenney_interface-sounds.zip` est identifié dans le dépôt privé Djipie, branche `proposal/ressources-partagees-audio-v1`, sous `RESSOURCES_PARTAGEES/AUDIO/`. **Ces effets d'interface ne sont pas des voix émotionnelles et n'ont pas été importés dans cette APK**. L'accès aux médias Djipie reste à la demande et ne doit pas déclencher de chargement automatique.
