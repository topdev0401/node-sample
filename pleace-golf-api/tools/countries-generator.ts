import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";
const openBookPricesCountryList = require('country-data').countries;

// Taken from https://github.com/Dinuks/country-nationality-list (https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json)
// Values used: num_code & nationality
const dinuksCountryList = [
    {
        "num_code": "4",
        "alpha_2_code": "AF",
        "alpha_3_code": "AFG",
        "en_short_name": "Afghanistan",
        "nationality": "Afghan"
    },
    {
        "num_code": "248",
        "alpha_2_code": "AX",
        "alpha_3_code": "ALA",
        "en_short_name": "\u00c5land Islands",
        "nationality": "\u00c5land Island"
    },
    {
        "num_code": "8",
        "alpha_2_code": "AL",
        "alpha_3_code": "ALB",
        "en_short_name": "Albania",
        "nationality": "Albanian"
    },
    {
        "num_code": "12",
        "alpha_2_code": "DZ",
        "alpha_3_code": "DZA",
        "en_short_name": "Algeria",
        "nationality": "Algerian"
    },
    {
        "num_code": "16",
        "alpha_2_code": "AS",
        "alpha_3_code": "ASM",
        "en_short_name": "American Samoa",
        "nationality": "American Samoan"
    },
    {
        "num_code": "20",
        "alpha_2_code": "AD",
        "alpha_3_code": "AND",
        "en_short_name": "Andorra",
        "nationality": "Andorran"
    },
    {
        "num_code": "24",
        "alpha_2_code": "AO",
        "alpha_3_code": "AGO",
        "en_short_name": "Angola",
        "nationality": "Angolan"
    },
    {
        "num_code": "660",
        "alpha_2_code": "AI",
        "alpha_3_code": "AIA",
        "en_short_name": "Anguilla",
        "nationality": "Anguillan"
    },
    {
        "num_code": "10",
        "alpha_2_code": "AQ",
        "alpha_3_code": "ATA",
        "en_short_name": "Antarctica",
        "nationality": "Antarctic"
    },
    {
        "num_code": "28",
        "alpha_2_code": "AG",
        "alpha_3_code": "ATG",
        "en_short_name": "Antigua and Barbuda",
        "nationality": "Antiguan or Barbudan"
    },
    {
        "num_code": "32",
        "alpha_2_code": "AR",
        "alpha_3_code": "ARG",
        "en_short_name": "Argentina",
        "nationality": "Argentine"
    },
    {
        "num_code": "51",
        "alpha_2_code": "AM",
        "alpha_3_code": "ARM",
        "en_short_name": "Armenia",
        "nationality": "Armenian"
    },
    {
        "num_code": "533",
        "alpha_2_code": "AW",
        "alpha_3_code": "ABW",
        "en_short_name": "Aruba",
        "nationality": "Aruban"
    },
    {
        "num_code": "36",
        "alpha_2_code": "AU",
        "alpha_3_code": "AUS",
        "en_short_name": "Australia",
        "nationality": "Australian"
    },
    {
        "num_code": "40",
        "alpha_2_code": "AT",
        "alpha_3_code": "AUT",
        "en_short_name": "Austria",
        "nationality": "Austrian"
    },
    {
        "num_code": "31",
        "alpha_2_code": "AZ",
        "alpha_3_code": "AZE",
        "en_short_name": "Azerbaijan",
        "nationality": "Azerbaijani, Azeri"
    },
    {
        "num_code": "44",
        "alpha_2_code": "BS",
        "alpha_3_code": "BHS",
        "en_short_name": "Bahamas",
        "nationality": "Bahamian"
    },
    {
        "num_code": "48",
        "alpha_2_code": "BH",
        "alpha_3_code": "BHR",
        "en_short_name": "Bahrain",
        "nationality": "Bahraini"
    },
    {
        "num_code": "50",
        "alpha_2_code": "BD",
        "alpha_3_code": "BGD",
        "en_short_name": "Bangladesh",
        "nationality": "Bangladeshi"
    },
    {
        "num_code": "52",
        "alpha_2_code": "BB",
        "alpha_3_code": "BRB",
        "en_short_name": "Barbados",
        "nationality": "Barbadian"
    },
    {
        "num_code": "112",
        "alpha_2_code": "BY",
        "alpha_3_code": "BLR",
        "en_short_name": "Belarus",
        "nationality": "Belarusian"
    },
    {
        "num_code": "56",
        "alpha_2_code": "BE",
        "alpha_3_code": "BEL",
        "en_short_name": "Belgium",
        "nationality": "Belgian"
    },
    {
        "num_code": "84",
        "alpha_2_code": "BZ",
        "alpha_3_code": "BLZ",
        "en_short_name": "Belize",
        "nationality": "Belizean"
    },
    {
        "num_code": "204",
        "alpha_2_code": "BJ",
        "alpha_3_code": "BEN",
        "en_short_name": "Benin",
        "nationality": "Beninese, Beninois"
    },
    {
        "num_code": "60",
        "alpha_2_code": "BM",
        "alpha_3_code": "BMU",
        "en_short_name": "Bermuda",
        "nationality": "Bermudian, Bermudan"
    },
    {
        "num_code": "64",
        "alpha_2_code": "BT",
        "alpha_3_code": "BTN",
        "en_short_name": "Bhutan",
        "nationality": "Bhutanese"
    },
    {
        "num_code": "68",
        "alpha_2_code": "BO",
        "alpha_3_code": "BOL",
        "en_short_name": "Bolivia (Plurinational State of)",
        "nationality": "Bolivian"
    },
    {
        "num_code": "535",
        "alpha_2_code": "BQ",
        "alpha_3_code": "BES",
        "en_short_name": "Bonaire, Sint Eustatius and Saba",
        "nationality": "Bonaire"
    },
    {
        "num_code": "70",
        "alpha_2_code": "BA",
        "alpha_3_code": "BIH",
        "en_short_name": "Bosnia and Herzegovina",
        "nationality": "Bosnian or Herzegovinian"
    },
    {
        "num_code": "72",
        "alpha_2_code": "BW",
        "alpha_3_code": "BWA",
        "en_short_name": "Botswana",
        "nationality": "Motswana, Botswanan"
    },
    {
        "num_code": "74",
        "alpha_2_code": "BV",
        "alpha_3_code": "BVT",
        "en_short_name": "Bouvet Island",
        "nationality": "Bouvet Island"
    },
    {
        "num_code": "76",
        "alpha_2_code": "BR",
        "alpha_3_code": "BRA",
        "en_short_name": "Brazil",
        "nationality": "Brazilian"
    },
    {
        "num_code": "86",
        "alpha_2_code": "IO",
        "alpha_3_code": "IOT",
        "en_short_name": "British Indian Ocean Territory",
        "nationality": "BIOT"
    },
    {
        "num_code": "96",
        "alpha_2_code": "BN",
        "alpha_3_code": "BRN",
        "en_short_name": "Brunei Darussalam",
        "nationality": "Bruneian"
    },
    {
        "num_code": "100",
        "alpha_2_code": "BG",
        "alpha_3_code": "BGR",
        "en_short_name": "Bulgaria",
        "nationality": "Bulgarian"
    },
    {
        "num_code": "854",
        "alpha_2_code": "BF",
        "alpha_3_code": "BFA",
        "en_short_name": "Burkina Faso",
        "nationality": "Burkinab\u00e9"
    },
    {
        "num_code": "108",
        "alpha_2_code": "BI",
        "alpha_3_code": "BDI",
        "en_short_name": "Burundi",
        "nationality": "Burundian"
    },
    {
        "num_code": "132",
        "alpha_2_code": "CV",
        "alpha_3_code": "CPV",
        "en_short_name": "Cabo Verde",
        "nationality": "Cabo Verdean"
    },
    {
        "num_code": "116",
        "alpha_2_code": "KH",
        "alpha_3_code": "KHM",
        "en_short_name": "Cambodia",
        "nationality": "Cambodian"
    },
    {
        "num_code": "120",
        "alpha_2_code": "CM",
        "alpha_3_code": "CMR",
        "en_short_name": "Cameroon",
        "nationality": "Cameroonian"
    },
    {
        "num_code": "124",
        "alpha_2_code": "CA",
        "alpha_3_code": "CAN",
        "en_short_name": "Canada",
        "nationality": "Canadian"
    },
    {
        "num_code": "136",
        "alpha_2_code": "KY",
        "alpha_3_code": "CYM",
        "en_short_name": "Cayman Islands",
        "nationality": "Caymanian"
    },
    {
        "num_code": "140",
        "alpha_2_code": "CF",
        "alpha_3_code": "CAF",
        "en_short_name": "Central African Republic",
        "nationality": "Central African"
    },
    {
        "num_code": "148",
        "alpha_2_code": "TD",
        "alpha_3_code": "TCD",
        "en_short_name": "Chad",
        "nationality": "Chadian"
    },
    {
        "num_code": "152",
        "alpha_2_code": "CL",
        "alpha_3_code": "CHL",
        "en_short_name": "Chile",
        "nationality": "Chilean"
    },
    {
        "num_code": "156",
        "alpha_2_code": "CN",
        "alpha_3_code": "CHN",
        "en_short_name": "China",
        "nationality": "Chinese"
    },
    {
        "num_code": "162",
        "alpha_2_code": "CX",
        "alpha_3_code": "CXR",
        "en_short_name": "Christmas Island",
        "nationality": "Christmas Island"
    },
    {
        "num_code": "166",
        "alpha_2_code": "CC",
        "alpha_3_code": "CCK",
        "en_short_name": "Cocos (Keeling) Islands",
        "nationality": "Cocos Island"
    },
    {
        "num_code": "170",
        "alpha_2_code": "CO",
        "alpha_3_code": "COL",
        "en_short_name": "Colombia",
        "nationality": "Colombian"
    },
    {
        "num_code": "174",
        "alpha_2_code": "KM",
        "alpha_3_code": "COM",
        "en_short_name": "Comoros",
        "nationality": "Comoran, Comorian"
    },
    {
        "num_code": "178",
        "alpha_2_code": "CG",
        "alpha_3_code": "COG",
        "en_short_name": "Congo (Republic of the)",
        "nationality": "Congolese"
    },
    {
        "num_code": "180",
        "alpha_2_code": "CD",
        "alpha_3_code": "COD",
        "en_short_name": "Congo (Democratic Republic of the)",
        "nationality": "Congolese"
    },
    {
        "num_code": "184",
        "alpha_2_code": "CK",
        "alpha_3_code": "COK",
        "en_short_name": "Cook Islands",
        "nationality": "Cook Island"
    },
    {
        "num_code": "188",
        "alpha_2_code": "CR",
        "alpha_3_code": "CRI",
        "en_short_name": "Costa Rica",
        "nationality": "Costa Rican"
    },
    {
        "num_code": "384",
        "alpha_2_code": "CI",
        "alpha_3_code": "CIV",
        "en_short_name": "C\u00f4te d'Ivoire",
        "nationality": "Ivorian"
    },
    {
        "num_code": "191",
        "alpha_2_code": "HR",
        "alpha_3_code": "HRV",
        "en_short_name": "Croatia",
        "nationality": "Croatian"
    },
    {
        "num_code": "192",
        "alpha_2_code": "CU",
        "alpha_3_code": "CUB",
        "en_short_name": "Cuba",
        "nationality": "Cuban"
    },
    {
        "num_code": "531",
        "alpha_2_code": "CW",
        "alpha_3_code": "CUW",
        "en_short_name": "Cura\u00e7ao",
        "nationality": "Cura\u00e7aoan"
    },
    {
        "num_code": "196",
        "alpha_2_code": "CY",
        "alpha_3_code": "CYP",
        "en_short_name": "Cyprus",
        "nationality": "Cypriot"
    },
    {
        "num_code": "203",
        "alpha_2_code": "CZ",
        "alpha_3_code": "CZE",
        "en_short_name": "Czech Republic",
        "nationality": "Czech"
    },
    {
        "num_code": "208",
        "alpha_2_code": "DK",
        "alpha_3_code": "DNK",
        "en_short_name": "Denmark",
        "nationality": "Danish"
    },
    {
        "num_code": "262",
        "alpha_2_code": "DJ",
        "alpha_3_code": "DJI",
        "en_short_name": "Djibouti",
        "nationality": "Djiboutian"
    },
    {
        "num_code": "212",
        "alpha_2_code": "DM",
        "alpha_3_code": "DMA",
        "en_short_name": "Dominica",
        "nationality": "Dominican"
    },
    {
        "num_code": "214",
        "alpha_2_code": "DO",
        "alpha_3_code": "DOM",
        "en_short_name": "Dominican Republic",
        "nationality": "Dominican"
    },
    {
        "num_code": "218",
        "alpha_2_code": "EC",
        "alpha_3_code": "ECU",
        "en_short_name": "Ecuador",
        "nationality": "Ecuadorian"
    },
    {
        "num_code": "818",
        "alpha_2_code": "EG",
        "alpha_3_code": "EGY",
        "en_short_name": "Egypt",
        "nationality": "Egyptian"
    },
    {
        "num_code": "222",
        "alpha_2_code": "SV",
        "alpha_3_code": "SLV",
        "en_short_name": "El Salvador",
        "nationality": "Salvadoran"
    },
    {
        "num_code": "226",
        "alpha_2_code": "GQ",
        "alpha_3_code": "GNQ",
        "en_short_name": "Equatorial Guinea",
        "nationality": "Equatorial Guinean, Equatoguinean"
    },
    {
        "num_code": "232",
        "alpha_2_code": "ER",
        "alpha_3_code": "ERI",
        "en_short_name": "Eritrea",
        "nationality": "Eritrean"
    },
    {
        "num_code": "233",
        "alpha_2_code": "EE",
        "alpha_3_code": "EST",
        "en_short_name": "Estonia",
        "nationality": "Estonian"
    },
    {
        "num_code": "231",
        "alpha_2_code": "ET",
        "alpha_3_code": "ETH",
        "en_short_name": "Ethiopia",
        "nationality": "Ethiopian"
    },
    {
        "num_code": "238",
        "alpha_2_code": "FK",
        "alpha_3_code": "FLK",
        "en_short_name": "Falkland Islands (Malvinas)",
        "nationality": "Falkland Island"
    },
    {
        "num_code": "234",
        "alpha_2_code": "FO",
        "alpha_3_code": "FRO",
        "en_short_name": "Faroe Islands",
        "nationality": "Faroese"
    },
    {
        "num_code": "242",
        "alpha_2_code": "FJ",
        "alpha_3_code": "FJI",
        "en_short_name": "Fiji",
        "nationality": "Fijian"
    },
    {
        "num_code": "246",
        "alpha_2_code": "FI",
        "alpha_3_code": "FIN",
        "en_short_name": "Finland",
        "nationality": "Finnish"
    },
    {
        "num_code": "250",
        "alpha_2_code": "FR",
        "alpha_3_code": "FRA",
        "en_short_name": "France",
        "nationality": "French"
    },
    {
        "num_code": "254",
        "alpha_2_code": "GF",
        "alpha_3_code": "GUF",
        "en_short_name": "French Guiana",
        "nationality": "French Guianese"
    },
    {
        "num_code": "258",
        "alpha_2_code": "PF",
        "alpha_3_code": "PYF",
        "en_short_name": "French Polynesia",
        "nationality": "French Polynesian"
    },
    {
        "num_code": "260",
        "alpha_2_code": "TF",
        "alpha_3_code": "ATF",
        "en_short_name": "French Southern Territories",
        "nationality": "French Southern Territories"
    },
    {
        "num_code": "266",
        "alpha_2_code": "GA",
        "alpha_3_code": "GAB",
        "en_short_name": "Gabon",
        "nationality": "Gabonese"
    },
    {
        "num_code": "270",
        "alpha_2_code": "GM",
        "alpha_3_code": "GMB",
        "en_short_name": "Gambia",
        "nationality": "Gambian"
    },
    {
        "num_code": "268",
        "alpha_2_code": "GE",
        "alpha_3_code": "GEO",
        "en_short_name": "Georgia",
        "nationality": "Georgian"
    },
    {
        "num_code": "276",
        "alpha_2_code": "DE",
        "alpha_3_code": "DEU",
        "en_short_name": "Germany",
        "nationality": "German"
    },
    {
        "num_code": "288",
        "alpha_2_code": "GH",
        "alpha_3_code": "GHA",
        "en_short_name": "Ghana",
        "nationality": "Ghanaian"
    },
    {
        "num_code": "292",
        "alpha_2_code": "GI",
        "alpha_3_code": "GIB",
        "en_short_name": "Gibraltar",
        "nationality": "Gibraltar"
    },
    {
        "num_code": "300",
        "alpha_2_code": "GR",
        "alpha_3_code": "GRC",
        "en_short_name": "Greece",
        "nationality": "Greek, Hellenic"
    },
    {
        "num_code": "304",
        "alpha_2_code": "GL",
        "alpha_3_code": "GRL",
        "en_short_name": "Greenland",
        "nationality": "Greenlandic"
    },
    {
        "num_code": "308",
        "alpha_2_code": "GD",
        "alpha_3_code": "GRD",
        "en_short_name": "Grenada",
        "nationality": "Grenadian"
    },
    {
        "num_code": "312",
        "alpha_2_code": "GP",
        "alpha_3_code": "GLP",
        "en_short_name": "Guadeloupe",
        "nationality": "Guadeloupe"
    },
    {
        "num_code": "316",
        "alpha_2_code": "GU",
        "alpha_3_code": "GUM",
        "en_short_name": "Guam",
        "nationality": "Guamanian, Guambat"
    },
    {
        "num_code": "320",
        "alpha_2_code": "GT",
        "alpha_3_code": "GTM",
        "en_short_name": "Guatemala",
        "nationality": "Guatemalan"
    },
    {
        "num_code": "831",
        "alpha_2_code": "GG",
        "alpha_3_code": "GGY",
        "en_short_name": "Guernsey",
        "nationality": "Channel Island"
    },
    {
        "num_code": "324",
        "alpha_2_code": "GN",
        "alpha_3_code": "GIN",
        "en_short_name": "Guinea",
        "nationality": "Guinean"
    },
    {
        "num_code": "624",
        "alpha_2_code": "GW",
        "alpha_3_code": "GNB",
        "en_short_name": "Guinea-Bissau",
        "nationality": "Bissau-Guinean"
    },
    {
        "num_code": "328",
        "alpha_2_code": "GY",
        "alpha_3_code": "GUY",
        "en_short_name": "Guyana",
        "nationality": "Guyanese"
    },
    {
        "num_code": "332",
        "alpha_2_code": "HT",
        "alpha_3_code": "HTI",
        "en_short_name": "Haiti",
        "nationality": "Haitian"
    },
    {
        "num_code": "334",
        "alpha_2_code": "HM",
        "alpha_3_code": "HMD",
        "en_short_name": "Heard Island and McDonald Islands",
        "nationality": "Heard Island or McDonald Islands"
    },
    {
        "num_code": "336",
        "alpha_2_code": "VA",
        "alpha_3_code": "VAT",
        "en_short_name": "Vatican City State",
        "nationality": "Vatican"
    },
    {
        "num_code": "340",
        "alpha_2_code": "HN",
        "alpha_3_code": "HND",
        "en_short_name": "Honduras",
        "nationality": "Honduran"
    },
    {
        "num_code": "344",
        "alpha_2_code": "HK",
        "alpha_3_code": "HKG",
        "en_short_name": "Hong Kong",
        "nationality": "Hong Kong, Hong Kongese"
    },
    {
        "num_code": "348",
        "alpha_2_code": "HU",
        "alpha_3_code": "HUN",
        "en_short_name": "Hungary",
        "nationality": "Hungarian, Magyar"
    },
    {
        "num_code": "352",
        "alpha_2_code": "IS",
        "alpha_3_code": "ISL",
        "en_short_name": "Iceland",
        "nationality": "Icelandic"
    },
    {
        "num_code": "356",
        "alpha_2_code": "IN",
        "alpha_3_code": "IND",
        "en_short_name": "India",
        "nationality": "Indian"
    },
    {
        "num_code": "360",
        "alpha_2_code": "ID",
        "alpha_3_code": "IDN",
        "en_short_name": "Indonesia",
        "nationality": "Indonesian"
    },
    {
        "num_code": "364",
        "alpha_2_code": "IR",
        "alpha_3_code": "IRN",
        "en_short_name": "Iran",
        "nationality": "Iranian, Persian"
    },
    {
        "num_code": "368",
        "alpha_2_code": "IQ",
        "alpha_3_code": "IRQ",
        "en_short_name": "Iraq",
        "nationality": "Iraqi"
    },
    {
        "num_code": "372",
        "alpha_2_code": "IE",
        "alpha_3_code": "IRL",
        "en_short_name": "Ireland",
        "nationality": "Irish"
    },
    {
        "num_code": "833",
        "alpha_2_code": "IM",
        "alpha_3_code": "IMN",
        "en_short_name": "Isle of Man",
        "nationality": "Manx"
    },
    {
        "num_code": "376",
        "alpha_2_code": "IL",
        "alpha_3_code": "ISR",
        "en_short_name": "Israel",
        "nationality": "Israeli"
    },
    {
        "num_code": "380",
        "alpha_2_code": "IT",
        "alpha_3_code": "ITA",
        "en_short_name": "Italy",
        "nationality": "Italian"
    },
    {
        "num_code": "388",
        "alpha_2_code": "JM",
        "alpha_3_code": "JAM",
        "en_short_name": "Jamaica",
        "nationality": "Jamaican"
    },
    {
        "num_code": "392",
        "alpha_2_code": "JP",
        "alpha_3_code": "JPN",
        "en_short_name": "Japan",
        "nationality": "Japanese"
    },
    {
        "num_code": "832",
        "alpha_2_code": "JE",
        "alpha_3_code": "JEY",
        "en_short_name": "Jersey",
        "nationality": "Channel Island"
    },
    {
        "num_code": "400",
        "alpha_2_code": "JO",
        "alpha_3_code": "JOR",
        "en_short_name": "Jordan",
        "nationality": "Jordanian"
    },
    {
        "num_code": "398",
        "alpha_2_code": "KZ",
        "alpha_3_code": "KAZ",
        "en_short_name": "Kazakhstan",
        "nationality": "Kazakhstani, Kazakh"
    },
    {
        "num_code": "404",
        "alpha_2_code": "KE",
        "alpha_3_code": "KEN",
        "en_short_name": "Kenya",
        "nationality": "Kenyan"
    },
    {
        "num_code": "296",
        "alpha_2_code": "KI",
        "alpha_3_code": "KIR",
        "en_short_name": "Kiribati",
        "nationality": "I-Kiribati"
    },
    {
        "num_code": "408",
        "alpha_2_code": "KP",
        "alpha_3_code": "PRK",
        "en_short_name": "Korea (Democratic People's Republic of)",
        "nationality": "North Korean"
    },
    {
        "num_code": "410",
        "alpha_2_code": "KR",
        "alpha_3_code": "KOR",
        "en_short_name": "Korea (Republic of)",
        "nationality": "South Korean"
    },
    {
        "num_code": "414",
        "alpha_2_code": "KW",
        "alpha_3_code": "KWT",
        "en_short_name": "Kuwait",
        "nationality": "Kuwaiti"
    },
    {
        "num_code": "417",
        "alpha_2_code": "KG",
        "alpha_3_code": "KGZ",
        "en_short_name": "Kyrgyzstan",
        "nationality": "Kyrgyzstani, Kyrgyz, Kirgiz, Kirghiz"
    },
    {
        "num_code": "418",
        "alpha_2_code": "LA",
        "alpha_3_code": "LAO",
        "en_short_name": "Lao People's Democratic Republic",
        "nationality": "Lao, Laotian"
    },
    {
        "num_code": "428",
        "alpha_2_code": "LV",
        "alpha_3_code": "LVA",
        "en_short_name": "Latvia",
        "nationality": "Latvian"
    },
    {
        "num_code": "422",
        "alpha_2_code": "LB",
        "alpha_3_code": "LBN",
        "en_short_name": "Lebanon",
        "nationality": "Lebanese"
    },
    {
        "num_code": "426",
        "alpha_2_code": "LS",
        "alpha_3_code": "LSO",
        "en_short_name": "Lesotho",
        "nationality": "Basotho"
    },
    {
        "num_code": "430",
        "alpha_2_code": "LR",
        "alpha_3_code": "LBR",
        "en_short_name": "Liberia",
        "nationality": "Liberian"
    },
    {
        "num_code": "434",
        "alpha_2_code": "LY",
        "alpha_3_code": "LBY",
        "en_short_name": "Libya",
        "nationality": "Libyan"
    },
    {
        "num_code": "438",
        "alpha_2_code": "LI",
        "alpha_3_code": "LIE",
        "en_short_name": "Liechtenstein",
        "nationality": "Liechtenstein"
    },
    {
        "num_code": "440",
        "alpha_2_code": "LT",
        "alpha_3_code": "LTU",
        "en_short_name": "Lithuania",
        "nationality": "Lithuanian"
    },
    {
        "num_code": "442",
        "alpha_2_code": "LU",
        "alpha_3_code": "LUX",
        "en_short_name": "Luxembourg",
        "nationality": "Luxembourg, Luxembourgish"
    },
    {
        "num_code": "446",
        "alpha_2_code": "MO",
        "alpha_3_code": "MAC",
        "en_short_name": "Macao",
        "nationality": "Macanese, Chinese"
    },
    {
        "num_code": "807",
        "alpha_2_code": "MK",
        "alpha_3_code": "MKD",
        "en_short_name": "Macedonia (the former Yugoslav Republic of)",
        "nationality": "Macedonian"
    },
    {
        "num_code": "450",
        "alpha_2_code": "MG",
        "alpha_3_code": "MDG",
        "en_short_name": "Madagascar",
        "nationality": "Malagasy"
    },
    {
        "num_code": "454",
        "alpha_2_code": "MW",
        "alpha_3_code": "MWI",
        "en_short_name": "Malawi",
        "nationality": "Malawian"
    },
    {
        "num_code": "458",
        "alpha_2_code": "MY",
        "alpha_3_code": "MYS",
        "en_short_name": "Malaysia",
        "nationality": "Malaysian"
    },
    {
        "num_code": "462",
        "alpha_2_code": "MV",
        "alpha_3_code": "MDV",
        "en_short_name": "Maldives",
        "nationality": "Maldivian"
    },
    {
        "num_code": "466",
        "alpha_2_code": "ML",
        "alpha_3_code": "MLI",
        "en_short_name": "Mali",
        "nationality": "Malian, Malinese"
    },
    {
        "num_code": "470",
        "alpha_2_code": "MT",
        "alpha_3_code": "MLT",
        "en_short_name": "Malta",
        "nationality": "Maltese"
    },
    {
        "num_code": "584",
        "alpha_2_code": "MH",
        "alpha_3_code": "MHL",
        "en_short_name": "Marshall Islands",
        "nationality": "Marshallese"
    },
    {
        "num_code": "474",
        "alpha_2_code": "MQ",
        "alpha_3_code": "MTQ",
        "en_short_name": "Martinique",
        "nationality": "Martiniquais, Martinican"
    },
    {
        "num_code": "478",
        "alpha_2_code": "MR",
        "alpha_3_code": "MRT",
        "en_short_name": "Mauritania",
        "nationality": "Mauritanian"
    },
    {
        "num_code": "480",
        "alpha_2_code": "MU",
        "alpha_3_code": "MUS",
        "en_short_name": "Mauritius",
        "nationality": "Mauritian"
    },
    {
        "num_code": "175",
        "alpha_2_code": "YT",
        "alpha_3_code": "MYT",
        "en_short_name": "Mayotte",
        "nationality": "Mahoran"
    },
    {
        "num_code": "484",
        "alpha_2_code": "MX",
        "alpha_3_code": "MEX",
        "en_short_name": "Mexico",
        "nationality": "Mexican"
    },
    {
        "num_code": "583",
        "alpha_2_code": "FM",
        "alpha_3_code": "FSM",
        "en_short_name": "Micronesia (Federated States of)",
        "nationality": "Micronesian"
    },
    {
        "num_code": "498",
        "alpha_2_code": "MD",
        "alpha_3_code": "MDA",
        "en_short_name": "Moldova (Republic of)",
        "nationality": "Moldovan"
    },
    {
        "num_code": "492",
        "alpha_2_code": "MC",
        "alpha_3_code": "MCO",
        "en_short_name": "Monaco",
        "nationality": "Mon\u00e9gasque, Monacan"
    },
    {
        "num_code": "496",
        "alpha_2_code": "MN",
        "alpha_3_code": "MNG",
        "en_short_name": "Mongolia",
        "nationality": "Mongolian"
    },
    {
        "num_code": "499",
        "alpha_2_code": "ME",
        "alpha_3_code": "MNE",
        "en_short_name": "Montenegro",
        "nationality": "Montenegrin"
    },
    {
        "num_code": "500",
        "alpha_2_code": "MS",
        "alpha_3_code": "MSR",
        "en_short_name": "Montserrat",
        "nationality": "Montserratian"
    },
    {
        "num_code": "504",
        "alpha_2_code": "MA",
        "alpha_3_code": "MAR",
        "en_short_name": "Morocco",
        "nationality": "Moroccan"
    },
    {
        "num_code": "508",
        "alpha_2_code": "MZ",
        "alpha_3_code": "MOZ",
        "en_short_name": "Mozambique",
        "nationality": "Mozambican"
    },
    {
        "num_code": "104",
        "alpha_2_code": "MM",
        "alpha_3_code": "MMR",
        "en_short_name": "Myanmar",
        "nationality": "Burmese"
    },
    {
        "num_code": "516",
        "alpha_2_code": "NA",
        "alpha_3_code": "NAM",
        "en_short_name": "Namibia",
        "nationality": "Namibian"
    },
    {
        "num_code": "520",
        "alpha_2_code": "NR",
        "alpha_3_code": "NRU",
        "en_short_name": "Nauru",
        "nationality": "Nauruan"
    },
    {
        "num_code": "524",
        "alpha_2_code": "NP",
        "alpha_3_code": "NPL",
        "en_short_name": "Nepal",
        "nationality": "Nepali, Nepalese"
    },
    {
        "num_code": "528",
        "alpha_2_code": "NL",
        "alpha_3_code": "NLD",
        "en_short_name": "Netherlands",
        "nationality": "Dutch, Netherlandic"
    },
    {
        "num_code": "540",
        "alpha_2_code": "NC",
        "alpha_3_code": "NCL",
        "en_short_name": "New Caledonia",
        "nationality": "New Caledonian"
    },
    {
        "num_code": "554",
        "alpha_2_code": "NZ",
        "alpha_3_code": "NZL",
        "en_short_name": "New Zealand",
        "nationality": "New Zealand, NZ"
    },
    {
        "num_code": "558",
        "alpha_2_code": "NI",
        "alpha_3_code": "NIC",
        "en_short_name": "Nicaragua",
        "nationality": "Nicaraguan"
    },
    {
        "num_code": "562",
        "alpha_2_code": "NE",
        "alpha_3_code": "NER",
        "en_short_name": "Niger",
        "nationality": "Nigerien"
    },
    {
        "num_code": "566",
        "alpha_2_code": "NG",
        "alpha_3_code": "NGA",
        "en_short_name": "Nigeria",
        "nationality": "Nigerian"
    },
    {
        "num_code": "570",
        "alpha_2_code": "NU",
        "alpha_3_code": "NIU",
        "en_short_name": "Niue",
        "nationality": "Niuean"
    },
    {
        "num_code": "574",
        "alpha_2_code": "NF",
        "alpha_3_code": "NFK",
        "en_short_name": "Norfolk Island",
        "nationality": "Norfolk Island"
    },
    {
        "num_code": "580",
        "alpha_2_code": "MP",
        "alpha_3_code": "MNP",
        "en_short_name": "Northern Mariana Islands",
        "nationality": "Northern Marianan"
    },
    {
        "num_code": "578",
        "alpha_2_code": "NO",
        "alpha_3_code": "NOR",
        "en_short_name": "Norway",
        "nationality": "Norwegian"
    },
    {
        "num_code": "512",
        "alpha_2_code": "OM",
        "alpha_3_code": "OMN",
        "en_short_name": "Oman",
        "nationality": "Omani"
    },
    {
        "num_code": "586",
        "alpha_2_code": "PK",
        "alpha_3_code": "PAK",
        "en_short_name": "Pakistan",
        "nationality": "Pakistani"
    },
    {
        "num_code": "585",
        "alpha_2_code": "PW",
        "alpha_3_code": "PLW",
        "en_short_name": "Palau",
        "nationality": "Palauan"
    },
    {
        "num_code": "275",
        "alpha_2_code": "PS",
        "alpha_3_code": "PSE",
        "en_short_name": "Palestine, State of",
        "nationality": "Palestinian"
    },
    {
        "num_code": "591",
        "alpha_2_code": "PA",
        "alpha_3_code": "PAN",
        "en_short_name": "Panama",
        "nationality": "Panamanian"
    },
    {
        "num_code": "598",
        "alpha_2_code": "PG",
        "alpha_3_code": "PNG",
        "en_short_name": "Papua New Guinea",
        "nationality": "Papua New Guinean, Papuan"
    },
    {
        "num_code": "600",
        "alpha_2_code": "PY",
        "alpha_3_code": "PRY",
        "en_short_name": "Paraguay",
        "nationality": "Paraguayan"
    },
    {
        "num_code": "604",
        "alpha_2_code": "PE",
        "alpha_3_code": "PER",
        "en_short_name": "Peru",
        "nationality": "Peruvian"
    },
    {
        "num_code": "608",
        "alpha_2_code": "PH",
        "alpha_3_code": "PHL",
        "en_short_name": "Philippines",
        "nationality": "Philippine, Filipino"
    },
    {
        "num_code": "612",
        "alpha_2_code": "PN",
        "alpha_3_code": "PCN",
        "en_short_name": "Pitcairn",
        "nationality": "Pitcairn Island"
    },
    {
        "num_code": "616",
        "alpha_2_code": "PL",
        "alpha_3_code": "POL",
        "en_short_name": "Poland",
        "nationality": "Polish"
    },
    {
        "num_code": "620",
        "alpha_2_code": "PT",
        "alpha_3_code": "PRT",
        "en_short_name": "Portugal",
        "nationality": "Portuguese"
    },
    {
        "num_code": "630",
        "alpha_2_code": "PR",
        "alpha_3_code": "PRI",
        "en_short_name": "Puerto Rico",
        "nationality": "Puerto Rican"
    },
    {
        "num_code": "634",
        "alpha_2_code": "QA",
        "alpha_3_code": "QAT",
        "en_short_name": "Qatar",
        "nationality": "Qatari"
    },
    {
        "num_code": "638",
        "alpha_2_code": "RE",
        "alpha_3_code": "REU",
        "en_short_name": "R\u00e9union",
        "nationality": "R\u00e9unionese, R\u00e9unionnais"
    },
    {
        "num_code": "642",
        "alpha_2_code": "RO",
        "alpha_3_code": "ROU",
        "en_short_name": "Romania",
        "nationality": "Romanian"
    },
    {
        "num_code": "643",
        "alpha_2_code": "RU",
        "alpha_3_code": "RUS",
        "en_short_name": "Russian Federation",
        "nationality": "Russian"
    },
    {
        "num_code": "646",
        "alpha_2_code": "RW",
        "alpha_3_code": "RWA",
        "en_short_name": "Rwanda",
        "nationality": "Rwandan"
    },
    {
        "num_code": "652",
        "alpha_2_code": "BL",
        "alpha_3_code": "BLM",
        "en_short_name": "Saint Barth\u00e9lemy",
        "nationality": "Barth\u00e9lemois"
    },
    {
        "num_code": "654",
        "alpha_2_code": "SH",
        "alpha_3_code": "SHN",
        "en_short_name": "Saint Helena, Ascension and Tristan da Cunha",
        "nationality": "Saint Helenian"
    },
    {
        "num_code": "659",
        "alpha_2_code": "KN",
        "alpha_3_code": "KNA",
        "en_short_name": "Saint Kitts and Nevis",
        "nationality": "Kittitian or Nevisian"
    },
    {
        "num_code": "662",
        "alpha_2_code": "LC",
        "alpha_3_code": "LCA",
        "en_short_name": "Saint Lucia",
        "nationality": "Saint Lucian"
    },
    {
        "num_code": "663",
        "alpha_2_code": "MF",
        "alpha_3_code": "MAF",
        "en_short_name": "Saint Martin (French part)",
        "nationality": "Saint-Martinoise"
    },
    {
        "num_code": "666",
        "alpha_2_code": "PM",
        "alpha_3_code": "SPM",
        "en_short_name": "Saint Pierre and Miquelon",
        "nationality": "Saint-Pierrais or Miquelonnais"
    },
    {
        "num_code": "670",
        "alpha_2_code": "VC",
        "alpha_3_code": "VCT",
        "en_short_name": "Saint Vincent and the Grenadines",
        "nationality": "Saint Vincentian, Vincentian"
    },
    {
        "num_code": "882",
        "alpha_2_code": "WS",
        "alpha_3_code": "WSM",
        "en_short_name": "Samoa",
        "nationality": "Samoan"
    },
    {
        "num_code": "674",
        "alpha_2_code": "SM",
        "alpha_3_code": "SMR",
        "en_short_name": "San Marino",
        "nationality": "Sammarinese"
    },
    {
        "num_code": "678",
        "alpha_2_code": "ST",
        "alpha_3_code": "STP",
        "en_short_name": "Sao Tome and Principe",
        "nationality": "S\u00e3o Tom\u00e9an"
    },
    {
        "num_code": "682",
        "alpha_2_code": "SA",
        "alpha_3_code": "SAU",
        "en_short_name": "Saudi Arabia",
        "nationality": "Saudi, Saudi Arabian"
    },
    {
        "num_code": "686",
        "alpha_2_code": "SN",
        "alpha_3_code": "SEN",
        "en_short_name": "Senegal",
        "nationality": "Senegalese"
    },
    {
        "num_code": "688",
        "alpha_2_code": "RS",
        "alpha_3_code": "SRB",
        "en_short_name": "Serbia",
        "nationality": "Serbian"
    },
    {
        "num_code": "690",
        "alpha_2_code": "SC",
        "alpha_3_code": "SYC",
        "en_short_name": "Seychelles",
        "nationality": "Seychellois"
    },
    {
        "num_code": "694",
        "alpha_2_code": "SL",
        "alpha_3_code": "SLE",
        "en_short_name": "Sierra Leone",
        "nationality": "Sierra Leonean"
    },
    {
        "num_code": "702",
        "alpha_2_code": "SG",
        "alpha_3_code": "SGP",
        "en_short_name": "Singapore",
        "nationality": "Singaporean"
    },
    {
        "num_code": "534",
        "alpha_2_code": "SX",
        "alpha_3_code": "SXM",
        "en_short_name": "Sint Maarten (Dutch part)",
        "nationality": "Sint Maarten"
    },
    {
        "num_code": "703",
        "alpha_2_code": "SK",
        "alpha_3_code": "SVK",
        "en_short_name": "Slovakia",
        "nationality": "Slovak"
    },
    {
        "num_code": "705",
        "alpha_2_code": "SI",
        "alpha_3_code": "SVN",
        "en_short_name": "Slovenia",
        "nationality": "Slovenian, Slovene"
    },
    {
        "num_code": "90",
        "alpha_2_code": "SB",
        "alpha_3_code": "SLB",
        "en_short_name": "Solomon Islands",
        "nationality": "Solomon Island"
    },
    {
        "num_code": "706",
        "alpha_2_code": "SO",
        "alpha_3_code": "SOM",
        "en_short_name": "Somalia",
        "nationality": "Somali, Somalian"
    },
    {
        "num_code": "710",
        "alpha_2_code": "ZA",
        "alpha_3_code": "ZAF",
        "en_short_name": "South Africa",
        "nationality": "South African"
    },
    {
        "num_code": "239",
        "alpha_2_code": "GS",
        "alpha_3_code": "SGS",
        "en_short_name": "South Georgia and the South Sandwich Islands",
        "nationality": "South Georgia or South Sandwich Islands"
    },
    {
        "num_code": "728",
        "alpha_2_code": "SS",
        "alpha_3_code": "SSD",
        "en_short_name": "South Sudan",
        "nationality": "South Sudanese"
    },
    {
        "num_code": "724",
        "alpha_2_code": "ES",
        "alpha_3_code": "ESP",
        "en_short_name": "Spain",
        "nationality": "Spanish"
    },
    {
        "num_code": "144",
        "alpha_2_code": "LK",
        "alpha_3_code": "LKA",
        "en_short_name": "Sri Lanka",
        "nationality": "Sri Lankan"
    },
    {
        "num_code": "729",
        "alpha_2_code": "SD",
        "alpha_3_code": "SDN",
        "en_short_name": "Sudan",
        "nationality": "Sudanese"
    },
    {
        "num_code": "740",
        "alpha_2_code": "SR",
        "alpha_3_code": "SUR",
        "en_short_name": "Suriname",
        "nationality": "Surinamese"
    },
    {
        "num_code": "744",
        "alpha_2_code": "SJ",
        "alpha_3_code": "SJM",
        "en_short_name": "Svalbard and Jan Mayen",
        "nationality": "Svalbard"
    },
    {
        "num_code": "748",
        "alpha_2_code": "SZ",
        "alpha_3_code": "SWZ",
        "en_short_name": "Swaziland",
        "nationality": "Swazi"
    },
    {
        "num_code": "752",
        "alpha_2_code": "SE",
        "alpha_3_code": "SWE",
        "en_short_name": "Sweden",
        "nationality": "Swedish"
    },
    {
        "num_code": "756",
        "alpha_2_code": "CH",
        "alpha_3_code": "CHE",
        "en_short_name": "Switzerland",
        "nationality": "Swiss"
    },
    {
        "num_code": "760",
        "alpha_2_code": "SY",
        "alpha_3_code": "SYR",
        "en_short_name": "Syrian Arab Republic",
        "nationality": "Syrian"
    },
    {
        "num_code": "158",
        "alpha_2_code": "TW",
        "alpha_3_code": "TWN",
        "en_short_name": "Taiwan, Province of China",
        "nationality": "Chinese, Taiwanese"
    },
    {
        "num_code": "762",
        "alpha_2_code": "TJ",
        "alpha_3_code": "TJK",
        "en_short_name": "Tajikistan",
        "nationality": "Tajikistani"
    },
    {
        "num_code": "834",
        "alpha_2_code": "TZ",
        "alpha_3_code": "TZA",
        "en_short_name": "Tanzania, United Republic of",
        "nationality": "Tanzanian"
    },
    {
        "num_code": "764",
        "alpha_2_code": "TH",
        "alpha_3_code": "THA",
        "en_short_name": "Thailand",
        "nationality": "Thai"
    },
    {
        "num_code": "626",
        "alpha_2_code": "TL",
        "alpha_3_code": "TLS",
        "en_short_name": "Timor-Leste",
        "nationality": "Timorese"
    },
    {
        "num_code": "768",
        "alpha_2_code": "TG",
        "alpha_3_code": "TGO",
        "en_short_name": "Togo",
        "nationality": "Togolese"
    },
    {
        "num_code": "772",
        "alpha_2_code": "TK",
        "alpha_3_code": "TKL",
        "en_short_name": "Tokelau",
        "nationality": "Tokelauan"
    },
    {
        "num_code": "776",
        "alpha_2_code": "TO",
        "alpha_3_code": "TON",
        "en_short_name": "Tonga",
        "nationality": "Tongan"
    },
    {
        "num_code": "780",
        "alpha_2_code": "TT",
        "alpha_3_code": "TTO",
        "en_short_name": "Trinidad and Tobago",
        "nationality": "Trinidadian or Tobagonian"
    },
    {
        "num_code": "788",
        "alpha_2_code": "TN",
        "alpha_3_code": "TUN",
        "en_short_name": "Tunisia",
        "nationality": "Tunisian"
    },
    {
        "num_code": "792",
        "alpha_2_code": "TR",
        "alpha_3_code": "TUR",
        "en_short_name": "Turkey",
        "nationality": "Turkish"
    },
    {
        "num_code": "795",
        "alpha_2_code": "TM",
        "alpha_3_code": "TKM",
        "en_short_name": "Turkmenistan",
        "nationality": "Turkmen"
    },
    {
        "num_code": "796",
        "alpha_2_code": "TC",
        "alpha_3_code": "TCA",
        "en_short_name": "Turks and Caicos Islands",
        "nationality": "Turks and Caicos Island"
    },
    {
        "num_code": "798",
        "alpha_2_code": "TV",
        "alpha_3_code": "TUV",
        "en_short_name": "Tuvalu",
        "nationality": "Tuvaluan"
    },
    {
        "num_code": "800",
        "alpha_2_code": "UG",
        "alpha_3_code": "UGA",
        "en_short_name": "Uganda",
        "nationality": "Ugandan"
    },
    {
        "num_code": "804",
        "alpha_2_code": "UA",
        "alpha_3_code": "UKR",
        "en_short_name": "Ukraine",
        "nationality": "Ukrainian"
    },
    {
        "num_code": "784",
        "alpha_2_code": "AE",
        "alpha_3_code": "ARE",
        "en_short_name": "United Arab Emirates",
        "nationality": "Emirati, Emirian, Emiri"
    },
    {
        "num_code": "826",
        "alpha_2_code": "GB",
        "alpha_3_code": "GBR",
        "en_short_name": "United Kingdom of Great Britain and Northern Ireland",
        "nationality": "British, UK"
    },
    {
        "num_code": "581",
        "alpha_2_code": "UM",
        "alpha_3_code": "UMI",
        "en_short_name": "United States Minor Outlying Islands",
        "nationality": "American"
    },
    {
        "num_code": "840",
        "alpha_2_code": "US",
        "alpha_3_code": "USA",
        "en_short_name": "United States of America",
        "nationality": "American"
    },
    {
        "num_code": "858",
        "alpha_2_code": "UY",
        "alpha_3_code": "URY",
        "en_short_name": "Uruguay",
        "nationality": "Uruguayan"
    },
    {
        "num_code": "860",
        "alpha_2_code": "UZ",
        "alpha_3_code": "UZB",
        "en_short_name": "Uzbekistan",
        "nationality": "Uzbekistani, Uzbek"
    },
    {
        "num_code": "548",
        "alpha_2_code": "VU",
        "alpha_3_code": "VUT",
        "en_short_name": "Vanuatu",
        "nationality": "Ni-Vanuatu, Vanuatuan"
    },
    {
        "num_code": "862",
        "alpha_2_code": "VE",
        "alpha_3_code": "VEN",
        "en_short_name": "Venezuela (Bolivarian Republic of)",
        "nationality": "Venezuelan"
    },
    {
        "num_code": "704",
        "alpha_2_code": "VN",
        "alpha_3_code": "VNM",
        "en_short_name": "Vietnam",
        "nationality": "Vietnamese"
    },
    {
        "num_code": "92",
        "alpha_2_code": "VG",
        "alpha_3_code": "VGB",
        "en_short_name": "Virgin Islands (British)",
        "nationality": "British Virgin Island"
    },
    {
        "num_code": "850",
        "alpha_2_code": "VI",
        "alpha_3_code": "VIR",
        "en_short_name": "Virgin Islands (U.S.)",
        "nationality": "U.S. Virgin Island"
    },
    {
        "num_code": "876",
        "alpha_2_code": "WF",
        "alpha_3_code": "WLF",
        "en_short_name": "Wallis and Futuna",
        "nationality": "Wallis and Futuna, Wallisian or Futunan"
    },
    {
        "num_code": "732",
        "alpha_2_code": "EH",
        "alpha_3_code": "ESH",
        "en_short_name": "Western Sahara",
        "nationality": "Sahrawi, Sahrawian, Sahraouian"
    },
    {
        "num_code": "887",
        "alpha_2_code": "YE",
        "alpha_3_code": "YEM",
        "en_short_name": "Yemen",
        "nationality": "Yemeni"
    },
    {
        "num_code": "894",
        "alpha_2_code": "ZM",
        "alpha_3_code": "ZMB",
        "en_short_name": "Zambia",
        "nationality": "Zambian"
    },
    {
        "num_code": "716",
        "alpha_2_code": "ZW",
        "alpha_3_code": "ZWE",
        "en_short_name": "Zimbabwe",
        "nationality": "Zimbabwean"
    }
];

