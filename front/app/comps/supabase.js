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

export async function handleLogin() {
  await supaBase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/shop",
    },
  });
};

export async function getUserProfile () {
  // Retorna o json simplificado do usuario
  if (typeof window !== "undefined") {
    let userprofile = sessionStorage.getItem("shopzen-userprofile");

    if (!userprofile) {
      const { data: { user } } = await supaBase.auth.getUser()

      if (!user) {
        return undefined;
      };

      userprofile = await createUserProfile(user);

      return userprofile;
    };

    return JSON.parse(userprofile);
  };
};


async function createUserProfile(user) {
  if (typeof window !== "undefined") {

    if (user) {
      const crypto = require("crypto");
      const key = process.env.NEXT_PUBLIC_RANDOM_SECRET_KEY;
      const hash = crypto.createHash('sha256').update(user.id + key).digest('hex');

      const userprofile = {
        token: hash,
      };

      sessionStorage.setItem("shopzen-userprofile", JSON.stringify(userprofile));
  
      return userprofile;
    };
  };
};

