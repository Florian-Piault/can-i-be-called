export function useLoginMethods(
  { password, cPassword, mail, toLogin },
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

  return { swapMode, onSubmit };
}
