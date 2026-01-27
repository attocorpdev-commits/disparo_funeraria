export const validatePhone = (phone) => {
    // Remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');

    // Check if it matches 55 + 2 digit DDD + 9 digit number (total 13 digits)
    // or just 2 digit DDD + 9 digit number (total 11 digits) to normalize

    if (cleanPhone.length === 11) {
        return `55${cleanPhone}`;
    }

    if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
        return cleanPhone;
    }

    return null; // Invalid
};

export const isValidCSVHeader = (headers) => {
    const required = ['nome', 'contato'];
    const lowerHeaders = headers.map(h => h.toLowerCase().trim());
    return required.every(r => lowerHeaders.includes(r));
};
