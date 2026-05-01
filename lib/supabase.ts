import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://favdocyrzlhctipumhke.supabase.co/rest/v1/", // ←必ず""で囲む
  "sb_publishable_FKVk_I7TNGeqIxCZCH7sAQ_PwIczZ2C"   // ←anon public key
);