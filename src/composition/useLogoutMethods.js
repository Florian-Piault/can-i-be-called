import { getAuth, signOut } from "firebase/auth";

export function useLogoutMethods(store, router) {
  /**
   * Logs out the user
   */
  const logOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      store.commit("setAuthentication", null);
      router.push({ name: "login" });
    } catch (e) {
      console.error(e);
    }
  };

  return { logOut };
}
