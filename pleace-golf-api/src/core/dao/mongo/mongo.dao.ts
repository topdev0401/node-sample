/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { DAO } from "../dao.interface";
import * as mongoose from "mongoose";
import { Logger } from "../../logging";
import { RangeFilter } from "../filter/range.filter";
import { GreaterThanOrEqualFilter } from "../filter/greater-than-or-equal.filter";
import { LessThanOrEqualFilter } from "../filter/less-than-or-equal.filter";
import { FilterType } from "../filter/filter.type";
import { Filter } from "../filter/filter";

export abstract class MongoDAO<T> implements DAO<T> {

     protected schemaName : string;

    constructor(protected objectSchema: mongoose.Model<mongoose.Document & T>) {
        this.schemaName = objectSchema.collection.collectionName;
    }

    /*private getTypeName<T>(type: T): string {
        return typeof type;
    }*/

    public async create(object: T): Promise<T> {
        try {
            const newObject = new this.objectSchema(object);
            return await newObject.save();
        } catch (error) {
            
            Logger.error(`Could not create ${this.schemaName} with:'${object}'. Error: ${error}`);
            throw error;
        }
    }

    public async createMany(objects: T[]): Promise<T[]> {
        try {
            return await this.objectSchema.insertMany(objects);
        } catch (error) {

            Logger.error(`Could not create many ${this.schemaName}. Error: ${error}`);
            throw error;
        }
    }

    public abstract async update(object: T): Promise<T>;

    public async delete(id: string): Promise<T> {
        let result: Promise<T> = undefined;

        try {
            const object: Promise<T> = this.objectSchema.findByIdAndRemove(id).exec();
            result = object;
        } catch (error) {
            const errorMsg = `${this.schemaName} with id='${id}' could not be removed. Error: ${error}`;
            Logger.error(errorMsg);
            //result = Promise.reject(new Error(errorMsg));
            throw error;
        }

        return result;
    }

    public async getByID(id: string): Promise<T> {
        return this.objectSchema.findById(id);
    }

    public async getAll(): Promise<T[]> {
        let result: Promise<T[]> = undefined;

        try {
            result = this.objectSchema.find({}).exec();
        } catch (error) {
            const errorMsg = `Error: ${error}`;
            Logger.error(errorMsg);
            //result = Promise.reject(new Error(errorMsg));
            throw error;
        }

        return result;
    }

    private buildTransformedFilterValue(filterValue: FilterType): any {
        if (filterValue instanceof Array) {
            let isStringArray = true;
            filterValue.forEach(function (item) {
                if (typeof item !== 'string') {
                    isStringArray = false;
                }
            })
            if (isStringArray && filterValue.length > 0) {
                console.log('string[]!');
                return {
                    $in: filterValue
                };
            }
            else {
                throw new Error("Unsupported filter type");
            }
        }
        else if (filterValue instanceof RangeFilter) {
            return {
                $gte: filterValue.start,
                $lte: filterValue.end
            }
        }
        else if (filterValue instanceof GreaterThanOrEqualFilter) {
            return {
                $gte: filterValue.value
            }
        }
        else if (filterValue instanceof LessThanOrEqualFilter) {
            return {
                $lte: filterValue.value
            }
        }
        else {
            return filterValue;
        }
    }

    private buildFilterObjectFromFilters(filters: Filter[]): any {
        const filterObject: any = {};

        filters.forEach(filter => {
            filterObject[filter.property] = this.buildTransformedFilterValue(filter.value);
        });
        return filterObject;
    }

    public async getByFilter(filter: Filter): Promise<T> {
        try {
            const filterObject: any = {};
            filterObject[filter.property] = this.buildTransformedFilterValue(filter.value);
            return await this.objectSchema.findOne(filterObject).exec();
        } catch (error) {
            const errorMsg = `Cannot obtain ${this.schemaName} with filterValue='${filter.value}'. Error: ${error}`;
            Logger.error(errorMsg);
            //return Promise.reject(new Error(errorMsg));
            throw error;
        }
    }

    public async getByFilters(filters: Filter[]): Promise<T> {
        try {
            const filter: any = this.buildFilterObjectFromFilters(filters);
            return this.objectSchema.findOne(filter).exec();
        } catch (error) {
            const errorMsg = `Cannot obtain ${this.schemaName} with filters='${filters}'. Error: ${error}`;
            Logger.error(errorMsg);
            throw error;
        }
    }

    public async getMultipleByFilters(filters: Filter[]): Promise<T[]> {
        try {
            const filter: any = this.buildFilterObjectFromFilters(filters);
            return this.objectSchema.find(filter).exec();
        } catch (error) {
            const errorMsg = `Cannot obtain ${this.schemaName} with filters='${filters}'. Error: ${error}`;
            Logger.error(errorMsg);
            throw error;
        }
    }

    public abstract async search(inputQuery: string, limit: number): Promise<T[]>;

    public async searchByProperty(property: string, value: string, limit: number): Promise<T[]> {
        if (limit === undefined) {
            throw new RangeError("Query limit not set");
        }

        const wildcardRegex = new RegExp(`.*${value}.*`);
        const filter: any = {};
        filter[property] = { $regex: wildcardRegex };

        const query: any[] = [{
            $match: filter
        }, {
            $limit: limit
        }];

        try {
            const objects: T[] = await this.objectSchema.aggregate(query).exec();
            return objects;
        } catch (err) {
            Logger.error(err);
            //return Promise.reject(err);
            throw err;
        }
    }


}
