/**
 * UI theme for toast
 * @typedef {("danger" | "success" | "info" | "warning" | "primary")} ToastVariant
 */

/**
 * @returns {HTMLElement} the sample toast element to clone from
 */
const querySampleToastElement = () => document.getElementById('sample-toast');
/**
 * @returns {HTMLElement} the container for all stacking toast elements
 */
const queryToastContainerElement = () => document.getElementById('toast-container');

/**
 * Make a new empty toast element from the sample toast element
 *
 * @returns {HTMLElement} an empty toast element
 */
const cloneDummyToastElement = () => {
  // get the sample toast
  const sampleToastElement = querySampleToastElement();

  // clone from the sample
  const clonnedToastElement = sampleToastElement.cloneNode(true);
  clonnedToastElement.removeAttribute('id');
  clonnedToastElement.removeAttribute('aria-hidden');

  // return the new toast element
  return clonnedToastElement;
};

/**
 * Create a toast element and modify the content
 *
 * @param {string} message to display
 * @param {ToastVariant} variant for toast UI theme
 * @returns {HTMLElement} styled toast element with custom message
 */
const createToastElement = (message, variant) => {
  // Craete an empty toast
  const toastElement = cloneDummyToastElement();

  // populate the new empty toaste
  const toastBodyElement = toastElement.querySelector('.toast-body');
  toastBodyElement.innerHTML = message;
  toastElement.classList.add(`bg-${variant}`, 'text-white');

  return toastElement;
};

/**
 * Show a toast with custom message to users
 *
 * @param {string} message to display
 * @param {ToastVariant} [variant] for toast UI theme. Default is `info`
 * @param {any} [options] bootstrap toast options. See {@link https://getbootstrap.com/docs/5.0/components/toasts/#options}
 * @returns {any} an instance of BootStrap Toast. See {@link https://getbootstrap.com/docs/5.0/components/toasts/#methods}
 */
const showToast = (message, variant = 'info', options) => {
  // Create a new toast element
  const toastElement = createToastElement(message, variant);
  const toastContainerElement = queryToastContainerElement();
  toastContainerElement.appendChild(toastElement);

  // Remove the toast from DOM after displaying
  toastElement.addEventListener('hidden.bs.toast', (ev) =>
    toastContainerElement.removeChild(ev.currentTarget)
  );

  // Display the toast
  // eslint-disable-next-line no-undef
  const bsToast = new bootstrap.Toast(toastElement, options);
  bsToast.show();
  return bsToast;
};

export default showToast;
