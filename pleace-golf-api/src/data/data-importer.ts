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
//import * as golfclubs from "../../golf_club_json.json";
import { Tournament } from "../types/tournament";
import * as moment from "moment";
import { GolfCourseDAO } from "../daos/golf-course.dao.interface";
import { GolfClubSchema } from "../models/golf-club.model";
import { GolfCourseSchema } from "../models/golf-course.model";
import { ObjectId } from "mongodb";

export class DataImporter {

    private readonly golfClubDAO: DAO<GolfClub>;
    private readonly golfCourseDAO: GolfCourseDAO;
    private readonly accessTokenDAO: DAO<AccessToken>;
    private readonly tournamentDAO: DAO<Tournament>;
    private readonly filePath: string;
    private filePathNew: string;
    private readonly countryService: CountryService;
    codeSuffix = 0;
    public constructor(golfClubDAO: DAO<GolfClub>, golfCourseDAO: GolfCourseDAO, accessTokenDAO: DAO<AccessToken>, tournamentDAO: DAO<Tournament>, filePath: string, countryService: CountryService,filePathNew: string) {
        this.golfClubDAO = golfClubDAO;
        this.golfCourseDAO = golfCourseDAO;
        this.accessTokenDAO = accessTokenDAO;
        this.tournamentDAO = tournamentDAO;
        this.filePath = filePath;
        this.countryService = countryService;
        this.filePathNew = filePathNew;
    }

    // Mongoose casts 24 hex char strings to ObjectIds for you automatically based on your schema.
    // Any 12 character string is a valid ObjectId, because the only defining feature of ObjectIds is that they have 12 bytes.
    private hashIdTo12Characters(id: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(id);
        return hash.digest('hex').substring(0, 24);
    }

    private mapGolfClub(object: any): GolfClub {

        let country = this.countryService.getCountryByName(object.country);

        if (!country) { 
            Logger.info("Couldnt find country by name for: " + object.country);
            Logger.info("Trying with state as country: " + object.state);

            country = this.countryService.getCountryByName(object.state);
            if (!country) {
                Logger.info("Couldnt find country by name for: " + object.state);
                Logger.debug(object);
                throw new Error("Failed to find country");
            }
            Logger.info("Found country by name with state as country: " + object.state);
        }
        
        const newGolfClub: GolfClub = new GolfClub();
        newGolfClub._id = this.hashIdTo12Characters(object.club_id);
        newGolfClub.code = object.club_id;
        newGolfClub.name = object.club_name;
        newGolfClub.membership = object.club_membership;
        newGolfClub.numberOfHoles = object.number_of_holes;
        newGolfClub.countryCode = country.getCode();
        newGolfClub.phone = object.phone;
        newGolfClub.email = object.email_address;
        newGolfClub.website = object.website;
        newGolfClub.contactName = object.contact_name;
        return newGolfClub;
    };

    private mapGolfClubNew(object: any): GolfClub {        
        return object;
    };

    private mapGolfCourse(object: any): GolfCourse {
        const newGolfCourse: GolfCourse = new GolfCourse();
        newGolfCourse._id = this.hashIdTo12Characters(object.course_id);
        newGolfCourse.code = object.course_id;
        newGolfCourse.clubId = this.hashIdTo12Characters(object.club_id);
        newGolfCourse.name = object.course_name;
        newGolfCourse.numberOfHoles = object.holes;
        newGolfCourse.par = object.par !== "N/D" ? object.par : null;
        newGolfCourse.type = object.course_type;
        return newGolfCourse;
    };

    private async generateAccessTokens(): Promise<AccessToken[]> {
        const numCelebrityTokens = 1000;
        const numProfessionalGolferTokens = 1000;

        const CelebrityAccessTokens = await this.generateAccessTokensForType(numCelebrityTokens, GolfDivision.Celebrity);
        const professionalGolferAccessTokens = await this.generateAccessTokensForType(numProfessionalGolferTokens, GolfDivision.ProfessionalGolfer);

        return _.concat(CelebrityAccessTokens, professionalGolferAccessTokens);
    }

    private generateTournament(): Tournament {

        return {
            name: "Opener",
            regStartDate: moment.utc('2020-05-01').toDate(),
            regEndDate: moment.utc('2020-06-05').toDate(),
            startDate: moment.utc('2020-06-06').toDate(),
            endDate: moment.utc('2020-06-08').toDate(),
            maxPlayers: -1,
            divisions: [GolfDivision.Celebrity, GolfDivision.ProfessionalGolfer],
            courses: [
                {
                    course: {
                        _id: "0003eb37db46afa3cd512de8"
                    },
                    numberOfHoles: 18,
                    group: {
                        size: 2,
                        maxGroups: 3
                    }
                },
                {
                    course: {
                        _id: "0006c6e292988af7727802d8"
                    },
                    numberOfHoles: 18,
                    group: {
                        size: 2,
                        maxGroups: 3
                    }
                }
            ]
        } as Tournament;
    }

