import { checkId } from "../../../../core/validation/validator";

export const TournamentRequestSchema = [
    checkId('tournamentId')
];
