/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Cell } from "./cell";

export interface WorkSheet {
    /**
     * Indexing with a cell address string maps to a cell object
     * Special keys start with '!'
     */
    [cell: string]: Cell | any;
}