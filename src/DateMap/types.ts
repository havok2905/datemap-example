export interface IDateMap {
  get(date: Date): string | null;
  put(date: Date, value: string): void;
}
