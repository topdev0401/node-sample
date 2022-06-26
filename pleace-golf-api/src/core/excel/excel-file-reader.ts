/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as xlsx from "xlsx";
import * as _ from "lodash";
import { Logger } from "../logging";

interface ObjectRow <T> {
	isEmpty: boolean;
	row: T;
}

export class ExcelFileReader {
    static readFileAsJSON(filename: string) {
        const workbook: xlsx.WorkBook = xlsx.readFile(filename);
        const sheetNameList = workbook.SheetNames;

        return _.map(sheetNameList, function (sheetName) {
            return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        });
	}

	static readFile(filename: string) {
		return xlsx.readFile(filename);
	}

	private static buildObjectRow<T>(worksheet: xlsx.WorkSheet, r: any, rowIndex: number, cols: any[], header: number, hdr: any[], isWorksheetArray: boolean, options: any, mapObject: (object: any) => T): ObjectRow<T> {

		var rr = xlsx.utils.encode_row(rowIndex);
		var defval = options.defval, raw = options.raw || !Object.prototype.hasOwnProperty.call(options, "raw");
		var isEmpty = true;
		var row: any = (header === 1) ? [] : {};
		if (header !== 1) {
			if (Object.defineProperty) {
				try {
					Object.defineProperty(row, '__rowNum__', { value: rowIndex, enumerable: false });
				} catch (e) {
					row.__rowNum__ = rowIndex;
				}
			}
			else row.__rowNum__ = rowIndex;
		}
		if (!isWorksheetArray || worksheet[rowIndex]) for (var C = r.s.c; C <= r.e.c; ++C) {
			var val = isWorksheetArray ? worksheet[rowIndex][C] : worksheet[cols[C] + rr];
			if (val === undefined || val.t === undefined) {
				if (defval === undefined) {
					continue;
				}
				if (hdr[C] != null) {
					row[hdr[C]] = defval;
				}
				continue;
			}
			var v = val.v;
			switch (val.t) {
				case 'z': if (v == null) break; continue;
				case 'e': v = void 0; break;
				case 's': case 'd': case 'b': case 'n': break;
				default: throw new Error('unrecognized type ' + val.t);
			}
			if (hdr[C] != null) {
				if (v == null) {
					if (defval !== undefined) {
						row[hdr[C]] = defval;
					}
					else if (raw && v === null) {
						row[hdr[C]] = null;
					}
					else {
						continue;
					}
				} else {
					row[hdr[C]] = raw ? v : xlsx.utils.format_cell(val, v, options);
				}

				if (v != null) {
					isEmpty = false;
				}
			}
		}

		if (!isEmpty) {
			row = mapObject(row);
		}

		return { row: row, isEmpty: isEmpty };
	}

	static sheetToObjectArray<T>(workbook: xlsx.WorkBook, sheetName: string, mapObject: (object: any) => T, overrideRange?: any, overrideHeader?: any): T[] {

		const self = this;

		// Options (https://docs.sheetjs.com/#json)
		const options: any = {
			// Use raw values (true) or formatted strings (false)
			raw: true,
			/* Override Range 
			 *	number:	Use worksheet range but set starting row to the value
			 *	string: Use specified range(A1 - style bounded range string)
			 *	default: Use worksheet range(ws['!ref'])
			*/
			range: overrideRange,
			/* Control output format 
			 *	1: Generate an array of arrays 
			 *	'A': Row object keys are literal column labels
			 *	string[]: Use specified strings as keys in row objects
			 *	default: Read and disambiguate first row as keys
			*/
			header: overrideHeader,
			/* Control date format
			 *	string: Use specified date format in string output
			 *	default: FMT 14
			*/
			dateNF: null,
			// Use specified value in place of null or undefined
			defval: null,
			/* Include blank lines in the output **
			 *	true: Include blank lines
			 *	false: Skip blank lines
			*/
			blankrows: true
		};

		var worksheet = workbook.Sheets[sheetName];

		if (worksheet == null || worksheet["!ref"] == null) return [];

		// Defaults
		var val: any = { t: 'n', v: 0 }, header = 0, offset = 1, hdr = [], v = 0, vv = "";
		// Range start and end defaults
		var r = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

		var range = options.range != null ? options.range : worksheet["!ref"];
		Logger.debug(`Range options.range: ${options.range} with worksheet reference: ${worksheet["!ref"]}`);


		switch (typeof range) {
			case 'string': r = xlsx.utils.decode_range(range); break;
			case 'number': r = xlsx.utils.decode_range(worksheet["!ref"]); r.s.r = range; break;
			default: r = range;
		}

		if (options.header === 1) {
			header = 1;
		}
		else if (options.header === "A") {
			header = 2;
		}
		else if (Array.isArray(options.header)) {
			header = 3;
		}
		else if (options.header == null) {
			header = 0;
		}

		if (header > 0) {
			offset = 0;
		}

		var rr = xlsx.utils.encode_row(r.s.r);

		Logger.debug(`Range row: ${rr} with start index: ${r.s.r} - end index: ${r.e.r}`);
		Logger.debug(`Range column: start index: ${r.s.c} - end index: ${r.e.c}`);

		var cols = [];
		var out = [];
		var outIndex = 0, counter = 0;
		var isWorksheetArray = Array.isArray(worksheet);
		var rowIndex = r.s.r, columnIndex = 0, CC = 0;

		if (isWorksheetArray && !worksheet[rowIndex]) {
			worksheet[rowIndex] = [];
		}

		for (columnIndex = r.s.c; columnIndex <= r.e.c; ++columnIndex) {
			cols[columnIndex] = xlsx.utils.encode_col(columnIndex);
			val = isWorksheetArray ? worksheet[rowIndex][columnIndex] : worksheet[cols[columnIndex] + rr];

			switch (header) {
				case 1: hdr[columnIndex] = columnIndex - r.s.c; break;
				case 2: hdr[columnIndex] = cols[columnIndex]; break;
				case 3: hdr[columnIndex] = options.header[columnIndex - r.s.c]; break;
				default:
					if (val == null) {
						val.w = "__EMPTY";
						val.t = "s";
					}
					vv = xlsx.utils.format_cell(val as xlsx.CellObject, null, options);
					v = Number(vv);
					counter = 0;
					for (CC = 0; CC < hdr.length; ++CC) {
						if (hdr[CC] == vv) {
							vv = v + "_" + (++counter);
						}
					}
					hdr[columnIndex] = vv;
			}
		}
		for (rowIndex = r.s.r + offset; rowIndex <= r.e.r; ++rowIndex) {
			var row = self.buildObjectRow(worksheet, r, rowIndex, cols, header, hdr, isWorksheetArray, options, mapObject);
			if ((row.isEmpty === false) || (header === 1 ? options.blankrows !== false : !!options.blankrows)) {
				out[outIndex++] = row.row;
			}
		}
		out.length = outIndex;
		return out;
	}
}
