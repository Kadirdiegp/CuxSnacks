import emailjs from '@emailjs/browser';

// EmailJS Konfiguration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

console.log('EmailJS Konfiguration:', {
  SERVICE_ID: EMAILJS_SERVICE_ID,
  TEMPLATE_ID: EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: EMAILJS_PUBLIC_KEY?.substring(0, 5) + '...'
});

// Initialisiere EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Email Template Parameter Interface
export interface EmailTemplateParams {
  to_email: string;
  order_number: string;
  order_details: string;
  total: string;
  customer_name: string;
  delivery_address?: string;
}

// Funktion zum Formatieren der Bestelldetails für die E-Mail
export const formatOrderDetailsForEmail = (items: Array<{ name: string; quantity: number; price: number }>) => {
  return items
    .map(item => {
      const total = (item.price * item.quantity).toFixed(2);
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${total}€</td>
        </tr>
      `;
    })
    .join('');
};

// Funktion zum Senden der Bestätigungs-E-Mail
export const sendOrderConfirmationEmail = async (params: EmailTemplateParams) => {
  try {
    // Bereite die Template-Parameter vor
    const templateParams = {
      to_email: params.to_email,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa; border-radius: 5px;">
            <h2 style="color: #333; margin: 0;">Bestellbestätigung</h2>
          </div>

          <div style="padding: 20px; color: #333;">
            <p style="font-size: 16px;">Hallo ${params.customer_name},</p>
            
            <p style="font-size: 16px;">vielen Dank für Ihre Bestellung!</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;"><strong>Bestellnummer:</strong> ${params.order_number}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 10px;">Ihre Bestellung:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left;">Artikel</th>
                    <th style="padding: 10px; text-align: right;">Preis</th>
                  </tr>
                </thead>
                <tbody>
                  ${params.order_details}
                  <tr>
                    <td style="padding: 10px; border-top: 2px solid #333;"><strong>Gesamtbetrag</strong></td>
                    <td style="padding: 10px; border-top: 2px solid #333; text-align: right;"><strong>${params.total}€</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Lieferadresse:</h3>
              <p style="margin: 0; font-size: 14px;">${params.delivery_address}</p>
            </div>
            
            <p style="font-size: 16px;">Wir werden Ihre Bestellung schnellstmöglich zubereiten und liefern.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 14px;">Mit freundlichen Grüßen<br>Ihr Restaurant-Team</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 14px;">Bei Fragen kontaktieren Sie uns gerne.</p>
          </div>
        </div>
      `
    };

    console.log('Sende E-Mail mit folgender Konfiguration:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      to_email: params.to_email
    });

    // Sende die E-Mail
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('E-Mail erfolgreich gesendet:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return { success: false, error };
  }
};