    private async generateAccessTokensForType(numberOfTokens: number, golfDivision: GolfDivision): Promise<AccessToken[]> {
        const accessTokens: AccessToken[] = [];
        for (var i = 0; i < numberOfTokens; i++) {
            let token = await TokenGenerator.generateToken(Number(config.accessTokenLength));
            accessTokens.push({
                token: token,
                golfDivision: golfDivision
            } as AccessToken);
        }

        return accessTokens;
    }

    getExcelAsJson() {
        Logger.info("Starting reading excel");
        Logger.info("filePathNew>>>>>",this.filePathNew);
        if(this.filePathNew) {
            this.filePathNew = '/home/mike-pg-staging/pleace-golf-api/assets/msscorecard.xlsx';
        }
        const workbook: xlsx.WorkBook = ExcelFileReader.readFile(this.filePathNew);
        Logger.info("Starting mapping in json");
        const clubData = ExcelFileReader.sheetToObjectArray<GolfClub>(workbook, "Sheet1",this.mapGolfClubNew.bind(this), null, null);
        Logger.info("End reading excel");
        return clubData;
    }

    async importData() {
        Logger.info("Starting data import");

        const workbook: xlsx.WorkBook = ExcelFileReader.readFile(this.filePath);
        const sheetNameList = workbook.SheetNames;

        Logger.info("Finished reading workbook");
        Logger.info(`Sheet names: ${sheetNameList}`);

        // Tournament Data
        const tournamentData = this.generateTournament();

        Logger.info("Starting create tournament data");
        try {
            await this.tournamentDAO.create(tournamentData);
        } catch (error) {
            throw new Error(error.message);
        }
        Logger.info("Finished create tournament data");

        // Club Data
        Logger.info(`Starting map sheet to golf club data`);
        const clubData = ExcelFileReader.sheetToObjectArray<GolfClub>(workbook, "Golf Clubs", this.mapGolfClub.bind(this), null, null);
        Logger.info(`Finished map sheet to golf club data, count: ${clubData.length}`);

        Logger.info("Starting bulk create golf club data");
        try {
            await this.golfClubDAO.createMany(clubData);
        } catch (error) {
            throw new Error(error.message);
        }
        Logger.info("Finished bulk create golf club data");

        // Course Data
        Logger.info(`Starting map sheet to golf course data`);
        const courseData = ExcelFileReader.sheetToObjectArray<GolfCourse>(workbook, "Golf Courses", this.mapGolfCourse.bind(this), null, null);
        Logger.info(`Finished map sheet to golf course data, count: ${courseData.length}`);

        Logger.info("Starting bulk create golf course data");
        try {
            await this.golfCourseDAO.createMany(courseData);
        } catch (error) {
            throw new Error(error.message);
        }
        Logger.info("Finished bulk create golf course data");

        // Access Token Data
        Logger.info(`Starting access token generation`);
        const accessTokenData = await this.generateAccessTokens();
        Logger.info(`Finished access token generation, count: ${accessTokenData.length}`);

        Logger.info("Starting bulk create access token data");
        try {
            await this.accessTokenDAO.createMany(accessTokenData);
        } catch (error) {
            throw new Error(error.message);
        }
        Logger.info("Finished bulk create access token data");

        Logger.info("Finished data import");
    }

    async addCourseTees(teesRequest: any) {
        await this.golfCourseDAO.addGolfCourseTees(teesRequest);
    }


