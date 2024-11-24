import { supabase } from '../lib/supabase';

const API_URL = 'http://localhost:3001/api';

// Diese Funktion würde in einer sicheren Serverumgebung laufen
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated verification code:', code); // Debug log
  return code;
};

// Temporärer Speicher für Verifizierungscodes (In Produktion würde dies in einer Datenbank gespeichert)
const verificationCodes: { [key: string]: { code: string; timestamp: number } } = {};

export const sendVerificationSMS = async (phoneNumber: string) => {
  try {
    const response = await fetch(`${API_URL}/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const verifyCode = async (phoneNumber: string, code: string) => {
  try {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, code })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    // Speichere die verifizierte Nummer in der Datenbank
    const { error: supabaseError } = await supabase
      .from('verified_phones')
      .upsert([
        {
          phone_number: phoneNumber,
          verified_at: new Date().toISOString(),
        }
      ]);

    if (supabaseError) throw supabaseError;

    return { success: true, data };
  } catch (error) {
    console.error('Error verifying code:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
