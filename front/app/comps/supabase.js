import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supaBase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: window.sessionStorage,
    }
  }     
);

export async function getUserProfile () {
  // Retorna o json simplificado do usuario
  if (typeof window !== "undefined") {
    let userprofile = sessionStorage.getItem("shopzen-userprofile");

    if (!userprofile) {
      const supabaseToken = sessionStorage.getItem(process.env.NEXT_PUBLIC_SUPABASE_TOKEN_NAME);  // Recebe o supabase token do sessionStorage

      if (!supabaseToken) {
        return undefined;
      };

      userprofile = await createUserProfile(supabaseToken);
      sessionStorage.removeItem(process.env.NEXT_PUBLIC_SUPABASE_TOKEN_NAME); // remove o token do supabase

      return userprofile;
    };

    return JSON.parse(userprofile);
  };
};


async function createUserProfile(supabaseToken) {
  if (typeof window !== "undefined") {

    if (supabaseToken) {
      const parsedData = JSON.parse(supabaseToken);  // Converte o str do sessionStorage em Json
      const baseToken =  parsedData.user.id + parsedData.user.identities[0].identity_id;

      // Gera o user token
      const crypto = require("crypto")
      const key = process.env.NEXT_PUBLIC_RANDOM_SECRET_KEY
      const hash = crypto.createHash('sha256').update(baseToken + key).digest('hex');

      const userprofile = {
        "id": parsedData.user.id,
        "jwt": parsedData.access_token,
        "token": hash,
      };

      sessionStorage.setItem("shopzen-userprofile", JSON.stringify(userprofile));
  
      return userprofile;
    };
  };
};

