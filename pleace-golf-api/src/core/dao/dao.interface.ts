/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Filter } from "./filter/filter";

/**
 * Represents data access for all model types.
 *
 * @interface
 */
export interface DAO<T> {

    /**
     * Creates an object in the system
     * @async
     * @param  {T} object The object
     * @returns {Promise<T>} Returns a promise for an object
     */
    create(object: T): Promise<T>;

    /**
     * Creates multiple objects in the system
     * @async
     * @param  {T[]} objects The objects
     * @returns {Promise<T[]>} Returns a promise for an object array
     */
    createMany(objects: T[]): Promise<T[]>;

    /**
     * Updates an object
     * @async
     * @param  {T} object Object to update
     * @returns {Promise<T>} Returns a promise for an object
     */
    update(object: T): Promise<T>;

    /**
     * Creates an object if it doesnt exist and updates an object if it does exist
     * NOTE: example input [{ "attribute1": "value1" }, { "attribute2": "value2" }]
     * @async
     * @param filterObjects {filterProperty:filterValue}[],
     * @param  {T} object Object to update
     * @returns {Promise<T>} Returns a promise for an object
     */
    //upsert(filterObjects: any[], object: T): Promise<T>;

    /**
     * Removes an object from the system
     * @async
     * @param  {string} id ID for the object being deleted
     * @returns {Promise<User>} Returns a promise for an object
     */
    delete(id: string): Promise<T>;

    /**
     * Retrieves an object by unique identifier
     * @async
     * @param  {string} id ID to find the object by
     * @returns {Promise<T>} Returns a promise for an object
     */
    getByID(id: string): Promise<T>;

    /**
     * Retrieves all objects
     * @async
     * @returns {Promise<T[]>} Returns a promise for an object array
     */
    getAll(): Promise<T[]>;

    /**
     * Retrieves an object based on a property filter
     * @async
     * @param {Filter} filter The filter
     * @returns {Promise<T>} Returns a promise for an object
     */
    getByFilter(filter: Filter): Promise<T>;

    /**
     * Retrieves an object based on multiple filter criteria
     * @async
     * @param {Filter[]} filters The filters
     * @returns {Promise<T>} Returns a promise for an object
     */
    getByFilters(filters: Filter[]): Promise<T>;

    /**
     * Retrieves multiple objects based on multiple filter criteria
     * @async
     * @param {Filter[]} filters The filters
     * @returns {Promise<T[]>} Returns a promise for an object array
     */
    getMultipleByFilters(filters: Filter[]): Promise<T[]>;

    /**
     * Searches for objects. Depends on implementation
     * @async
     * @param {string} inputQuery The input query with which to form a query
     * @param {string} limit Max number of results to fetch
     * @returns {Promise<T[]>} Returns a promise for an object array
     * @throws {RangeError}
     */
    search(inputQuery: string, limit: number): Promise<T[]>;

    /**
     * Searches for objects based on a property
     * @async
     * @param {string} property The property by which to search
     * @param {string} value The desired value of the property
     * @param {string} limit Max number of results to fetch
     * @returns {Promise<T[]>} Returns a promise for an object array
     * @throws {RangeError}
     */
    searchByProperty(property: string, value: string, limit: number): Promise<T[]>;
}
