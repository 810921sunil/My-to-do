package com.zenithlife.app;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.os.BatteryManager;
import android.provider.CallLog;
import android.provider.Settings;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@CapacitorPlugin(name = "PhoneTracker")
public class PhoneTrackerPlugin extends Plugin {

    @PluginMethod
    public void getBatteryStatus(PluginCall call) {
        try {
            Context context = getContext();
            IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = context.registerReceiver(null, ifilter);

            int level = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) : -1;
            int scale = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1) : -1;
            float batteryPct = level / (float) scale * 100;

            int status = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1) : -1;
            boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL;

            JSObject ret = new JSObject();
            ret.put("level", Math.round(batteryPct));
            ret.put("isCharging", isCharging);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error fetching battery status: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getCallLogs(PluginCall call) {
        try {
            Context context = getContext();
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
                call.reject("Permission READ_CALL_LOG not granted");
                return;
            }

            ContentResolver cr = context.getContentResolver();
            Cursor cursor = cr.query(CallLog.Calls.CONTENT_URI, null, null, null, CallLog.Calls.DATE + " DESC LIMIT 15");

            JSArray callsArray = new JSArray();
            if (cursor != null && cursor.moveToFirst()) {
                int numberIdx = cursor.getColumnIndex(CallLog.Calls.NUMBER);
                int nameIdx = cursor.getColumnIndex(CallLog.Calls.CACHED_NAME);
                int typeIdx = cursor.getColumnIndex(CallLog.Calls.TYPE);
                int dateIdx = cursor.getColumnIndex(CallLog.Calls.DATE);
                int durationIdx = cursor.getColumnIndex(CallLog.Calls.DURATION);

                SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a", Locale.getDefault());

                do {
                    String number = cursor.getString(numberIdx);
                    String name = cursor.getString(nameIdx);
                    if (name == null || name.isEmpty()) name = number;
                    int typeCode = cursor.getInt(typeIdx);
                    long dateMs = cursor.getLong(dateIdx);
                    int durationSec = cursor.getInt(durationIdx);

                    String type = "incoming";
                    if (typeCode == CallLog.Calls.OUTGOING_TYPE) type = "outgoing";
                    else if (typeCode == CallLog.Calls.MISSED_TYPE) type = "missed";

                    String timeStr = formatter.format(new Date(dateMs));
                    String durationStr = (durationSec / 60) + "m " + (durationSec % 60) + "s";

                    JSObject callObj = new JSObject();
                    callObj.put("id", "call_" + dateMs);
                    callObj.put("name", name);
                    callObj.put("number", number);
                    callObj.put("type", type);
                    callObj.put("time", timeStr);
                    callObj.put("duration", durationStr);

                    callsArray.put(callObj);
                } while (cursor.moveToNext());
                cursor.close();
            }

            JSObject ret = new JSObject();
            ret.put("calls", callsArray);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error reading call logs: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openUsageAccessSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open Usage Access settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openNotificationAccessSettings(PluginCall call) {
        try {
            Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open Notification Access settings: " + e.getMessage());
        }
    }
}
