import { GolfTee } from "../golf-tee";

/**
 * @swagger
 * definitions:
 *  GolfCourseResponse:
 *      type: object
 *      properties:
 *          courseId:
 *              type: string
 *          name:
 *              type: string
 *          tees:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/GolfTee'
 */
export class GolfCourseResponse {
    courseId: string;
    name: string;
    tees: GolfTee[];
    clubId?:string;
    clubName?:string;
}