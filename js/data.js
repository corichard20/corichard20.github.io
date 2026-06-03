// FY2024 Tax & Budget Data
// Federal data: OMB Historical Tables, CBO
// State data: NASBO State Expenditure Report, individual state budget docs
// Local data: City budget documents

const DATA = {

  // ─── FEDERAL ────────────────────────────────────────────────────────────────

  federal: {
    // 2024 tax brackets (taxable income)
    brackets: {
      single: [
        { max: 11600,   rate: 0.10 },
        { max: 47150,   rate: 0.12 },
        { max: 100525,  rate: 0.22 },
        { max: 191950,  rate: 0.24 },
        { max: 243725,  rate: 0.32 },
        { max: 609350,  rate: 0.35 },
        { max: Infinity,rate: 0.37 }
      ],
      mfj: [
        { max: 23200,   rate: 0.10 },
        { max: 94300,   rate: 0.12 },
        { max: 201050,  rate: 0.22 },
        { max: 383900,  rate: 0.24 },
        { max: 487450,  rate: 0.32 },
        { max: 731200,  rate: 0.35 },
        { max: Infinity,rate: 0.37 }
      ],
      mfs: [
        { max: 11600,   rate: 0.10 },
        { max: 47150,   rate: 0.12 },
        { max: 100525,  rate: 0.22 },
        { max: 191950,  rate: 0.24 },
        { max: 243725,  rate: 0.32 },
        { max: 365600,  rate: 0.35 },
        { max: Infinity,rate: 0.37 }
      ],
      hoh: [
        { max: 16550,   rate: 0.10 },
        { max: 63100,   rate: 0.12 },
        { max: 100500,  rate: 0.22 },
        { max: 191950,  rate: 0.24 },
        { max: 243700,  rate: 0.32 },
        { max: 609350,  rate: 0.35 },
        { max: Infinity,rate: 0.37 }
      ]
    },
    // Total individual income tax collections FY2024 (billions)
    totalIncomeTaxRevenue: 2426e9,
    // FY2024 spending by category (billions). Source: OMB Table 3.2, CBO Budget Outlook
    budget: [
      { label: 'Social Security',        amount: 1466e9, color: '#4299e1', description: 'Retirement, disability, and survivor benefits for 70M+ Americans' },
      { label: 'Medicare',               amount: 1053e9, color: '#48bb78', description: 'Health insurance for 65M+ seniors and people with disabilities' },
      { label: 'Medicaid & CHIP',        amount:  616e9, color: '#38a169', description: 'Health coverage for 90M+ low-income adults, children, and disabled' },
      { label: 'Defense',                amount:  886e9, color: '#e53e3e', description: 'Military personnel, weapons, operations, and national security' },
      { label: 'Net Interest on Debt',   amount:  892e9, color: '#718096', description: 'Interest payments on $27T+ national debt' },
      { label: 'Veterans Benefits',      amount:  301e9, color: '#805ad5', description: 'VA healthcare, disability, pensions, and education for vets' },
      { label: 'Income Security',        amount:  490e9, color: '#d69e2e', description: 'SNAP, housing assistance, EITC, unemployment insurance' },
      { label: 'Education',              amount:  258e9, color: '#ed8936', description: 'Title I, Pell Grants, student loans, special ed' },
      { label: 'Transportation',         amount:  136e9, color: '#319795', description: 'Highways, bridges, transit, aviation, rail' },
      { label: 'Health (Non-Medicare)',  amount:  120e9, color: '#63b3ed', description: 'NIH research, CDC, community health centers' },
      { label: 'International Affairs',  amount:   72e9, color: '#9f7aea', description: 'Foreign aid, State Dept, USAID, military assistance' },
      { label: 'Science & Space',        amount:   35e9, color: '#f6ad55', description: 'NASA, NSF, DOE science programs' },
      { label: 'Environment & Energy',   amount:   47e9, color: '#68d391', description: 'EPA, national parks, clean energy, natural resources' },
      { label: 'Justice & Public Safety',amount:  103e9, color: '#fc8181', description: 'Federal courts, FBI, DEA, immigration enforcement' },
      { label: 'Other',                  amount:  276e9, color: '#a0aec0', description: 'Agriculture, commerce, labor, and other agencies' }
    ]
  },

  // ─── STATES ─────────────────────────────────────────────────────────────────

  states: {
    AL: {
      name: 'Alabama',
      brackets: {
        single: [{ max: 500, rate: 0.02 }, { max: 3000, rate: 0.04 }, { max: Infinity, rate: 0.05 }],
        mfj:    [{ max: 1000, rate: 0.02 }, { max: 6000, rate: 0.04 }, { max: Infinity, rate: 0.05 }],
        mfs:    [{ max: 500, rate: 0.02 }, { max: 3000, rate: 0.04 }, { max: Infinity, rate: 0.05 }],
        hoh:    [{ max: 500, rate: 0.02 }, { max: 3000, rate: 0.04 }, { max: Infinity, rate: 0.05 }]
      },
      totalIncomeTaxRevenue: 4.2e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.355, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.115, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.315, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.040, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.060, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.045, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.070, color: '#a0aec0' }
      ]
    },
    AK: {
      name: 'Alaska',
      brackets: { single: [], mfj: [], mfs: [], hoh: [] },
      totalIncomeTaxRevenue: 0,
      budget: [
        { label: 'K-12 Education',          pct: 0.265, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.090, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.280, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.095, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.060, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.060, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.150, color: '#a0aec0' }
      ]
    },
    AZ: {
      name: 'Arizona',
      flat: 0.025,
      totalIncomeTaxRevenue: 7.1e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.340, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.095, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.305, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.045, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.065, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.050, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.100, color: '#a0aec0' }
      ]
    },
    AR: {
      name: 'Arkansas',
      brackets: {
        single: [
          { max: 5099,    rate: 0.00 },
          { max: 10299,   rate: 0.02 },
          { max: 14299,   rate: 0.03 },
          { max: 23599,   rate: 0.034 },
          { max: Infinity,rate: 0.049 }
        ],
        mfj: [
          { max: 5099,    rate: 0.00 },
          { max: 10299,   rate: 0.02 },
          { max: 14299,   rate: 0.03 },
          { max: 23599,   rate: 0.034 },
          { max: Infinity,rate: 0.049 }
        ],
        mfs: [
          { max: 5099,    rate: 0.00 },
          { max: 10299,   rate: 0.02 },
          { max: 14299,   rate: 0.03 },
          { max: 23599,   rate: 0.034 },
          { max: Infinity,rate: 0.049 }
        ],
        hoh: [
          { max: 5099,    rate: 0.00 },
          { max: 10299,   rate: 0.02 },
          { max: 14299,   rate: 0.03 },
          { max: 23599,   rate: 0.034 },
          { max: Infinity,rate: 0.049 }
        ]
      },
      totalIncomeTaxRevenue: 3.0e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.390, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.115, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.285, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.045, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.040, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.070, color: '#a0aec0' }
      ]
    },
    CA: {
      name: 'California',
      brackets: {
        single: [
          { max: 10756,   rate: 0.01 },
          { max: 25499,   rate: 0.02 },
          { max: 40245,   rate: 0.04 },
          { max: 55866,   rate: 0.06 },
          { max: 70606,   rate: 0.08 },
          { max: 360659,  rate: 0.093 },
          { max: 432787,  rate: 0.103 },
          { max: 721314,  rate: 0.113 },
          { max: 1000000, rate: 0.123 },
          { max: Infinity,rate: 0.133 }
        ],
        mfj: [
          { max: 21512,   rate: 0.01 },
          { max: 50998,   rate: 0.02 },
          { max: 80490,   rate: 0.04 },
          { max: 111732,  rate: 0.06 },
          { max: 141212,  rate: 0.08 },
          { max: 721318,  rate: 0.093 },
          { max: 865574,  rate: 0.103 },
          { max: 1000000, rate: 0.113 },
          { max: 1442628, rate: 0.123 },
          { max: Infinity,rate: 0.133 }
        ],
        mfs: [
          { max: 10756,   rate: 0.01 },
          { max: 25499,   rate: 0.02 },
          { max: 40245,   rate: 0.04 },
          { max: 55866,   rate: 0.06 },
          { max: 70606,   rate: 0.08 },
          { max: 360659,  rate: 0.093 },
          { max: 432787,  rate: 0.103 },
          { max: 721314,  rate: 0.113 },
          { max: 1000000, rate: 0.123 },
          { max: Infinity,rate: 0.133 }
        ],
        hoh: [
          { max: 21512,   rate: 0.01 },
          { max: 50998,   rate: 0.02 },
          { max: 65744,   rate: 0.04 },
          { max: 81364,   rate: 0.06 },
          { max: 96107,   rate: 0.08 },
          { max: 490493,  rate: 0.093 },
          { max: 588593,  rate: 0.103 },
          { max: 1000000, rate: 0.113 },
          { max: 980914,  rate: 0.123 },
          { max: Infinity,rate: 0.133 }
        ]
      },
      totalIncomeTaxRevenue: 133e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.385, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.085, color: '#68d391' },
        { label: 'Medicaid (Medi-Cal)',      pct: 0.195, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.030, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.075, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.065, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.165, color: '#a0aec0' }
      ]
    },
    CO: {
      name: 'Colorado',
      flat: 0.044,
      totalIncomeTaxRevenue: 11e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.325, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.095, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.295, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.065, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.050, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.060, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.110, color: '#a0aec0' }
      ]
    },
    CT: {
      name: 'Connecticut',
      brackets: {
        single: [
          { max: 10000,   rate: 0.03 },
          { max: 50000,   rate: 0.05 },
          { max: 100000,  rate: 0.055 },
          { max: 200000,  rate: 0.06 },
          { max: 250000,  rate: 0.065 },
          { max: 500000,  rate: 0.069 },
          { max: Infinity,rate: 0.0699 }
        ],
        mfj: [
          { max: 20000,   rate: 0.03 },
          { max: 100000,  rate: 0.05 },
          { max: 200000,  rate: 0.055 },
          { max: 400000,  rate: 0.06 },
          { max: 500000,  rate: 0.065 },
          { max: 1000000, rate: 0.069 },
          { max: Infinity,rate: 0.0699 }
        ],
        mfs: [
          { max: 10000,   rate: 0.03 },
          { max: 50000,   rate: 0.05 },
          { max: 100000,  rate: 0.055 },
          { max: 200000,  rate: 0.06 },
          { max: 250000,  rate: 0.065 },
          { max: 500000,  rate: 0.069 },
          { max: Infinity,rate: 0.0699 }
        ],
        hoh: [
          { max: 16000,   rate: 0.03 },
          { max: 80000,   rate: 0.05 },
          { max: 160000,  rate: 0.055 },
          { max: 320000,  rate: 0.06 },
          { max: 400000,  rate: 0.065 },
          { max: 800000,  rate: 0.069 },
          { max: Infinity,rate: 0.0699 }
        ]
      },
      totalIncomeTaxRevenue: 8.5e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.205, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.085, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.360, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.055, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.050, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.070, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.175, color: '#a0aec0' }
      ]
    },
    DE: {
      name: 'Delaware',
      brackets: {
        single: [
          { max: 2000,    rate: 0.00 },
          { max: 5000,    rate: 0.022 },
          { max: 10000,   rate: 0.039 },
          { max: 20000,   rate: 0.048 },
          { max: 25000,   rate: 0.052 },
          { max: 60000,   rate: 0.0555 },
          { max: Infinity,rate: 0.066 }
        ],
        mfj: [
          { max: 2000,    rate: 0.00 },
          { max: 5000,    rate: 0.022 },
          { max: 10000,   rate: 0.039 },
          { max: 20000,   rate: 0.048 },
          { max: 25000,   rate: 0.052 },
          { max: 60000,   rate: 0.0555 },
          { max: Infinity,rate: 0.066 }
        ],
        mfs: [
          { max: 2000,    rate: 0.00 },
          { max: 5000,    rate: 0.022 },
          { max: 10000,   rate: 0.039 },
          { max: 20000,   rate: 0.048 },
          { max: 25000,   rate: 0.052 },
          { max: 60000,   rate: 0.0555 },
          { max: Infinity,rate: 0.066 }
        ],
        hoh: [
          { max: 2000,    rate: 0.00 },
          { max: 5000,    rate: 0.022 },
          { max: 10000,   rate: 0.039 },
          { max: 20000,   rate: 0.048 },
          { max: 25000,   rate: 0.052 },
          { max: 60000,   rate: 0.0555 },
          { max: Infinity,rate: 0.066 }
        ]
      },
      totalIncomeTaxRevenue: 2.1e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.310, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.090, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.295, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.060, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.065, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.125, color: '#a0aec0' }
      ]
    },
    FL: {
      name: 'Florida',
      brackets: { single: [], mfj: [], mfs: [], hoh: [] },
      totalIncomeTaxRevenue: 0,
      budget: [
        { label: 'K-12 Education',          pct: 0.295, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.100, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.315, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.085, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.065, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.040, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.100, color: '#a0aec0' }
      ]
    },
    GA: {
      name: 'Georgia',
      flat: 0.0549,
      totalIncomeTaxRevenue: 16e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.415, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.115, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.245, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.055, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.060, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.040, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.070, color: '#a0aec0' }
      ]
    },
    HI: {
      name: 'Hawaii',
      brackets: {
        single: [
          { max: 2400,    rate: 0.014 },
          { max: 4800,    rate: 0.032 },
          { max: 9600,    rate: 0.055 },
          { max: 14400,   rate: 0.064 },
          { max: 19200,   rate: 0.068 },
          { max: 24000,   rate: 0.072 },
          { max: 36000,   rate: 0.076 },
          { max: 48000,   rate: 0.079 },
          { max: 150000,  rate: 0.0825 },
          { max: 175000,  rate: 0.09 },
          { max: 200000,  rate: 0.10 },
          { max: Infinity,rate: 0.11 }
        ],
        mfj: [
          { max: 4800,    rate: 0.014 },
          { max: 9600,    rate: 0.032 },
          { max: 19200,   rate: 0.055 },
          { max: 28800,   rate: 0.064 },
          { max: 38400,   rate: 0.068 },
          { max: 48000,   rate: 0.072 },
          { max: 72000,   rate: 0.076 },
          { max: 96000,   rate: 0.079 },
          { max: 300000,  rate: 0.0825 },
          { max: 350000,  rate: 0.09 },
          { max: 400000,  rate: 0.10 },
          { max: Infinity,rate: 0.11 }
        ],
        mfs: [
          { max: 2400,    rate: 0.014 },
          { max: 4800,    rate: 0.032 },
          { max: 9600,    rate: 0.055 },
          { max: 14400,   rate: 0.064 },
          { max: 19200,   rate: 0.068 },
          { max: 24000,   rate: 0.072 },
          { max: 36000,   rate: 0.076 },
          { max: 48000,   rate: 0.079 },
          { max: 150000,  rate: 0.0825 },
          { max: 175000,  rate: 0.09 },
          { max: 200000,  rate: 0.10 },
          { max: Infinity,rate: 0.11 }
        ],
        hoh: [
          { max: 3600,    rate: 0.014 },
          { max: 7200,    rate: 0.032 },
          { max: 14400,   rate: 0.055 },
          { max: 21600,   rate: 0.064 },
          { max: 28800,   rate: 0.068 },
          { max: 36000,   rate: 0.072 },
          { max: 54000,   rate: 0.076 },
          { max: 72000,   rate: 0.079 },
          { max: 225000,  rate: 0.0825 },
          { max: 262500,  rate: 0.09 },
          { max: 300000,  rate: 0.10 },
          { max: Infinity,rate: 0.11 }
        ]
      },
      totalIncomeTaxRevenue: 2.5e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.285, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.095, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.310, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.055, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.040, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.065, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.150, color: '#a0aec0' }
      ]
    },
    ID: {
      name: 'Idaho',
      flat: 0.05695,
      totalIncomeTaxRevenue: 2.4e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.375, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.140, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.270, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.060, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.040, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.060, color: '#a0aec0' }
      ]
    },
    IL: {
      name: 'Illinois',
      flat: 0.0495,
      totalIncomeTaxRevenue: 22e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.295, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.065, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.355, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.045, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.075, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.110, color: '#a0aec0' }
      ]
    },
    IN: {
      name: 'Indiana',
      flat: 0.0315,
      totalIncomeTaxRevenue: 8e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.385, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.135, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.270, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.055, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.060, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.045, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.050, color: '#a0aec0' }
      ]
    },
    IA: {
      name: 'Iowa',
      flat: 0.044,
      totalIncomeTaxRevenue: 5e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.380, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.130, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.265, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.060, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.050, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.060, color: '#a0aec0' }
      ]
    },
    KS: {
      name: 'Kansas',
      brackets: {
        single: [
          { max: 15000,   rate: 0.031 },
          { max: 30000,   rate: 0.0525 },
          { max: Infinity,rate: 0.057 }
        ],
        mfj: [
          { max: 30000,   rate: 0.031 },
          { max: 60000,   rate: 0.0525 },
          { max: Infinity,rate: 0.057 }
        ],
        mfs: [
          { max: 15000,   rate: 0.031 },
          { max: 30000,   rate: 0.0525 },
          { max: Infinity,rate: 0.057 }
        ],
        hoh: [
          { max: 15000,   rate: 0.031 },
          { max: 30000,   rate: 0.0525 },
          { max: Infinity,rate: 0.057 }
        ]
      },
      totalIncomeTaxRevenue: 4.2e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.405, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.115, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.265, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.060, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.045, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.055, color: '#a0aec0' }
      ]
    },
    KY: {
      name: 'Kentucky',
      flat: 0.04,
      totalIncomeTaxRevenue: 6e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.360, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.105, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.295, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.050, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.065, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.045, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.080, color: '#a0aec0' }
      ]
    },
    LA: {
      name: 'Louisiana',
      brackets: {
        single: [
          { max: 12500,   rate: 0.0185 },
          { max: Infinity,rate: 0.035 }
        ],
        mfj: [
          { max: 25000,   rate: 0.0185 },
          { max: Infinity,rate: 0.035 }
        ],
        mfs: [
          { max: 12500,   rate: 0.0185 },
          { max: Infinity,rate: 0.035 }
        ],
        hoh: [
          { max: 12500,   rate: 0.0185 },
          { max: Infinity,rate: 0.035 }
        ]
      },
      totalIncomeTaxRevenue: 5e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.310, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.120, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.345, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.050, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.065, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.045, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.065, color: '#a0aec0' }
      ]
    },
    ME: {
      name: 'Maine',
      brackets: {
        single: [
          { max: 24500,   rate: 0.058 },
          { max: 58050,   rate: 0.0675 },
          { max: Infinity,rate: 0.0715 }
        ],
        mfj: [
          { max: 49050,   rate: 0.058 },
          { max: 116100,  rate: 0.0675 },
          { max: Infinity,rate: 0.0715 }
        ],
        mfs: [
          { max: 24500,   rate: 0.058 },
          { max: 58050,   rate: 0.0675 },
          { max: Infinity,rate: 0.0715 }
        ],
        hoh: [
          { max: 36750,   rate: 0.058 },
          { max: 87100,   rate: 0.0675 },
          { max: Infinity,rate: 0.0715 }
        ]
      },
      totalIncomeTaxRevenue: 2.0e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.330, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.080, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.335, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.065, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.045, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.060, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.085, color: '#a0aec0' }
      ]
    },
    MD: {
      name: 'Maryland',
      brackets: {
        single: [
          { max: 1000,    rate: 0.02 },
          { max: 2000,    rate: 0.03 },
          { max: 3000,    rate: 0.04 },
          { max: 100000,  rate: 0.0475 },
          { max: 125000,  rate: 0.05 },
          { max: 150000,  rate: 0.0525 },
          { max: 250000,  rate: 0.055 },
          { max: Infinity,rate: 0.0575 }
        ],
        mfj: [
          { max: 1000,    rate: 0.02 },
          { max: 2000,    rate: 0.03 },
          { max: 3000,    rate: 0.04 },
          { max: 150000,  rate: 0.0475 },
          { max: 175000,  rate: 0.05 },
          { max: 225000,  rate: 0.0525 },
          { max: 300000,  rate: 0.055 },
          { max: Infinity,rate: 0.0575 }
        ],
        mfs: [
          { max: 1000,    rate: 0.02 },
          { max: 2000,    rate: 0.03 },
          { max: 3000,    rate: 0.04 },
          { max: 100000,  rate: 0.0475 },
          { max: 125000,  rate: 0.05 },
          { max: 150000,  rate: 0.0525 },
          { max: 250000,  rate: 0.055 },
          { max: Infinity,rate: 0.0575 }
        ],
        hoh: [
          { max: 1000,    rate: 0.02 },
          { max: 2000,    rate: 0.03 },
          { max: 3000,    rate: 0.04 },
          { max: 150000,  rate: 0.0475 },
          { max: 175000,  rate: 0.05 },
          { max: 225000,  rate: 0.0525 },
          { max: 300000,  rate: 0.055 },
          { max: Infinity,rate: 0.0575 }
        ]
      },
      totalIncomeTaxRevenue: 17e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.265, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.090, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.325, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.065, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.050, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.070, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.135, color: '#a0aec0' }
      ]
    },
    MA: {
      name: 'Massachusetts',
      brackets: {
        single: [
          { max: 1000000, rate: 0.05 },
          { max: Infinity,rate: 0.09 }
        ],
        mfj: [
          { max: 1000000, rate: 0.05 },
          { max: Infinity,rate: 0.09 }
        ],
        mfs: [
          { max: 1000000, rate: 0.05 },
          { max: Infinity,rate: 0.09 }
        ],
        hoh: [
          { max: 1000000, rate: 0.05 },
          { max: Infinity,rate: 0.09 }
        ]
      },
      totalIncomeTaxRevenue: 27e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.235, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.080, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.370, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.055, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.040, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.080, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.140, color: '#a0aec0' }
      ]
    },
    MI: {
      name: 'Michigan',
      flat: 0.0405,
      totalIncomeTaxRevenue: 11e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.365, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.095, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.280, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.065, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.055, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.060, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.080, color: '#a0aec0' }
      ]
    },
    MN: {
      name: 'Minnesota',
      brackets: {
        single: [
          { max: 31690,   rate: 0.0535 },
          { max: 104090,  rate: 0.068 },
          { max: 193240,  rate: 0.0785 },
          { max: Infinity,rate: 0.0985 }
        ],
        mfj: [
          { max: 46330,   rate: 0.0535 },
          { max: 184040,  rate: 0.068 },
          { max: 321450,  rate: 0.0785 },
          { max: Infinity,rate: 0.0985 }
        ],
        mfs: [
          { max: 23165,   rate: 0.0535 },
          { max: 92020,   rate: 0.068 },
          { max: 160725,  rate: 0.0785 },
          { max: Infinity,rate: 0.0985 }
        ],
        hoh: [
          { max: 39410,   rate: 0.0535 },
          { max: 158140,  rate: 0.068 },
          { max: 270480,  rate: 0.0785 },
          { max: Infinity,rate: 0.0985 }
        ]
      },
      totalIncomeTaxRevenue: 19e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.380, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.095, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.285, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.065, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.040, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.075, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.060, color: '#a0aec0' }
      ]
    },
    MS: {
      name: 'Mississippi',
      brackets: {
        single: [
          { max: 10000,   rate: 0.00 },
          { max: Infinity,rate: 0.047 }
        ],
        mfj: [
          { max: 10000,   rate: 0.00 },
          { max: Infinity,rate: 0.047 }
        ],
        mfs: [
          { max: 10000,   rate: 0.00 },
          { max: Infinity,rate: 0.047 }
        ],
        hoh: [
          { max: 10000,   rate: 0.00 },
          { max: Infinity,rate: 0.047 }
        ]
      },
      totalIncomeTaxRevenue: 3e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.390, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.125, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.285, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.045, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.065, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.040, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.050, color: '#a0aec0' }
      ]
    },
    MO: {
      name: 'Missouri',
      brackets: {
        single: [
          { max: 1207,    rate: 0.00 },
          { max: 2414,    rate: 0.015 },
          { max: 3621,    rate: 0.020 },
          { max: 4828,    rate: 0.025 },
          { max: 6035,    rate: 0.030 },
          { max: 7242,    rate: 0.035 },
          { max: 8448,    rate: 0.040 },
          { max: 9655,    rate: 0.045 },
          { max: Infinity,rate: 0.048 }
        ],
        mfj: [
          { max: 1207,    rate: 0.00 },
          { max: 2414,    rate: 0.015 },
          { max: 3621,    rate: 0.020 },
          { max: 4828,    rate: 0.025 },
          { max: 6035,    rate: 0.030 },
          { max: 7242,    rate: 0.035 },
          { max: 8448,    rate: 0.040 },
          { max: 9655,    rate: 0.045 },
          { max: Infinity,rate: 0.048 }
        ],
        mfs: [
          { max: 1207,    rate: 0.00 },
          { max: 2414,    rate: 0.015 },
          { max: 3621,    rate: 0.020 },
          { max: 4828,    rate: 0.025 },
          { max: 6035,    rate: 0.030 },
          { max: 7242,    rate: 0.035 },
          { max: 8448,    rate: 0.040 },
          { max: 9655,    rate: 0.045 },
          { max: Infinity,rate: 0.048 }
        ],
        hoh: [
          { max: 1207,    rate: 0.00 },
          { max: 2414,    rate: 0.015 },
          { max: 3621,    rate: 0.020 },
          { max: 4828,    rate: 0.025 },
          { max: 6035,    rate: 0.030 },
          { max: 7242,    rate: 0.035 },
          { max: 8448,    rate: 0.040 },
          { max: 9655,    rate: 0.045 },
          { max: Infinity,rate: 0.048 }
        ]
      },
      totalIncomeTaxRevenue: 8e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.385, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.110, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.275, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.060, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.065, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.050, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.055, color: '#a0aec0' }
      ]
    },
    MT: {
      name: 'Montana',
      brackets: {
        single: [
          { max: 20500,   rate: 0.047 },
          { max: Infinity,rate: 0.059 }
        ],
        mfj: [
          { max: 41000,   rate: 0.047 },
          { max: Infinity,rate: 0.059 }
        ],
        mfs: [
          { max: 20500,   rate: 0.047 },
          { max: Infinity,rate: 0.059 }
        ],
        hoh: [
          { max: 20500,   rate: 0.047 },
          { max: Infinity,rate: 0.059 }
        ]
      },
      totalIncomeTaxRevenue: 2.1e9,
      budget: [
        { label: 'K-12 Education',          pct: 0.345, color: '#4299e1' },
        { label: 'Higher Education',         pct: 0.120, color: '#68d391' },
        { label: 'Medicaid & Health',        pct: 0.300, color: '#fc8181' },
        { label: 'Transportation',           pct: 0.075, color: '#f6ad55' },
        { label: 'Corrections & Public Safety', pct: 0.045, color: '#9f7aea' },
        { label: 'Human Services',           pct: 0.055, color: '#ed64a6' },
        { label: 'Other',                    pct: 0.060, color: '#a0aec0' }
      ]
    },
    NE: {
      name: 'Nebraska',
      brackets: {
        single: [
          { max: 3700,    rate: 0.0246 },
          { max: 22170,   rate: 0.0351 },
          { max: 35730,   rate: 0.0501 },
          { max: Infinity,rate: 0.0584 }
        ],
        mfj: [
          { max: 7390,    rate: 0.0246 },
          { max: 44350,   rate: 0.0351 },
          { max: 71460,   rate: 0.0501 },
          { max: Infinity,rate: 0.0584 }
        ],
        mfs: [
          { max: 3700,    rate: 0.0246 },
          { max: 22170,   rate: 0.0351 },
          { max: 35730,   rate: 0.0501 },
          { max: Infinity,rate: 0.0584 }
        ],
        hoh: [
          { max: 6860,    rate: 0.0246 },
          { max: 37100,   rate: 0.0351 },
          { max: 53590,   rate: 0.0501 },
          { max: Infinity,rate: 0.0584 }
        ]
              budget: [
        { label: 'Public Safety (Police/Fire/EMS)', pct: 0.255, color: '#e53e3e' },
        { label: 'Education (Public Schools)',       pct: 0.205, color: '#4299e1' },
        { label: 'Social Services',                 pct: 0.070, color: '#ed64a6' },
        { label: 'Parks & Libraries',               pct: 0.040, color: '#68d391' },
        { label: 'Transportation',                  pct: 0.085, color: '#319795' },
        { label: 'Public Works & Sanitation',       pct: 0.070, color: '#f6ad55' },
        { label: 'Debt Service',                    pct: 0.105, color: '#718096' },
        { label: 'Admin & Other',                   pct: 0.170, color: '#a0aec0' }
      ]
    },
    'Pittsburgh': {
      state: 'PA',
      flat: 0.03,
      totalIncomeTaxRevenue: 0.35e9,
      budget: [
        { label: 'Public Safety (Police/Fire/EMS)', pct: 0.280, color: '#e53e3e' },
        { label: 'Education (Public Schools)',       pct: 0.195, color: '#4299e1' },
        { label: 'Social Services',                 pct: 0.055, color: '#ed64a6' },
        { label: 'Parks & Libraries',               pct: 0.040, color: '#68d391' },
        { label: 'Transportation',                  pct: 0.075, color: '#319795' },
        { label: 'Public Works & Sanitation',       pct: 0.070, color: '#f6ad55' },
        { label: 'Debt Service',                    pct: 0.125, color: '#718096' },
        { label: 'Admin & Other',                   pct: 0.160, color: '#a0aec0' }
      ]
    },
    'Wilmington': {
      state: 'DE',
      flat: 0.0125,
      totalIncomeTaxRevenue: 0.12e9,
      budget: [
        { label: 'Public Safety (Police/Fire/EMS)', pct: 0.300, color: '#e53e3e' },
        { label: 'Education (Public Schools)',       pct: 0.175, color: '#4299e1' },
        { label: 'Social Services',                 pct: 0.060, color: '#ed64a6' },
        { label: 'Parks & Libraries',               pct: 0.030, color: '#68d391' },
        { label: 'Transportation',                  pct: 0.065, color: '#319795' },
        { label: 'Public Works & Sanitation',       pct: 0.085, color: '#f6ad55' },
        { label: 'Debt Service',                    pct: 0.120, color: '#718096' },
        { label: 'Admin & Other',                   pct: 0.165, color: '#a0aec0' }
      ]
    }
  },

  cityAliases: {
    'new york': 'New York City',
    'new york city': 'New York City',
    'brooklyn': 'New York City',
    'queens': 'New York City',
    'bronx': 'New York City',
    'staten island': 'New York City',
    'manhattan': 'New York City',
    'astoria': 'New York City',
    'flushing': 'New York City',
    'jamaica': 'New York City',
    'philadelphia': 'Philadelphia',
    'baltimore': 'Baltimore',
    'detroit': 'Detroit',
    'columbus': 'Columbus',
    'cleveland': 'Cleveland',
    'cincinnati': 'Cincinnati',
    'akron': 'Akron',
    'toledo': 'Toledo',
    'kansas city': 'Kansas City',
    'st. louis': 'St. Louis',
    'saint louis': 'St. Louis',
    'st louis': 'St. Louis',
    'louisville': 'Louisville',
    'pittsburgh': 'Pittsburgh',
    'wilmington': 'Wilmington'
  }
};
