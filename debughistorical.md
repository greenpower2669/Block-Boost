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

## 16/10/2026 — Moteur vocal Android isolé, validation CI

- Besoin : voix Block Boost plus expressive et sans blocage UI durant les voix/combo.
- Solution : bridge JS → `ExpressiveVoiceEngine` utilisant HandlerThread, TTS Android local, validation des paramètres, priorité, annulation et préparation d'assets OGG vocaux (absents de cette version).
- Director JS : huit dernières phrases écartées du tirage, historique maximum 48 en stockage local, profils émotionnels et répliques supplémentaires ; tests Node.
- CI tests [38956309287](https://github.com/greenpower2669/Block-Boost/actions/runs/38956309287) **success** ; CI Android [38956309047](https://github.com/greenpower2669/Block-Boost/actions/runs/38956309047) **success**, APK et empreinte contrôlées, commit du binaire sur `temp/blockboost-emotion-0.2.0/temp/android/`.
- SHA-256 APK `49c5bce6a6edc4892b60f1505c5b06b321bd54819068e62dede7407cd4f9f6e0` ; 40 230 octets. App ID `fr.greenpower.blockboost.emotionlab`, indépendant de l'ancienne debug afin d'éviter conflit de clé.
- Test Samsung non effectué. Vraies voix émotionnelles préenregistrées / synthèse neuronale non livrées. Aucun merge main ni release.

## 2026-10-16 — Bonus vitesse visibles et EXTRA sans rotation (0.3.0)

- CI de développement initiale rouge : ancienne assertion Chrome attendait exactement 15 points et une bannière « EXTRA » après une rotation ; après ajout des points vitesse et du HUD il fallait adapter le scénario.
- Correction : calculer, afficher et effacer l'état de sélection après toute pose dans `paint()`. Tests de navigateur désormais orientés sur la valeur affichée et le score conservé, non sur la valeur de l'ancienne version.
- Test Chrome renforcé : un premier glisser à **deux doigts** gagne son coefficient vitesse mais **pas** d'extra. Une seconde pose **sans rotation** affiche `EXTRA SANS ROTATION`, augmente le score et reste sauvegardée après rechargement.
- Suite JavaScript 22 scénarios verte, CI globale [38958540023](https://github.com/greenpower2669/Block-Boost/actions/runs/38958540023) verte ; Android [38958540134](https://github.com/greenpower2669/Block-Boost/actions/runs/38958540134) vert ; APK directe https://raw.githubusercontent.com/greenpower2669/Block-Boost/temp/blockboost-bonus-0.3.0/temp/android/BlockBoost-0.3.0-bonus-debug.apk.
- 42 688 octets, SHA256 `e14696954dbf30b17fb006fb34ab72daf9a131da1e4e4f27cf319110faf72b65` stocké dans `temp/android/BlockBoost-0.3.0-bonus-debug.sha256`. APK signée debug, pas Google Play. Aucune validation humaine du rendu Samsung.
