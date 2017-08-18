import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';

export class Common extends Observable {
  public message: string;

  constructor() {
    super();
    this.message = Utils.SUCCESS_MSG();

  }

  public greet() {
    return "Hello, NS";
  }

  /**
     * https://stackoverflow.com/questions/6701948/efficient-way-to-compare-version-strings-in-java
     * <p/>
     * Compares two version strings.
     * <p/>
     * Use this instead of String.compareTo() for a non-lexicographical
     * comparison that works for version strings. e.g. "1.10".compareTo("1.6").
     *
     * @param str1 a string of ordinal numbers separated by decimal points.
     * @param str2 a string of ordinal numbers separated by decimal points.
     * @return The result is a negative integer if str1 is _numerically_ less than str2.
     * The result is a positive integer if str1 is _numerically_ greater than str2.
     * The result is zero if the strings are _numerically_ equal.
     * @note It does not work if "1.10" is supposed to be equal to "1.10.0".
     */
  public static versionCompareNumerically(str1: string, str2: string): number {
     /**
      // String[] vals1 = str1.split("\\.");
      // String[] vals2 = str2.split("\\.");
      // int i = 0;
      // // set index to first non-equal ordinal or length of shortest version string
      // while (i < vals1.length && i < vals2.length && vals1[i].equals(vals2[i])) {
      //     i++;
      // }
      // try {
      //     // compare first non-equal ordinal number
      //     if (i < vals1.length && i < vals2.length) {
      //         int diff = Integer.valueOf(vals1[i]).compareTo(Integer.valueOf(vals2[i]));
      //         return Integer.signum(diff);
      //     }
      //     // the strings are equal or one string is a substring of the other
      //     // e.g. "1.2.3" = "1.2.3" or "1.2.3" < "1.2.3.4"
      //     else {
      //         return Integer.signum(vals1.length - vals2.length);
      //     }
      // } catch (NumberFormatException e) {
      //     // Possibly there are different versions of the app in the store, so we can't check.
      //     return 0;
      // }
      */
      return 0
  }

}

export class Utils {
  public static SUCCESS_MSG(): string {
    let msg = `Your plugin is working on ${app.android ? 'Android' : 'iOS'}.`;

    setTimeout(() => {
      dialogs.alert(`${msg} For real. It's really working :)`).then(() => console.log(`Dialog closed.`));
    }, 2000);

    return msg;
  }
}
