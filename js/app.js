// Tax bracket calculator
function calcBracketTax(income, brackets) {
  if (!brackets || brackets.length === 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (income <= 0) break;
    const taxable = Math.min(income, b.max) - prev;
    if (taxable > 0) tax += taxable * b.rate;
    prev = b.max === Infinity ? income : b.max;
    if (income <= b.max) break;
  }
  return Math.max(0, tax);
}

function calcTax(income, stateData, status) {
  const federal = calcBracketTax(income, DATA.federal.brackets[status]);
  let state = 0;
  if (stateData) {
    if (stateData.flat) {
      state = income * stateData.flat;
    } else {
      state = calcBracketTax(income, stateData.brackets[status]);
    }
  }
  return { federal, state };
}

function calcLocalTax(income, localData, status) {
  if (!localData) return 0;
  if (localData.flat) return income * localData.flat;
  return calcBracketTax(income, localData.brackets[status]);
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function fmtSmall(n) {
  if (n < 0.01) return '<$0.01';
  if (n < 1) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

const charts = {};

function buildDonut(canvasId, labels, data, colors, centerLabel) {
  if (charts[canvasId]) {
    charts[canvasId].destroy();
  }
  const ctx = document.getElementById(canvasId).getContext('2d');
  charts[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }]
    },
    options: {
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)} (${(ctx.raw / ctx.dataset.data.reduce((a,b)=>a+b,0)*100).toFixed(1)}%)`
          }
        }
      }
    },
    plugins: [{
      id: 'centerText',
      afterDraw(chart) {
        const { width, height, ctx } = chart;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = centerLabel.split('\n');
        const lineH = height / 8;
        lines.forEach((line, i) => {
          ctx.font = i === 0
            ? `bold ${Math.round(height / 9)}px system-ui`
            : `${Math.round(height / 14)}px system-ui`;
          ctx.fillStyle = i === 0 ? '#1a202c' : '#718096';
          ctx.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * lineH);
        });
        ctx.restore();
      }
    }]
  });
}

function buildLegend(containerId, items) {
  const el = document.getElementById(containerId);
  el.innerHTML = items.map(item => `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${item.color}"></span>
      <span class="legend-label">${item.label}</span>
      <span class="legend-amount">${fmtSmall(item.amount)}</span>
      <span class="legend-pct">${item.pct.toFixed(1)}%</span>
    </div>
  `).join('');
}

function renderFederal(income, status, taxPaid) {
  const share = taxPaid / DATA.federal.totalIncomeTaxRevenue;
  const totalSpend = DATA.federal.budget.reduce((s, c) => s + c.amount, 0);
  const items = DATA.federal.budget.map(cat => ({
    label: cat.label,
    color: cat.color,
    amount: share * cat.amount,
    pct: (cat.amount / totalSpend) * 100
  }));
  buildDonut('federal-chart',
    items.map(i => i.label),
    items.map(i => Math.max(i.amount, 0.01)),
    items.map(i => i.color),
    `${fmt(taxPaid)}\npaid in federal tax`
  );
  buildLegend('federal-legend', items);
  document.getElementById('federal-section').hidden = false;
}

function renderState(stateData, income, status, taxPaid) {
  const el = document.getElementById('state-section');
  if (!stateData || stateData.totalIncomeTaxRevenue === 0) {
    el.innerHTML = `
      <h2>State Taxes (${stateData?.name || ''})</h2>
      <div class="no-tax-card">
        <div class="no-tax-icon">🎉</div>
        <h3>${stateData?.name || 'Your state'} has no state income tax</h3>
        <p>State services are funded through sales taxes, property taxes, and other revenue sources.</p>
      </div>`;
    el.hidden = false;
    return;
  }
  const share = taxPaid / stateData.totalIncomeTaxRevenue;
  const total = stateData.budget.reduce((s, c) => s + c.pct, 0);
  const normalized = stateData.budget.map(c => ({ ...c, pct: c.pct / total }));
  const estimatedStateSpending = stateData.totalIncomeTaxRevenue * 4;
  const items = normalized.map(cat => ({
    label: cat.label,
    color: cat.color,
    amount: share * (cat.pct * estimatedStateSpending),
    pct: cat.pct * 100
  }));
  el.innerHTML = `
    <h2>State Taxes (${stateData.name})</h2>
    <div class="chart-wrapper"><canvas id="state-chart"></canvas></div>
    <div class="chart-legend" id="state-legend"></div>
  `;
  buildDonut('state-chart',
    items.map(i => i.label),
    items.map(i => Math.max(i.amount, 0.01)),
    items.map(i => i.color),
    `${fmt(taxPaid)}\npaid in state tax`
  );
  buildLegend('state-legend', items);
  el.hidden = false;
}

function renderLocal(localData, cityName, income, status, taxPaid) {
  const el = document.getElementById('local-section');
  document.getElementById('city-name').textContent = cityName;
  if (!localData || taxPaid === 0) { el.hidden = true; return; }
  const share = localData.totalIncomeTaxRevenue > 0 ? taxPaid / localData.totalIncomeTaxRevenue : 0;
  const total = localData.budget.reduce((s, c) => s + c.pct, 0);
  const normalized = localData.budget.map(c => ({ ...c, pct: c.pct / total }));
  const estimatedLocalSpending = localData.totalIncomeTaxRevenue * 2.5;
  const items = normalized.map(cat => ({
    label: cat.label,
    color: cat.color,
    amount: share * (cat.pct * estimatedLocalSpending),
    pct: cat.pct * 100
  }));
  buildDonut('local-chart',
    items.map(i => i.label),
    items.map(i => Math.max(i.amount, 0.01)),
    items.map(i => i.color),
    `${fmt(taxPaid)}\npaid in local tax`
  );
  buildLegend('local-legend', items);
  el.hidden = false;
}

function renderSummary(federal, state, local, locationStr) {
  const total = federal + state + local;
  const cards = [
    { label: 'Total Estimated Tax', amount: total, color: '#1a365d', sub: locationStr },
    { label: 'Federal Income Tax', amount: federal, color: '#3182ce', sub: 'to U.S. Treasury' },
    { label: 'State Income Tax', amount: state, color: '#38a169', sub: state === 0 ? 'No state income tax' : 'to state government' },
    ...(local > 0 ? [{ label: 'Local Income Tax', amount: local, color: '#805ad5', sub: 'to city/municipality' }] : [])
  ];
  document.getElementById('summary-cards').innerHTML = cards.map(c => `
    <div class="summary-card" style="border-top-color:${c.color}">
      <div class="summary-amount" style="color:${c.color}">${fmt(c.amount)}</div>
      <div class="summary-label">${c.label}</div>
      <div class="summary-sub">${c.sub}</div>
    </div>
  `).join('');
}

let currentState = null;
let currentCity = null;
let localData = null;

const zipInput = document.getElementById('zip');
const locationDisplay = document.getElementById('location-display');
let zipTimeout = null;

zipInput.addEventListener('input', () => {
  clearTimeout(zipTimeout);
  const val = zipInput.value.trim();
  if (val.length !== 5 || !/^\d{5}$/.test(val)) {
    locationDisplay.textContent = '';
    locationDisplay.className = 'location-display';
    currentState = null; currentCity = null; localData = null;
    return;
  }
  locationDisplay.textContent = 'Looking up…';
  locationDisplay.className = 'location-display loading';
  zipTimeout = setTimeout(() => lookupZip(val), 400);
});

async function lookupZip(zip) {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    const place = data.places[0];
    const cityName = place['place name'];
    const stateAbbr = place['state abbreviation'];
    currentState = stateAbbr;
    currentCity = cityName;
    const alias = DATA.cityAliases[cityName.toLowerCase()];
    localData = alias ? DATA.local[alias] : (DATA.local[cityName] || null);
    locationDisplay.textContent = `${cityName}, ${stateAbbr}${localData ? ' (local income tax applies)' : ''}`;
    locationDisplay.className = 'location-display found';
  } catch {
    currentState = null; currentCity = null; localData = null;
    locationDisplay.textContent = 'ZIP not found — please check or select state manually';
    locationDisplay.className = 'location-display error';
    showManualState();
  }
}

function showManualState() {
  if (document.getElementById('state-select-wrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'state-select-wrap';
  wrap.className = 'form-group';
  wrap.innerHTML = `
    <label for="state-select">State</label>
    <select id="state-select">
      <option value="">— Select state —</option>
      ${Object.entries(DATA.states).sort((a,b) => a[1].name.localeCompare(b[1].name))
        .map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
    </select>
  `;
  zipInput.closest('.form-group').after(wrap);
  document.getElementById('state-select').addEventListener('change', e => {
    currentState = e.target.value || null;
  });
}

document.getElementById('tax-form').addEventListener('submit', async e => {
  e.preventDefault();
  const income = parseFloat(document.getElementById('income').value);
  const status = document.getElementById('filing-status').value;
  if (!income || income < 0) { alert('Please enter a valid taxable income.'); return; }
  if (!currentState) {
    const sel = document.getElementById('state-select');
    if (sel) currentState = sel.value;
    if (!currentState) { alert('Please enter a valid ZIP code or select your state.'); return; }
  }
  const stateData = DATA.states[currentState];
  const { federal, state } = calcTax(income, stateData, status);
  const local = calcLocalTax(income, localData, status);
  const locationStr = currentCity
    ? `${currentCity}, ${stateData?.name || currentState}`
    : (stateData?.name || currentState);
  renderSummary(federal, state, local, locationStr);
  renderFederal(income, status, federal);
  renderState(stateData, income, status, state);
  renderLocal(localData, currentCity || '', income, status, local);
  document.getElementById('results').hidden = false;
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
