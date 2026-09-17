/* =========================================================
   SUPABASE CLIENT INITIALIZATION (PRODUCTION READY)
   ========================================================= */

const SUPABASE_URL = "https://rcglkldkkjdouocfgubw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZ2xrbGRra2pkb3VvY2ZndWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjYzODksImV4cCI6MjEwNTE0MjM4OX0.RUjXJzXxWKNTDYG5d9lpAFnmMtyU6dIoyrw9353zu3Q";

function initSupabaseClient() {
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        return window.supabaseClient;
    }
    return null;
}

initSupabaseClient();