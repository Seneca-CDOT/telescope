import showToast from '../utils/toast.js';
/* eslint-disable no-undef */
const theme = {
  background: '#252525',
  cursor: '#A0A0A0',
  foreground: '#A0A0A0',
  black: '#252525',
  blue: '#268BD2',
  brightBlack: '#505354',
  brightBlue: '#62ADE3',
  brightCyan: '#94D8E5',
  brightGreen: '#B7EB46',
  brightMagenta: '#BFA0FE',
  brightRed: '#FF5995',
  brightWhite: '#F8F8F2',
  brightYellow: '#FEED6C',
  cyan: '#56C2D6',
  green: '#82B414 ',
  magenta: '#8C54FE',
  red: '#F92672',
  white: '#CCCCC6',
  yellow: '#FD971F',
};
const terminal = new Terminal({
  cols: 80,
  rows: 30,
  convertEol: true,
  theme,
});

const fitAddon = new FitAddon.FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));
terminal.loadAddon(new WebLinksAddon.WebLinksAddon());
terminal.loadAddon(new WebglAddon.WebglAddon());
fitAddon.fit();

/**
 * @type {HTMLElement} reference to the button triggering copy terminal content
 */
const copyToClipboardButton = document.getElementById('copy-to-clipboard-button');

/**
 * Write all content from terminal to user' clipboard
 */
const copyToClipboard = async () => {
  // Check for terminal
  if (!terminal) {
    showToast('Terminal is not initialized', 'danger');
    return;
  }

  // extract content from terminal
  terminal.selectAll();
  const text = terminal.getSelection().trim();
  terminal.clearSelection();

  try {
    // write to clipboard
    await window.navigator.clipboard.writeText(text);
    showToast('Copy successfully', 'success');
  } catch (error) {
    console.error(error);
    showToast('Fail to copy', 'danger');
  }
};
copyToClipboardButton.addEventListener('click', () => copyToClipboard());

export default terminal;
