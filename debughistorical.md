# Block Boost — debughistorical

## 2026-10-16 — Initialisation documentaire
- Dépôt observé : README et licence uniquement, pas de code exécutable.
- Référence fonctionnelle : capture utilisateur `Blck.mp4`, analysée dans la conversation ; les règles internes non démontrables ne sont pas certifiées.
- Spécification proposée : gameplay, mascottes, voix/FX couplés et scores locaux.
- **Aucun bug logiciel identifié ou corrigé, aucun test exécuté, aucun APK/AAB construit.**
- Conserver ici les incidents réels, diagnostics, validations et correctifs seulement quand l'implémentation commencera.

## 2026-10-16 — Premier prototype jouable et validation GitHub

- Création de `feature/block-boost-playable-rotation-v1`, basée sur la branche de documentation précédente.
- Mise en place d'un moteur JavaScript, d'une interface PWA, de six mascottes emoji provisoires, voix de synthèse navigateur, FX et stockage local.
- Rotation : deuxième contact tactile pendant le maintien de la pièce = +90° dans le sens horaire ; le premier contact reste responsable de la dépose.
- Premier workflow rouge : 11/12 tests. Cause **dans le jeu de données du test de fin de partie**, qui remplissait une ligne et déclenchait sa suppression ; le cas ne représentait pas une véritable impasse.
- Deuxième workflow encore rouge : des cellules totalement pleines ailleurs dans le plateau déclenchaient à nouveau un effacement ; correction avec une disposition de trous isolés dans chaque rangée et colonne, y compris la ligne/colonne de pose.
- Puis **12/12 tests moteur verts**. CI de Chrome plus récente : simulation de deux contacts réussie, rotation effective, dépose, score et reprise après recharge. Résultat vert : https://github.com/greenpower2669/Block-Boost/actions/runs/38930799354.
- Correctif du son : ne pas appeler `SpeechSynthesis.speaking` comme une fonction (c'est un booléen).
- Réserves : pas de test physique sur Samsung, pas de sprites finaux ou voix embarquées, aucun build Android, aucune fusion `main`, aucune release.

## 2026-10-16 — Compilation APK et publication du fichier décompressé

- Première CI Android en échec : `android-actions/setup-android@v3` demandait le paquet SDK obsolète `tools`. Correction : utiliser directement le `sdkmanager` du SDK préinstallé GitHub.
- Deuxième CI en échec : `BuildConfig.DEBUG` non généré par la configuration AGP. Correction : détecter `ApplicationInfo.FLAG_DEBUGGABLE` pour activer uniquement le debug WebView.
- Troisième CI Android **verte** : https://github.com/greenpower2669/Block-Boost/actions/runs/38932973713. Compilation Gradle/Javac, tests moteur, vérification ressources APK et publication de l'artefact ZIP.
- Demande explicite : éviter le téléchargement ZIP sur Android. Nouvelle GitHub Action `.github/workflows/publish-apk-direct.yml` : récupère l'artefact du run vert par `gh run download`, l'extrait sur GitHub Actions, vérifie le SHA-256, commit l'APK natif dans le répertoire `temp/android/` sur une branche isolée `temp/blockboost-apk-0.1.0`.
- Action directe **verte** : https://github.com/greenpower2669/Block-Boost/actions/runs/38933516757.
- Fichier vérifié dans GitHub : https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-apk-0.1.0/temp/android/BlockBoost-0.1.0-debug.apk. Taille 33307 octets ; SHA-256 `49e963e01c075a2014b1889c54a236fec86b56587b328bfede3e2bea0688b98c`.
- Aucun merge ni release ; APK debug non validée par test manuel Android 16.
