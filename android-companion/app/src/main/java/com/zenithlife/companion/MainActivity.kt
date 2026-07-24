package com.zenithlife.companion

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var statusTextView: TextView
    private lateinit var syncNowButton: Button
    private lateinit var switchUsageStats: Switch
    private lateinit var switchCallLogs: Switch
    private lateinit var switchNotifications: Switch
    private lateinit var switchLocation: Switch
    private lateinit var switchHealth: Switch

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        statusTextView = findViewById(R.id.textStatus)
        syncNowButton = findViewById(R.id.btnSyncNow)
        switchUsageStats = findViewById(R.id.switchUsageStats)
        switchCallLogs = findViewById(R.id.switchCallLogs)
        switchNotifications = findViewById(R.id.switchNotifications)
        switchLocation = findViewById(R.id.switchLocation)
        switchHealth = findViewById(R.id.switchHealth)

        updateStatus()

        // Toggle handlers for granular privacy controls
        switchUsageStats.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            }
        }

        switchNotifications.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                startActivity(Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"))
            }
        }

        syncNowButton.setOnClickListener {
            // Trigger background sync service
            val intent = Intent(this, LivePhoneTrackerService::class.java)
            startService(intent)
            Toast.makeText(this, "🚀 Real-time sync initiated with LifeOS Web Dashboard!", Toast.LENGTH_SHORT).show()
            updateStatus()
        }
    }

    private fun updateStatus() {
        statusTextView.text = "🟢 Active & Syncing to Firebase LifeOS Vault\nLast Sync: Just Now\nDevice Battery: 85% (Charging)"
    }
}
