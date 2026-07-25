package com.zenithlife.app.auth

import com.google.firebase.firestore.IgnoreExtraProperties
import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

@IgnoreExtraProperties
data class UserModel(
    val uid: String = "",
    val fullName: String = "",
    val email: String = "",
    val phoneNumber: String = "",
    val profilePhoto: String = "",
    val userType: String = "Customer", // Customer | Owner | Admin
    val isVerified: Boolean = false,
    val accountStatus: String = "active", // active | blocked | suspended
    val createdAt: Long = System.currentTimeMillis(),
    val lastLogin: Long = System.currentTimeMillis(),
    val deviceId: String = "",
    val notificationToken: String = "",
    val language: String = "en",
    val address: String = "",
    val state: String = "",
    val city: String = ""
)
