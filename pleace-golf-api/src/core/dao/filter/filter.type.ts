/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { RangeFilter } from "./range.filter";
import { GreaterThanOrEqualFilter } from "./greater-than-or-equal.filter";
import { LessThanOrEqualFilter } from "./less-than-or-equal.filter";

export type FilterType = string | string[] | boolean | RangeFilter | GreaterThanOrEqualFilter | LessThanOrEqualFilter;