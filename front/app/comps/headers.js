import { useAuth } from './authProvider';


export const useHeaders = () => {
  const { userProfile } = useAuth();

  const getAcessToken = () => {
    const supabaseToken = sessionStorage.getItem(process.env.NEXT_PUBLIC_SUPABASE_TOKEN_NAME);  // Recebe o supabase token do sessionStorage
    const parsedData = JSON.parse(supabaseToken);  // Converte o str do sessionStorage em Json

    return parsedData.access_token;
  };

  if (userProfile) {
    return {
      Authorization: `Bearer ${getAcessToken()}`,
      Token: `Token ${userProfile.token}`,
    };
  }

  return null;
};
