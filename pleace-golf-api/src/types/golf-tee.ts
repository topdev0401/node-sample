import { Gender } from "./gender.enum";
import { GolfHole } from "./golf-hole";

export class GolfTee {
    _id?: string;
    name: string; // Colour
    gender: Gender;
    courseRating: number;
    slopeRating: number;
    par: number;
    holes: GolfHole[];
}