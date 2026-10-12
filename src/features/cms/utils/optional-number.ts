/** Empty optional numeric inputs stay null; Number(null) would incorrectly become zero. */
export function optionalNumber(value: string | number | null | undefined) {
  return value === "" || value === null || value === undefined
    ? null
    : Number(value);
}
