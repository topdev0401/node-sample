import { Gender } from "../../../../types/gender.enum";
import { checkCountry } from "../../../../core/validation/validator";

const { check } = require("express-validator");

/**
 * @swagger
 * definitions:
 *  AddCourseTeeRequest:
 *      type: object
 *      required:
 *          - courses
 *      properties:
 *          courses:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/CourseTeesRequest'
 */
export class AddCourseTeeRequest {
    courses: CourseTeesRequest[];
}

/**
 * @swagger
 * definitions:
 *  CourseTeesRequest:
 *      type: object
 *      required:
 *          - courseId
 *          - tees
 *      properties:
 *          courseId:
 *              type: string
 *          tees:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/CourseTeeRequest'
 */
export class CourseTeesRequest {
    courseId: string;
    tees: CourseTeeRequest[];
}

/**
 * @swagger
 * definitions:
 *  CourseTeeRequest:
 *      type: object
 *      required:
 *          - name
 *          - gender
 *          - courseRating
 *          - slopeRating
 *          - par
 *          - holes
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
 *                  $ref: '#/definitions/GolfHoleRequest'
 */
export class CourseTeeRequest {
    name: string;
    gender: Gender;
    courseRating: number;
    slopeRating: number;
    par: number;
    holes: GolfHoleRequest[];
}

/**
 * @swagger
 * definitions:
 *  GolfHoleRequest:
 *      type: object
 *      required:
 *          - hole
 *          - par
 *      properties:
 *          hole:
 *              type: number
 *          par:
 *              type: number
 */
export class GolfHoleRequest {
    hole: number;
    par: number;
}