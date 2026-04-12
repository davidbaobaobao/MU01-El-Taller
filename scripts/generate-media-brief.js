const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, LevelFormat, Header, Footer,
} = require('docx');
const fs = require('fs');

const C = {
  terracotta:  '904824',
  adobe:       '7b5548',
  parchment:   'f5ede3',
  darkClay:    '1e1b15',
  outlineVar:  'dac1b8',
  white:       'FFFFFF',
  rowAlt:      'FBF2E8',
  promptBg:    'F0EAE4',
  promptBorder:'C4856A',
  tagLaunch:   'FAECE7',
  tagPost:     'EEF0FB',
  tagLaunchTx: '6B2A0E',
  tagPostTx:   '1A2A6B',
};

const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const hairline  = { style: BorderStyle.SINGLE, size: 1, color: C.outlineVar };

const serif = (text, opts = {}) => new TextRun({ text, font: 'Georgia', size: opts.size || 22, bold: opts.bold || false, color: opts.color || C.darkClay, italics: opts.italic || false });
const body  = (text, opts = {}) => new TextRun({ text, font: 'Arial',   size: opts.size || 20, bold: opts.bold || false, color: opts.color || C.darkClay, italics: opts.italic || false });
const mono  = (text, opts = {}) => new TextRun({ text, font: 'Courier New', size: opts.size || 18, color: opts.color || C.darkClay });

const p   = (children, opts = {}) => new Paragraph({ children: Array.isArray(children) ? children : [children], spacing: { before: opts.before || 0, after: opts.after || 120 }, alignment: opts.align || AlignmentType.LEFT, indent: opts.indent ? { left: opts.indent } : undefined });
const gap = () => new Paragraph({ children: [new TextRun({ text: '', size: 2 })], spacing: { before: 0, after: 0 } });
const tag = (text, fill, color) => new TextRun({ text: `  ${text}  `, font: 'Arial', size: 15, bold: true, color, shading: { type: ShadingType.CLEAR, fill }, allCaps: true, characterSpacing: 50 });

function sectionHead(title, sub = '') {
  return [
    new Paragraph({ children: [serif(title, { size: 30, bold: true, color: C.terracotta })], spacing: { before: 480, after: sub ? 80 : 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.outlineVar, space: 6 } } }),
    ...(sub ? [p([body(sub, { size: 18, color: C.adobe, italic: true })], { before: 80, after: 200 })] : []),
  ];
}

function subHead(text) {
  return new Paragraph({ children: [serif(text, { size: 23, bold: true })], spacing: { before: 280, after: 100 } });
}

function theadRow(labels, widths) {
  return new TableRow({ tableHeader: true, children: labels.map((lbl, i) => new TableCell({ width: { size: widths[i], type: WidthType.DXA }, borders: { top: noBorder, left: noBorder, right: noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.terracotta } }, shading: { type: ShadingType.CLEAR, fill: C.white }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [p([body(lbl, { size: 16, bold: true, color: C.terracotta })])] })) });
}

function metaRow(label, value, bold = false) {
  return new TableRow({ children: [
    new TableCell({ width: { size: 1800, type: WidthType.DXA }, borders: noBorders, shading: { type: ShadingType.CLEAR, fill: C.rowAlt }, margins: { top: 70, bottom: 70, left: 100, right: 100 }, children: [p([body(label, { size: 17, bold: true, color: C.adobe })])] }),
    new TableCell({ width: { size: 7838, type: WidthType.DXA }, borders: noBorders, shading: { type: ShadingType.CLEAR, fill: C.white }, margins: { top: 70, bottom: 70, left: 100, right: 100 }, children: [p([body(value, { size: 18, bold, color: C.darkClay })])] }),
  ]});
}

