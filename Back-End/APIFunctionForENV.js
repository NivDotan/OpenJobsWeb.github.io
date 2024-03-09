const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') });

export function supabaseUrlFunction(){
    const supabaseUrl = process.env.supabaseUrl;
    return supabaseUrl;
}

export function supabaseKeyFunction(){
    const supabaseKey = process.env.supabaseKey;
    return supabaseKey;
}
