/**
 * UI theme for toast
 * @typedef {("danger" | "success" | "info" | "warning" | "primary")} ToastVariant
 */

/**
 * @returns {HTMLElement} the sample toast to clone from
 */
const querySampleToastEl = () => document.getElementById('sample-toast');
/**
 * @returns {HTMLElement} the container for all stacking toast elements
 */
const queryToastContainer = () => document.getElementById('toast-container');

/**
 * Make a new empty toast node from the sample toast node
 *
 * @returns {HTMLElement} an empty toast element
 */
const cloneDummyToastNode = () => {
  // get the sample toast
  const sampleToastEl = querySampleToastEl();

  // clone from the sample
  const clonnedToastEl = sampleToastEl.cloneNode(true);
  clonnedToastEl.removeAttribute('id');
  clonnedToastEl.removeAttribute('aria-hidden');

  // return the new toast element
  return clonnedToastEl;
};

/**
 * Create a toast element and modify the content
 *
 * @param {string} message to display
 * @param {ToastVariant} variant for toast UI theme
 * @returns {HTMLElement} styled toast element with custom message
 */
const createToastNode = (message, variant) => {
  // Craete an empty toast
  const toastNode = cloneDummyToastNode();

  // populate the new empty toaste
  const toastBodyEl = toastNode.querySelector('.toast-body');
  toastBodyEl.innerHTML = message;
  toastNode.classList.add(`bg-${variant}`, 'text-white');

  return toastNode;
};

/**
 * Show a toast with custom message to users
 *
 * @param {string} message to display
 * @param {ToastVariant} variant for toast UI theme
 * @param {any} [options] bootstrap toast options. See {@link https://getbootstrap.com/docs/5.0/components/toasts/#options}
 * @returns {any} an instance of BootStrap Toast. See {@link https://getbootstrap.com/docs/5.0/components/toasts/#methods}
 */
const enqueueToast = (message, variant, options) => {
  // Create a new toast element
  const toastNode = createToastNode(message, variant);
  const toastContainer = queryToastContainer();
  toastContainer.appendChild(toastNode);

  // Remove the toast from DOM after displaying
  toastNode.addEventListener('hidden.bs.toast', (ev) =>
    toastContainer.removeChild(ev.currentTarget)
  );

  // Display the toast
  // eslint-disable-next-line no-undef
  const bsToast = new bootstrap.Toast(toastNode, options);
  bsToast.show();
  return bsToast;
};

export default enqueueToast;
