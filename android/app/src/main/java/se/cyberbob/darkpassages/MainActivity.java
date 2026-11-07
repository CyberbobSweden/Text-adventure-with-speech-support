package se.cyberbob.darkpassages;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(VoiceServicePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
