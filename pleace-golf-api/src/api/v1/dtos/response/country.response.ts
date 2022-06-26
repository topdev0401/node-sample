
/**
 * @swagger
 * definitions:
 *  CountryResponse:
 *      type: object
 *      required:
 *          - name
 *          - nationality
 *          - hasSubdivision
 *      properties:
 *          name:
 *              type: string
 *          nationality:
 *              type: string
 *          hasSubdivision:
 *              type: boolean
 *              description: Whether the country has children countries (countries that have a subdivision code that contains this countries alpha2 code)
 *          code:
 *              type: string
 *              description: Alpha2 country code or subdivision code
 */
export class CountryResponse {
    name: string;
    nationality: string;
    hasSubdivision: boolean;
    code?: string;
    isState: boolean;
}