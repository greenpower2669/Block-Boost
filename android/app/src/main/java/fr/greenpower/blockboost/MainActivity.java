package fr.greenpower.blockboost;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.net.Uri;
import android.text.TextUtils;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Offline Block Boost shell. A reserved HTTPS origin serves only APK-bundled
 * resources, so ES modules and localStorage share a proper secure origin.
 * No INTERNET permission, remote JavaScript or external URLs.
 */
public final class MainActivity extends Activity {
    private static final String ASSET_HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + ASSET_HOST + "/assets/index.html";
    private WebView game;
    private ExpressiveVoiceEngine voice;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(23, 25, 64));
        getWindow().setNavigationBarColor(Color.rgb(23, 25, 64));
        if (android.os.Build.VERSION.SDK_INT >= 26) {
            getWindow().getDecorView().setSystemUiVisibility(0);
        }

        game = new WebView(this);
        game.setBackgroundColor(Color.rgb(23, 25, 64));
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        game.setVerticalScrollBarEnabled(false);
        game.setHorizontalScrollBarEnabled(false);
        game.setOnApplyWindowInsetsListener((view, insets) -> {
            // Keep the game above system gestures and camera cutouts on Android 16.
            int top = insets.getSystemWindowInsetTop();
            int bottom = insets.getSystemWindowInsetBottom();
            int left = insets.getSystemWindowInsetLeft();
            int right = insets.getSystemWindowInsetRight();
            view.setPadding(left, top, right, bottom);
            return insets;
        });

        WebSettings settings = game.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        WebView.setWebContentsDebuggingEnabled(
                (getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        game.setWebChromeClient(new WebChromeClient());
        game.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocalAsset(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return fromBundle(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return fromBundle(Uri.parse(url));
            }
        });
        // Bridge is exposed ONLY to a fixed first-party offline origin.
        game.addJavascriptInterface(new VoiceBridge(), "AndroidBridge");
        setContentView(game);
        voice = new ExpressiveVoiceEngine(getApplicationContext());
        game.loadUrl(START_URL);
    }

    private boolean isLocalAsset(Uri uri) {
        return uri != null && "https".equals(uri.getScheme())
                && ASSET_HOST.equals(uri.getHost())
                && uri.getPath() != null && uri.getPath().startsWith("/assets/");
    }

    private WebResourceResponse denied() {
        byte[] text = "Resource unavailable".getBytes(StandardCharsets.UTF_8);
        WebResourceResponse result = new WebResourceResponse("text/plain", "UTF-8",
                new ByteArrayInputStream(text));
        result.setStatusCodeAndReasonPhrase(404, "Not Found");
        return result;
    }

    private String contentType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".mjs") || path.endsWith(".js")) return "text/javascript";
        if (path.endsWith(".json") || path.endsWith(".webmanifest")) return "application/json";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }

    private WebResourceResponse fromBundle(Uri uri) {
        if (!isLocalAsset(uri)) return denied();
        String asset = uri.getPath().substring("/assets/".length());
        if (TextUtils.isEmpty(asset)) asset = "index.html";
        if (asset.contains("..") || asset.contains("\\") || asset.startsWith("/")) {
            return denied();
        }
        try {
            InputStream data = getAssets().open("www/" + asset);
            WebResourceResponse result = new WebResourceResponse(contentType(asset),
                    "UTF-8", data);
            result.setResponseHeaders(java.util.Collections.singletonMap("Cache-Control",
                    "no-cache"));
            return result;
        } catch (IOException ignored) {
            return denied();
        }
    }

    /** Voice requests are immediately sent to a dedicated Android HandlerThread. */
    public final class VoiceBridge {
        @JavascriptInterface
        public void speak(String sentence, double pitch, String emotion, int priority, String clip) {
            if(voice!=null) voice.speak(sentence, emotion, clip, (float)pitch, priority);
        }
        @JavascriptInterface
        public void stop() {
            if(voice!=null) voice.stop();
        }
    }

    @Override
    protected void onPause() {
        if (game != null) game.onPause();
        if (voice != null) voice.stop();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (game != null) game.onResume();
    }

    @Override
    protected void onDestroy() {
        if (game != null) {
            game.removeJavascriptInterface("AndroidBridge");
            game.stopLoading();
            game.destroy();
            game = null;
        }
        if (voice != null) {
            voice.close();
            voice = null;
        }
        super.onDestroy();
    }
}
