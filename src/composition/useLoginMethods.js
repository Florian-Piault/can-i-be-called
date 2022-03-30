import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

export function useLoginMethods(
  { password, cPassword, mail, toLogin, store, router },
  setToast
) {
  // a changer
  const checkLoginFields = () => {
    return mail.value && password.value;
  };
  // a changer
  const checkRegisterFields = () => {
    return password.value === cPassword.value;
  };

  const swapMode = () => {
    password.value = "";
    cPassword.value = "";
    mail.value = "";
    toLogin.value = !toLogin.value;
  };

  const onSubmit = mode => {
    if (mode === "register") {
      if (!checkRegisterFields()) return setToast("register failed");
      return setToast("register OK");
    }
    if (!checkLoginFields) return setToast("login failed");
    return setToast("login OK");
  };

  const authWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      store.state.user = result.user;
      store.commit("setAuthentication", true);
      router.push({ name: "tabs" });
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

  return { swapMode, onSubmit, authWithGoogle };
}