/*
The MIT License (MIT)

Copyright (c) 2014 Annexare Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// Taken from https://github.com/annexare/Countries (https://github.com/annexare/Countries/blob/master/data/countries.json)
// Values used: name & continent
const annexareCountryList: any = {
    "AD": {
        "name": "Andorra",
        "native": "Andorra",
        "phone": "376",
        "continent": "EU",
        "capital": "Andorra la Vella",
        "currency": "EUR",
        "languages": [
            "ca"
        ]
    },
    "AE": {
        "name": "United Arab Emirates",
        "native": "دولة الإمارات العربية المتحدة",
        "phone": "971",
        "continent": "AS",
        "capital": "Abu Dhabi",
        "currency": "AED",
        "languages": [
            "ar"
        ]
    },
    "AF": {
        "name": "Afghanistan",
        "native": "افغانستان",
        "phone": "93",
        "continent": "AS",
        "capital": "Kabul",
        "currency": "AFN",
        "languages": [
            "ps",
            "uz",
            "tk"
        ]
    },
    "AG": {
        "name": "Antigua and Barbuda",
        "native": "Antigua and Barbuda",
        "phone": "1268",
        "continent": "NA",
        "capital": "Saint John's",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "AI": {
        "name": "Anguilla",
        "native": "Anguilla",
        "phone": "1264",
        "continent": "NA",
        "capital": "The Valley",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "AL": {
        "name": "Albania",
        "native": "Shqipëria",
        "phone": "355",
        "continent": "EU",
        "capital": "Tirana",
        "currency": "ALL",
        "languages": [
            "sq"
        ]
    },
    "AM": {
        "name": "Armenia",
        "native": "Հայաստան",
        "phone": "374",
        "continent": "AS",
        "capital": "Yerevan",
        "currency": "AMD",
        "languages": [
            "hy",
            "ru"
        ]
    },
    "AO": {
        "name": "Angola",
        "native": "Angola",
        "phone": "244",
        "continent": "AF",
        "capital": "Luanda",
        "currency": "AOA",
        "languages": [
            "pt"
        ]
    },
    "AQ": {
        "name": "Antarctica",
        "native": "Antarctica",
        "phone": "672",
        "continent": "AN",
        "capital": "",
        "currency": "",
        "languages": []
    },
    "AR": {
        "name": "Argentina",
        "native": "Argentina",
        "phone": "54",
        "continent": "SA",
        "capital": "Buenos Aires",
        "currency": "ARS",
        "languages": [
            "es",
            "gn"
        ]
    },
    "AS": {
        "name": "American Samoa",
        "native": "American Samoa",
        "phone": "1684",
        "continent": "OC",
        "capital": "Pago Pago",
        "currency": "USD",
        "languages": [
            "en",
            "sm"
        ]
    },
    "AT": {
        "name": "Austria",
        "native": "Österreich",
        "phone": "43",
        "continent": "EU",
        "capital": "Vienna",
        "currency": "EUR",
        "languages": [
            "de"
        ]
    },
    "AU": {
        "name": "Australia",
        "native": "Australia",
        "phone": "61",
        "continent": "OC",
        "capital": "Canberra",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "AW": {
        "name": "Aruba",
        "native": "Aruba",
        "phone": "297",
        "continent": "NA",
        "capital": "Oranjestad",
        "currency": "AWG",
        "languages": [
            "nl",
            "pa"
        ]
    },
    "AX": {
        "name": "Åland",
        "native": "Åland",
        "phone": "358",
        "continent": "EU",
        "capital": "Mariehamn",
        "currency": "EUR",
        "languages": [
            "sv"
        ]
    },
    "AZ": {
        "name": "Azerbaijan",
        "native": "Azərbaycan",
        "phone": "994",
        "continent": "AS",
        "capital": "Baku",
        "currency": "AZN",
        "languages": [
            "az"
        ]
    },
    "BA": {
        "name": "Bosnia and Herzegovina",
        "native": "Bosna i Hercegovina",
        "phone": "387",
        "continent": "EU",
        "capital": "Sarajevo",
        "currency": "BAM",
        "languages": [
            "bs",
            "hr",
            "sr"
        ]
    },
    "BB": {
        "name": "Barbados",
        "native": "Barbados",
        "phone": "1246",
        "continent": "NA",
        "capital": "Bridgetown",
        "currency": "BBD",
        "languages": [
            "en"
        ]
    },
    "BD": {
        "name": "Bangladesh",
        "native": "Bangladesh",
        "phone": "880",
        "continent": "AS",
        "capital": "Dhaka",
        "currency": "BDT",
        "languages": [
            "bn"
        ]
    },
    "BE": {
        "name": "Belgium",
        "native": "België",
        "phone": "32",
        "continent": "EU",
        "capital": "Brussels",
        "currency": "EUR",
        "languages": [
            "nl",
            "fr",
            "de"
        ]
    },
    "BF": {
        "name": "Burkina Faso",
        "native": "Burkina Faso",
        "phone": "226",
        "continent": "AF",
        "capital": "Ouagadougou",
        "currency": "XOF",
        "languages": [
            "fr",
            "ff"
        ]
    },
    "BG": {
        "name": "Bulgaria",
        "native": "България",
        "phone": "359",
        "continent": "EU",
        "capital": "Sofia",
        "currency": "BGN",
        "languages": [
            "bg"
        ]
    },
    "BH": {
        "name": "Bahrain",
        "native": "‏البحرين",
        "phone": "973",
        "continent": "AS",
        "capital": "Manama",
        "currency": "BHD",
        "languages": [
            "ar"
        ]
    },
    "BI": {
        "name": "Burundi",
        "native": "Burundi",
        "phone": "257",
        "continent": "AF",
        "capital": "Bujumbura",
        "currency": "BIF",
        "languages": [
            "fr",
            "rn"
        ]
    },
    "BJ": {
        "name": "Benin",
        "native": "Bénin",
        "phone": "229",
        "continent": "AF",
        "capital": "Porto-Novo",
        "currency": "XOF",
        "languages": [
            "fr"
        ]
    },
    "BL": {
        "name": "Saint Barthélemy",
        "native": "Saint-Barthélemy",
        "phone": "590",
        "continent": "NA",
        "capital": "Gustavia",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "BM": {
        "name": "Bermuda",
        "native": "Bermuda",
        "phone": "1441",
        "continent": "NA",
        "capital": "Hamilton",
        "currency": "BMD",
        "languages": [
            "en"
        ]
    },
    "BN": {
        "name": "Brunei",
        "native": "Negara Brunei Darussalam",
        "phone": "673",
        "continent": "AS",
        "capital": "Bandar Seri Begawan",
        "currency": "BND",
        "languages": [
            "ms"
        ]
    },
    "BO": {
        "name": "Bolivia",
        "native": "Bolivia",
        "phone": "591",
        "continent": "SA",
        "capital": "Sucre",
        "currency": "BOB,BOV",
        "languages": [
            "es",
            "ay",
            "qu"
        ]
    },
    "BQ": {
        "name": "Bonaire",
        "native": "Bonaire",
        "phone": "5997",
        "continent": "NA",
        "capital": "Kralendijk",
        "currency": "USD",
        "languages": [
            "nl"
        ]
    },
    "BR": {
        "name": "Brazil",
        "native": "Brasil",
        "phone": "55",
        "continent": "SA",
        "capital": "Brasília",
        "currency": "BRL",
        "languages": [
            "pt"
        ]
    },
    "BS": {
        "name": "Bahamas",
        "native": "Bahamas",
        "phone": "1242",
        "continent": "NA",
        "capital": "Nassau",
        "currency": "BSD",
        "languages": [
            "en"
        ]
    },
    "BT": {
        "name": "Bhutan",
        "native": "ʼbrug-yul",
        "phone": "975",
        "continent": "AS",
        "capital": "Thimphu",
        "currency": "BTN,INR",
        "languages": [
            "dz"
        ]
    },
    "BV": {
        "name": "Bouvet Island",
        "native": "Bouvetøya",
        "phone": "47",
        "continent": "AN",
        "capital": "",
        "currency": "NOK",
        "languages": [
            "no",
            "nb",
            "nn"
        ]
    },
    "BW": {
        "name": "Botswana",
        "native": "Botswana",
        "phone": "267",
        "continent": "AF",
        "capital": "Gaborone",
        "currency": "BWP",
        "languages": [
            "en",
            "tn"
        ]
    },
    "BY": {
        "name": "Belarus",
        "native": "Белару́сь",
        "phone": "375",
        "continent": "EU",
        "capital": "Minsk",
        "currency": "BYN",
        "languages": [
            "be",
            "ru"
        ]
    },
    "BZ": {
        "name": "Belize",
        "native": "Belize",
        "phone": "501",
        "continent": "NA",
        "capital": "Belmopan",
        "currency": "BZD",
        "languages": [
            "en",
            "es"
        ]
    },
    "CA": {
        "name": "Canada",
        "native": "Canada",
        "phone": "1",
        "continent": "NA",
        "capital": "Ottawa",
        "currency": "CAD",
        "languages": [
            "en",
            "fr"
        ]
    },
    "CC": {
        "name": "Cocos [Keeling] Islands",
        "native": "Cocos (Keeling) Islands",
        "phone": "61",
        "continent": "AS",
        "capital": "West Island",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "CD": {
        "name": "Democratic Republic of the Congo",
        "native": "République démocratique du Congo",
        "phone": "243",
        "continent": "AF",
        "capital": "Kinshasa",
        "currency": "CDF",
        "languages": [
            "fr",
            "ln",
            "kg",
            "sw",
            "lu"
        ]
    },
    "CF": {
        "name": "Central African Republic",
        "native": "Ködörösêse tî Bêafrîka",
        "phone": "236",
        "continent": "AF",
        "capital": "Bangui",
        "currency": "XAF",
        "languages": [
            "fr",
            "sg"
        ]
    },
    "CG": {
        "name": "Republic of the Congo",
        "native": "République du Congo",
        "phone": "242",
        "continent": "AF",
        "capital": "Brazzaville",
        "currency": "XAF",
        "languages": [
            "fr",
            "ln"
        ]
    },
    "CH": {
        "name": "Switzerland",
        "native": "Schweiz",
        "phone": "41",
        "continent": "EU",
        "capital": "Bern",
        "currency": "CHE,CHF,CHW",
        "languages": [
            "de",
            "fr",
            "it"
        ]
    },
    "CI": {
        "name": "Ivory Coast",
        "native": "Côte d'Ivoire",
        "phone": "225",
        "continent": "AF",
        "capital": "Yamoussoukro",
        "currency": "XOF",
        "languages": [
            "fr"
        ]
    },
    "CK": {
        "name": "Cook Islands",
        "native": "Cook Islands",
        "phone": "682",
        "continent": "OC",
        "capital": "Avarua",
        "currency": "NZD",
        "languages": [
            "en"
        ]
    },
    "CL": {
        "name": "Chile",
        "native": "Chile",
        "phone": "56",
        "continent": "SA",
        "capital": "Santiago",
        "currency": "CLF,CLP",
        "languages": [
            "es"
        ]
    },
    "CM": {
        "name": "Cameroon",
        "native": "Cameroon",
        "phone": "237",
        "continent": "AF",
        "capital": "Yaoundé",
        "currency": "XAF",
        "languages": [
            "en",
            "fr"
        ]
    },
    "CN": {
        "name": "China",
        "native": "中国",
        "phone": "86",
        "continent": "AS",
        "capital": "Beijing",
        "currency": "CNY",
        "languages": [
            "zh"
        ]
    },
    "CO": {
        "name": "Colombia",
        "native": "Colombia",
        "phone": "57",
        "continent": "SA",
        "capital": "Bogotá",
        "currency": "COP",
        "languages": [
            "es"
        ]
    },
    "CR": {
        "name": "Costa Rica",
        "native": "Costa Rica",
        "phone": "506",
        "continent": "NA",
        "capital": "San José",
        "currency": "CRC",
        "languages": [
            "es"
        ]
    },
    "CU": {
        "name": "Cuba",
        "native": "Cuba",
        "phone": "53",
        "continent": "NA",
        "capital": "Havana",
        "currency": "CUC,CUP",
        "languages": [
            "es"
        ]
    },
    "CV": {
        "name": "Cape Verde",
        "native": "Cabo Verde",
        "phone": "238",
        "continent": "AF",
        "capital": "Praia",
        "currency": "CVE",
        "languages": [
            "pt"
        ]
    },
    "CW": {
        "name": "Curacao",
        "native": "Curaçao",
        "phone": "5999",
        "continent": "NA",
        "capital": "Willemstad",
        "currency": "ANG",
        "languages": [
            "nl",
            "pa",
            "en"
        ]
    },
    "CX": {
        "name": "Christmas Island",
        "native": "Christmas Island",
        "phone": "61",
        "continent": "AS",
        "capital": "Flying Fish Cove",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "CY": {
        "name": "Cyprus",
        "native": "Κύπρος",
        "phone": "357",
        "continent": "EU",
        "capital": "Nicosia",
        "currency": "EUR",
        "languages": [
            "el",
            "tr",
            "hy"
        ]
    },
    "CZ": {
        "name": "Czech Republic",
        "native": "Česká republika",
        "phone": "420",
        "continent": "EU",
        "capital": "Prague",
        "currency": "CZK",
        "languages": [
            "cs",
            "sk"
        ]
    },
    "DE": {
        "name": "Germany",
        "native": "Deutschland",
        "phone": "49",
        "continent": "EU",
        "capital": "Berlin",
        "currency": "EUR",
        "languages": [
            "de"
        ]
    },
    "DJ": {
        "name": "Djibouti",
        "native": "Djibouti",
        "phone": "253",
        "continent": "AF",
        "capital": "Djibouti",
        "currency": "DJF",
        "languages": [
            "fr",
            "ar"
        ]
    },
    "DK": {
        "name": "Denmark",
        "native": "Danmark",
        "phone": "45",
        "continent": "EU",
        "capital": "Copenhagen",
        "currency": "DKK",
        "languages": [
            "da"
        ]
    },
    "DM": {
        "name": "Dominica",
        "native": "Dominica",
        "phone": "1767",
        "continent": "NA",
        "capital": "Roseau",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "DO": {
        "name": "Dominican Republic",
        "native": "República Dominicana",
        "phone": "1809,1829,1849",
        "continent": "NA",
        "capital": "Santo Domingo",
        "currency": "DOP",
        "languages": [
            "es"
        ]
    },
    "DZ": {
        "name": "Algeria",
        "native": "الجزائر",
        "phone": "213",
        "continent": "AF",
        "capital": "Algiers",
        "currency": "DZD",
        "languages": [
            "ar"
        ]
    },
    "EC": {
        "name": "Ecuador",
        "native": "Ecuador",
        "phone": "593",
        "continent": "SA",
        "capital": "Quito",
        "currency": "USD",
        "languages": [
            "es"
        ]
    },
    "EE": {
        "name": "Estonia",
        "native": "Eesti",
        "phone": "372",
        "continent": "EU",
        "capital": "Tallinn",
        "currency": "EUR",
        "languages": [
            "et"
        ]
    },
    "EG": {
        "name": "Egypt",
        "native": "مصر‎",
        "phone": "20",
        "continent": "AF",
        "capital": "Cairo",
        "currency": "EGP",
        "languages": [
            "ar"
        ]
    },
    "EH": {
        "name": "Western Sahara",
        "native": "الصحراء الغربية",
        "phone": "212",
        "continent": "AF",
        "capital": "El Aaiún",
        "currency": "MAD,DZD,MRU",
        "languages": [
            "es"
        ]
    },
    "ER": {
        "name": "Eritrea",
        "native": "ኤርትራ",
        "phone": "291",
        "continent": "AF",
        "capital": "Asmara",
        "currency": "ERN",
        "languages": [
            "ti",
            "ar",
            "en"
        ]
    },
    "ES": {
        "name": "Spain",
        "native": "España",
        "phone": "34",
        "continent": "EU",
        "capital": "Madrid",
        "currency": "EUR",
        "languages": [
            "es",
            "eu",
            "ca",
            "gl",
            "oc"
        ]
    },
    "ET": {
        "name": "Ethiopia",
        "native": "ኢትዮጵያ",
        "phone": "251",
        "continent": "AF",
        "capital": "Addis Ababa",
        "currency": "ETB",
        "languages": [
            "am"
        ]
    },
    "FI": {
        "name": "Finland",
        "native": "Suomi",
        "phone": "358",
        "continent": "EU",
        "capital": "Helsinki",
        "currency": "EUR",
        "languages": [
            "fi",
            "sv"
        ]
    },
    "FJ": {
        "name": "Fiji",
        "native": "Fiji",
        "phone": "679",
        "continent": "OC",
        "capital": "Suva",
        "currency": "FJD",
        "languages": [
            "en",
            "fj",
            "hi",
            "ur"
        ]
    },
    "FK": {
        "name": "Falkland Islands",
        "native": "Falkland Islands",
        "phone": "500",
        "continent": "SA",
        "capital": "Stanley",
        "currency": "FKP",
        "languages": [
            "en"
        ]
    },
    "FM": {
        "name": "Micronesia",
        "native": "Micronesia",
        "phone": "691",
        "continent": "OC",
        "capital": "Palikir",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "FO": {
        "name": "Faroe Islands",
        "native": "Føroyar",
        "phone": "298",
        "continent": "EU",
        "capital": "Tórshavn",
        "currency": "DKK",
        "languages": [
            "fo"
        ]
    },
    "FR": {
        "name": "France",
        "native": "France",
        "phone": "33",
        "continent": "EU",
        "capital": "Paris",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "GA": {
        "name": "Gabon",
        "native": "Gabon",
        "phone": "241",
        "continent": "AF",
        "capital": "Libreville",
        "currency": "XAF",
        "languages": [
            "fr"
        ]
    },
    "GB": {
        "name": "United Kingdom",
        "native": "United Kingdom",
        "phone": "44",
        "continent": "EU",
        "capital": "London",
        "currency": "GBP",
        "languages": [
            "en"
        ]
    },
    "GD": {
        "name": "Grenada",
        "native": "Grenada",
        "phone": "1473",
        "continent": "NA",
        "capital": "St. George's",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "GE": {
        "name": "Georgia",
        "native": "საქართველო",
        "phone": "995",
        "continent": "AS",
        "capital": "Tbilisi",
        "currency": "GEL",
        "languages": [
            "ka"
        ]
    },
    "GF": {
        "name": "French Guiana",
        "native": "Guyane française",
        "phone": "594",
        "continent": "SA",
        "capital": "Cayenne",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "GG": {
        "name": "Guernsey",
        "native": "Guernsey",
        "phone": "44",
        "continent": "EU",
        "capital": "St. Peter Port",
        "currency": "GBP",
        "languages": [
            "en",
            "fr"
        ]
    },
    "GH": {
        "name": "Ghana",
        "native": "Ghana",
        "phone": "233",
        "continent": "AF",
        "capital": "Accra",
        "currency": "GHS",
        "languages": [
            "en"
        ]
    },
    "GI": {
        "name": "Gibraltar",
        "native": "Gibraltar",
        "phone": "350",
        "continent": "EU",
        "capital": "Gibraltar",
        "currency": "GIP",
        "languages": [
            "en"
        ]
    },
    "GL": {
        "name": "Greenland",
        "native": "Kalaallit Nunaat",
        "phone": "299",
        "continent": "NA",
        "capital": "Nuuk",
        "currency": "DKK",
        "languages": [
            "kl"
        ]
    },
    "GM": {
        "name": "Gambia",
        "native": "Gambia",
        "phone": "220",
        "continent": "AF",
        "capital": "Banjul",
        "currency": "GMD",
        "languages": [
            "en"
        ]
    },
    "GN": {
        "name": "Guinea",
        "native": "Guinée",
        "phone": "224",
        "continent": "AF",
        "capital": "Conakry",
        "currency": "GNF",
        "languages": [
            "fr",
            "ff"
        ]
    },
    "GP": {
        "name": "Guadeloupe",
        "native": "Guadeloupe",
        "phone": "590",
        "continent": "NA",
        "capital": "Basse-Terre",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "GQ": {
        "name": "Equatorial Guinea",
        "native": "Guinea Ecuatorial",
        "phone": "240",
        "continent": "AF",
        "capital": "Malabo",
        "currency": "XAF",
        "languages": [
            "es",
            "fr"
        ]
    },
    "GR": {
        "name": "Greece",
        "native": "Ελλάδα",
        "phone": "30",
        "continent": "EU",
        "capital": "Athens",
        "currency": "EUR",
        "languages": [
            "el"
        ]
    },
    "GS": {
        "name": "South Georgia and the South Sandwich Islands",
        "native": "South Georgia",
        "phone": "500",
        "continent": "AN",
        "capital": "King Edward Point",
        "currency": "GBP",
        "languages": [
            "en"
        ]
    },
    "GT": {
        "name": "Guatemala",
        "native": "Guatemala",
        "phone": "502",
        "continent": "NA",
        "capital": "Guatemala City",
        "currency": "GTQ",
        "languages": [
            "es"
        ]
    },
    "GU": {
        "name": "Guam",
        "native": "Guam",
        "phone": "1671",
        "continent": "OC",
        "capital": "Hagåtña",
        "currency": "USD",
        "languages": [
            "en",
            "ch",
            "es"
        ]
    },
    "GW": {
        "name": "Guinea-Bissau",
        "native": "Guiné-Bissau",
        "phone": "245",
        "continent": "AF",
        "capital": "Bissau",
        "currency": "XOF",
        "languages": [
            "pt"
        ]
    },
    "GY": {
        "name": "Guyana",
        "native": "Guyana",
        "phone": "592",
        "continent": "SA",
        "capital": "Georgetown",
        "currency": "GYD",
        "languages": [
            "en"
        ]
    },
    "HK": {
        "name": "Hong Kong",
        "native": "香港",
        "phone": "852",
        "continent": "AS",
        "capital": "City of Victoria",
        "currency": "HKD",
        "languages": [
            "zh",
            "en"
        ]
    },
    "HM": {
        "name": "Heard Island and McDonald Islands",
        "native": "Heard Island and McDonald Islands",
        "phone": "61",
        "continent": "AN",
        "capital": "",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "HN": {
        "name": "Honduras",
        "native": "Honduras",
        "phone": "504",
        "continent": "NA",
        "capital": "Tegucigalpa",
        "currency": "HNL",
        "languages": [
            "es"
        ]
    },
    "HR": {
        "name": "Croatia",
        "native": "Hrvatska",
        "phone": "385",
        "continent": "EU",
        "capital": "Zagreb",
        "currency": "HRK",
        "languages": [
            "hr"
        ]
    },
    "HT": {
        "name": "Haiti",
        "native": "Haïti",
        "phone": "509",
        "continent": "NA",
        "capital": "Port-au-Prince",
        "currency": "HTG,USD",
        "languages": [
            "fr",
            "ht"
        ]
    },
    "HU": {
        "name": "Hungary",
        "native": "Magyarország",
        "phone": "36",
        "continent": "EU",
        "capital": "Budapest",
        "currency": "HUF",
        "languages": [
            "hu"
        ]
    },
    "ID": {
        "name": "Indonesia",
        "native": "Indonesia",
        "phone": "62",
        "continent": "AS",
        "capital": "Jakarta",
        "currency": "IDR",
        "languages": [
            "id"
        ]
    },
    "IE": {
        "name": "Ireland",
        "native": "Éire",
        "phone": "353",
        "continent": "EU",
        "capital": "Dublin",
        "currency": "EUR",
        "languages": [
            "ga",
            "en"
        ]
    },
    "IL": {
        "name": "Israel",
        "native": "יִשְׂרָאֵל",
        "phone": "972",
        "continent": "AS",
        "capital": "Jerusalem",
        "currency": "ILS",
        "languages": [
            "he",
            "ar"
        ]
    },
    "IM": {
        "name": "Isle of Man",
        "native": "Isle of Man",
        "phone": "44",
        "continent": "EU",
        "capital": "Douglas",
        "currency": "GBP",
        "languages": [
            "en",
            "gv"
        ]
    },
    "IN": {
        "name": "India",
        "native": "भारत",
        "phone": "91",
        "continent": "AS",
        "capital": "New Delhi",
        "currency": "INR",
        "languages": [
            "hi",
            "en"
        ]
    },
    "IO": {
        "name": "British Indian Ocean Territory",
        "native": "British Indian Ocean Territory",
        "phone": "246",
        "continent": "AS",
        "capital": "Diego Garcia",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "IQ": {
        "name": "Iraq",
        "native": "العراق",
        "phone": "964",
        "continent": "AS",
        "capital": "Baghdad",
        "currency": "IQD",
        "languages": [
            "ar",
            "ku"
        ]
    },
    "IR": {
        "name": "Iran",
        "native": "ایران",
        "phone": "98",
        "continent": "AS",
        "capital": "Tehran",
        "currency": "IRR",
        "languages": [
            "fa"
        ]
    },
    "IS": {
        "name": "Iceland",
        "native": "Ísland",
        "phone": "354",
        "continent": "EU",
        "capital": "Reykjavik",
        "currency": "ISK",
        "languages": [
            "is"
        ]
    },
    "IT": {
        "name": "Italy",
        "native": "Italia",
        "phone": "39",
        "continent": "EU",
        "capital": "Rome",
        "currency": "EUR",
        "languages": [
            "it"
        ]
    },
    "JE": {
        "name": "Jersey",
        "native": "Jersey",
        "phone": "44",
        "continent": "EU",
        "capital": "Saint Helier",
        "currency": "GBP",
        "languages": [
            "en",
            "fr"
        ]
    },
    "JM": {
        "name": "Jamaica",
        "native": "Jamaica",
        "phone": "1876",
        "continent": "NA",
        "capital": "Kingston",
        "currency": "JMD",
        "languages": [
            "en"
        ]
    },
    "JO": {
        "name": "Jordan",
        "native": "الأردن",
        "phone": "962",
        "continent": "AS",
        "capital": "Amman",
        "currency": "JOD",
        "languages": [
            "ar"
        ]
    },
    "JP": {
        "name": "Japan",
        "native": "日本",
        "phone": "81",
        "continent": "AS",
        "capital": "Tokyo",
        "currency": "JPY",
        "languages": [
            "ja"
        ]
    },
    "KE": {
        "name": "Kenya",
        "native": "Kenya",
        "phone": "254",
        "continent": "AF",
        "capital": "Nairobi",
        "currency": "KES",
        "languages": [
            "en",
            "sw"
        ]
    },
    "KG": {
        "name": "Kyrgyzstan",
        "native": "Кыргызстан",
        "phone": "996",
        "continent": "AS",
        "capital": "Bishkek",
        "currency": "KGS",
        "languages": [
            "ky",
            "ru"
        ]
    },
    "KH": {
        "name": "Cambodia",
        "native": "Kâmpŭchéa",
        "phone": "855",
        "continent": "AS",
        "capital": "Phnom Penh",
        "currency": "KHR",
        "languages": [
            "km"
        ]
    },
    "KI": {
        "name": "Kiribati",
        "native": "Kiribati",
        "phone": "686",
        "continent": "OC",
        "capital": "South Tarawa",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "KM": {
        "name": "Comoros",
        "native": "Komori",
        "phone": "269",
        "continent": "AF",
        "capital": "Moroni",
        "currency": "KMF",
        "languages": [
            "ar",
            "fr"
        ]
    },
    "KN": {
        "name": "Saint Kitts and Nevis",
        "native": "Saint Kitts and Nevis",
        "phone": "1869",
        "continent": "NA",
        "capital": "Basseterre",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "KP": {
        "name": "North Korea",
        "native": "북한",
        "phone": "850",
        "continent": "AS",
        "capital": "Pyongyang",
        "currency": "KPW",
        "languages": [
            "ko"
        ]
    },
    "KR": {
        "name": "South Korea",
        "native": "대한민국",
        "phone": "82",
        "continent": "AS",
        "capital": "Seoul",
        "currency": "KRW",
        "languages": [
            "ko"
        ]
    },
    "KW": {
        "name": "Kuwait",
        "native": "الكويت",
        "phone": "965",
        "continent": "AS",
        "capital": "Kuwait City",
        "currency": "KWD",
        "languages": [
            "ar"
        ]
    },
    "KY": {
        "name": "Cayman Islands",
        "native": "Cayman Islands",
        "phone": "1345",
        "continent": "NA",
        "capital": "George Town",
        "currency": "KYD",
        "languages": [
            "en"
        ]
    },
    "KZ": {
        "name": "Kazakhstan",
        "native": "Қазақстан",
        "phone": "76,77",
        "continent": "AS",
        "capital": "Astana",
        "currency": "KZT",
        "languages": [
            "kk",
            "ru"
        ]
    },
    "LA": {
        "name": "Laos",
        "native": "ສປປລາວ",
        "phone": "856",
        "continent": "AS",
        "capital": "Vientiane",
        "currency": "LAK",
        "languages": [
            "lo"
        ]
    },
    "LB": {
        "name": "Lebanon",
        "native": "لبنان",
        "phone": "961",
        "continent": "AS",
        "capital": "Beirut",
        "currency": "LBP",
        "languages": [
            "ar",
            "fr"
        ]
    },
    "LC": {
        "name": "Saint Lucia",
        "native": "Saint Lucia",
        "phone": "1758",
        "continent": "NA",
        "capital": "Castries",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "LI": {
        "name": "Liechtenstein",
        "native": "Liechtenstein",
        "phone": "423",
        "continent": "EU",
        "capital": "Vaduz",
        "currency": "CHF",
        "languages": [
            "de"
        ]
    },
    "LK": {
        "name": "Sri Lanka",
        "native": "śrī laṃkāva",
        "phone": "94",
        "continent": "AS",
        "capital": "Colombo",
        "currency": "LKR",
        "languages": [
            "si",
            "ta"
        ]
    },
    "LR": {
        "name": "Liberia",
        "native": "Liberia",
        "phone": "231",
        "continent": "AF",
        "capital": "Monrovia",
        "currency": "LRD",
        "languages": [
            "en"
        ]
    },
    "LS": {
        "name": "Lesotho",
        "native": "Lesotho",
        "phone": "266",
        "continent": "AF",
        "capital": "Maseru",
        "currency": "LSL,ZAR",
        "languages": [
            "en",
            "st"
        ]
    },
    "LT": {
        "name": "Lithuania",
        "native": "Lietuva",
        "phone": "370",
        "continent": "EU",
        "capital": "Vilnius",
        "currency": "EUR",
        "languages": [
            "lt"
        ]
    },
    "LU": {
        "name": "Luxembourg",
        "native": "Luxembourg",
        "phone": "352",
        "continent": "EU",
        "capital": "Luxembourg",
        "currency": "EUR",
        "languages": [
            "fr",
            "de",
            "lb"
        ]
    },
    "LV": {
        "name": "Latvia",
        "native": "Latvija",
        "phone": "371",
        "continent": "EU",
        "capital": "Riga",
        "currency": "EUR",
        "languages": [
            "lv"
        ]
    },
    "LY": {
        "name": "Libya",
        "native": "‏ليبيا",
        "phone": "218",
        "continent": "AF",
        "capital": "Tripoli",
        "currency": "LYD",
        "languages": [
            "ar"
        ]
    },
    "MA": {
        "name": "Morocco",
        "native": "المغرب",
        "phone": "212",
        "continent": "AF",
        "capital": "Rabat",
        "currency": "MAD",
        "languages": [
            "ar"
        ]
    },
    "MC": {
        "name": "Monaco",
        "native": "Monaco",
        "phone": "377",
        "continent": "EU",
        "capital": "Monaco",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "MD": {
        "name": "Moldova",
        "native": "Moldova",
        "phone": "373",
        "continent": "EU",
        "capital": "Chișinău",
        "currency": "MDL",
        "languages": [
            "ro"
        ]
    },
    "ME": {
        "name": "Montenegro",
        "native": "Црна Гора",
        "phone": "382",
        "continent": "EU",
        "capital": "Podgorica",
        "currency": "EUR",
        "languages": [
            "sr",
            "bs",
            "sq",
            "hr"
        ]
    },
    "MF": {
        "name": "Saint Martin",
        "native": "Saint-Martin",
        "phone": "590",
        "continent": "NA",
        "capital": "Marigot",
        "currency": "EUR",
        "languages": [
            "en",
            "fr",
            "nl"
        ]
    },
    "MG": {
        "name": "Madagascar",
        "native": "Madagasikara",
        "phone": "261",
        "continent": "AF",
        "capital": "Antananarivo",
        "currency": "MGA",
        "languages": [
            "fr",
            "mg"
        ]
    },
    "MH": {
        "name": "Marshall Islands",
        "native": "M̧ajeļ",
        "phone": "692",
        "continent": "OC",
        "capital": "Majuro",
        "currency": "USD",
        "languages": [
            "en",
            "mh"
        ]
    },
    "MK": {
        "name": "North Macedonia",
        "native": "Северна Македонија",
        "phone": "389",
        "continent": "EU",
        "capital": "Skopje",
        "currency": "MKD",
        "languages": [
            "mk"
        ]
    },
    "ML": {
        "name": "Mali",
        "native": "Mali",
        "phone": "223",
        "continent": "AF",
        "capital": "Bamako",
        "currency": "XOF",
        "languages": [
            "fr"
        ]
    },
    "MM": {
        "name": "Myanmar [Burma]",
        "native": "မြန်မာ",
        "phone": "95",
        "continent": "AS",
        "capital": "Naypyidaw",
        "currency": "MMK",
        "languages": [
            "my"
        ]
    },
    "MN": {
        "name": "Mongolia",
        "native": "Монгол улс",
        "phone": "976",
        "continent": "AS",
        "capital": "Ulan Bator",
        "currency": "MNT",
        "languages": [
            "mn"
        ]
    },
    "MO": {
        "name": "Macao",
        "native": "澳門",
        "phone": "853",
        "continent": "AS",
        "capital": "",
        "currency": "MOP",
        "languages": [
            "zh",
            "pt"
        ]
    },
    "MP": {
        "name": "Northern Mariana Islands",
        "native": "Northern Mariana Islands",
        "phone": "1670",
        "continent": "OC",
        "capital": "Saipan",
        "currency": "USD",
        "languages": [
            "en",
            "ch"
        ]
    },
    "MQ": {
        "name": "Martinique",
        "native": "Martinique",
        "phone": "596",
        "continent": "NA",
        "capital": "Fort-de-France",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "MR": {
        "name": "Mauritania",
        "native": "موريتانيا",
        "phone": "222",
        "continent": "AF",
        "capital": "Nouakchott",
        "currency": "MRU",
        "languages": [
            "ar"
        ]
    },
    "MS": {
        "name": "Montserrat",
        "native": "Montserrat",
        "phone": "1664",
        "continent": "NA",
        "capital": "Plymouth",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "MT": {
        "name": "Malta",
        "native": "Malta",
        "phone": "356",
        "continent": "EU",
        "capital": "Valletta",
        "currency": "EUR",
        "languages": [
            "mt",
            "en"
        ]
    },
    "MU": {
        "name": "Mauritius",
        "native": "Maurice",
        "phone": "230",
        "continent": "AF",
        "capital": "Port Louis",
        "currency": "MUR",
        "languages": [
            "en"
        ]
    },
    "MV": {
        "name": "Maldives",
        "native": "Maldives",
        "phone": "960",
        "continent": "AS",
        "capital": "Malé",
        "currency": "MVR",
        "languages": [
            "dv"
        ]
    },
    "MW": {
        "name": "Malawi",
        "native": "Malawi",
        "phone": "265",
        "continent": "AF",
        "capital": "Lilongwe",
        "currency": "MWK",
        "languages": [
            "en",
            "ny"
        ]
    },
    "MX": {
        "name": "Mexico",
        "native": "México",
        "phone": "52",
        "continent": "NA",
        "capital": "Mexico City",
        "currency": "MXN",
        "languages": [
            "es"
        ]
    },
    "MY": {
        "name": "Malaysia",
        "native": "Malaysia",
        "phone": "60",
        "continent": "AS",
        "capital": "Kuala Lumpur",
        "currency": "MYR",
        "languages": [
            "ms"
        ]
    },
    "MZ": {
        "name": "Mozambique",
        "native": "Moçambique",
        "phone": "258",
        "continent": "AF",
        "capital": "Maputo",
        "currency": "MZN",
        "languages": [
            "pt"
        ]
    },
    "NA": {
        "name": "Namibia",
        "native": "Namibia",
        "phone": "264",
        "continent": "AF",
        "capital": "Windhoek",
        "currency": "NAD,ZAR",
        "languages": [
            "en",
            "af"
        ]
    },
    "NC": {
        "name": "New Caledonia",
        "native": "Nouvelle-Calédonie",
        "phone": "687",
        "continent": "OC",
        "capital": "Nouméa",
        "currency": "XPF",
        "languages": [
            "fr"
        ]
    },
    "NE": {
        "name": "Niger",
        "native": "Niger",
        "phone": "227",
        "continent": "AF",
        "capital": "Niamey",
        "currency": "XOF",
        "languages": [
            "fr"
        ]
    },
    "NF": {
        "name": "Norfolk Island",
        "native": "Norfolk Island",
        "phone": "672",
        "continent": "OC",
        "capital": "Kingston",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "NG": {
        "name": "Nigeria",
        "native": "Nigeria",
        "phone": "234",
        "continent": "AF",
        "capital": "Abuja",
        "currency": "NGN",
        "languages": [
            "en"
        ]
    },
    "NI": {
        "name": "Nicaragua",
        "native": "Nicaragua",
        "phone": "505",
        "continent": "NA",
        "capital": "Managua",
        "currency": "NIO",
        "languages": [
            "es"
        ]
    },
    "NL": {
        "name": "Netherlands",
        "native": "Nederland",
        "phone": "31",
        "continent": "EU",
        "capital": "Amsterdam",
        "currency": "EUR",
        "languages": [
            "nl"
        ]
    },
    "NO": {
        "name": "Norway",
        "native": "Norge",
        "phone": "47",
        "continent": "EU",
        "capital": "Oslo",
        "currency": "NOK",
        "languages": [
            "no",
            "nb",
            "nn"
        ]
    },
    "NP": {
        "name": "Nepal",
        "native": "नपल",
        "phone": "977",
        "continent": "AS",
        "capital": "Kathmandu",
        "currency": "NPR",
        "languages": [
            "ne"
        ]
    },
    "NR": {
        "name": "Nauru",
        "native": "Nauru",
        "phone": "674",
        "continent": "OC",
        "capital": "Yaren",
        "currency": "AUD",
        "languages": [
            "en",
            "na"
        ]
    },
    "NU": {
        "name": "Niue",
        "native": "Niuē",
        "phone": "683",
        "continent": "OC",
        "capital": "Alofi",
        "currency": "NZD",
        "languages": [
            "en"
        ]
    },
    "NZ": {
        "name": "New Zealand",
        "native": "New Zealand",
        "phone": "64",
        "continent": "OC",
        "capital": "Wellington",
        "currency": "NZD",
        "languages": [
            "en",
            "mi"
        ]
    },
    "OM": {
        "name": "Oman",
        "native": "عمان",
        "phone": "968",
        "continent": "AS",
        "capital": "Muscat",
        "currency": "OMR",
        "languages": [
            "ar"
        ]
    },
    "PA": {
        "name": "Panama",
        "native": "Panamá",
        "phone": "507",
        "continent": "NA",
        "capital": "Panama City",
        "currency": "PAB,USD",
        "languages": [
            "es"
        ]
    },
    "PE": {
        "name": "Peru",
        "native": "Perú",
        "phone": "51",
        "continent": "SA",
        "capital": "Lima",
        "currency": "PEN",
        "languages": [
            "es"
        ]
    },
    "PF": {
        "name": "French Polynesia",
        "native": "Polynésie française",
        "phone": "689",
        "continent": "OC",
        "capital": "Papeetē",
        "currency": "XPF",
        "languages": [
            "fr"
        ]
    },
    "PG": {
        "name": "Papua New Guinea",
        "native": "Papua Niugini",
        "phone": "675",
        "continent": "OC",
        "capital": "Port Moresby",
        "currency": "PGK",
        "languages": [
            "en"
        ]
    },
    "PH": {
        "name": "Philippines",
        "native": "Pilipinas",
        "phone": "63",
        "continent": "AS",
        "capital": "Manila",
        "currency": "PHP",
        "languages": [
            "en"
        ]
    },
    "PK": {
        "name": "Pakistan",
        "native": "Pakistan",
        "phone": "92",
        "continent": "AS",
        "capital": "Islamabad",
        "currency": "PKR",
        "languages": [
            "en",
            "ur"
        ]
    },
    "PL": {
        "name": "Poland",
        "native": "Polska",
        "phone": "48",
        "continent": "EU",
        "capital": "Warsaw",
        "currency": "PLN",
        "languages": [
            "pl"
        ]
    },
    "PM": {
        "name": "Saint Pierre and Miquelon",
        "native": "Saint-Pierre-et-Miquelon",
        "phone": "508",
        "continent": "NA",
        "capital": "Saint-Pierre",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "PN": {
        "name": "Pitcairn Islands",
        "native": "Pitcairn Islands",
        "phone": "64",
        "continent": "OC",
        "capital": "Adamstown",
        "currency": "NZD",
        "languages": [
            "en"
        ]
    },
    "PR": {
        "name": "Puerto Rico",
        "native": "Puerto Rico",
        "phone": "1787,1939",
        "continent": "NA",
        "capital": "San Juan",
        "currency": "USD",
        "languages": [
            "es",
            "en"
        ]
    },
    "PS": {
        "name": "Palestine",
        "native": "فلسطين",
        "phone": "970",
        "continent": "AS",
        "capital": "Ramallah",
        "currency": "ILS",
        "languages": [
            "ar"
        ]
    },
    "PT": {
        "name": "Portugal",
        "native": "Portugal",
        "phone": "351",
        "continent": "EU",
        "capital": "Lisbon",
        "currency": "EUR",
        "languages": [
            "pt"
        ]
    },
    "PW": {
        "name": "Palau",
        "native": "Palau",
        "phone": "680",
        "continent": "OC",
        "capital": "Ngerulmud",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "PY": {
        "name": "Paraguay",
        "native": "Paraguay",
        "phone": "595",
        "continent": "SA",
        "capital": "Asunción",
        "currency": "PYG",
        "languages": [
            "es",
            "gn"
        ]
    },
    "QA": {
        "name": "Qatar",
        "native": "قطر",
        "phone": "974",
        "continent": "AS",
        "capital": "Doha",
        "currency": "QAR",
        "languages": [
            "ar"
        ]
    },
    "RE": {
        "name": "Réunion",
        "native": "La Réunion",
        "phone": "262",
        "continent": "AF",
        "capital": "Saint-Denis",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "RO": {
        "name": "Romania",
        "native": "România",
        "phone": "40",
        "continent": "EU",
        "capital": "Bucharest",
        "currency": "RON",
        "languages": [
            "ro"
        ]
    },
    "RS": {
        "name": "Serbia",
        "native": "Србија",
        "phone": "381",
        "continent": "EU",
        "capital": "Belgrade",
        "currency": "RSD",
        "languages": [
            "sr"
        ]
    },
    "RU": {
        "name": "Russia",
        "native": "Россия",
        "phone": "7",
        "continent": "EU",
        "capital": "Moscow",
        "currency": "RUB",
        "languages": [
            "ru"
        ]
    },
    "RW": {
        "name": "Rwanda",
        "native": "Rwanda",
        "phone": "250",
        "continent": "AF",
        "capital": "Kigali",
        "currency": "RWF",
        "languages": [
            "rw",
            "en",
            "fr"
        ]
    },
    "SA": {
        "name": "Saudi Arabia",
        "native": "العربية السعودية",
        "phone": "966",
        "continent": "AS",
        "capital": "Riyadh",
        "currency": "SAR",
        "languages": [
            "ar"
        ]
    },
    "SB": {
        "name": "Solomon Islands",
        "native": "Solomon Islands",
        "phone": "677",
        "continent": "OC",
        "capital": "Honiara",
        "currency": "SBD",
        "languages": [
            "en"
        ]
    },
    "SC": {
        "name": "Seychelles",
        "native": "Seychelles",
        "phone": "248",
        "continent": "AF",
        "capital": "Victoria",
        "currency": "SCR",
        "languages": [
            "fr",
            "en"
        ]
    },
    "SD": {
        "name": "Sudan",
        "native": "السودان",
        "phone": "249",
        "continent": "AF",
        "capital": "Khartoum",
        "currency": "SDG",
        "languages": [
            "ar",
            "en"
        ]
    },
    "SE": {
        "name": "Sweden",
        "native": "Sverige",
        "phone": "46",
        "continent": "EU",
        "capital": "Stockholm",
        "currency": "SEK",
        "languages": [
            "sv"
        ]
    },
    "SG": {
        "name": "Singapore",
        "native": "Singapore",
        "phone": "65",
        "continent": "AS",
        "capital": "Singapore",
        "currency": "SGD",
        "languages": [
            "en",
            "ms",
            "ta",
            "zh"
        ]
    },
    "SH": {
        "name": "Saint Helena",
        "native": "Saint Helena",
        "phone": "290",
        "continent": "AF",
        "capital": "Jamestown",
        "currency": "SHP",
        "languages": [
            "en"
        ]
    },
    "SI": {
        "name": "Slovenia",
        "native": "Slovenija",
        "phone": "386",
        "continent": "EU",
        "capital": "Ljubljana",
        "currency": "EUR",
        "languages": [
            "sl"
        ]
    },
    "SJ": {
        "name": "Svalbard and Jan Mayen",
        "native": "Svalbard og Jan Mayen",
        "phone": "4779",
        "continent": "EU",
        "capital": "Longyearbyen",
        "currency": "NOK",
        "languages": [
            "no"
        ]
    },
    "SK": {
        "name": "Slovakia",
        "native": "Slovensko",
        "phone": "421",
        "continent": "EU",
        "capital": "Bratislava",
        "currency": "EUR",
        "languages": [
            "sk"
        ]
    },
    "SL": {
        "name": "Sierra Leone",
        "native": "Sierra Leone",
        "phone": "232",
        "continent": "AF",
        "capital": "Freetown",
        "currency": "SLL",
        "languages": [
            "en"
        ]
    },
    "SM": {
        "name": "San Marino",
        "native": "San Marino",
        "phone": "378",
        "continent": "EU",
        "capital": "City of San Marino",
        "currency": "EUR",
        "languages": [
            "it"
        ]
    },
    "SN": {
        "name": "Senegal",
        "native": "Sénégal",
        "phone": "221",
        "continent": "AF",
        "capital": "Dakar",
        "currency": "XOF",
        "languages": [
            "fr"
        ]
    },
    "SO": {
        "name": "Somalia",
        "native": "Soomaaliya",
        "phone": "252",
        "continent": "AF",
        "capital": "Mogadishu",
        "currency": "SOS",
        "languages": [
            "so",
            "ar"
        ]
    },
    "SR": {
        "name": "Suriname",
        "native": "Suriname",
        "phone": "597",
        "continent": "SA",
        "capital": "Paramaribo",
        "currency": "SRD",
        "languages": [
            "nl"
        ]
    },
    "SS": {
        "name": "South Sudan",
        "native": "South Sudan",
        "phone": "211",
        "continent": "AF",
        "capital": "Juba",
        "currency": "SSP",
        "languages": [
            "en"
        ]
    },
    "ST": {
        "name": "São Tomé and Príncipe",
        "native": "São Tomé e Príncipe",
        "phone": "239",
        "continent": "AF",
        "capital": "São Tomé",
        "currency": "STN",
        "languages": [
            "pt"
        ]
    },
    "SV": {
        "name": "El Salvador",
        "native": "El Salvador",
        "phone": "503",
        "continent": "NA",
        "capital": "San Salvador",
        "currency": "SVC,USD",
        "languages": [
            "es"
        ]
    },
    "SX": {
        "name": "Sint Maarten",
        "native": "Sint Maarten",
        "phone": "1721",
        "continent": "NA",
        "capital": "Philipsburg",
        "currency": "ANG",
        "languages": [
            "nl",
            "en"
        ]
    },
    "SY": {
        "name": "Syria",
        "native": "سوريا",
        "phone": "963",
        "continent": "AS",
        "capital": "Damascus",
        "currency": "SYP",
        "languages": [
            "ar"
        ]
    },
    "SZ": {
        "name": "Swaziland",
        "native": "Swaziland",
        "phone": "268",
        "continent": "AF",
        "capital": "Lobamba",
        "currency": "SZL",
        "languages": [
            "en",
            "ss"
        ]
    },
    "TC": {
        "name": "Turks and Caicos Islands",
        "native": "Turks and Caicos Islands",
        "phone": "1649",
        "continent": "NA",
        "capital": "Cockburn Town",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "TD": {
        "name": "Chad",
        "native": "Tchad",
        "phone": "235",
        "continent": "AF",
        "capital": "N'Djamena",
        "currency": "XAF",
        "languages": [
            "fr",
            "ar"
        ]
    },
    "TF": {
        "name": "French Southern Territories",
        "native": "Territoire des Terres australes et antarctiques fr",
        "phone": "262",
        "continent": "AN",
        "capital": "Port-aux-Français",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "TG": {
        "name": "Togo",
        "native": "Togo",
        "phone": "228",
        "continent": "AF",
        "capital": "Lomé",
        "currency": "XOF",
        "languages": [
            "fr"
        ]
    },
    "TH": {
        "name": "Thailand",
        "native": "ประเทศไทย",
        "phone": "66",
        "continent": "AS",
        "capital": "Bangkok",
        "currency": "THB",
        "languages": [
            "th"
        ]
    },
    "TJ": {
        "name": "Tajikistan",
        "native": "Тоҷикистон",
        "phone": "992",
        "continent": "AS",
        "capital": "Dushanbe",
        "currency": "TJS",
        "languages": [
            "tg",
            "ru"
        ]
    },
    "TK": {
        "name": "Tokelau",
        "native": "Tokelau",
        "phone": "690",
        "continent": "OC",
        "capital": "Fakaofo",
        "currency": "NZD",
        "languages": [
            "en"
        ]
    },
    "TL": {
        "name": "East Timor",
        "native": "Timor-Leste",
        "phone": "670",
        "continent": "OC",
        "capital": "Dili",
        "currency": "USD",
        "languages": [
            "pt"
        ]
    },
    "TM": {
        "name": "Turkmenistan",
        "native": "Türkmenistan",
        "phone": "993",
        "continent": "AS",
        "capital": "Ashgabat",
        "currency": "TMT",
        "languages": [
            "tk",
            "ru"
        ]
    },
    "TN": {
        "name": "Tunisia",
        "native": "تونس",
        "phone": "216",
        "continent": "AF",
        "capital": "Tunis",
        "currency": "TND",
        "languages": [
            "ar"
        ]
    },
    "TO": {
        "name": "Tonga",
        "native": "Tonga",
        "phone": "676",
        "continent": "OC",
        "capital": "Nuku'alofa",
        "currency": "TOP",
        "languages": [
            "en",
            "to"
        ]
    },
    "TR": {
        "name": "Turkey",
        "native": "Türkiye",
        "phone": "90",
        "continent": "AS",
        "capital": "Ankara",
        "currency": "TRY",
        "languages": [
            "tr"
        ]
    },
    "TT": {
        "name": "Trinidad and Tobago",
        "native": "Trinidad and Tobago",
        "phone": "1868",
        "continent": "NA",
        "capital": "Port of Spain",
        "currency": "TTD",
        "languages": [
            "en"
        ]
    },
    "TV": {
        "name": "Tuvalu",
        "native": "Tuvalu",
        "phone": "688",
        "continent": "OC",
        "capital": "Funafuti",
        "currency": "AUD",
        "languages": [
            "en"
        ]
    },
    "TW": {
        "name": "Taiwan",
        "native": "臺灣",
        "phone": "886",
        "continent": "AS",
        "capital": "Taipei",
        "currency": "TWD",
        "languages": [
            "zh"
        ]
    },
    "TZ": {
        "name": "Tanzania",
        "native": "Tanzania",
        "phone": "255",
        "continent": "AF",
        "capital": "Dodoma",
        "currency": "TZS",
        "languages": [
            "sw",
            "en"
        ]
    },
    "UA": {
        "name": "Ukraine",
        "native": "Україна",
        "phone": "380",
        "continent": "EU",
        "capital": "Kyiv",
        "currency": "UAH",
        "languages": [
            "uk"
        ]
    },
    "UG": {
        "name": "Uganda",
        "native": "Uganda",
        "phone": "256",
        "continent": "AF",
        "capital": "Kampala",
        "currency": "UGX",
        "languages": [
            "en",
            "sw"
        ]
    },
    "UM": {
        "name": "U.S. Minor Outlying Islands",
        "native": "United States Minor Outlying Islands",
        "phone": "1",
        "continent": "OC",
        "capital": "",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "US": {
        "name": "United States",
        "native": "United States",
        "phone": "1",
        "continent": "NA",
        "capital": "Washington D.C.",
        "currency": "USD,USN,USS",
        "languages": [
            "en"
        ]
    },
    "UY": {
        "name": "Uruguay",
        "native": "Uruguay",
        "phone": "598",
        "continent": "SA",
        "capital": "Montevideo",
        "currency": "UYI,UYU",
        "languages": [
            "es"
        ]
    },
    "UZ": {
        "name": "Uzbekistan",
        "native": "O‘zbekiston",
        "phone": "998",
        "continent": "AS",
        "capital": "Tashkent",
        "currency": "UZS",
        "languages": [
            "uz",
            "ru"
        ]
    },
    "VA": {
        "name": "Vatican City",
        "native": "Vaticano",
        "phone": "379",
        "continent": "EU",
        "capital": "Vatican City",
        "currency": "EUR",
        "languages": [
            "it",
            "la"
        ]
    },
    "VC": {
        "name": "Saint Vincent and the Grenadines",
        "native": "Saint Vincent and the Grenadines",
        "phone": "1784",
        "continent": "NA",
        "capital": "Kingstown",
        "currency": "XCD",
        "languages": [
            "en"
        ]
    },
    "VE": {
        "name": "Venezuela",
        "native": "Venezuela",
        "phone": "58",
        "continent": "SA",
        "capital": "Caracas",
        "currency": "VES",
        "languages": [
            "es"
        ]
    },
    "VG": {
        "name": "British Virgin Islands",
        "native": "British Virgin Islands",
        "phone": "1284",
        "continent": "NA",
        "capital": "Road Town",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "VI": {
        "name": "U.S. Virgin Islands",
        "native": "United States Virgin Islands",
        "phone": "1340",
        "continent": "NA",
        "capital": "Charlotte Amalie",
        "currency": "USD",
        "languages": [
            "en"
        ]
    },
    "VN": {
        "name": "Vietnam",
        "native": "Việt Nam",
        "phone": "84",
        "continent": "AS",
        "capital": "Hanoi",
        "currency": "VND",
        "languages": [
            "vi"
        ]
    },
    "VU": {
        "name": "Vanuatu",
        "native": "Vanuatu",
        "phone": "678",
        "continent": "OC",
        "capital": "Port Vila",
        "currency": "VUV",
        "languages": [
            "bi",
            "en",
            "fr"
        ]
    },
    "WF": {
        "name": "Wallis and Futuna",
        "native": "Wallis et Futuna",
        "phone": "681",
        "continent": "OC",
        "capital": "Mata-Utu",
        "currency": "XPF",
        "languages": [
            "fr"
        ]
    },
    "WS": {
        "name": "Samoa",
        "native": "Samoa",
        "phone": "685",
        "continent": "OC",
        "capital": "Apia",
        "currency": "WST",
        "languages": [
            "sm",
            "en"
        ]
    },
    "XK": {
        "name": "Kosovo",
        "native": "Republika e Kosovës",
        "phone": "377,381,383,386",
        "continent": "EU",
        "capital": "Pristina",
        "currency": "EUR",
        "languages": [
            "sq",
            "sr"
        ]
    },
    "YE": {
        "name": "Yemen",
        "native": "اليَمَن",
        "phone": "967",
        "continent": "AS",
        "capital": "Sana'a",
        "currency": "YER",
        "languages": [
            "ar"
        ]
    },
    "YT": {
        "name": "Mayotte",
        "native": "Mayotte",
        "phone": "262",
        "continent": "AF",
        "capital": "Mamoudzou",
        "currency": "EUR",
        "languages": [
            "fr"
        ]
    },
    "ZA": {
        "name": "South Africa",
        "native": "South Africa",
        "phone": "27",
        "continent": "AF",
        "capital": "Pretoria",
        "currency": "ZAR",
        "languages": [
            "af",
            "en",
            "nr",
            "st",
            "ss",
            "tn",
            "ts",
            "ve",
            "xh",
            "zu"
        ]
    },
    "ZM": {
        "name": "Zambia",
        "native": "Zambia",
        "phone": "260",
        "continent": "AF",
        "capital": "Lusaka",
        "currency": "ZMW",
        "languages": [
            "en"
        ]
    },
    "ZW": {
        "name": "Zimbabwe",
        "native": "Zimbabwe",
        "phone": "263",
        "continent": "AF",
        "capital": "Harare",
        "currency": "USD,ZAR,BWP,GBP,AUD,CNY,INR,JPY",
        "languages": [
            "en",
            "sn",
            "nd"
        ]
    }
};
// Override country names (by alpha 2 code)
const overrideCountryNames: any = {
    "US": "United States of America",
    "AX": "Åland Islands",
    "MM": "Myanmar"
};

// Alternate names
const alternateCountryNames: any = {
    "TT": ["Trinidad & Tobago"],
    "CV": ["Cabo Verde"],
    "VI": ["United States Virgin Islands"],
    "CD": ["Democratic Republic of Congo"],
    "CI": ["Côte d'Ivoire", "Cote d'Ivoire"],
    "KN": ["St. Kitts-Nevis"],
    "VC": ["St. Vincent & the Grenadines"],
    "RE": ["Reunion"],
    "MM": ["Burma"],
};

// Taken from https://github.com/annexare/Countries (https://github.com/annexare/Countries/blob/master/data/continents.json)
const continents: any = {
    "AF": "Africa",
    "AN": "Antarctica",
    "AS": "Asia",
    "EU": "Europe",
    "NA": "North America",
    "OC": "Oceania",
    "SA": "South America"
};

// https://en.wikipedia.org/wiki/ISO_3166-2
// https://en.wikipedia.org/wiki/ISO_3166-2:GB
// Nationalities from: https://www.learnenglish.de/basics/nationalities.html and https://en.wikipedia.org/wiki/Lists_of_people_by_nationality
const subdivisions: any = {
    "GB": [
        {
            "name": "England",
            "nationality": "English",
            "code": {
                "subdivision": "GB-ENG"
            }
        },
        {
            "name": "Northern Ireland",
            "nationality": "Irish",
            "code": {
                "subdivision": "GB-NIR"
            }
        },
        {
            "name": "Scotland",
            "nationality": "Scottish",
            "code": {
                "subdivision": "GB-SCT"
            }
        },
        {
            "name": "Wales",
            "nationality": "Welsh",
            "code": {
                "subdivision": "GB-WLS"
            }
        }
    ]
}

function mapContinentData() {
    var continentKeys = _.keys(continents);
    return _.map(continentKeys, (continentKey) => {
        return {
            code: continentKey,
            name: continents[continentKey]
        };
    });
}

function mapCountryData() {
    const assignedCountries = getAssignedCountries();
    let mappedCountryData : any[] = _.map(assignedCountries, (assignedCountry) => {

        let nationality = getNationality(assignedCountry.code.alpha2);
        let countryName = annexareCountryList[assignedCountry.code.alpha2];
        let overrideCountryName = overrideCountryNames[assignedCountry.code.alpha2];
        let alternateCountryNamesList = alternateCountryNames[assignedCountry.code.alpha2];
        if (!countryName.name || !nationality.nationality || !countryName.continent || !nationality.num_code || !assignedCountry.code.alpha2 || !assignedCountry.code.alpha3) {
            console.error("Empty value in country model...");
        }

        return {
            name: overrideCountryName ? overrideCountryName : countryName.name,
            alternateNames: alternateCountryNamesList,
            nationality: nationality.nationality,
            continent: countryName.continent,
            hasSubdivision: false,
            code: {
                numeric: nationality.num_code,
                alpha2: assignedCountry.code.alpha2,
                alpha3: assignedCountry.code.alpha3
            }
        }
    });

    // Add subdivisions
    var subdivisionKeys = _.keys(subdivisions);
    _.forEach(subdivisionKeys, function (subdivisionKey) {
        let countrySubdivisions = subdivisions[subdivisionKey];

        let mappedWholeCountry = _.find(mappedCountryData, function (country) {
            return country.code.alpha2 === subdivisionKey;
        });
        console.log(mappedWholeCountry);
        if (countrySubdivisions.length > 0) {
            mappedWholeCountry.hasSubdivision = true;
        }
        
        let mappedCountrySubdivisions = _.map(countrySubdivisions, function (countrySubdivision) {
            countrySubdivision.hasSubdivision = false;
            countrySubdivision.continent = mappedWholeCountry.continent;
            return countrySubdivision;
        });
        console.log(mappedCountrySubdivisions);
        mappedCountryData.push(...mappedCountrySubdivisions);
    });

    // Sort countries
    return _.sortBy(mappedCountryData, ['name']);;
}

function getAssignedCountries(): any[] {
    // Assigned means that the code is properly in the ISO 3166 standard. 
    // Reserved means that the code is being prevented from being used.
    // Deleted means that it has been deleted (that it used to be in the standard but is now not).
    // User Assigned means that for some use cases it is required.
    return _.reject(_.map(openBookPricesCountryList.all, function (country) {
        if (country.status === "assigned") {
            return {
                name: country.name,
                code: {
                    alpha2: country.alpha2,
                    alpha3: country.alpha3,
                }
            };
        }
    }), _.isEmpty);
}

function getNationality(alpha2Code: string): any {
    return _.find(dinuksCountryList, function (country) {
        return country.alpha_2_code === alpha2Code;
    });
}


// Countries
const mappedCountries = mapCountryData();
console.log(`Total Countries: ${mappedCountries.length}`);

const countriesJson = JSON.stringify(mappedCountries, null, 2);
const countryDataFilePath = path.resolve(__dirname, "countries.json");
fs.writeFile(countryDataFilePath, countriesJson, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log(`Countries saved at: ${countryDataFilePath}`);
}); 

// Continents
var mappedContinents = mapContinentData();
console.log(`Total Continents: ${mappedContinents.length}`);

const continentsJson = JSON.stringify(mappedContinents, null, 2);
const continentsDataFilePath = path.resolve(__dirname, "continents.json");
fs.writeFile(continentsDataFilePath, continentsJson, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log(`Continents saved at: ${continentsDataFilePath}`);
}); 