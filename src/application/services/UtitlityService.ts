export class utilityService {

  /**
   * Generates a Universally Unique Identifier (UUID).
   * @returns A string containing a randomly generated UUID.
   */
  genereateUUID() {
    // Returns a string containing a randomly generated UUID.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Returns the day of the week for a given date.
   * @param date - The date for which to get the day of the week.
   * @returns The day of the week as a string.
   */
  getDayOfTheWeek(date: Date): string {
    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SUNDAY'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }

  /**
 * Processes an array in batches and returns the results as a nested array.
 *
 * @param array - The array to process in batches.
 * @param processBatch - The function that processes each batch of the array.
 * @param batchSize - The size of each batch. Defaults to 100.
 * @returns A promise that resolves to a nested array of results.
 */
  async processArrayInBatches<T, R>(
    array: T[],
    processBatch: (batch: T[]) => Promise<R[]>,
    batchSize: number = 100,
  ): Promise<R[][]> {
    const results: R[][] = [];

    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);
      const batchResult = await processBatch(batch);
      console.log(`Batch from ${i} to ${i + batchSize} processed`);

      results.push(batchResult);
    }

    return results;
  }
}