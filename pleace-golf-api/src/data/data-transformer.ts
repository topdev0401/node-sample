import { DAO } from "../core/dao/dao.interface";
import { GolfClub } from "../types/golf-club";
import { GolfCourse } from "../types/golf-course";
import { ExcelFileReader } from "../core/excel/excel-file-reader";
import { Logger } from "../core/logging";
import * as xlsx from "xlsx";
import * as mongoose from "mongoose";
import * as crypto from "crypto";
import * as _ from "lodash";
import { CountryService } from "../core/country/country-service";
import { AccessToken } from "../types/access-token";
import { GolfDivision } from "../types/golf-division.enum";
import { TokenGenerator } from "../core/auth/token-generator";
import config from '../config';
import { Tournament } from "../types/tournament";
import * as moment from "moment";
import { GolfCourseDAO } from "../daos/golf-course.dao.interface";
import { FilterBuilder } from "../core/dao/filter/filter-builder";
import { Gender } from "../types/gender.enum";
import * as fs from "fs";
import * as path from "path";

export class DataTransformer {

    private readonly golfClubDAO: DAO<GolfClub>;
    private readonly golfCourseDAO: GolfCourseDAO;
    private readonly accessTokenDAO: DAO<AccessToken>;
    private readonly tournamentDAO: DAO<Tournament>;
    private readonly filePath: string;
    private readonly countryService: CountryService;
    
    public constructor(golfClubDAO: DAO<GolfClub>, golfCourseDAO: GolfCourseDAO, accessTokenDAO: DAO<AccessToken>, tournamentDAO: DAO<Tournament>, filePath: string, countryService: CountryService) {
        this.golfClubDAO = golfClubDAO;
        this.golfCourseDAO = golfCourseDAO;
        this.accessTokenDAO = accessTokenDAO;
        this.tournamentDAO = tournamentDAO;
        this.filePath = filePath;
        this.countryService = countryService;
    }

    private mapGolfTees(objects: any) {
        let tees = [];
        for (let object of objects) {
            tees.push(this.mapGolfTee(object))
        }
        return tees;
    }

    private mapGolfTee(object: any) {
        return {
            "name": object["Tee Name"],
            "gender": object["Tee Gender"],
            "courseRating": object["CR"],
            "slopeRating": object["Slope"],
            "par": object["Par"],
            "holes": this.mapGolfTeeHoles(object)
        }
    }

    private mapGolfTeeHoles(object: any) {
        let keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
        let holes = [];

        for (let key of keys) {
            if (object[key]) {
                holes.push({
                    "hole": Number(key),
                    "par": object[key]
                });
            }
        }

        return holes;
    }

    private mapGolfCourse(object: any): any {

        if (object["Tee Gender"] && object["Tee Gender"] === "Male") {
            object["Tee Gender"] = Gender.Male;
        }
        if (object["Tee Gender"] && object["Tee Gender"] === "Female") {
            object["Tee Gender"] = Gender.Female;
        }

        if (object["Course Name"] == null) {
            return null;
        }

        return object;
    };

    async transformData() {
        Logger.info("Starting data transform");

        const workbook: xlsx.WorkBook = ExcelFileReader.readFile(this.filePath);
        const sheetNameList = workbook.SheetNames;

        Logger.info("Finished reading workbook");
        Logger.info(`Sheet names: ${sheetNameList}`);

        // Course Tee Data
        Logger.info(`Starting map sheet to golf course tee data`);
        const courseTeeData = ExcelFileReader.sheetToObjectArray<any>(workbook, sheetNameList[0], this.mapGolfCourse.bind(this), null, null);

        var courseTeeDataGroupedByCourseCode = _.groupBy(courseTeeData, function (courseData) {
            return courseData["Course ID"];
        });

        let courseTees = [];
        let courses = [];

        for (let courseCode of _.keys(courseTeeDataGroupedByCourseCode)) {

            let formattedCourseCode = courseCode.trim();
            // Look up course
            const filters = new FilterBuilder()
                .addFilter("code", formattedCourseCode)
                .buildAll();

            const golfCourse = await this.golfCourseDAO.getByFilters(filters);

            if (golfCourse) {
                let result = {
                    courseId: golfCourse._id,
                    tees: this.mapGolfTees(courseTeeDataGroupedByCourseCode[courseCode])
                };
                courseTees.push(result);

                courses.push({
                    course: golfCourse._id,
                    numberOfHoles: 18,
                    group: {
                        size: 2,
                        maxGroups: 3
                    }
                })
            }
            else {
                Logger.info("Couldnt find golf course by id/code: " + formattedCourseCode);
            }
        }
        
        Logger.info(`Finished map sheet to golf course tee data, count: ${courseTees.length}`);
        
        let courseTeesObject = {
            courses: courseTees
        };
        Logger.info(courseTeesObject);
        Logger.info({
            courses: courses
        });
        const courseTeesJson = JSON.stringify(courseTeesObject, null, 2);
        const courseTeesDataFilePath = path.resolve(__dirname, "courseTees.json");
        /*
        fs.writeFile(courseTeesDataFilePath, courseTeesJson, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`Continents saved at: ${courseTeesDataFilePath}`);
        }); */

        Logger.info("Finished data transform");
    }
}
