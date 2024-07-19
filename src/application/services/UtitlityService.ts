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
}