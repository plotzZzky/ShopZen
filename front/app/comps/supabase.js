import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supaBase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: {
        getItem: (key) => {
          if (typeof window !== 'undefined') {
            return sessionStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(key);
          }
        }
      }
    }
  }     
);


export const getUserProfile = () => {
  // Retorna o json simplificado do usuario
  if (typeof window !== "undefined") {
    const userprofile = sessionStorage.getItem("shopzen-userprofile");

    if (!userprofile) {
      const userprofile = createUserProfile();
    };
  
    sessionStorage.removeItem(process.env.NEXT_PUBLIC_SUPABASE_TOKEN_NAME); // remove o token do supabase

    return userprofile;
  };
};


function createUserProfile() {
  if (typeof window !== "undefined") {
    const supabaseToken = sessionStorage.getItem(process.env.NEXT_PUBLIC_SUPABASE_TOKEN_NAME);  // Recebe o supabase token do sessionStorage

    if (supabaseToken) {
      const parsedData = JSON.parse(supabaseToken);  // Converte o str do sessionStorage em Json
      const base_token =  parsedData.user.id + parsedData.user.identities[0].identity_id;

      // Gera o user token
      const crypto = require("crypto")
      const key = process.env.NEXT_PUBLIC_RANDOM_SECRET_KEY
      const hash = crypto.createHash('sha256').update(base_token + key).digest('hex');

      const userprofile = {
        "id": parsedData.user.id,
        "jwt": parsedData.access_token,
        "token": hash,
      };

      sessionStorage.setItem("shopzen-userprofile", userprofile);
  
      return userprofile;
    };
  };
};


export function recievePictureUrl(urlData) {
  /**
   * Função que busca os dados no storage do supebase, recebe um json e retorna a Url publica(string)
   * @param {string} - Url da imagem do perfil(profile.picture) 
   * @returns {string} - Retorna a url publica da imagem 
   */
  const pictureRequest = supaBase.storage.from('LibrasConnectBlob').getPublicUrl(urlData);
  const pictureUrl = pictureRequest["data"]["publicUrl"];
  return pictureUrl;
};
