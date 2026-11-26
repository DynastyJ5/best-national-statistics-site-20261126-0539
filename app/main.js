// DataNusa bootstrap: build the nav once, render the page for the current
// hash, re-render on every hash change. No network, no storage, no tracking.
import { render, navHtml } from './views.js';

document.getElementById('nav').innerHTML = navHtml();
window.addEventListener('hashchange', render);
render();
