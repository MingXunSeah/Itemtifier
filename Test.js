import {auth, authServices} from './firebase';

/* -----------------    Email and Password     ------------------ */
/**
 * Sign up a new user via {@param email} and {@param password}.
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

/**
 * Sign in with an existing {@param email} and {@param password}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

/**
 * Reset the password associated to an existing {@param email}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doPasswordReset = (email) =>
    auth.sendPasswordResetEmail(email);

/**
 * Change the password associated to the currently
 * signed in user with a new {@param password}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);

/**
 * @returns {boolean} {@code true} if the current authUser
 * has a verified email or  {@code false} otherwise.
 *
 * If the current authUser does not exist, i.e. is a guest,
 * the function defaults to {@code true}.
 */
export const isEmailVerified = () => {
    return !auth.currentUser || auth.currentUser.emailVerified;
};

/**
 * @returns {boolean} {@code true} if the {@param authUser}
 * has a verified email or {@code false} if not.
 *
 * If {@param authUser} does not exist, the user is assumed
 * to be a guest and defaults to {@code true}.
 */
export const isAuthUserEmailVerified = (authUser) => {
    return authUser.emailVerified;
};


/* -----------------     Google Sign In     ------------------ */
/**
 * Google Provider to enable sign in/ sign up with google
 * @type {firebase.auth.GoogleAuthProvider}
 */
const googleProvider = new authServices.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
// TODO(alex): Link to existing account instead of creating a new account for the user with the same email.
export const doSignInWithGoogle = () => auth.signInWithRedirect(googleProvider);

/* -----------------     Facebook Sign In     ------------------ */
/**
 * Facebook Provider to enable sign in/ sign up with facebook
 * @type {firebase.auth.FacebookAuthProvider}
 */
const facebookProvider = new authServices.FacebookAuthProvider();
facebookProvider.addScope('email');
// TODO(alex): Link to existing account instead of creating a new account for the user with the same email.
export const doSignInWithFacebook = () => auth.signInWithRedirect(facebookProvider);

/* -----------------     Auth Provider (Google/Facebook) post-signin     ------------------ */
/**
 * Response to be received on redirect from Google or Facebook sign in links
 * @return {!firebase.Promise<!firebase.auth.UserCredential>|Promise<firebase.auth.UserCredential>}
 */
export const doOnRedirectFromAuthProvider = () => auth.getRedirectResult();

/* -----------------    User State     ------------------ */
/**
 * Send a verification email for the {@code currentUser}
 */
export const doSendEmailVerification = () =>
    auth.currentUser.sendEmailVerification();

/**
 * Pass a controller {@param _function} to manage the authenticated
 * user object {@code auth.currentUser} every time something is
 * changed for the authenticated user.
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doOnAuthStateChanged = (_function) =>
    auth.onAuthStateChanged(_function);

/**
 * @returns {object} of the current user logged onto firebase.
 */
export const getCurrentUser = () =>
    auth.currentUser;

/**
 * @returns {string} UUID of the current user logged onto firebase.
 */
export const getCurrentUserUid = () =>
    auth.currentUser.uid;

/**
 * @returns {string} Display Name of the current user logged onto firebase.
 */
export const getCurrentUserDisplayName = () =>
    auth.currentUser.displayName;

/**
 * @returns {string} Email of the current user logged onto firebase.
 */
export const getCurrentUserEmail = () =>
    auth.currentUser.email;

/**
 * Sets the authentication state persistence mode to the following mode:
 *
 * LOCAL - (Default) Requires auth.signOut() to be manually called.
 *
 * @returns {firebase.Promise<void>|Promise<any>}
 *
 * For more information, visit
 * {@link https://firebase.google.com/docs/auth/web/auth-state-persistence}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doSetAuthLocalPersistence = () =>
    auth.setPersistence(authServices.Auth.Persistence.LOCAL);

/**
 * Sets the authentication state persistence mode to the following mode:
 *
 * SESSION - State will only persist in the current session or tab
 *          and will be cleared when the tab or window is closed.
 *
 * @returns {firebase.Promise<void>|Promise<any>}
 *
 * For more information, visit
 * {@link https://firebase.google.com/docs/auth/web/auth-state-persistence}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doSetAuthSessionPersistence = () =>
    auth.setPersistence(authServices.Auth.Persistence.SESSION);

/**
 * Sets the authentication state persistence mode to the following mode:
 *
 * NONE - State will only be stored in memory and any refresh
 *          will instantly clear the persisted auth state.
 *
 * @returns {firebase.Promise<void>|Promise<any>}
 *
 * For more information, visit
 * {@link https://firebase.google.com/docs/auth/web/auth-state-persistence}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doSetAuthNonePersistence = () =>
    auth.setPersistence(authServices.Auth.Persistence.NONE);

/**
 * Sign out any currently signed in user
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doSignOut = () =>
    auth.signOut();


/* -----------------    Other User Details     ------------------ */
/**
 * Change the basic profile information associated to the currently
 * signed in user with new {@param profileInformation}
 *
 * NOTE: Asynchronous promise call from firebase has to be handled.
 */
export const doUpdateProfile = (profileInformation) =>
    auth.currentUser.updateProfile(profileInformation);
