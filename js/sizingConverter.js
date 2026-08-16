// SHOE & FOOTWEAR CONVERSION UTILITIES FOR GEAR GROMZ

export function convertFootLength(lengthInInches) {
  const inches = parseFloat(lengthInInches);
  if (isNaN(inches) || inches <= 0) {
    return { inches: 0, cm: 0, mondo: 'N/A', usKids: 'N/A', eu: 'N/A', crocs: 'N/A' };
  }

  const cm = inches * 2.54;
  
  // Ski boot Mondo Point (rounded to nearest 0.5 cm)
  const mondo = (Math.round(cm * 2) / 2).toFixed(1);

  // US Kids Sizing (Formula: (inches * 3) - 11.67 approx)
  let usKids = 'N/A';
  if (inches < 6.0) usKids = 'Toddler 6';
  else if (inches < 6.4) usKids = 'Toddler 8';
  else if (inches < 6.7) usKids = 'Toddler 10';
  else if (inches < 7.0) usKids = 'Toddler 11';
  else if (inches < 7.4) usKids = 'Toddler 12';
  else if (inches < 7.7) usKids = 'Toddler 13';
  else if (inches < 8.0) usKids = 'Youth 1';
  else if (inches < 8.4) usKids = 'Youth 2';
  else if (inches < 8.7) usKids = 'Youth 3';
  else if (inches < 9.0) usKids = 'Youth 4';
  else if (inches < 9.4) usKids = 'Youth 5';
  else usKids = 'Youth 6+';

  // EU Sizing (approx (cm + 1.5) * 1.5)
  const eu = Math.round((cm + 1.5) * 1.5);

  // Crocs Sizing
  let crocs = 'N/A';
  if (inches < 6.4) crocs = 'C8/C9';
  else if (inches < 6.7) crocs = 'C10';
  else if (inches < 7.0) crocs = 'C11';
  else if (inches < 7.4) crocs = 'C12';
  else if (inches < 7.7) crocs = 'C13';
  else if (inches < 8.0) crocs = 'J1';
  else if (inches < 8.4) crocs = 'J2';
  else if (inches < 8.7) crocs = 'J3';
  else crocs = 'M4/W6';

  return {
    inches: inches.toFixed(1),
    cm: cm.toFixed(1),
    mondo: mondo + ' MP',
    usKids,
    eu: 'EU ' + eu,
    crocs
  };
}