    async importClubData() {
         let oldName = '';
         let oldCountry = '';
         let teeArr = [];
         let updatedCourse = [];
         let notFountCnt = 0;
         let fountCnt = 0;
         let golfclubs:any = this.getExcelAsJson();
         for(let i =0; i < golfclubs?.length ; i++) {
             this.codeSuffix++;
             let golfClub = golfclubs[i];
             let holesData = this.getHoles(golfClub);
             const clubName = golfClub.course_name.trim();
             console.log('count::',i); 
             if(i==0){
                 oldName = clubName;
                 oldCountry = golfClub.state_country;
             }
             
             if(oldName !== clubName) {
                 let countryCode = this.getCountryCode(oldCountry);
                 if(!countryCode) {
                     countryCode = 'US';
                 }
                 console.log('clubName::',oldName);
                 console.log('countryCode::',countryCode);
                 //console.log('countryCode :',countryCode);
                 let clubIds = [];
                 let clubs:any = await this.getClubIds(oldName,countryCode);
             
                 
                 if(clubs?.length === 0) {
                    // console.log('not found')
                     this.addGolfClubCourse(oldName,oldCountry,teeArr,holesData.numberOfHoles,countryCode);
                     notFountCnt++;
                 } else {
                     if(teeArr.length > 0) {
                        clubs.forEach(element => {
                            clubIds.push(ObjectId(element._id));
                            this.updateGolfClub(element._id,oldCountry);
                        });
                        await GolfCourseSchema.find({
                            clubId : { $in : clubIds}
                        },{_id:1,tees:1}).exec().then(courses => {
                            for(let j=0;j < courses.length; j++) {
                                let cour = courses[j];
                                if(cour.tees?.length === 0) {
                                    updatedCourse.push(cour._id);
                                    let course = {
                                        courseId : cour._id,
                                        tees : teeArr
                                    }
                                    this.addCourseTees(course);
                                }
                            }
                        });
                        
                        fountCnt++;
                    }
                 }
                 //console.log('clubIds',clubIds);
                
                 
                 oldName = clubName;
                 oldCountry = golfClub.state_country;
                 teeArr = [];
                // break;
             }
            if(golfClub.Par != 0 && golfClub.tee_name) {
                teeArr.push(
                    {
                        name:golfClub.tee_name.trim().replace(/[^a-zA-Z0-9 ]/g, ""),
                        gender:golfClub.tee_gender.trim(),
                        courseRating:golfClub.rating == '-' || golfClub.rating == '' || !golfClub.rating ? 72.0 : golfClub.rating,
                        slopeRating:golfClub.slope == '-' || golfClub.slope == '' || !golfClub.slope ? 113 : golfClub.slope,
                        par:golfClub.Par,
                        holes:holesData.holes,
                    }
                    );
            }
         }
         //console.log('updatedCourse::',updatedCourse);
         console.log('fountCnt::',fountCnt);
         console.log('notFountCnt::',notFountCnt);
     }

    async importClubDataOld() {
       /*  let oldName = '';
        let oldCountry = '';
        let teeArr = [];
        let updatedCourse = [];
        let notFountCnt = 0;
        let fountCnt = 0;
        for(let i =0; i < golfclubs?.length ; i++) {
            this.codeSuffix++;
            let golfClub = golfclubs[i];
            let holesData = this.getHoles(golfClub);
            const clubName = golfClub.course_name.trim();
            //console.log('clubName',clubName); 
            if(i==0){
                oldName = clubName;
                oldCountry = golfClub.state_country;
            }
            
            if(oldName !== clubName) {
                let countryCode = this.getCountryCode(oldCountry);
                if(!countryCode) {
                    countryCode = 'US';
                }
                console.log('clubName::',oldName);
                console.log('countryCode::',countryCode);
                //console.log('countryCode :',countryCode);
                let clubIds = [];
                let clubs:any = await this.getClubIds(oldName,countryCode);
            
                
                if(clubs?.length === 0) {
                    this.addGolfClubCourse(oldName,oldCountry,teeArr,holesData.numberOfHoles);
                    notFountCnt++;
                } else {
                    clubs.forEach(element => {
                        clubIds.push(ObjectId(element._id));
                    });
                    await GolfCourseSchema.find({
                        clubId : { $in : clubIds}
                    },{_id:1,tees:1}).exec().then(courses => {
                        for(let j=0;j < courses.length; j++) {
                            let cour = courses[j];
                            if(cour.tees?.length === 0) {
                                updatedCourse.push(cour._id);
                                let course = {
                                    courseId : cour._id,
                                    tees : teeArr
                                }
                                this.addCourseTees(course);
                            }
                        }
                    });
                    fountCnt++;
                }
                //console.log('clubIds',clubIds);
               
                
                oldName = clubName;
                oldCountry = golfClub.state_country;
                teeArr = [];
            }
            teeArr.push(
                {
                    name:golfClub.tee_name.trim(),
                    gender:golfClub.tee_gender.trim(),
                    courseRating:golfClub.rating,
                    slopeRating:golfClub.slope,
                    par:golfClub.Par,
                    holes:holesData.holes,
                }
                );
        }
        //console.log('updatedCourse::',updatedCourse);
        console.log('fountCnt::',fountCnt);
        console.log('notFountCnt::',notFountCnt);
        */
    }

    getStateCity(oldCountry) {
        let str = oldCountry.split(',');
        let stateCode = '';
        let city = '';
        if(str.length > 2) {
            stateCode = str[str.length - 2]?.trim();
            city = str[str.length - 3]?.trim();
        }
        if(str.length == 2) {
            city = str[str.length - 2]?.trim();
        }
        stateCode = stateCode ? stateCode : '';
        city = city ? city : '';

        return {city:city,state:stateCode};
    }
    
