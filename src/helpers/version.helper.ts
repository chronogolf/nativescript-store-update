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

    return (
      a.length > index && (b.length <= index || parseInt(a[index], 10) > parseInt(b[index], 10))
    )
  }

  private static _compareVersions(left: string, right: string): number {
    const a = left.split('.')
    const b = right.split('.')

    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const aInt = parseInt(a[i], 10)
      const bInt = parseInt(b[i], 10)
      if ((a[i] && !b[i] && aInt > 0) || aInt > bInt) return 1
      if ((b[i] && !a[i] && bInt > 0) || aInt < bInt) return -1
    }
    return 0
  }
}
