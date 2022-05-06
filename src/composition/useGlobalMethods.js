import { toastController } from "@ionic/vue";

export function useGlobalMethods() {
  /**
   * Creates a toast component
   *
   * @param {string} message - What to show
   * @param {number} duration - How long to show
   * @param {string} color - What color *(primary, secondary, danger, warning...)*
   *
   * @default
   *  duration = 2000 ms
   *  color = primary
   *
   * @returns the instance of the toast
   */
  const setToast = async ({ message, duration = 2000, color = "primary" }) => {
    const toast = await toastController.create({
      message,
      duration,
      color,
    });
    return toast.present();
  };

  return { setToast };
}
