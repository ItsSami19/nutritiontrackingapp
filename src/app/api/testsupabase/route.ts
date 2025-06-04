import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from("meals").select("*");
  return Response.json({ data, error });
}
