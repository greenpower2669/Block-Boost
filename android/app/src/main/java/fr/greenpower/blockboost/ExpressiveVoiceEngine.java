package fr.greenpower.blockboost;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Process;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Asynchronous speech engine. Each operation takes place on its own HandlerThread,
 * independently of Android's UI thread and the WebView's compositor/input thread.
 *
 * 1. Optional prerecorded ORIGINAL emotional clips shipped in assets/www/voices/.
 * 2. Otherwise use the device's local French TextToSpeech, with event prosody profiles.
 *
 * Android TTS rate and pitch are NOT neural emotion synthesis. Voice clips can supply
 * genuine emotion when licensed/performed clips are bundled in a future iteration.
 */
public final class ExpressiveVoiceEngine implements TextToSpeech.OnInitListener {
    private final Context context;
    private final HandlerThread thread;
    private final Handler worker;
    private final AtomicLong generation = new AtomicLong(0);
    private TextToSpeech tts;
    private MediaPlayer player;
    private volatile boolean initialized = false;
    private volatile boolean closed = false;
    private volatile Request pending;
    private int currentPriority = 0;
    private String currentUtterance = null;

    private static final class Request {
        final String text;
        final String mood;
        final String clip;
        final float basePitch;
        final int priority;
        final long token;
        Request(String text, String mood, String clip, float basePitch, int priority, long token) {
            this.text=text; this.mood=mood; this.clip=clip; this.basePitch=basePitch;
            this.priority=priority; this.token=token;
        }
    }

    public ExpressiveVoiceEngine(Context context) {
        this.context=context.getApplicationContext();
        this.thread=new HandlerThread("BlockBoostVoice", Process.THREAD_PRIORITY_AUDIO);
        this.thread.start();
        this.worker=new Handler(thread.getLooper());
        worker.post(() -> {
            if(closed)return;
            tts=new TextToSpeech(this.context, this);
        });
    }

    public void speak(String text, String mood, String clip, float pitch, int priority) {
        if (closed || text == null || text.isEmpty() || text.length()>240) return;
        String tone = normalizeMood(mood);
        String resource = safeClip(clip);
        final long token = generation.incrementAndGet();
        final Request req = new Request(text,tone,resource,pitch,
                Math.max(0,Math.min(5,priority)),token);
        worker.post(() -> {
            if(closed || req.token != generation.get())return;
            if(!initialized || tts==null) {pending=req;return;}
            // Latest action wins; old celebration clips are pre-empted by newer priority.
            if(currentPriority > req.priority && currentUtterance != null)return;
            perform(req);
        });
    }

    private static String normalizeMood(String mood) {
        if(mood==null)return "encourage";
        switch(mood){
            case "calm":case "encourage":case "surprise":case "combo":
            case "celebrate":case "consolation":return mood;
            default:return "encourage";
        }
    }

    private static String safeClip(String path) {
        // Only bundled, explicit files; never a web URL or an absolute filesystem path.
        if (path==null || !path.matches("[a-z0-9_/-]{1,100}\\.ogg"))return "";
        if(path.contains("..") || path.startsWith("/") || !path.startsWith("voices/"))return "";
        return path;
    }

    private void perform(Request req) {
        currentPriority=req.priority;
        currentUtterance=Long.toString(req.token);
        stopAudio();
        if (!req.clip.isEmpty() && startClip(req))return;
        speakTts(req);
    }

    // Future resource packs can add pre-acted French emotions without touching game logic.
    private boolean startClip(Request req) {
        try {
            AssetFileDescriptor afd=context.getAssets().openFd("www/"+req.clip);
            MediaPlayer media=new MediaPlayer();
            media.setAudioAttributes(new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .setUsage(AudioAttributes.USAGE_GAME).build());
            media.setDataSource(afd.getFileDescriptor(),afd.getStartOffset(),afd.getLength());
            afd.close();
            media.setOnPreparedListener(mp -> {
                if(closed || req.token!=generation.get())return;
                mp.start();
            });
            media.setOnCompletionListener(mp -> worker.post(() -> {
                if(player==mp){releasePlayer();finish(req);}
            }));
            media.setOnErrorListener((mp,what,extra)->{
                worker.post(() -> {
                    if(player==mp && !closed) {
                        releasePlayer();
                        if(req.token==generation.get())speakTts(req);
                    }
                });
                return true;
            });
            player=media;
            media.prepareAsync();
            return true;
        }catch(Exception noBundledClip) {
            releasePlayer(); return false;
        }
    }

    private void speakTts(Request req) {
        if(tts==null || closed)return;
        float speed, pitch;
        switch(req.mood){
            case "calm": speed=.96f; pitch=.96f; break;
            case "surprise": speed=1.09f; pitch=1.13f; break;
            case "combo": speed=1.12f; pitch=1.17f; break;
            case "celebrate": speed=1.13f; pitch=1.21f; break;
            case "consolation": speed=.92f; pitch=.94f; break;
            default: speed=1.04f; pitch=1.05f; break;
        }
        tts.setPitch(Math.max(.75f,Math.min(1.50f,req.basePitch*pitch)));
        tts.setSpeechRate(speed);
        final int result=tts.speak(req.text,TextToSpeech.QUEUE_FLUSH,null,currentUtterance);
        if(result==TextToSpeech.ERROR)finish(req);
    }

    @Override public void onInit(int status) {
        worker.post(() -> {
            if(closed || tts==null)return;
            initialized=status==TextToSpeech.SUCCESS;
            if(!initialized)return;
            tts.setLanguage(Locale.FRANCE);
            try {
                Set<Voice> voices=tts.getVoices();
                if(voices!=null)for(Voice v:voices) {
                    if(v.getLocale()!=null && "fr".equals(v.getLocale().getLanguage())
                            && !v.isNetworkConnectionRequired()) {
                        tts.setVoice(v);break;
                    }
                }
            }catch(Exception ignored){}
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) {}
                @Override public void onDone(String id) {worker.post(()->finishId(id));}
                @Override public void onError(String id) {worker.post(()->finishId(id));}
            });
            Request req=pending;pending=null;
            if(req!=null && req.token==generation.get()) perform(req);
        });
    }

    private void finishId(String id) {
        if(currentUtterance!=null && currentUtterance.equals(id)) {
            currentPriority=0;currentUtterance=null;
        }
    }
    private void finish(Request req) {finishId(Long.toString(req.token));}
    private void stopAudio() {
        if(tts!=null)try{tts.stop();}catch(Exception ignored){}
        releasePlayer();
    }
    private void releasePlayer(){
        if(player!=null){try{player.release();}catch(Exception ignored){}player=null;}
    }
    public void stop() {
        generation.incrementAndGet();
        worker.post(() -> {
            pending=null;currentPriority=0;currentUtterance=null;
            stopAudio();
        });
    }
    public void close(){
        if(closed)return;
        closed=true;generation.incrementAndGet();
        worker.post(() -> {
            pending=null;
            stopAudio();
            if(tts!=null){tts.shutdown();tts=null;}
            thread.quitSafely();
        });
    }
}
