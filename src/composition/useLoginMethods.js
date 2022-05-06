import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInAnonymously,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export function useLoginMethods(
  { password, mail, toLogin, store, router },
  setToast
) {
  const swapMode = () => {
    password.value = "";
    mail.value = "";
    toLogin.value = !toLogin.value;
  };

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
      router.push({ name: "tabs" });
    } catch (e) {
      setToast({
        message: e.message,
        color: "error",
      });
    }
  };

  const authPassword = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, mail.value, password.value);

      router.push({ name: "tabs" });
    } catch (error) {
      setToast({ message: "Echec de la connexion", color: "danger" });
      console.error(error);
    }
  };

  const authAnonymous = async () => {
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
      router.push({ name: "tabs" });
    } catch (error) {
      setToast({ message: error, color: "danger" });
    }
  };

  const authMobile = async () => {
    const auth = getAuth();
    const credential = new GoogleAuthProvider();
    console.log(auth);
    console.log(credential);
    try {
      await signInWithCredential(auth);
      router.push({ name: "tabs" });
    } catch (error) {
      setToast({ message: error, color: "danger" });
    }
  };

  const authWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      await signInWithPopup(auth, provider);
      router.push({ name: "tabs" });

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
    authMobile,
    authPassword,
    register,
  };
}
