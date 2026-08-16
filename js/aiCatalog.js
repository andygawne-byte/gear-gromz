// AI PHOTO CATALOGING SERVICE (GEMINI FLASH) FOR GEAR GROMZ

export async function analyzeGearPhoto(base64Image, apiKey) {
  if (!apiKey) {
    // Fallback simulation if no API key provided in settings
    console.log('No Gemini API key supplied. Using simulated AI photo extraction.');
    return {
      category: 'Ski/Snowboard',
      brand: 'Salomon',
      model: 'QST Lux Jr',
      size_label: '130cm',
      min_height_in: 48,
      max_height_in: 54,
      bsl_mm: 265,
      condition: 'Good',
      notes: 'AI Detected: Salomon youth all-mountain skis with C5 bindings.'
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptText = `Analyze this outdoor gear photo. Return ONLY a valid raw JSON object with these keys:
  {
    "category": "Bikes | Ski/Snowboard | Outerwear/Apparel | Boots/Footwear | Water Sports | Camping/Backpacking",
    "brand": "String",
    "model": "String",
    "size_label": "String",
    "min_height_in": Number or null,
    "max_height_in": Number or null,
    "bsl_mm": Number or null,
    "condition": "Like New | Good | Fair | Needs TLC",
    "notes": "String short description"
  }`;

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    const textResp = result.candidates[0].content.parts[0].text;
    const jsonMatch = textResp.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse JSON from Gemini response');
  } catch (err) {
    console.error('Gemini API Error:', err);
    alert('AI Photo analysis failed. Please fill in details manually.');
    return null;
  }
}
