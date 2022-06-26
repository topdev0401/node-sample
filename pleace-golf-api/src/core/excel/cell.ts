/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

export interface Cell {
    /** Value of the cell.  Can be omitted if a formula is specified */
    value?: string | number | boolean | Date;

    /** Formatted text (if applicable) */
    formattedText?: string;

    /** Cell formula (if applicable) */
    formula?: string;

    /** Number format string (either a string or an index to the format table) associated with the cell (if requested) */
    numberFormat?: string | number;

    /** Cell hyperlink */
    link?: string;
}