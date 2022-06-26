
/**
 * @swagger
 * definitions:
 *  ErrorResponse:
 *      type: object
 *      properties:
 *          errorType:
 *              type: string
 *          errorMessage:
 *              type: string
 *          field:
 *              type: string
 */
export class ErrorResponse{
    errorType: string;
    errorMessage: string;
    field?: string;
}