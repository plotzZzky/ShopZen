import { getUserProfile } from "./supabase";

const userProfile = getUserProfile();

export const headers = {
    Authorization: `Bearer ${userProfile?.jwt}`,
    Token: `Token ${userProfile?.token}`
};
