/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Filter } from "./filter";
import { FilterType } from "./filter.type";

export class FilterBuilder {
    private filters: Filter[] = [];

    addFilter(property: string, value: FilterType) {
        this.filters.push(
            new Filter(property, value)
        );
        return this;
    }

    buildFirst() {
        return this.filters[0];
    }

    buildAll() {
        return this.filters;
    }
}