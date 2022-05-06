import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";

export function useLoginMethods(
  { password, cPassword, mail, toLogin, store, router },
  setToast
) {
  const swapMode = () => {
    password.value = "";
    cPassword.value = "";
    mail.value = "";
    toLogin.value = !toLogin.value;
  };

  const authAnonymous = async () => {
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
      router.push({ name: "tabs" });
    } catch (error) {
      setToast(error.message);
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
      const errorCode = e.code;
      const errorMessage = e.message;
      const email = e.email;
      const credential = GoogleAuthProvider.credentialFromError(e);
      console.error(
        `error code : ${errorCode}\nmessage : ${errorMessage}\nmail: ${email}\n credential: ${credential}`
      );
    }
  };

  return { swapMode, authWithGoogle, authAnonymous };
}
