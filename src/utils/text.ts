// Every screen counts its own rows so it can fit the terminal. These helpers
// give that count: text is wrapped here, not by Ink.

const isWide = (cp: number): boolean =>
  (cp >= 0x1100 && cp <= 0x115f) ||
  (cp >= 0x2e80 && cp <= 0xa4cf) ||
  (cp >= 0xac00 && cp <= 0xd7a3) ||
  (cp >= 0xf900 && cp <= 0xfaff) ||
  (cp >= 0xfe30 && cp <= 0xfe6f) ||
  (cp >= 0xff00 && cp <= 0xff60) ||
  (cp >= 0x1f300 && cp <= 0x1faff);

const isZeroWidth = (cp: number): boolean =>
  cp === 0x200d || (cp >= 0xfe00 && cp <= 0xfe0f) || (cp >= 0x300 && cp <= 0x36f);

export function displayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    const cp = char.codePointAt(0) ?? 0;
    if (!isZeroWidth(cp)) width += isWide(cp) ? 2 : 1;
  }
  return width;
}

function splitLongWord(word: string, limit: number): string[] {
  const pieces: string[] = [];
  let current = '';
  for (const char of word) {
    if (current && displayWidth(current + char) > limit) {
      pieces.push(current);
      current = '';
    }
    current += char;
  }
  if (current) pieces.push(current);
  return pieces;
}

// Wraps on spaces. List items keep a hanging indent. Use NBSP to keep words together.
export function wrapText(text: string, width: number): string[] {
  const limit = Math.max(1, width);
  const lines: string[] = [];

  for (const paragraph of text.split('\n')) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }

    const lead = paragraph.match(/^[ ]*(?:(?:•|\d+\.)[ ]+)?/)?.[0] ?? '';
    const hang = ' '.repeat(Math.min(displayWidth(lead), Math.floor(limit / 2)));
    const words = paragraph.slice(lead.length).split(/[ \t]+/).filter(Boolean);
    let current = lead;
    let hasWord = false;

    for (const word of words) {
      const gap = hasWord ? 1 : 0;
      if (displayWidth(current) + gap + displayWidth(word) <= limit) {
        current += (hasWord ? ' ' : '') + word;
        hasWord = true;
        continue;
      }
      if (hasWord) lines.push(current);
      const pieces = splitLongWord(word, Math.max(1, limit - hang.length));
      pieces.slice(0, -1).forEach((piece) => lines.push(hang + piece));
      current = hang + pieces[pieces.length - 1];
      hasWord = true;
    }
    lines.push(current);
  }
  return lines;
}

// Turns block-level Markdown from the model into plain terminal text.
export function formatReply(text: string): string {
  const lines = text
    .replace(/\r/g, '')
    .replace(/\t/g, '  ')
    .split('\n')
    .filter((line) => !/^\s*```/.test(line))
    .map((line) => {
      if (/^\s*([-*_])\1{2,}\s*$/.test(line)) return '';
      const heading = line.match(/^#{1,6}\s+(.*)$/);
      if (heading) return `**${heading[1].replace(/\*\*/g, '')}**`;
      return line.replace(/^(\s*)[-*+]\s+/, '$1• ');
    });
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Closes and reopens **bold** when a line wrap falls inside it.
export function balanceBold(lines: string[]): string[] {
  let open = false;
  return lines.map((line) => {
    if (line.trim() === '') {
      open = false;
      return line;
    }
    const indent = line.match(/^ */)?.[0] ?? '';
    const body = line.slice(indent.length);
    const markers = (body.match(/\*\*/g) ?? []).length;
    const output = indent + (open ? '**' : '') + body;
    if (markers % 2 === 1) open = !open;
    return open ? `${output}**` : output;
  });
}

// Joins terms so that wrapping only breaks between them, never inside one.
export function joinTerms(terms: string[]): string {
  return terms.map((term) => term.replace(/ /g, ' ')).join(' · ');
}
