import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";

export function useLoginMethods(
  { password, mail, toLogin, store, router },
  setToast
) {
  /**
   * Changes the mode : login < > register
   */
  const swapMode = () => {
    password.value = "";
    mail.value = "";
    toLogin.value = !toLogin.value;
  };

  /**
   * Creates an account thanks to an email and a password
   *
   * Creates a instance of the new user in the database
   */
  const register = async () => {
    const auth = getAuth();
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        mail.value,
        password.value
      );
      await store.dispatch("createUserWithEmail", {
        db: store.state.database,
        user: credentials.user,
      });
      router.push({ name: "agenda" });
    } catch (error) {
      setToast({ message: "Erreur lors de l'inscription", color: "danger" });
      console.error(error);
    }
  };

  /**
   * Logs the user into the app thanks to an email and a password
   */
  const authPassword = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, mail.value, password.value);
      router.push({ name: "agenda" });
    } catch (error) {
      setToast({ message: "Erreur de connexion", color: "danger" });
      console.error(error);
    }
  };

  /**
   * Logs the user into the app as an anonymous
   */
  const authAnonymous = async () => {
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
      router.push({ name: "agenda" });
    } catch (error) {
      setToast({ message: "Erreur de connexion", color: "danger" });
      console.error(error);
    }
  };

  /**
   * Logs the user into the app with Google
   *
   * Creates an account if the user doesn't exist
   */
  const authWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push({ name: "agenda" });

      // create user if it doesn't exist
      const user = await store.dispatch("getUser", {
        db: store.state.database,
        id: auth.currentUser.uid,
      });
      if (!user) {
        await store.dispatch("createUserWithGoogle", {
          db: store.state.database,
          user: auth.currentUser,
        });
      }
    } catch (e) {
      setToast({ message: e.message, color: "danger" });
      const errorCode = e.code;
      const errorMessage = e.message;
      const email = e.email;
      const credential = GoogleAuthProvider.credentialFromError(e);
      console.error(
        `error code : ${errorCode}\nmessage : ${errorMessage}\nmail: ${email}\n credential: ${credential}`
      );
    }
  };

  return {
    swapMode,
    authWithGoogle,
    authAnonymous,
    authPassword,
    register,
  };
}
