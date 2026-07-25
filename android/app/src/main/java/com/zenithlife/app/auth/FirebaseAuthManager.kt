package com.zenithlife.app.auth

import android.app.Activity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import java.util.concurrent.TimeUnit

class FirebaseAuthManager private constructor() {

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    companion object {
        @Volatile
        private var instance: FirebaseAuthManager? = null

        fun getInstance(): FirebaseAuthManager {
            return instance ?: synchronized(this) {
                instance ?: FirebaseAuthManager().also { instance = it }
            }
        }
    }

    val currentUser: FirebaseUser?
        get() = auth.currentUser

    // 1. Auto Login Check & Profile Retrieval
    fun checkAutoLogin(onResult: (isLoggedIn: Boolean, userModel: UserModel?) -> Unit) {
        val user = auth.currentUser
        if (user != null) {
            firestore.collection("Users").document(user.uid).get()
                .addOnSuccessListener { doc ->
                    if (doc != null && doc.exists()) {
                        val model = doc.toObject(UserModel::class.java)
                        if (model?.accountStatus == "blocked") {
                            auth.signOut()
                            onResult(false, null)
                        } else {
                            // Update last login timestamp
                            firestore.collection("Users").document(user.uid)
                                .update("lastLogin", System.currentTimeMillis())
                            onResult(true, model)
                        }
                    } else {
                        onResult(true, null) // Needs profile creation
                    }
                }
                .addOnFailureListener {
                    onResult(true, null)
                }
        } else {
            onResult(false, null)
        }
    }

    // 2. Phone OTP Verification
    fun sendPhoneOtp(
        phoneNumber: String,
        activity: Activity,
        callbacks: PhoneAuthProvider.OnVerificationStateChangedCallbacks
    ) {
        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(activity)
            .setCallbacks(callbacks)
            .build()
        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    fun verifyPhoneOtpCredential(
        credential: PhoneAuthCredential,
        onResult: (success: Boolean, isNewUser: Boolean, errorMsg: String?) -> Unit
    ) {
        auth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val user = auth.currentUser
                    val isNewUser = task.result?.additionalUserInfo?.isNewUser ?: false
                    if (user != null && isNewUser) {
                        val newModel = UserModel(
                            uid = user.uid,
                            phoneNumber = user.phoneNumber ?: "",
                            isVerified = true
                        )
                        saveProfileToFirestore(newModel) {
                            onResult(true, true, null)
                        }
                    } else {
                        onResult(true, false, null)
                    }
                } else {
                    onResult(false, false, task.exception?.localizedMessage)
                }
            }
    }

    // 3. Google Token Verification
    fun signInWithGoogleToken(
        idToken: String,
        onResult: (success: Boolean, isNewUser: Boolean, errorMsg: String?) -> Unit
    ) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val user = auth.currentUser
                    val isNewUser = task.result?.additionalUserInfo?.isNewUser ?: false
                    if (user != null && isNewUser) {
                        val newModel = UserModel(
                            uid = user.uid,
                            fullName = user.displayName ?: "",
                            email = user.email ?: "",
                            profilePhoto = user.photoUrl?.toString() ?: "",
                            isVerified = true
                        )
                        saveProfileToFirestore(newModel) {
                            onResult(true, true, null)
                        }
                    } else {
                        onResult(true, false, null)
                    }
                } else {
                    onResult(false, false, task.exception?.localizedMessage)
                }
            }
    }

    // 4. Email & Password Login
    fun signInWithEmail(
        email: String,
        pass: String,
        onResult: (success: Boolean, errorMsg: String?) -> Unit
    ) {
        auth.signInWithEmailAndPassword(email, pass)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    onResult(true, null)
                } else {
                    onResult(false, task.exception?.localizedMessage)
                }
            }
    }

    // 5. Email & Password Signup
    fun signUpWithEmail(
        email: String,
        pass: String,
        fullName: String,
        onResult: (success: Boolean, errorMsg: String?) -> Unit
    ) {
        auth.createUserWithEmailAndPassword(email, pass)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val user = auth.currentUser
                    user?.sendEmailVerification()
                    if (user != null) {
                        val newModel = UserModel(
                            uid = user.uid,
                            fullName = fullName,
                            email = email,
                            isVerified = false
                        )
                        saveProfileToFirestore(newModel) {
                            onResult(true, null)
                        }
                    }
                } else {
                    onResult(false, task.exception?.localizedMessage)
                }
            }
    }

    // 6. Forgot Password Email Reset
    fun sendForgotPasswordEmail(
        email: String,
        onResult: (success: Boolean, errorMsg: String?) -> Unit
    ) {
        auth.sendPasswordResetEmail(email)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    onResult(true, null)
                } else {
                    onResult(false, task.exception?.localizedMessage)
                }
            }
    }

    // 7. Save / Update User Profile in Firestore
    fun saveProfileToFirestore(
        userModel: UserModel,
        onResult: (success: Boolean) -> Unit
    ) {
        val uid = userModel.uid.ifEmpty { auth.currentUser?.uid ?: return }
        firestore.collection("Users").document(uid)
            .set(userModel)
            .addOnSuccessListener { onResult(true) }
            .addOnFailureListener { onResult(false) }
    }

    // 8. Change Email Address
    fun updateEmail(newEmail: String, onResult: (success: Boolean, errorMsg: String?) -> Unit) {
        auth.currentUser?.updateEmail(newEmail)
            ?.addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val uid = auth.currentUser?.uid ?: ""
                    firestore.collection("Users").document(uid).update("email", newEmail)
                    onResult(true, null)
                } else {
                    onResult(false, task.exception?.localizedMessage)
                }
            }
    }

    // 9. Logout
    fun logout() {
        auth.signOut()
    }

    // 10. Delete Account
    fun deleteAccount(onResult: (success: Boolean) -> Unit) {
        val user = auth.currentUser
        val uid = user?.uid ?: ""
        if (uid.isNotEmpty()) {
            firestore.collection("Users").document(uid).delete()
            user.delete().addOnCompleteListener { task ->
                onResult(task.isSuccessful)
            }
        }
    }
}
