/**
 * Replaces {name} in any copy string with the celebrant's name, so the
 * config stays readable and the name only has to be set in one place.
 */
export function personalize(value, name) {
  if (typeof value === 'string') return value.replaceAll('{name}', name);
  if (Array.isArray(value)) return value.map((v) => personalize(v, name));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, personalize(v, name)])
    );
  }
  return value;
}
