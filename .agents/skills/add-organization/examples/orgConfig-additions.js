// =============================================================
// EXAMPLE: Adding "Bachelors" wing to the multi-org CMS
// Slug: bachelors | Display Name: Bachelors Wing
// =============================================================

// ----- Step 1: orgConfig.js additions -----

export const WINGS = ['School', 'Plus2', 'Bachelors']; // ← added Bachelors

export const PROGRAMS = {
  // ...existing entries...
  Bachelors: [
    { id: 'bca', name: 'BCA', type: 'semester' },
    { id: 'bbs', name: 'BBS', type: 'year' },
    { id: 'csit', name: 'CSIT', type: 'semester' },
  ],
};

export const LEVELS = {
  // ...existing entries...
  bca: ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'],
  bbs: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  csit: ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'],
};
