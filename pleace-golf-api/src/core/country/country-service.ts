/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as _ from "lodash";
import config from '../../config';
import { Logger } from "../logging";
import * as countries from "../../../countries.json";
import * as continents from "../../../continents.json";
import { CountryCodeType } from "./country-code-type.enum";
import { Country } from "./country";
import { Continent } from "./continent";

export class CountryService {

    constructor() {
    }

    mapCountry(country: any) {

        if (!country) {
            return null;
        }

        return new Country(
            country.name,
            country.nationality,
            country.continent,
            country.hasSubdivision,
            country.code,
            country.alternateNames,
            country.isState
        );
    }

    getCountries(): Country[] {
        return _.map(countries, (country) => {
            return this.mapCountry(country);
        });
    }

    // Only Alpha2OrSubdivision type
    getCountryCodes(): string[] {
        return _.map(countries, (country) => {
            return country.code.alpha2 ? country.code.alpha2 : country.code.subdivision;
        });
    }

    getContinentCountryCodes(code: string): string[] {
        let countryCodes = _.map(countries, (country) => {
            return country.continent === code ? (country.code.alpha2 ? country.code.alpha2 : country.code.subdivision) : null;
        });

        return _.reject(countryCodes, _.isNull);
    }

    getCountryCodesByContinent() {
        let continentMap : any = {};

        _.each(continents, (continent) => {
            continentMap[continent.code] = this.getContinentCountryCodes(continent.code);
        });
        return continentMap;
    }

    getContinents(): Continent[] {
        return continents;
    }

    private countryCodeTypeToAttribute(countryCodeType: CountryCodeType) {
        let countryCodeTypeAttribute: any;

        switch (countryCodeType) {
            case CountryCodeType.Numeric:
                countryCodeTypeAttribute = "numeric";
                break;
            case CountryCodeType.Alpha2:
                countryCodeTypeAttribute = "alpha2";
                break;
            case CountryCodeType.Alpha3:
                countryCodeTypeAttribute = "alpha3";
                break;
            case CountryCodeType.Subdivision:
                countryCodeTypeAttribute = "subdivision";
                break;
            case CountryCodeType.Alpha2OrSubdivision:
                countryCodeTypeAttribute = "alpha2,subdivision";
                break;
            default:
                throw new Error(`Invalid country code type: ${countryCodeType}`);
        }
        return countryCodeTypeAttribute;
    }

    getCountry(countryCode: string, countryCodeType: CountryCodeType): Country {
        let countryCodeTypeAttribute: any = this.countryCodeTypeToAttribute(countryCodeType);

        if (countryCodeTypeAttribute === "alpha2,subdivision") {
            return this.mapCountry(_.find(countries, function (country) {
                return country.code.alpha2 === countryCode || country.code.subdivision === countryCode;
            }));
        }
        else {
            return this.mapCountry(_.find(countries, function (country) {
                return (country.code as any)[countryCodeTypeAttribute] === countryCode;
            }));
        }
    }

    getCountryByName(countryName: string): Country {
        const formattedCountryName = countryName.toLowerCase();
        return this.mapCountry(_.find(countries, function (country) {
            const alternateNameMatch = _.some(country.alternateNames, function(alternateName) {
                return alternateName.toLowerCase() === formattedCountryName;
            });

            return country.name.toLowerCase() === formattedCountryName || alternateNameMatch;
        }));
    }

    getCountryCodeByName(countryName: string): string {
       let country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
       if(country) {
           if(country.code.alpha2) {
               return country.code.alpha2;
           } else if(country.code.subdivision) {
               return country.code.subdivision;
           } else {
               return "";
           }
       }
    }
}
