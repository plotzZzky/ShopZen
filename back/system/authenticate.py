from supabase import create_client, Client
import  hashlib
import json
import os


supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)


def validate_supabase_token(user_jwt, user_token):
    result = supabase.auth.get_user(jwt=user_jwt)  # Recebe os dados do usuario
    user = json.loads(result.user.json())
    hash_token = generate_hash(user)

    if hash_token == user_token:
        return True

    return False


def generate_hash(user):
    base_token: str = user["id"] + user["identities"][0]["identity_id"]
    key: str = os.getenv("RANDOM_SECRET_KEY")
    hash_token = hashlib.sha256((base_token + key).encode('utf-8')).hexdigest()
    return hash_token
