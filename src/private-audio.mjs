/** Private per-game sound hooks.
 * The public repository never contains the licensed Sonniss recordings.
 * A private Djipie build injects the selected OGGs into the FINISHED APK
 * and replaces this EMPTY manifest in temporary build workspace only.
 * Public CI/PWA always use the existing Kenney CC0 fallback instead.
 */
export const PRIVATE_AUDIO_FILES=Object.freeze({});
