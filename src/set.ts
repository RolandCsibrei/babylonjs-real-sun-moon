/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function set(object: any, property: string, value: any) {
  const key = property as keyof typeof object;
  object[key] = value;
}