function promptBlock(promptText, isVideo = false) {
  if (isVideo) {
    return [new Paragraph({ children: [body('  Capture on set — AI generation not applicable for video  ', { size: 17, color: C.tagPostTx, italic: true })], shading: { type: ShadingType.CLEAR, fill: C.tagPost }, spacing: { before: 120, after: 200 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.tagPostTx, space: 8 } } })];
  }
  return [
    new Paragraph({ children: [body('META AI PROMPT  —  paste directly into imagine.meta.com', { size: 15, bold: true, color: C.terracotta })], spacing: { before: 160, after: 60 } }),
    new Paragraph({ children: [mono(promptText, { size: 18 })], shading: { type: ShadingType.CLEAR, fill: C.promptBg }, spacing: { before: 0, after: 0 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.promptBorder, space: 6 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.promptBorder, space: 6 }, left: { style: BorderStyle.SINGLE, size: 16, color: C.terracotta, space: 8 }, right: { style: BorderStyle.SINGLE, size: 4, color: C.promptBorder, space: 6 } } }),
    new Paragraph({ children: [body('Copy and paste the text above directly into Meta AI Imagine. Generate 4–8 variations and select the best.', { size: 16, color: C.adobe, italic: true })], spacing: { before: 60, after: 200 } }),
  ];
}

function assetBlock(item, index, isVideo = false) {
  const priorityFill  = item.priority === 'Launch' ? C.tagLaunch : C.tagPost;
  const priorityColor = item.priority === 'Launch' ? C.tagLaunchTx : C.tagPostTx;
  return [
    new Paragraph({ children: [body(`${String(index).padStart(2,'0')}  `, { size: 13, color: C.adobe }), body(item.filename, { size: 22, bold: true }), new TextRun({ text: '    ' }), tag(item.priority, priorityFill, priorityColor), ...(isVideo ? [new TextRun({ text: '  ' }), tag('VIDEO', C.tagPost, C.tagPostTx)] : [])], spacing: { before: 320, after: 80 } }),
    new Table({ width: { size: 9638, type: WidthType.DXA }, columnWidths: [1800, 7838], rows: [metaRow('Used on', item.usedOn), metaRow('Format', item.orientation), metaRow('Subject', item.subject, true), metaRow('Direction', item.direction)] }),
    ...promptBlock(item.metaPrompt, isVideo),
    new Paragraph({ children: [new TextRun({ text: '', size: 2 })], border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.outlineVar } }, spacing: { before: 80, after: 0 } }),
  ];
}

