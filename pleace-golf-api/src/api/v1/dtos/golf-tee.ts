import { Gender } from "../../../types/gender.enum";
import { GolfHoleResponse } from "./response";

/**
 * @swagger
 * definitions:
 *  GolfTee:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          gender:
 *              type: string
 *              enum: [MALE, FEMALE]
 *          courseRating:
 *              type: number
 *          slopeRating:
 *              type: number
 *          par:
 *              type: number
 *          holes:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/GolfHoleResponse'
 *              
 */
export class GolfTee {
    _id: string;
    name: string;
    gender: Gender;
    courseRating: number;
    slopeRating: number;
    par: number;
    holes: GolfHoleResponse[];
}