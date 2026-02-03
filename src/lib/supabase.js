
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

    if (validContacts.length === 0) return { error: null, count: 0, data: [] };

    // Use select() to return the records so we get the IDs
    const { data, error } = await supabase
        .from('contacts')
        .upsert(validContacts, { onConflict: 'phone', ignoreDuplicates: false }) // Allow updates to ensure we get IDs back
        .select();

    return { data, error };
};

/**
 * Updates the campaign ID for a list of contacts.
 */
export const updateContactsCampaign = async (contactIds, campaignId) => {
    const { data, error } = await supabase
        .from('contacts')
        .update({ id_campanha: campaignId })
        .in('id', contactIds);

    return { data, error };
};

/**
 * Creates a new campaign record.
 */
export const createCampaign = async (name, message, totalContacts) => {
    // We generate a UUID to be used as id_campanha matching the record ID
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

    // After creation, we update the record with its own ID in id_campanha for consistency if needed
    // although they will be the same UUID.
    if (data && !error) {
        await supabase
            .from('campaigns')
            .update({ id_campanha: data.id })
            .eq('id', data.id);

        data.id_campanha = data.id;
    }

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