// ══════════════════════════════════════════════════════════════
// ASSET DATA
// ══════════════════════════════════════════════════════════════
const ASSETS = [
  { group: 'Hero — Homepage (2 images)', groupSub: 'First thing visitors see. These set the entire tone. Shoot with exceptional care.', items: [
    { filename: 'hero-wheel.jpg', priority: 'Launch', usedOn: 'index.html — hero section, right column top', orientation: 'Landscape · 3:2 · min 3000×2000px', subject: 'Hands shaping wet clay on a spinning pottery wheel — close-up', direction: 'Fill frame with hands and clay. Natural warm light from left. Slight motion blur on spinning clay acceptable. Hands should look experienced but human — not manicured. No face in frame.', metaPrompt: 'Close-up photograph of two hands shaping wet brown clay on a spinning pottery wheel, warm golden morning light raking from the left side, slight motion blur on the rotating clay rim, terracotta and earth tones, shallow depth of field, film grain, editorial photography style, Kinfolk magazine aesthetic, Barcelona ceramics studio, organic imperfect texture, no faces, no text, landscape format' },
    { filename: 'hero-mugs.jpg', priority: 'Launch', usedOn: 'index.html — hero section, right column bottom', orientation: 'Landscape · 3:2 · min 3000×2000px', subject: 'Row of handmade ceramic mugs on a wooden shelf in warm light', direction: 'Warm light hitting ceramic surfaces to reveal glaze texture. Slightly offset composition, not centred. Include imperfection in pieces. Earthy tones, linen background. No branding.', metaPrompt: 'Handcrafted ceramic mugs arranged on a rustic wooden shelf in a sunlit pottery studio, warm afternoon light raking across uneven glazed surfaces, terracotta and cream tones, slight imperfections in the pottery visible, shallow depth of field, analogue film photography mood, Gracia Barcelona studio atmosphere, editorial still life, no text, no branding, landscape format' },
  ]},
  { group: 'Session Type Cards (4 images)', groupSub: 'One image per session type. Used as cover photo on each session card on the Workshops page.', items: [
    { filename: 'session-classic.jpg', priority: 'Launch', usedOn: 'Workshops page — The Classic session card', orientation: 'Landscape or square · 3:2 or 1:1 · min 1600×1200px', subject: 'Single person working alone at a pottery wheel', direction: 'Focused, intentional energy. Overhead or 3/4 angle. Person absorbed in work — not looking at camera. Natural light. Slightly desaturated warm film look.', metaPrompt: 'Overhead view of a single person working alone at a pottery wheel, hands centring brown clay, natural window light, focused and meditative mood, warm earthy tones, film photography grain, slight desaturation, Gracia Barcelona ceramics studio, no eye contact with camera, editorial documentary style, shallow depth of field, no text' },
    { filename: 'session-group.jpg', priority: 'Launch', usedOn: 'Workshops page — Group Session card', orientation: 'Landscape · 16:9 or 3:2 · min 1600×1000px', subject: 'Group of 4–6 people at a studio workbench making pottery together', direction: 'Energy and togetherness without being cheesy. People talking, laughing, or concentrating. Not looking at camera. Warm studio light.', metaPrompt: 'Group of five friends making pottery together at a large wooden workbench in a sunlit ceramics studio, some laughing and chatting, some concentrating on their clay pieces, warm afternoon light, earthy clay and linen tones, candid documentary photograph, no one looking at camera, Gracia Barcelona pottery workshop, editorial style, film grain, no text' },
    { filename: 'session-date.jpg', priority: 'Launch', usedOn: 'Workshops page — Date Night session card', orientation: 'Landscape · 3:2 · min 1600×1200px', subject: 'Two pairs of hands together on the same piece of clay on a wheel', direction: 'Intimate. Focus tight on hands only — no faces required. Warm dramatic backlighting or side light. Restrained and romantic.', metaPrompt: 'Two pairs of hands together shaping the same wet clay on a pottery wheel, warm dramatic side lighting, intimate close-up, terracotta and warm skin tones, no faces visible, romantic mood without cliche, shallow depth of field, analogue film photography, editorial couples portrait, pottery studio atmosphere, no text' },
    { filename: 'session-corporate.jpg', priority: 'Launch', usedOn: 'Workshops page — Corporate Workshop card', orientation: 'Landscape · 16:9 or 3:2 · min 1600×1000px', subject: '8–10 people in a ceramics studio, mix of working and chatting', direction: 'Professional but relaxed. Casual smart clothing, no suits. Mix of focusing and talking. Full studio visible. Must not look like stock photography.', metaPrompt: 'Ten colleagues in a bright ceramics studio during a corporate team-building pottery workshop, mix of concentrating on clay and chatting, casual smart clothing in earthy neutral tones, natural daylight, full studio interior visible with pottery wheels, Gracia Barcelona, candid wide shot, warm editorial photography, genuine interactions, no posed smiles, no text' },
  ]},
  { group: 'Studio Moments Gallery (4 images)', groupSub: 'Homepage offset grid. Allow generous margins — images are rotated ±3° in CSS.', items: [
    { filename: 'studio-1.jpg', priority: 'Launch', usedOn: 'index.html — studio moments grid position 1', orientation: 'Square · 1:1 · min 1200×1200px', subject: 'Raw clay texture or clay-covered hands, macro detail', direction: 'Purely textural. The material itself. Macro or near-macro. Grain of clay visible. Abstract and evocative.', metaPrompt: 'Extreme close-up macro photograph of raw wet clay texture on a potters hands, ridges and grooves in earthy terracotta clay, warm natural light, film grain, analogue photography mood, abstract textural composition, earth tones, no faces, no text, square format' },
    { filename: 'studio-2.jpg', priority: 'Launch', usedOn: 'index.html — studio moments grid position 2', orientation: 'Portrait · 3:4 · min 1000×1400px', subject: 'Finished ceramic bowls or mugs arranged on a shelf', direction: 'Warm raking light across surfaces reveals glaze variation. Slight imperfection in pieces is correct. Slightly offset composition.', metaPrompt: 'Handmade ceramic bowls and mugs on wooden shelving in a ceramics studio, warm directional light raking across glazed surfaces revealing texture and imperfections, cream terracotta and sage tones, analogue film photography, editorial still life, Kinfolk magazine aesthetic, shallow depth of field, no text, portrait orientation' },
    { filename: 'studio-3.jpg', priority: 'Launch', usedOn: 'index.html — studio moments grid position 3', orientation: 'Landscape · 4:3 · min 1400×1050px', subject: 'Studio interior — wheels, light, the atmosphere of the space', direction: 'Empty or one person in background. Late morning light through windows. Warm, spacious, craft atmosphere.', metaPrompt: 'Interior of a ceramics studio in Barcelona Gracia neighbourhood, late morning sunlight streaming through large windows, pottery wheels in rows, warm linen and terracotta tones, one blurred figure working in background, analogue photography, earthy editorial atmosphere, Kinfolk magazine style, film grain, no text' },
    { filename: 'studio-4.jpg', priority: 'Launch', usedOn: 'index.html — studio moments grid position 4', orientation: 'Square · 1:1 · min 1200×1200px', subject: 'Detail — pottery tools, apron, or a textured studio surface', direction: 'Abstract evocative detail. Wooden tools on bench, a glazing brush, the kiln door handle, or a clay-dusted apron. Atmospheric not literal.', metaPrompt: 'Close-up detail of vintage wooden pottery tools resting on a clay-dusted workbench in a ceramics studio, warm ambient light, terracotta and brown earth tones, film photography grain, analogue editorial still life, atmospheric and tactile, no text, square format, Gracia Barcelona studio' },
  ]},
  { group: 'About / Studio Page (3 images + portrait)', groupSub: 'Used on pages/studio.html. More journalistic and editorial — these tell the story of the space.', items: [
    { filename: 'studio-hero.jpg', priority: 'Launch', usedOn: 'pages/studio.html — full-width hero', orientation: 'Landscape · 16:9 or 3:2 · min 2400×1400px', subject: 'Full studio interior, wide establishing shot', direction: 'All six wheels visible if possible. Golden-hour or late-morning light. Welcoming and substantial. Like opening a magazine spread on the studio.', metaPrompt: 'Wide interior photograph of a ceramics studio in Gracia Barcelona, six pottery wheels visible, warm golden morning light from large windows, exposed plaster walls, wooden shelving with ceramic pieces, earthy warm tones, analogue film photography, editorial magazine style, welcoming and spacious atmosphere, no people, no text, landscape format' },
    { filename: 'studio-space-1.jpg', priority: 'Launch', usedOn: 'pages/studio.html — The Space section left column', orientation: 'Portrait · 3:4 · min 1000×1400px', subject: 'Two or three pottery wheels in the studio, close-medium shot', direction: 'Craft infrastructure. The wheels as objects. Warm light. Clay residue on wheel pans is correct.', metaPrompt: 'Two pottery wheels in a ceramics studio, clay residue on the wheel pans and surrounding surfaces, warm natural sidelight, terracotta and wooden tones, analogue film photography, close-medium editorial shot, no people, Gracia Barcelona studio atmosphere, shallow depth of field, no text, portrait orientation' },
    { filename: 'studio-space-2.jpg', priority: 'Launch', usedOn: 'pages/studio.html — The Space section right column', orientation: 'Portrait · 3:4 · min 1000×1400px', subject: 'Kiln or drying shelves with unfired pieces', direction: 'The production side of the studio. Unfired pieces drying, or kiln door. Warm industrial-craft atmosphere.', metaPrompt: 'Rows of unfired clay pottery pieces drying on wooden shelves in a ceramics studio, warm ambient light, raw clay and terracotta tones, industrial craft atmosphere, analogue documentary photography, Gracia Barcelona, no people, earthy editorial style, film grain, portrait orientation, no text' },
    { filename: 'instructor.jpg', priority: 'Launch', usedOn: 'pages/studio.html — instructor bio, circular crop (CSS border-radius:50%)', orientation: 'Square or portrait · shoot 4:5, face centred · min 800×800px', subject: 'Studio instructor — natural portrait in studio environment', direction: 'IMPORTANT: CSS crops to circle. Shoot with 30% clearance on all sides of the face. Natural light. Instructor at wheel looking up is ideal. Avoid white backgrounds.', metaPrompt: 'Portrait photograph of a female ceramics instructor in her studio looking up from a pottery wheel, warm natural window light, clay on her hands, wearing a linen apron, earthy warm tones, Gracia Barcelona studio background, analogue photography, natural relaxed expression, editorial portrait style, film grain, no text — IMPORTANT: square crop, face centred with large margin on all sides for circular cropping' },
  ]},
  { group: 'Video Assets (2 — post-launch)', groupSub: 'Not required for launch. Capture on the same shoot day to avoid a second session.', isVideo: true, items: [
    { filename: 'hero-loop.mp4', priority: 'Post-launch', usedOn: 'index.html — hero background loop (future)', orientation: '16:9 · 1920×1080 min (4K preferred) · 8–12 sec seamless loop · No audio', subject: 'Hands centring clay on wheel — seamless loop, no audio', direction: 'Start and end frames must match for invisible looping. Shoot at 60fps, slow to ~24fps in edit for tactile feel. Will have warm 40% opacity tint applied in CSS.', metaPrompt: 'N/A — video asset, capture on set. Brief: slow-motion close-up of hands centring wet clay on a pottery wheel, 60fps, warm studio light, seamless loop with matching start and end frames, earthy tones, no audio track' },
    { filename: 'studio-intro.mp4', priority: 'Post-launch', usedOn: 'pages/studio.html — embedded studio documentary (future)', orientation: '16:9 · 1920×1080 min (4K preferred) · 60–90 sec · Stereo ambient audio', subject: 'Short documentary intro to the studio and instructor', direction: 'Sequence: street → studio entrance → interior → instructor at wheel → group session → finished pieces → studio at rest. No voiceover. Ambient sound only. Edit like a short film, not a promo.', metaPrompt: 'N/A — video asset, capture on set. Brief: editorial 60–90 sec short film, sequence: street exterior → studio door → interior wide → clay work close-ups → group laughing → finished ceramics → empty studio. Ambient audio. Warm analogue colour grade.' },
  ]},
];

