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

var name = $("name").val();
// --- Authentication State Listener ---
// This listener checks the auth state when the page loads and whenever it changes

onAuthStateChanged(auth, (user) => {
    const authMessageElement = $("#auth-message");
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        authMessageElement.text(`Welcome, ${user.email}!`);
        // TODO: Update your UI here, e.g., hide the login form, show user content
        // Example: $(".container form").hide();
    } else {
        // User is signed out
        console.log("No user is signed in.");
        authMessageElement.text("No user signed in.");
        // TODO: Update your UI here, e.g., show the login form, hide user content
        // Example: $(".container form").show();
    }

    $("#user_id").append("User ID :" + user.uid);
    $("#user_email").append("User Email: " + user.email);
});

// Using the button IDs from your HTML (#singup, #login)
$("#singup").click(function () { // Matched the ID exactly from your HTML

    const f_name = $("#firstname").val();
    const surname = $("#surname").val();
    const email = $("#email").val();
    const mb_number = $("#mobile_num").val();
    const nin_pass = $().val("#nin_passport");
    const dob = $("#date_of_birth").val();
    const add = $("#address").val();

    //create a vf 
    const password = $("#password").val();
    const password_vf = $("#password_vf").val();

    $("#auth-message").text("Attempting to create user...");
    handleSignUp(email, password); // Call the signup function\]


});

$("#login").click(function () {
    const email = $("#email").val();
    const password = $("#password").val();
    $("#auth-message").text("Attempting to login...");
    handleSignIn(email, password); // Call the sign-in function
});

// --- Authentication Functions ---

// Function to handle user sign-in with Email and Password
function handleSignIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully!
            const user = userCredential.user;
            console.log("User Signed In:", user.email);

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error signing in: ${errorCode} - ${errorMessage}`);

            // Display more helpful error messages for sign-in if its fucking works  - update it does 
            let userFriendlyMessage = "An error occurred during sign-in.";
            if (errorCode === 'auth/invalid-email') {
                userFriendlyMessage = 'Please enter a valid email address.';
            } else if (errorCode === 'auth/user-disabled') {
                userFriendlyMessage = 'This user account has been disabled.';
            } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                userFriendlyMessage = 'Invalid email or password.';
            } else if (errorCode === 'auth/argument-error') {
                userFriendlyMessage = 'Please enter both an email and a password.';
            } else {

                // Catch any other unexpected errors that I cant tell for shit 
                userFriendlyMessage = `An unexpected error occurred: ${errorCode}`;
                console.error("Sign-in full error:", error);
            }
            $("#auth-message").text(`Sign-in Error: ${userFriendlyMessage}`);
        });
}
// Function to handle user sign-up with Email and Password ... ya im not doing google sign-in
function handleSignUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            // User created and signed in successfully!
            const user = userCredential.user;
            console.log("New user created:", user.email, user.uid); //this is just to see if the user account was created 
            $("#auth-message").text("User created successfully!");

            //This just adds the user who created a new account and ueses thier user ID instead of a Username this can be changed later on. ?
            set(ref(database, 'users/' + user.uid), {
                email: user.email,
                id: user.uid,
                createdAt: Date.now(),
            })

            set(ref(database, 'msgroup/' + msgroup.uid, {

                ms_time: Date.now(),
                userid: username.username,


            }))
                .then(() => {
                    console.log("User data saved to Realtime Database!");
                }) //for any error again 
                .catch((rtdbError) => {
                    console.error("Error saving user data to Realtime Database:", rtdbError);
                    // This will likely be a permission denied error due to rules. but all thats to be done is update the rules in my firebse config
                    $("#auth-message").append("<br>Warning: Could not save user data to database. Check your Realtime Database rules.");
                });



        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error signing up: ${errorCode} - ${errorMessage}`);

            // Display more error messages for signup I hope ... I spent way to loong reading and not trying so now im in a look for googling for help
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
                // Catch any other unexpected errors AGAIN! - man Firebase is not as easy as I thought but that may just be my small brain and knowledge
                userFriendlyMessage = `An unexpected error occurred: ${errorCode}`;
                console.error("Signup full error:", error);
            }

            $("#auth-message").text(`Signup Error: ${userFriendlyMessage}`);
        });
}





//This is where all the variables for the options will go when I make them catch
// something like this catch

let product_name = $("pd_name").val(); //the name ofthe product - Text 
let produc_condition = $("pd_con").val(); //the condition - Radio 
let prodict_description = $("pd_des").val(); // Short description about the product - Text
let product_price = $("pd_price").val(); //The price - Float or double?

//then we use this function 

//as for images thats something else I cant do unless I setup an online open file store connected to a cloud storage like googledrive
//and when they upload the image its goes straight to the cloud with an ID and when needed jut call it
//Since it will cost money to use Firebase Storage and I dont want to do that catch


/*
      function {something something ??}
      set(ref(database, 'market/' + user.uid), { //this will create a new folder where all products can be found that a user adds 
            product_name:,
            produc_condition:,
            prodict_description:,
            product_price:, 
          })
          .then(() => {
            console.log("User data saved to Realtime Database!");
          })
          .catch((rtdbError) => {
            console.error("Error saving user data to Realtime Database:", rtdbError);
            // This will likely be a permission denied error due to rules. but all thats to be done is update the rules in my firebse config
            $("#auth-message").append("<br>Warning: Could not save user data to database. Check your Realtime Database rules.");
          });
 
          its been a whole week and I forgot to work on this .... [13/05/25]
 
*/



  /* RF 
     Name - firstname
     Surname - surname
     Email Address - email
     Mobile Number - mobile_num
     NIN/Passport Number - nin_passport
     Date of Birth - date_of_birth
     Address - address
    */


