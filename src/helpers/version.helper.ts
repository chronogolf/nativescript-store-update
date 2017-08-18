export class VersionHelper {

  public static isHigher(left: string, right: string): boolean {
    return this._compareVersions(left, right) > 0
  }

  public static isEqualOrHigher(left: string, right: string): boolean {
    return this._compareVersions(left, right) !== -1
  }

  // A.b.c.d
  public static isMajorUpdate(left: string, right: string): boolean {
    return this._isIndexSectionHigher(left, right, 0)
  }

  // a.B.c.d
  public static isMinorUpdate(left: string, right: string): boolean {
    return this._isIndexSectionHigher(left, right, 1)
  }

  // a.b.C.d
  public static isPatchUpdate(left: string, right: string): boolean {
    return this._isIndexSectionHigher(left, right, 2)
  }

  // a.b.c.D
  public static isRevisionUpdate(left: string, right: string): boolean {
    return this._isIndexSectionHigher(left, right, 3)
  }

  /*
   *  Private
   */

  private static _isIndexSectionHigher(left: string, right: string, index: number): boolean {
    const a = left.split('.')
    const b = right.split('.')

    return (a.length > index) &&
      (b.length <= index || parseInt(a[index]) > parseInt(b[index]))
  }

  private static _compareVersions(left: string, right: string): number {
    const a = left.split('.')
    const b = right.split('.')

    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const a_int = parseInt(a[i])
      const b_int = parseInt(b[i])
      if ((a[i] && !b[i] && a_int > 0) || (a_int > b_int)) return 1;
      if ((b[i] && !a[i] && b_int > 0) || (a_int < b_int)) return -1;
    }
    return 0;
  }
}
