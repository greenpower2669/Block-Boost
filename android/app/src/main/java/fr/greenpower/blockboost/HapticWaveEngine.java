package fr.greenpower.blockboost;

import android.content.Context;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Process;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;

/**
 * Android 8+ haptic engine. Vibration runs on a separate HandlerThread; a
 * bounded, repeating waveform grows as a clearing position approaches.
 *
 * Safety: honor system and game settings, cap power, stop on lost heartbeat
 * within 750ms, and cancel immediately on release/pause/destruction.
 */
public final class HapticWaveEngine {
    private final Context context;
    private final HandlerThread thread;
    private final Handler worker;
    private final Vibrator vibrator;
    private volatile boolean closed = false;
    private int level = 0;
    private long heartbeatAt = 0;
    private long rewardUntil = 0;

    HapticWaveEngine(Context appContext) {
        context=appContext.getApplicationContext();
        vibrator=(Vibrator)context.getSystemService(Context.VIBRATOR_SERVICE);
        thread=new HandlerThread("BlockBoostHaptic",Process.THREAD_PRIORITY_DEFAULT);
        thread.start();
        worker=new Handler(thread.getLooper());
        worker.post(new Runnable() {
            @Override public void run() {
                if(closed)return;
                if(level!=0 && SystemClock.uptimeMillis()-heartbeatAt>750) {
                    cancelNow();level=0;
                }
                worker.postDelayed(this,220);
            }
        });
    }

    private boolean allowed() {
        if(closed||vibrator==null||!vibrator.hasVibrator())return false;
        try {
            return Settings.System.getInt(context.getContentResolver(),
                Settings.System.HAPTIC_FEEDBACK_ENABLED,1)!=0;
        }catch(Exception ignored){return true;}
    }

    public void guide(int requestedLevel) {
        if(closed)return;
        final int desired=Math.max(0,Math.min(6,requestedLevel));
        worker.post(() -> {
            if(closed)return;
            heartbeatAt=SystemClock.uptimeMillis();
            if(desired==0) {
                if(level!=0)cancelNow();
                level=0;
                return;
            }
            if(!allowed()) {
                cancelNow();level=0;return;
            }
            if(heartbeatAt < rewardUntil) return; // don't interrupt placement celebration
            if(level==desired)return; // heartbeat: no restarting waveform
            cancelNow();
            level=desired;
            // Six bounded levels: richer line+combo rewards can intensify final approach.
            // Caps protect comfort and battery; hardware may not control amplitude.
            int[] amplitudes={0,42,76,105,139,172,202};
            long[] pulses={0,45,55,65,80,100,125};
            long[] rests={0,310,230,175,120,82,65};
            int amp=vibrator.hasAmplitudeControl()?amplitudes[level]:VibrationEffect.DEFAULT_AMPLITUDE;
            try{
                vibrator.vibrate(VibrationEffect.createWaveform(
                    new long[]{0,pulses[level],rests[level]},new int[]{0,amp,0},0));
            }catch(RuntimeException failure){level=0;cancelNow();}
        });
    }

    public void celebrate(String kind) {
        if(closed||kind==null)return;
        final String which=kind;
        worker.post(() -> {
            if(!allowed())return;
            long[] durations;
            int[] volumes;
            switch(which) {
                case "comboCascade":
                    durations=new long[]{0,75,40,85,40,110,40,140};
                    volumes=new int[]{0,125,0,150,0,175,0,205};break;
                case "comboDouble":
                    durations=new long[]{0,65,48,85,48,120};
                    volumes=new int[]{0,120,0,160,0,192};break;
                case "lineCascade":
                    durations=new long[]{0,70,40,95,40,130};
                    volumes=new int[]{0,120,0,155,0,195};break;
                case "lineDouble":
                    durations=new long[]{0,65,55,125};
                    volumes=new int[]{0,125,0,195};break;
                case "comboBonus": durations=new long[]{0,75,45,85,45,115};volumes=new int[]{0,130,0,165,0,205};break;
                case "combo": durations=new long[]{0,65,65,85,55,95};volumes=new int[]{0,110,0,145,0,190};break;
                case "lineBonus": durations=new long[]{0,65,55,115};volumes=new int[]{0,130,0,190};break;
                case "line": durations=new long[]{0,65,55,85};volumes=new int[]{0,100,0,160};break;
                case "speedExtra": durations=new long[]{0,45,50,70,50,95};volumes=new int[]{0,105,0,145,0,190};break;
                case "speedHigh": durations=new long[]{0,60,60,90};volumes=new int[]{0,115,0,175};break;
                case "speed": durations=new long[]{0,50,55,60};volumes=new int[]{0,85,0,145};break;
                case "extra": durations=new long[]{0,45,75,75};volumes=new int[]{0,95,0,155};break;
                case "drop": durations=new long[]{0,38};volumes=new int[]{0,85};break;
                default:return;
            }
            cancelNow();
            level=0;
            int[] amps=volumes.clone();
            if(!vibrator.hasAmplitudeControl())for(int i=0;i<amps.length;i++)
                if(amps[i]>0)amps[i]=VibrationEffect.DEFAULT_AMPLITUDE;
            long duration=0;for(long t:durations)duration+=t;
            rewardUntil=SystemClock.uptimeMillis()+duration+120;
            try {
                vibrator.vibrate(VibrationEffect.createWaveform(durations,amps,-1));
            }catch(RuntimeException ignored){}
        });
    }

    public void stop() {
        if(closed)return;
        worker.post(() -> {cancelNow();level=0;rewardUntil=0;});
    }

    public void close() {
        if(closed)return;
        closed=true;
        worker.post(() -> {
            cancelNow();level=0;
            thread.quitSafely();
        });
    }

    private void cancelNow() {
        try{if(vibrator!=null)vibrator.cancel();}catch(RuntimeException ignored){}
    }
}
