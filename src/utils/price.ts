export function parsePrice(text: string): number {
  const matches = text.match(/\$([\d,]+\.\d{2})/g);
  if (!matches || matches.length === 0) {
    throw new Error(`No price found in "${text}"`);
  }
  // When a promo shows a struck-through price followed by the current one
  // (e.g. "$40.54 $14.22"), the current price is always the last match.
  const last = matches[matches.length - 1];
  return parseFloat(last.slice(1).replace(',', ''));
}
