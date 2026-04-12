/* ============================================================
   EL TALLER — main.js
   Handles:
   - Grain overlay injection
   - Active nav link
   - Session cards (dynamic, from data/sessions.json)
   - Upcoming dates table (dynamic, from data/upcoming-dates.json)
   ============================================================ */

// ── Helpers ──────────────────────────────────────────────────

/** Resolve a path relative to the site root regardless of current page depth */
function rootPath(path) {
  // pages/ are one level deep; index.html is at root
  const depth = window.location.pathname.includes('/pages/') ? '../' : './';
  return depth + path;
}

/** Fetch JSON from the data folder */
async function fetchData(filename) {
  const res = await fetch(rootPath(`data/${filename}`));
  if (!res.ok) throw new Error(`Failed to load ${filename}`);
  return res.json();
}

/** Format a date string (YYYY-MM-DD) to human-readable */
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

// ── Grain overlay ─────────────────────────────────────────────
function injectGrain() {
  const div = document.createElement('div');
  div.className = 'grain-overlay';
  document.body.appendChild(div);
}

// ── Active nav link ───────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive =
      (path.endsWith('index.html') || path === '/' || path === '') && href.includes('index') ||
      path.includes('workshops') && href.includes('workshops') ||
      path.includes('studio') && href.includes('studio') ||
      path.includes('contact') && href.includes('contact') ||
      path.includes('gift') && href.includes('gift');
    if (isActive) link.classList.add('active');
  });
}

// ── Session Cards ─────────────────────────────────────────────

/**
 * Renders session cards into a container element.
 * @param {string} containerId   - ID of the target element
 * @param {object} opts
 * @param {number} opts.limit    - Max cards to render (0 = all)
 * @param {boolean} opts.filter  - Show filter buttons above grid
 */
