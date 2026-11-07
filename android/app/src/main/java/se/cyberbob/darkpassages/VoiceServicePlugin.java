package se.cyberbob.darkpassages;

import android.Manifest;
import android.content.Intent;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

/** JS bridge: VoiceService.start() / stop() controls the microphone foreground service. */
@CapacitorPlugin(
    name = "VoiceService",
    permissions = { @Permission(strings = { Manifest.permission.POST_NOTIFICATIONS }, alias = "notifications") }
)
public class VoiceServicePlugin extends Plugin {
    @PluginMethod
    public void start(PluginCall call) {
        Intent i = new Intent(getContext(), MicService.class);
        ContextCompat.startForegroundService(getContext(), i);
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().stopService(new Intent(getContext(), MicService.class));
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33) {
            requestPermissionForAlias("notifications", call, "notifCallback");
        } else {
            call.resolve(new JSObject());
        }
    }

    @com.getcapacitor.annotation.PermissionCallback
    private void notifCallback(PluginCall call) {
        call.resolve(new JSObject());
    }
}
