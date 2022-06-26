/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { WorkSheet } from "./worksheet";

export interface WorkBook {
    /**
     * A dictionary of the worksheets in the workbook.
     * Use SheetNames to reference these.
     */
    Sheets: { [sheet: string]: WorkSheet };

    /** Ordered list of the sheet names in the workbook */
    SheetNames: string[];
}