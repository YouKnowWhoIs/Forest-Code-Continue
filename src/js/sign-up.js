import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  updateProfile,
} from 'firebase/auth';

const formContainer = document.querySelector('.Form-window');
const closeFormBtn = document.querySelector('.Close-form-btn');
const headerSignUp = document.querySelectorAll('.sign-up');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernamelInput = document.getElementById('username');
const signInButton = document.querySelector('.quickstart-sign-in');
const signUpButton = document.querySelector('.quickstart-sign-up');
const headerNav = document.querySelector('.header-nav');
const passwordResetButton = document.querySelector('.reset-btn');
const logOutBtn = document.querySelector('.log-out-btn');
const headerOutBtn = document.querySelector('.header-out-btn');
const burgMenu = document.querySelector('.burger-menu-list');
const mobNav = document.querySelector('.mob-header-nav');

const firebaseConfig = {
  apiKey: 'AIzaSyD8UvisVnkCvMijmf6q4ZtLkQgC43vz2KM',
  authDomain: 'dookshelf-357a4.firebaseapp.com',
  projectId: 'dookshelf-357a4',
  storageBucket: 'dookshelf-357a4.appspot.com',
  messagingSenderId: '957443484270',
  appId: '1:957443484270:web:de06245395594e6cf9947f',
  measurementId: 'G-PGZE6HZC47',
};
initializeApp(firebaseConfig);
const auth = getAuth();
window.onload = function () {
  onAuthStateChanged(auth, async user => {
    if (user) {
      formContainer.classList.remove('is-open');
      // headerNav.style.display = 'flex';
      // burgMenu.style.display = 'block';
      headerSignUp.forEach(el => (el.textContent = user.displayName));
      localStorage.setItem(
        'user-data',
        JSON.stringify({
          name: user.displayName,
          mail: user.email,
        })
      );
    } else {
      headerNav.style.display = 'none';
      formContainer.classList.remove('is-open');
      headerOutBtn.style.display = 'none';
      burgMenu.style.display = 'none';
    }
  });
};
// ========================================================================

headerSignUp.forEach(el => {
  el.addEventListener('click', function () {
    formContainer.classList.add('is-open');
    //
  });
});

closeFormBtn.addEventListener('click', function () {
  formContainer.classList.remove('is-open');
});
// =================================================
function toggleSignIn() {
  if (auth.currentUser) {
    signOut(auth).then(() => {
      handleSignOut();
      updateUI();
    });
  } else {
    const email = emailInput.value;
    const password = passwordInput.value;
    const name = usernamelInput.value;

    if (email.length < 4) {
      alert('Please enter an email address');
      return;
    }

    if (password.length < 4) {
      alert('Please enter a password with at least 4 characters');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        user.displayName = name;
        formContainer.classList.remove('is-open');
        headerNav.style.display = 'flex';
        burgMenu.style.display = 'block';
        headerSignUp.forEach(el => (el.textContent = user.displayName));
        iziToast.show({
          title: 'Hello',
          message: `Welcome, ${user.displayName}!`,
          color: 'blue',
          position: 'topCenter',
        });
        localStorage.setItem(
          'user-data',
          JSON.stringify({
            name: user.displayName,
            mail: user.email,
          })
        );
        user.getIdToken().then(token => {
          localStorage.setItem('userToken', token);
        });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password');
        } else {
          alert(errorMessage);
        }
        console.error(error);
      });
  }
}
// ===============================================
function handleSignUp() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const name = usernamelInput.value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Create user with email and pass.
  createUserWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      const user = userCredential.user;
      user.displayName = name;
      formContainer.classList.remove('is-open');
      headerNav.style.display = 'flex';
      burgMenu.style.display = 'block';
      headerSignUp.forEach(el => (el.textContent = user.displayName));
      await updateProfile(user, { displayName: user.displayName });
      iziToast.show({
        title: 'Ok',
        message: 'You have successfully registered!',
        color: 'blue',
        position: 'topCenter',
      });
      localStorage.setItem(
        'user-data',
        JSON.stringify({
          name: user.displayName,
          mail: user.email,
        })
      );
      user.getIdToken().then(token => {
        localStorage.setItem('userToken', token);
      });
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
}
// =========================================================================

function updateUI(user) {
  if (user) {
    // Відображення UI для автентифікованого користувача
    formContainer.classList.remove('is-open');
    // headerNav.style.display = 'flex';
    // burgMenu.style.display = 'block';
    headerSignUp.forEach(el => (el.textContent = user.displayName));
  } else {
    // Відображення UI для неавтентифікованого користувача
    headerNav.style.display = 'none';
    headerOutBtn.style.display = 'none';
    burgMenu.style.display = 'none';
    formContainer.classList.remove('is-open');
  }
}
// ========================================================================
function resetPassword() {
  const email = emailInput.value;
  sendPasswordResetEmail(auth, email)
    .then(function () {
      iziToast.show({
        message: 'Password reset email sent. Check your email',
        color: 'yellow',
        position: 'topCenter',
      });
    })
    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
    });
}
// ========================================================================
function handleSignOut() {
  if (auth.currentUser) {
    signOut(auth).then(() => {
      localStorage.removeItem('user-data'); // Очищення кешованих даних користувача
      localStorage.removeItem('userToken'); // Видалення токена після виходу
      headerOutBtn.style.display = 'none';
      // burgMenu.style.display = 'none';
      updateUI(); // Оновлення UI після виходу
    });
  }
}
// ========================================================================
signUpButton.addEventListener('click', function (event) {
  event.preventDefault();
  formContainer.classList.add('is-open');
  handleSignUp();
});

signInButton.addEventListener('click', function (event) {
  event.preventDefault();
  toggleSignIn();
});

passwordResetButton.addEventListener('click', function (event) {
  event.preventDefault();
  resetPassword();
});

logOutBtn.addEventListener('click', function (event) {
  event.preventDefault();
  handleSignOut();
});
headerOutBtn.addEventListener('click', function (event) {
  event.preventDefault();
  handleSignOut();
});
