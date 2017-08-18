import { Observable } from 'tns-core-modules/data/observable';
export declare class Common extends Observable {
    message: string;
    constructor();
    greet(): string;
    static versionCompareNumerically(str1: string, str2: string): number;
}
export declare class Utils {
    static SUCCESS_MSG(): string;
}
