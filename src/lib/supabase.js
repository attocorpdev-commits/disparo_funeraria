
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Helper Functions ---

/**
 * Saves a list of contacts to the database.
 * Ignores duplicates based on the 'phone' unique constraint.
 */
export const saveContacts = async (contacts) => {
    // Filter only valid contacts
    const validContacts = contacts
        .filter(c => c.isValid)
        .map(c => ({
            name: c.nome,
            phone: c.telefone
        }));

    if (validContacts.length === 0) return { error: null, count: 0 };

    const { data, error } = await supabase
        .from('contacts')
        .upsert(validContacts, { onConflict: 'phone', ignoreDuplicates: true })
        .select();

    return { data, error };
};

/**
 * Creates a new campaign record.
 */
export const createCampaign = async (name, message, totalContacts) => {
    const { data, error } = await supabase
        .from('campaigns')
        .insert([
            {
                name,
                message_content: message,
                total_contacts: totalContacts,
                status: 'sending'
            }
        ])
        .select()
        .single();

    return { data, error };
};

/**
 * Updates the status of a campaign.
 */
export const updateCampaignStatus = async (id, status) => {
    const { data, error } = await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', id);

    return { data, error };
};

/**
 * Fetches all campaigns ordered by creation date.
 */
export const getCampaigns = async () => {
    // Correctly order by created_at descending
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

    return { data, error };
};
