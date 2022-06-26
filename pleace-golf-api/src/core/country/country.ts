/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { CountryCode } from "./country-code";

export class Country {
    //name: string;
    //nationality: string;
    //continent: string;
    //hasSubdivision: boolean; // Wether the country has children countries (countries that have a subdivision code that contains this countries alpha2 code
    //code?: CountryCode;
    //alternateNames?: string[];


    constructor(public name: string, public nationality: string, public continent: string, public hasSubdivision: boolean, 
        public code?: CountryCode, public alternateNames?: string[],public isState?:boolean) {

    }

    /**
    * Get Code
    * @returns {string} Returns a string with the alpha2 or subdivision code.
    */
    getCode(): string {
        return this.code.alpha2 ? this.code.alpha2 : this.code.subdivision;
    }
}
