/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { FilterType } from "./filter.type";

export class Filter {
    // The property by which to search
    // The desired value of the property
    constructor(public property: string, public value: FilterType ) {}
}