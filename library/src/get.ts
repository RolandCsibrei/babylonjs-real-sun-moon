/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export function get<T>(object: any, property: string, defaultValue?: any) {
  const key = property as keyof typeof object;
  return <T>(object[key] === undefined ? defaultValue : object[key]);
}
