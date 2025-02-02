/***************************************************************
 * content-script.js
 *
 * 1) Injects Montserrat so your snippet's styling remains consistent.
 * 2) Adds a bottom-right "Launch Gravitas" button.
 * 3) Opens a 700x600 popup (with an X to close).
 * 4) Calls `createGravitasSimulation()` to place your snippet
 *    inside that popup, no second click needed.
 ***************************************************************/

import { createGravitasSimulation } from './gravitas-simulation.js';

// Only run in top frame
if (window.top === window.self) {
  injectMontserratFont();
  createLauncherButton();
}

/** 
 * 1) Dynamically inject a link to Montserrat from Google Fonts
 *    so your snippet uses it (instead of the site's default).
 */
function injectMontserratFont() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
  document.head.appendChild(link);
}

/**
 * 2) Create a bottom-right "Launch Gravitas" button.
 */
function createLauncherButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Launch Gravitas';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 999999,
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'Montserrat, sans-serif',
  
    /* Add these lines: */
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  btn.addEventListener('click', () => {
    showGravitasPopup();
  });

  document.body.appendChild(btn);
}

/**
 * 3) Shows a popup exactly 700px wide x 600px tall.
 *    Then calls `createGravitasSimulation()` inside that popup,
 *    so your snippet is embedded within it.
 */
function showGravitasPopup() {
  // If popup already exists, just show it again
  let existing = document.getElementById('gravitas-popup-overlay');
  if (existing) {
    existing.style.display = 'block';
    return;
  }

  // Create a dark overlay
  const overlay = document.createElement('div');
  overlay.id = 'gravitas-popup-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  });

  // 700 x 600 white container
  const popup = document.createElement('div');
  popup.id = 'gravitas-popup-container';
  Object.assign(popup.style, {
    position: 'absolute',
    width: '1024px',
    height: '600px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    fontFamily: 'Montserrat, sans-serif'
  });

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
    zIndex: 99999999
  });
  closeBtn.addEventListener('click', () => {
    // Remove the entire overlay from DOM, stopping the simulation
    overlay.remove();
  });
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // 4) Insert your snippet inside `popup`.
  //    That ensures #simulation-container is physically within
  //    the 700x600 space, not the entire page.
  createGravitasSimulation(popup);
}
