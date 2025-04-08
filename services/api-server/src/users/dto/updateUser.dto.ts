export type UpdateUserDto = {
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: string;
    resetToken?: string | null;
    image?: string;
    onboardingCompleted?: boolean
    inviteCode?: string | null
}