import { GolfCourseGuestPolicy } from "./golf-course-guest-policy.enum";
import { GolfCourseType } from "./golf-course-type.enum";
import { GolfTee } from "./golf-tee";

export class GolfCourse {
    _id: string;
    code: string;
    clubId: string;
    clubName?:string;
    tees: GolfTee[];
    name: string;
    numberOfHoles: number;
    par?: number;
    type: GolfCourseType;
    architect?: string;
    openYear?: string;
    guestPolicy: GolfCourseGuestPolicy;
    weekdayPrice?: number;
    weekendPrice?: number;
    twilightPrice?: number;
    fairway?: string;
    green?: string;
    currency: string;

    public static fromId(id: string): GolfCourse {
        return {
            _id: id
        } as GolfCourse;
    }
}