    async addGolfClubCourse(oldName,oldCountry,teeArr,numberOfHoles,countryCode) {
        /* let str = oldCountry.split(',')[1];
        let strArr = str.trim().split('~~'); */
        let stateCity = this.getStateCity(oldCountry);
        console.log('stateCity',stateCity);
        const code = countryCode +'-'+stateCity.state.toUpperCase()+'-000000'+this.codeSuffix;
        const golfClubData = {
            _id : this.hashIdTo12Characters(code),
            code : code,
            name : oldName,
            membership : 'Public',
            numberOfHoles : numberOfHoles,
            countryCode : countryCode,
            phone : 'N/D',
            email: 'N/D',
            website : 'N/D',
            contactName : 'N/D',
            state : stateCity.state.toUpperCase(),
            city : stateCity.city
        }
        let savedClubDb = await GolfClubSchema.create(golfClubData);
        const clubId = savedClubDb._id;
        const courseCode = code+'-0000001';
        console.log('new ClubId',clubId);
        const courseBody = {
            _id : this.hashIdTo12Characters(courseCode),
            code : courseCode,
            clubId : ObjectId(clubId),
            name : oldName,
            numberOfHoles : numberOfHoles,
            par : 72,
            type : 'Parkland',
            tees : teeArr
        }
        await GolfCourseSchema.create(courseBody);
    }


    async updateGolfClub(clubId,old_country) {
        let stateCity = this.getStateCity(old_country);
        await GolfClubSchema.findOneAndUpdate(
            {
                _id: clubId,
            },
            {
                $set: {
                    state: stateCity.state,
                    city : stateCity.city
                }
            },
            {
                new: true
            }
        ).exec();
    }

    getCountryCode(state_country) {
        let strArr = state_country.split(',');
        let str1 = strArr[strArr.length - 1].trim();
        if(str1 === "USA") {
            return "US";
        }
        if(str1 === "UK") {
            return "GB-ENG"
        }
        let code = this.countryService.getCountryCodeByName(str1);
        return code;
    }

    getCountryCodeOld(state_country) {
        let str = state_country.split(',')[1];
        return str.trim().split('~~')[1];
    }

    async getClubIds(clubName,countryCode) {
        const regex = new RegExp("^" + clubName.toLowerCase() + "$", "i")
        let clubInDb = GolfClubSchema.find({
            name: regex,countryCode:countryCode
        },{_id:1,code:1,name:1}).exec();
        /* let clubInDb = GolfClubSchema.find({
            name: {$regex: clubName, $options: "i"},countryCode:countryCode
        },{_id:1,code:1,name:1}).exec(); */
        return Promise.resolve(clubInDb);
    }

    private getHoles(golfClub) {
        let holes = [];
        let numberOfHoles = 9;
        holes.push({
            hole:1,
            par:golfClub['#1'] ? golfClub['#1'] : 0
        });
        holes.push({
            hole:2,
            par:golfClub['#2'] ? golfClub['#2'] : 0
        });
        holes.push({
            hole:3,
            par:golfClub['#3'] ? golfClub['#3'] : 0
        });
        holes.push({
            hole:4,
            par:golfClub['#4'] ? golfClub['#4'] : 0
        });
        holes.push({
            hole:5,
            par:golfClub['#5'] ? golfClub['#5'] : 0
        });
        holes.push({
            hole:6,
            par:golfClub['#6'] ? golfClub['#6'] : 0
        });
        holes.push({
            hole:7,
            par:golfClub['#7'] ? golfClub['#7'] : 0
        });
        holes.push({
            hole:8,
            par:golfClub['#8'] ? golfClub['#8'] : 0
        });
        holes.push({
            hole:9,
            par:golfClub['#9'] ? golfClub['#9'] : 0
        });
        if(golfClub['#10']) {
            numberOfHoles = 18;
            holes.push({
                hole:10,
                par:golfClub['#10'] ? golfClub['#10'] : 0
            });
            holes.push({
                hole:11,
                par:golfClub['#11'] ? golfClub['#11'] : 0
            });
            holes.push({
                hole:12,
                par:golfClub['#12'] ? golfClub['#12'] : 0
            });
            holes.push({
                hole:13,
                par:golfClub['#13'] ? golfClub['#13'] : 0
            });
            holes.push({
                hole:14,
                par:golfClub['#14'] ? golfClub['#14'] : 0
            });
            holes.push({
                hole:15,
                par:golfClub['#15'] ? golfClub['#15'] : 0
            });
            holes.push({
                hole:16,
                par:golfClub['#16'] ? golfClub['#16'] : 0
            });
            holes.push({
                hole:17,
                par:golfClub['#17'] ? golfClub['#17'] : 0
            });
            holes.push({
                hole:18,
                par:golfClub['#18'] ? golfClub['#18'] : 0
            });
        }
        return {holes:holes,numberOfHoles:numberOfHoles};
    }
}
