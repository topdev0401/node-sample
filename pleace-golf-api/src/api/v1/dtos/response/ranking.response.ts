
/**
 * @swagger
 * definitions:
 *  RankingResponse:
 *      type: object
 *      properties:
 *          position:
 *              type: number
 *          name:
 *              type: string
 *          countryCode:
 *              type: string
 *          totalPoints:
 *              type: number
 *                  
 */
export class RankingResponse {
    user?:string;
    position: number;
    name: string;
    countryCode: string;
    totalPoints: number;
    rounds?:number;
}