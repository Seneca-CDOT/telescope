/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* global localStorage, document, window */

import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.esm.js';

const authServer = 'http://localhost/v1/auth';
const frontEnd = 'http://localhost:8888/manual-auth/index.html';

function printToken(token) {
  const jwtElem = document.querySelector('#jwt');
  const decoded = jwtDecode(token);

  Object.entries(decoded).forEach(([key, value]) => {
    const li = document.createElement('li');
    li.innerHTML = `${key}: <span id="jwt-${key}">${value}</span>`;
    jwtElem.appendChild(li);
  });
}

window.onload = function () {
  const url = new URL(document.location);
  const params = url.searchParams;

  // Display any data we got back from the query string
  const accessToken = params.get('access_token');
  const state = params.get('state');
  document.querySelector('#access-token').innerHTML = accessToken;
  document.querySelector('#state').innerHTML = state;

  if (accessToken) {
    printToken(accessToken);
  }

  // Create and store a random state value
  const expectedState = nanoid();
  const previousState = localStorage.getItem('state');
  const expectedStateElem = document.querySelector('#expected-state');
  if (state === previousState) {
    expectedStateElem.innerHTML = `${previousState} (matches expected value)`;
  } else {
    expectedStateElem.innerHTML = `${previousState}`;
  }

  // Update the login/logout buttons
  const login = document.querySelector('#login');
  login.onclick = () => {
    localStorage.setItem('state', expectedState);
    window.location.href = `${authServer}/login?redirect_uri=${encodeURIComponent(
      frontEnd
    )}&state=${expectedState}`;
  };

  const logout = document.querySelector('#logout');
  logout.onclick = () => {
    localStorage.setItem('state', expectedState);
    window.location.href = `${authServer}/logout?redirect_uri=${encodeURIComponent(
      frontEnd
    )}&state=${expectedState}`;
  };
};
