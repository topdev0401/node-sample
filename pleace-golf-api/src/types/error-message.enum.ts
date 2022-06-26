
export const ErrorMessage = {
    UserExists: function(email: string): string {
        return `Account with provided email:${email} already exists.`;
    },
    TournamentEntryExists: "Tournament entry already exists.",
    TournamentEntryNotExists: "Tournament entry doesn't exists.",
    UserDoesNotExist: "User does not exist",
    InvalidCredentials: "Invalid email or password.",
    AccountDisabled: "Account has been disabled, please contact support.",
    AccountNotConfirmed: "Account has not been confirmed, please check your inbox for an account confirmation link.",
    InvalidInvitationLink : 'Invalid invitation link',
    InviteeAlreadyExists : 'Invitee Already Exists',
    GetByID(userID: string): string {
        return `An error occurred while fetching user: ${userID}.`;
    },
    EmailConfirmed(email: string): string {
        return `Account with provided email:${email} has already been confirmed.`;
    },
    EmailVerificationCode(userID: string): string {
        return `An error occurred while generating email verification code for user: ${userID}.`;
    },
    ResetVerificationCode(email: string): string {
        return `An error occurred while generating a reset password verification code for user: ${email}.`;
    },
    //InvalidVerificationCode: "Invalid verification code",
    InvalidEmailOrVerificationCode: "Invalid email or verification code",
    ResetPassword(email: string): string {
        return `An error occurred while resetting password for user: ${email}.`;
    },
    ChangePassword(userID: string): string {
        return `An error  occurred while changing password for user: ${userID}.`;
    },
    InvalidAccessToken: "Invalid or already used token.",
    InvalidLeaderboardId: "Invalid leaderboard ID.",
    InvalidCourseId: "Invalid course ID.",
    InvalidTournamentId: "Invalid tournament ID.",
    InvalidScorecardId: "Invalid scorecard ID.",
    InvalidDivision: "Invalid division.",
    InvalidTournamentDivision: "Invalid division. If you have a Celeb or Legend access code apply it in settings and try again.",
    TournamentPlayerCourseLimitReached: "The tournament player course limit has been reached. Please try a different course."
};

