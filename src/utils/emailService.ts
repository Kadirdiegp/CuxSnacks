import emailjs from '@emailjs/browser';

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

interface OrderEmailParams {
  userEmail: string;
  orderItems: string;
  total: number;
  address: string;
  phoneNumber: string;
}

export const sendOrderConfirmation = async (params: OrderEmailParams) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: params.userEmail,
        order_items: params.orderItems,
        total: params.total.toFixed(2),
        delivery_address: params.address,
        phone_number: params.phoneNumber,
      },
      PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Fehler beim Senden der Bestellbestätigung.');
  }
};
