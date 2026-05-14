// Cloudflare Workers environment bindings — di-generate dari wrangler.toml [vars]
// Ini hanya type declaration, bukan runtime value
declare interface Env {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    DATABASE_URL: string;
    PORT: string;
    NODE_ENV?: string;
}