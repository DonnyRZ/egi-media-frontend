export function copyKey(prefix: string, key: string) {
  return `${prefix}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
}