async function renderSessionCards(containerId, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let sessions;
  try { sessions = await fetchData('sessions.json'); }
  catch (e) { container.innerHTML = '<p class="text-muted">Sessions unavailable.</p>'; return; }

  const { limit = 0, filter = false } = opts;
  const displayed = limit > 0 ? sessions.slice(0, limit) : sessions;

  if (filter) {
    const tags = ['All', ...new Set(sessions.map(s => s.tag))];
    const filterBar = document.createElement('div');
    filterBar.className = 'sessions-filter';
    filterBar.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:2.5rem;';
    tags.forEach((tag, i) => {
      const btn = document.createElement('button');
      btn.textContent = tag;
      btn.dataset.filter = tag;
      btn.style.cssText = `
        padding:.4rem 1.1rem;border-radius:9999px;border:1px solid rgba(218,193,184,0.4);
        font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
        cursor:pointer;transition:all .2s;
        background:${i === 0 ? 'var(--primary)' : 'transparent'};
        color:${i === 0 ? 'var(--on-primary)' : 'var(--secondary)'};
        font-family:var(--font-body);
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sessions-filter button').forEach(b => {
          b.style.background = 'transparent';
          b.style.color = 'var(--secondary)';
        });
        btn.style.background = 'var(--primary)';
        btn.style.color = 'var(--on-primary)';
        filterCards(tag === 'All' ? null : tag);
      });
      filterBar.appendChild(btn);
    });
    container.parentNode.insertBefore(filterBar, container);
  }

  const grid = document.createElement('div');
  grid.className = 'grid grid-3';
  grid.id = containerId + '-grid';
  container.appendChild(grid);

  sessions.forEach(session => {
    const card = buildSessionCard(session);
    card.dataset.tag = session.tag;
    grid.appendChild(card);
  });

  function filterCards(tag) {
    grid.querySelectorAll('[data-tag]').forEach(card => {
      card.style.display = (!tag || card.dataset.tag === tag) ? '' : 'none';
    });
  }
}

function buildSessionCard(s) {
  const isFeatured = s.featured;
  const card = document.createElement('div');
  card.className = `session-card${isFeatured ? ' featured' : ''}`;

  const imgSrc = rootPath(s.image);
  const btnClass = isFeatured ? 'on-primary' : 'on-surface';
  const btnText = s.price === 'POA' ? 'Enquire' : 'Book session';

  card.innerHTML = `
    <div class="session-card-image-wrap">
      <img class="session-card-image" src="${imgSrc}" alt="${s.imageAlt}" loading="lazy"
           onerror="this.style.background='var(--surface-container)';this.src='';">
      ${isFeatured ? '<span class="session-card-badge">Most popular</span>' : ''}
    </div>
    <div class="session-card-body">
      <span class="session-card-tag">${s.tag}</span>
      <h3 class="session-card-title">${s.name}</h3>
      <p class="session-card-desc">${s.shortDescription}</p>
      <div class="session-card-meta">
        <span>${s.duration}</span>
        <span>${s.groupSize}</span>
      </div>
      <div class="session-card-price">
        ${s.price} <span>${s.priceNote}</span>
      </div>
      <a href="${rootPath(s.bookUrl)}" class="session-card-btn ${btnClass}">${btnText}</a>
    </div>
  `;
  return card;
}

// ── Upcoming Dates ────────────────────────────────────────────

/**
 * Renders upcoming dates into a table or card list.
 * @param {string} containerId
 * @param {object} opts
 * @param {number} opts.limit   - Max rows (0 = all)
 * @param {string} opts.style   - 'table' | 'cards'
 */
async function renderUpcomingDates(containerId, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let dates;
  try { dates = await fetchData('upcoming-dates.json'); }
  catch (e) { container.innerHTML = '<p class="text-muted">Dates unavailable.</p>'; return; }

  const { limit = 0, style = 'table' } = opts;
  const today = new Date(); today.setHours(0,0,0,0);
  const future = dates.filter(d => new Date(d.date) >= today);
  const displayed = limit > 0 ? future.slice(0, limit) : future;

  if (displayed.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:2rem 0;">No upcoming sessions right now — check back soon.</p>';
    return;
  }

  if (style === 'table') {
    renderDatesTable(container, displayed);
  } else {
    renderDatesCards(container, displayed);
  }
}

function renderDatesTable(container, dates) {
  const table = document.createElement('table');
  table.className = 'dates-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Session</th>
        <th>Availability</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="dates-tbody"></tbody>
  `;
  container.appendChild(table);
  const tbody = table.querySelector('#dates-tbody');

  dates.forEach(d => {
    const soldOut = d.spotsLeft === 0;
    const pct = Math.round(((d.spotsTotal - d.spotsLeft) / d.spotsTotal) * 100);
    const tr = document.createElement('tr');
    tr.className = 'dates-row';
    tr.innerHTML = `
      <td><strong style="font-family:var(--font-serif)">${formatDate(d.date)}</strong></td>
      <td style="color:var(--on-surface-variant)">${d.time}</td>
      <td><span class="tag-pill">${d.sessionName}</span></td>
      <td>
        <div class="spots-bar">
          <div class="spots-bar-fill${soldOut ? ' full' : ''}" style="width:${pct}%"></div>
        </div>
        <div class="spots-text${soldOut ? ' sold-out' : ''}">
          ${soldOut ? 'Sold out' : `${d.spotsLeft} spot${d.spotsLeft !== 1 ? 's' : ''} left`}
        </div>
      </td>
      <td>
        ${soldOut
          ? '<span style="font-size:.8rem;color:var(--outline);">Fully booked</span>'
          : `<a href="${rootPath(d.bookUrl)}" class="btn-primary btn-sm" style="white-space:nowrap">Book →</a>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDatesCards(container, dates) {
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;';
  dates.forEach(d => {
    const soldOut = d.spotsLeft === 0;
    const card = document.createElement('div');
    card.style.cssText = `
      background:var(--surface-container-lowest);
      border-radius:var(--radius-lg);padding:1.25rem;
      border-bottom:3px solid ${soldOut ? 'var(--outline)' : 'var(--primary)'};
    `;
    card.innerHTML = `
      <div style="font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
                  color:var(--secondary);margin-bottom:.5rem;">${d.sessionName}</div>
      <div style="font-family:var(--font-serif);font-size:1.1rem;margin-bottom:.25rem;">${formatDate(d.date)}</div>
      <div style="font-size:.85rem;color:var(--on-surface-variant);margin-bottom:1rem;">${d.time}</div>
      <div style="font-size:.8rem;color:${soldOut ? 'var(--error)' : 'var(--on-surface-variant)'};margin-bottom:1rem;">
        ${soldOut ? 'Sold out' : `${d.spotsLeft} of ${d.spotsTotal} spots left`}
      </div>
      ${soldOut
        ? ''
        : `<a href="${rootPath(d.bookUrl)}" class="btn-primary btn-sm" style="width:100%;justify-content:center;text-decoration:none;">Book →</a>`
      }
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

// ── Book page: pre-fill from URL params ──────────────────────
function prefillBookingForm() {
  const params = new URLSearchParams(window.location.search);
  const sessionParam = params.get('session');
  const dateParam    = params.get('date');
  const timeParam    = params.get('time');

  if (sessionParam) {
    const sel = document.getElementById('booking-session');
    if (sel) {
      [...sel.options].forEach(opt => {
        if (opt.value === sessionParam) opt.selected = true;
      });
    }
  }
  if (dateParam) {
    const inp = document.getElementById('booking-date');
    if (inp) inp.value = dateParam;
  }
  if (timeParam) {
    const inp = document.getElementById('booking-time');
    if (inp) inp.value = timeParam.replace(/(\d{2})(\d{2})/, '$1:$2');
  }
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectGrain();
  setActiveNav();
  prefillBookingForm();
});

// Export for use in page-level inline scripts
window.ElTaller = { renderSessionCards, renderUpcomingDates };
