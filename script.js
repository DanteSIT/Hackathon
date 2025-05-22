// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
// Import getAuth, the functions for creating users, signing in, and the state listener
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// *** Import the Realtime Database functions: getDatabase, ref, and set ***
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
// Removed Firestore imports like collection and addDoc, as they are for Firestore.

const firebaseConfig = {

    apiKey: "AIzaSyC42b8Vqjq7FcXVEybF5CpYDVp5MjWO8T0",

    authDomain: "hackathon2025-40af0.firebaseapp.com",

    databaseURL: "https://hackathon2025-40af0-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "hackathon2025-40af0",

    storageBucket: "hackathon2025-40af0.firebasestorage.app",

    messagingSenderId: "870888203476",

    appId: "1:870888203476:web:c111521e765865259d4741"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get the Auth service instance
const auth = getAuth(app);
// *** Get the Realtime Database service instance! ***
const database = getDatabase(app); // Use 'database' as a common variable name for the RTDB instance

// --- Authentication State Listener ---
onAuthStateChanged(auth, (user) => {
    const authMessageElement = $("#auth-message");
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        authMessageElement.text(`Welcome, ${user.email}!`);
    } else {
        // User is signed out
        console.log("No user is signed in.");
        authMessageElement.text("No user signed in.");
    }

    // Use .text() to avoid duplicate info
    $("#user_id").text(user ? "User ID: " + user.uid : "");
    $("#user_email").text(user ? "User Email: " + user.email : "");
});

// --- Signup Button Handler ---
$("#singup").click(function () {
    const f_name = $("#firstname").val();
    const surname = $("#surname").val();
    const email = $("#email").val();
    const mb_number = $("#mobile_num").val();
    const nin_pass = $("#nin_passport").val(); // Fixed selector
    const dob = $("#date_of_birth").val();
    const add = $("#address").val();
    const password = $("#password").val();
    const password_vf = $("#password_vf").val();

    $("#auth-message").text("Attempting to create user...");
    handleSignUp(email, password, {
        firstname: f_name,
        surname: surname,
        mobile: mb_number,
        nin_passport: nin_pass,
        date_of_birth: dob,
        address: add
    });
});

// --- Authentication Functions ---

// Function to handle user sign-up with Email and Password
function handleSignUp(email, password, extraFields = {}) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("New user created:", user.email, user.uid);
            $("#auth-message").text("User created successfully!");

            // Save all user info to the database
            set(ref(database, 'users/' + user.uid), {
                email: user.email,
                id: user.uid,
                createdAt: Date.now(),
                ...extraFields
            })
                .then(() => {
                    console.log("User data saved to Realtime Database!");
                })
                .catch((rtdbError) => {
                    console.error("Error saving user data to Realtime Database:", rtdbError);
                    $("#auth-message").append("<br>Warning: Could not save user data to database. Check your Realtime Database rules.");
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error signing up: ${errorCode} - ${errorMessage}`);

            let userFriendlyMessage = "An error occurred during signup.";
            if (errorCode === 'auth/weak-password') {
                userFriendlyMessage = 'Password is too weak (at least 6 characters).';
            } else if (errorCode === 'auth/email-already-in-use') {
                userFriendlyMessage = 'This email address is already registered.';
            } else if (errorCode === 'auth/invalid-email') {
                userFriendlyMessage = 'Please enter a valid email address.';
            } else if (errorCode === 'auth/argument-error') {
                userFriendlyMessage = 'Please enter both an email and a password.';
            } else {
                userFriendlyMessage = `An unexpected error occurred: ${errorCode}`;
                console.error("Signup full error:", error);
            }

            $("#auth-message").text(`Signup Error: ${userFriendlyMessage}`);
        });
}


  /* RF 
     Name - firstname
     Surname - surname
     Email Address - email
     Mobile Number - mobile_num
     NIN/Passport Number - nin_passport
     Date of Birth - date_of_birth
     Address - address

     msgroup.uid
    */


