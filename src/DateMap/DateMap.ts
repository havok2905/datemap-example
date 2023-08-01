import { IDateMap } from './types';

/**
 * DateMap acts like a dictionary that supports two methods
 * - put() insert a new date with an associated value of string.
 * - get(date) fetch an item from the dictionary by date. If there is no match,
 * return the last prior date. Otherwise return null;
 * 
 * This class caches sorted entires on each insert. This favors a read heavy use
 * of the dictionary, but makes writes far more expensive.
 */
export class DateMap implements IDateMap {
  private lookupTable: Record<string, string> = {};
  private sortedEntries: Array<[string, string]> = [];

  private getDateKeyFromDate(date: Date): string {
    return date.toString();
  };

  private getDateFromKey(dateString: string) {
    return new Date(dateString);
  }

  private getSortedEntriesByDate(): Array<[string, string]> {
    return Object.entries(this.lookupTable).sort((a, b) => {
      const aKey = a[0];
      const bKey = b[0];

      const aDate = this.getDateFromKey(aKey);
      const bDate = this.getDateFromKey(bKey);

      if (aDate > bDate) {
        return 1;
      } else if (aDate < bDate) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private isDateValid(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  get(date: Date): string | null {
    // Guard against invalid date
    if (!this.isDateValid(date)) return null;

    const targetDateKeyFromDate = this.getDateKeyFromDate(date);
    
    // If we have a match, return the value instantly.
    if (this.lookupTable[targetDateKeyFromDate]) return this.lookupTable[targetDateKeyFromDate];

    // Guard against an empty list.
    if (!this.sortedEntries.length) return null;

    // Guard against a target date that has no earlier match.
    const firstDate = this.getDateFromKey(this.sortedEntries[0][0]);
    if (date < firstDate) return null;

    /**
     * If we don't have an exact match fetch the date directly prior to our target.
     * 
     * This works for a few reasons:
     * 1. The array size at this point is always greater than 0, meaning we can't get an out of bounds error fetching the last item.
     * 2. We already check for an exact match and for a date that can have no direct prior date. We must have a prior dates available in the list.
     * 3. Because we're sorted we can just filter out dates earlier than our target and grab the tail of the list.
     */
    const datesLessThanTarget = this.sortedEntries.filter(([key]) => this.getDateFromKey(key) < date);
    const priorDateValuePair = datesLessThanTarget[datesLessThanTarget.length - 1];
    return priorDateValuePair[1];
  }

  put(date: Date, value: string): void {
    const key = this.getDateKeyFromDate(date);
    const alreadyHadValue = !!this.lookupTable[key];
    
    this.lookupTable[key] = value;

    /**
     * If we already have an item defined before the insertion into the lookup table,
     * that means our cache is dirty and needs refreshing.
     */
    if (!alreadyHadValue) {
      this.sortedEntries = this.getSortedEntriesByDate();
    }
  }
}
