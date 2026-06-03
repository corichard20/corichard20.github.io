$ cat /home/user/corichard20.github.io/js/app.js

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

// Chart instances
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
        ctx.font = `bold ${Math.round(height / 9)}px system-ui`;
        ctx.fillStyle = '#1a202c';
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
  const totalRevenue = DATA.federal.totalIncomeTaxRevenue;
  const share = taxPaid / totalRevenue;

  const items = DATA.federal.budget.map(cat => ({
    label: cat.label,
    color: cat.color,
    amount: share * cat.amount,
    pct: (cat.amount / DATA.federal.budget.reduce((s, c) => s + c.amount, 0)) * 100,
    description: cat.description
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

  // State income taxes fund roughly 1/4 of total state spending on average;
  // we scale up to full state spending for dollar amounts shown per category.
  const stateSpendingMultiplier = 4;
  const estimatedStateSpending = stateData.totalIncomeTaxRevenue * stateSpendingMultiplier;

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

  if (!localData || taxPaid === 0) {
    el.hidden = true;
    return;
  }

  const share = localData.totalIncomeTaxRevenue > 0 ? taxPaid / localData.totalIncomeTaxRevenue : 0;
  const total = localData.budget.reduce((s, c) => s + c.pct, 0);
  const normalized = localData.budget.map(c => ({ ...c, pct: c.pct / total }));

  // Cities spend roughly 2-3x their income tax revenue in total
  const localSpendingMultiplier = 2.5;
  const estimatedLocalSpending = localData.totalIncomeTaxRevenue * localSpendingMultiplier;

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

// ─── Zip lookup & form logic ────────────────────────────────────────────────

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
    currentState = null;
    currentCity = null;
    localData = null;
    return;
  }
  locationDisplay.textContent = 'Looking up…';
  locationDisplay.className = 'location-display loading';
  zipTimeout = setTimeout(() => lookupZip(val), 400);
});

// Embedded 3-digit zip prefix → state lookup (USPS ranges, covers all 50 states + DC)
const ZIP_PREFIX_STATE = (function() {
  const m = {};
  const ranges = [
    ['010','027','MA'],['028','029','RI'],['030','038','NH'],['039','039','ME'],
    ['040','049','ME'],['050','059','VT'],['060','069','CT'],['070','089','NJ'],
    ['100','149','NY'],['150','196','PA'],['197','199','DE'],['200','205','DC'],
    ['206','219','MD'],['220','246','VA'],['247','268','WV'],['270','289','NC'],
    ['290','299','SC'],['300','319','GA'],['320','349','FL'],['350','369','AL'],
    ['370','385','TN'],['386','397','MS'],['398','399','GA'],['400','427','KY'],
    ['430','458','OH'],['460','479','IN'],['480','499','MI'],['500','528','IA'],
    ['530','549','WI'],['550','567','MN'],['570','577','SD'],['580','588','ND'],
    ['590','599','MT'],['600','631','IL'],['632','658','MO'],['660','679','KS'],
    ['680','693','NE'],['700','714','LA'],['716','729','AR'],['730','749','OK'],
    ['750','799','TX'],['800','816','CO'],['820','831','WY'],['832','838','ID'],
    ['840','847','UT'],['850','865','AZ'],['870','884','NM'],['889','898','NV'],
    ['900','961','CA'],['970','979','OR'],['980','994','WA'],['995','999','AK'],
    ['967','969','HI'],['006','009','PR']
  ];
  for (const [lo, hi, st] of ranges) {
    const l = parseInt(lo), h = parseInt(hi);
    for (let i = l; i <= h; i++) m[String(i).padStart(3,'0')] = st;
  }
  // Overrides for specific prefixes
  Object.assign(m, {
    '063':'CT','064':'CT','067':'CT','068':'CT','069':'CT',
    '200':'DC','202':'DC','203':'DC','204':'DC','205':'DC',
    '340':'FL','963':'HI','964':'HI','965':'HI','966':'HI',
    '967':'HI','968':'HI','969':'HI'
  });
  return m;
})();

// Known zip prefixes for cities with local income taxes
const ZIP_CITY_HINTS = {
  // NYC (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
  '100':'New York City','101':'New York City','102':'New York City',
  '103':'New York City','104':'New York City','111':'New York City',
  '112':'New York City','113':'New York City','114':'New York City',
  '115':'New York City','116':'New York City',
  // Philadelphia
  '190':'Philadelphia','191':'Philadelphia',
  // Baltimore
  '212':'Baltimore',
  // Pittsburgh
  '152':'Pittsburgh',
  // Detroit
  '482':'Detroit',
  // Columbus OH
  '432':'Columbus',
  // Cleveland OH
  '441':'Cleveland',
  // Cincinnati OH
  '452':'Cincinnati','453':'Cincinnati',
  // Akron OH
  '443':'Akron','444':'Akron',
  // Toledo OH
  '436':'Toledo',
  // Kansas City MO
  '641':'Kansas City',
  // St. Louis MO
  '631':'St. Louis','632':'St. Louis',
  // Louisville KY
  '402':'Louisville',
  // Wilmington DE
  '198':'Wilmington',
};

async function lookupZip(zip) {
  const prefix = zip.slice(0, 3);
  const stateAbbr = ZIP_PREFIX_STATE[prefix];

  if (!stateAbbr || stateAbbr === 'PR') {
    locationDisplay.textContent = 'ZIP not found — please select your state manually';
    locationDisplay.className = 'location-display error';
    showManualState();
    return;
  }

  currentState = stateAbbr;

  // Check for local tax city via embedded prefix hints
  const cityHint = ZIP_CITY_HINTS[prefix];
  if (cityHint) {
    currentCity = cityHint;
    localData = DATA.local[cityHint] || null;
  } else {
    currentCity = null;
    localData = null;
  }

  const stateName = DATA.states[stateAbbr]?.name || stateAbbr;
  const cityStr = currentCity ? `${currentCity}, ` : '';
  locationDisplay.textContent = `${cityStr}${stateName}${localData ? ' (local income tax applies)' : ''}`;
  locationDisplay.className = 'location-display found';

  // Try to get exact city name from API in background (non-blocking)
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      const apiCity = data.places[0]['place name'];
      const alias = DATA.cityAliases[apiCity.toLowerCase()];
      const apiLocal = alias ? DATA.local[alias] : (DATA.local[apiCity] || null);
      if (apiLocal) {
        currentCity = alias || apiCity;
        localData = apiLocal;
      } else if (!localData) {
        currentCity = apiCity;
      }
      locationDisplay.textContent = `${currentCity || apiCity}, ${stateName}${localData ? ' (local income tax applies)' : ''}`;
    }
  } catch { /* silently ignore — embedded lookup already succeeded */ }
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

  if (!income || income < 0) {
    alert('Please enter a valid taxable income.');
    return;
  }

  if (!currentState) {
    // Check manual select
    const sel = document.getElementById('state-select');
    if (sel) currentState = sel.value;
    if (!currentState) {
      alert('Please enter a valid ZIP code or select your state.');
      return;
    }
  }

  const stateData = DATA.states[currentState];
  const { federal, state } = calcTax(income, stateData, status);
  const local = calcLocalTax(income, localData, status);

  const locationStr = currentCity ? `${currentCity}, ${stateData?.name || currentState}` : (stateData?.name || currentState);

  renderSummary(federal, state, local, locationStr);
  renderFederal(income, status, federal);
  renderState(stateData, income, status, state);
  renderLocal(localData, currentCity || '', income, status, local);

  document.getElementById('results').hidden = false;
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