function buildAllItems() {
  let idx = 1;
  const blocks = [];
  for (const group of ASSETS) {
    blocks.push(...sectionHead(group.group, group.groupSub));
    for (const item of group.items) {
      blocks.push(...assetBlock(item, idx++, group.isVideo || false));
    }
  }
  return blocks;
}

const doc = new Document({
  styles: { default: { document: { run: { font: 'Arial', size: 20, color: C.darkClay } } } },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } }, run: { font: 'Arial', size: 20, color: C.terracotta } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: { default: new Header({ children: [new Paragraph({ children: [serif('El Taller Barcelona', { size: 18, bold: true, color: C.terracotta }), body('   ·   Image & Video Brief — with Meta AI Prompts', { size: 17, color: C.adobe })], border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: C.outlineVar, space: 6 } }, spacing: { after: 0 } })] }) },
    footers:  { default: new Footer({ children: [new Paragraph({ children: [body('El Taller · imagine.meta.com   ', { size: 15, color: C.adobe }), body('Page ', { size: 15, color: C.adobe }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 15, color: C.adobe })], border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.outlineVar, space: 6 } }, spacing: { before: 100 } })] }) },
    children: [
      // ── COVER ──────────────────────────────────────────────
      gap(),
      new Paragraph({ children: [serif('El Taller', { size: 72, bold: true, color: C.terracotta })], spacing: { before: 600, after: 80 } }),
      new Paragraph({ children: [serif('Image & Video Production Brief', { size: 38, italic: true })], spacing: { before: 0, after: 80 } }),
      new Paragraph({ children: [body('With Meta AI generation prompts for each asset', { size: 22, color: C.adobe })], spacing: { before: 0, after: 400 } }),
      new Paragraph({ children: [new TextRun({ text: '', size: 2 })], border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: C.terracotta } }, spacing: { before: 0, after: 280 } }),

      // Cover summary table
      new Table({ width: { size: 9638, type: WidthType.DXA }, columnWidths: [3000, 6638], rows:
        [['Studio', 'El Taller · Carrer de la Perla, 12 · Gràcia · Barcelona'], ['Design direction', 'The Tactile Archivist — earthy, editorial, analogue'], ['Photos required', '13 images — all required for launch'], ['Videos required', '2 videos — post-launch, capture on same shoot day'], ['AI tool', 'Meta AI Imagine — imagine.meta.com'], ['Prompt compatibility', 'Prompts also work with Midjourney and Adobe Firefly']].map(([k, v], i) =>
          new TableRow({ children: [new TableCell({ width: { size: 3000, type: WidthType.DXA }, borders: noBorders, shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? C.rowAlt : C.white }, margins: { top: 90, bottom: 90, left: 120, right: 120 }, children: [p([body(k, { size: 18, bold: true, color: C.adobe })])] }), new TableCell({ width: { size: 6638, type: WidthType.DXA }, borders: noBorders, shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? C.rowAlt : C.white }, margins: { top: 90, bottom: 90, left: 120, right: 120 }, children: [p([body(v, { size: 18 })])] })] }))
      }),

      gap(),

      // ── HOW TO USE PROMPTS ─────────────────────────────────
      ...sectionHead('How to use these prompts'),
      p([body('Each image entry includes a Meta AI prompt tuned to El Taller\'s "Tactile Archivist" visual direction — warm, editorial, analogue. Prompts also work in Midjourney and Adobe Firefly.', { size: 20 })], { after: 160 }),
      subHead('Step by step'),
      ...['Go to imagine.meta.com (or use Meta AI in WhatsApp / Instagram)', 'Copy the prompt exactly from the shaded box under each image entry', 'Paste into Meta AI and generate — produce 4–8 variations', 'Select the best 2–3 and download at maximum resolution', 'Save with the exact filename listed (e.g. hero-wheel.jpg) and place in assets/images/', 'If the mood is wrong, append: ", editorial film photography, warm morning light, no artificial lighting"'].map(txt => new Paragraph({ children: [body(txt, { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 60, after: 60 } })),
      gap(),
      subHead('Refinement tips'),
      ...['Too clean / digital: add "film grain, analog photography, slight imperfection"', 'Too dark / moody: add "warm afternoon light, bright airy studio"', 'People look posed: add "candid, no eye contact with camera, genuine expression"', 'Instructor portrait: always include "face centred with generous margin on all sides" for the circular CSS crop', 'Midjourney users: append "--ar 3:2" or "--ar 16:9" for aspect ratio control'].map(txt => new Paragraph({ children: [body(txt, { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 60, after: 60 } })),
      gap(),
      p([body('Note: ', { size: 20, bold: true }), body('AI images work well for drafts and placeholders. For launch — especially the hero and instructor portrait — real photography is recommended. These prompts also serve as a photographer brief.', { size: 20 })], { after: 300 }),

      // ── ALL ASSET BLOCKS ───────────────────────────────────
      ...buildAllItems(),

      gap(),

      // ── CHECKLIST ──────────────────────────────────────────
      ...sectionHead('Delivery checklist'),
      p([body('Track progress and sign off each asset before handoff. Save with exact filenames — the website HTML references these directly.', { size: 20 })], { after: 200 }),

      new Table({ width: { size: 9638, type: WidthType.DXA }, columnWidths: [500, 2600, 1300, 1400, 3838], rows: [
        theadRow(['#', 'Filename', 'Type', 'Priority', 'Status'], [500, 2600, 1300, 1400, 3838]),
        ...(() => {
          const rows = []; let i = 1;
          for (const group of ASSETS) {
            for (const item of group.items) {
              const bg = group.isVideo ? 'EEF0FB' : (i % 2 === 0 ? C.rowAlt : C.white);
              rows.push(new TableRow({ children: [String(i), item.filename, group.isVideo ? 'Video' : 'Photo', item.priority, '☐  Not started'].map((val, ci) => new TableCell({ width: { size: [500,2600,1300,1400,3838][ci], type: WidthType.DXA }, borders: { top: noBorder, left: noBorder, right: noBorder, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.outlineVar } }, shading: { type: ShadingType.CLEAR, fill: bg }, margins: { top: 90, bottom: 90, left: 100, right: 100 }, children: [p([body(val, { size: ci===1?19:17, bold: ci===1, color: ci===3&&item.priority==='Post-launch'?C.adobe:C.darkClay, italic: ci===3&&item.priority==='Post-launch' })])] })) }));
              i++;
            }
          }
          return rows;
        })(),
      ]}),

      gap(),

      new Paragraph({ children: [new TextRun({ text: '', size: 2 })], border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.outlineVar } }, spacing: { before: 200, after: 200 } }),
      p([body('Questions? ', { size: 20, bold: true }), body('hola@eltaller.barcelona', { size: 20, color: C.terracotta })], { after: 80 }),
      p([body('El Taller · Carrer de la Perla, 12 · 08012 Barcelona · Gràcia', { size: 18, color: C.adobe, italic: true })]),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('el-taller-media-brief.docx', buf);
  console.log('Done');
});
