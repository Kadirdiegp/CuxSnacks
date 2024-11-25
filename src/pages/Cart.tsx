import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrders } from '../hooks/useOrders';
import { sendOrderConfirmationEmail, formatOrderDetailsForEmail } from '../lib/emailConfig';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { DeliveryAddress, DELIVERY_HOURS, ALLOWED_CITIES } from '../types/order';
import { MINIMUM_ORDER_AMOUNT, DELIVERY_FEE, calculateRemainingAmount } from '../constants/cart';

interface CheckoutForm {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  additionalInfo: string;
  phoneNumber: string;
  paymentMethod: 'cash' | 'card';
}

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    additionalInfo: '',
    phoneNumber: '',
    paymentMethod: 'cash'
  });

  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;
  const remainingAmount = calculateRemainingAmount(subtotal);

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium mb-4">Ihr Warenkorb ist leer</h2>
        <p className="text-zinc-400 mb-8">Fügen Sie einige Produkte hinzu, um fortzufahren.</p>
      </div>
    );
  }

  const isDeliveryTime = () => {
    const now = new Date();
    const [startHour, startMinute] = DELIVERY_HOURS.start.split(':').map(Number);
    const [endHour, endMinute] = DELIVERY_HOURS.end.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTime = currentHour * 60 + currentMinute;
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime <= endTime;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.street || !formData.houseNumber || !formData.postalCode || !formData.city || !formData.phoneNumber) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return false;
    }

    if (!ALLOWED_CITIES.includes(formData.city)) {
      setError('Lieferung nur nach Cuxhaven und Wurster Nordseeküste möglich.');
      return false;
    }

    return true;
  };

  const handleShowCheckoutForm = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subtotal < MINIMUM_ORDER_AMOUNT) {
      setError(`Mindestbestellwert: ${MINIMUM_ORDER_AMOUNT.toFixed(2)}€`);
      return;
    }

    if (!isDeliveryTime()) {
      setError(`Lieferung nur zwischen ${DELIVERY_HOURS.start} und ${DELIVERY_HOURS.end} Uhr möglich.`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Erstelle die Bestellung
      const order = await createOrder(items, total);
      console.log('Bestellung erstellt:', order);
      
      // Formatiere die Adresse
      const deliveryAddress = `${formData.street} ${formData.houseNumber}, ${formData.postalCode} ${formData.city}`;

      // Sende die Bestellbestätigung per E-Mail
      const emailParams = {
        to_email: user?.email || '',
        order_number: order.id,
        order_details: formatOrderDetailsForEmail(items),
        total: total.toFixed(2),
        customer_name: user?.user_metadata?.full_name || user?.email || '',
        delivery_address: deliveryAddress
      };

      console.log('Sende Bestellbestätigung...', { email: user?.email });
      const emailResult = await sendOrderConfirmationEmail(emailParams);
      
      if (!emailResult.success) {
        console.error('E-Mail-Fehler:', emailResult.error);
        // Zeige Fehlermeldung an, aber lasse den Bestellprozess weiterlaufen
        setError('Bestellung wurde aufgenommen, aber die Bestätigungs-E-Mail konnte nicht gesendet werden.');
      } else {
        console.log('Bestellbestätigung wurde gesendet');
      }

      clearCart();
      navigate('/profile');
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen der Bestellung');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Warenkorb</h1>

      {remainingAmount > 0 && (
        <div className="bg-blue-500/10 border border-blue-500 text-blue-500 p-4 rounded-lg mb-6">
          <p>Noch {remainingAmount.toFixed(2)}€ bis zum Mindestbestellwert von {MINIMUM_ORDER_AMOUNT.toFixed(2)}€</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-zinc-400">
                  {item.price.toFixed(2)}€ pro Stück
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {(item.price * item.quantity).toFixed(2)}€
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Zwischensumme</span>
            <span>{subtotal.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Liefergebühr</span>
            <span>{DELIVERY_FEE.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Gesamtsumme</span>
            <span>{total.toFixed(2)}€</span>
          </div>
        </div>

        {subtotal < MINIMUM_ORDER_AMOUNT && (
          <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg mb-6 text-sm">
            Mindestbestellwert: {MINIMUM_ORDER_AMOUNT.toFixed(2)}€
          </div>
        )}

        {!isDeliveryTime() && (
          <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg mb-6 text-sm">
            Lieferung nur zwischen {DELIVERY_HOURS.start} und {DELIVERY_HOURS.end} Uhr
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleShowCheckoutForm}
              className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Zur Kasse ({total.toFixed(2)}€)
            </button>
          </div>
        )}

        {showCheckoutForm && (
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Straße *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hausnummer *
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stadt *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                    required
                  >
                    <option value="">Bitte wählen</option>
                    {ALLOWED_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Telefonnummer *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Zusätzliche Informationen
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Zahlungsmethode *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="text-white"
                    />
                    <span>Barzahlung beim Fahrer</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="text-white"
                    />
                    <span>Kartenzahlung beim Fahrer</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || subtotal < MINIMUM_ORDER_AMOUNT || !isDeliveryTime()}
              className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird bearbeitet...' : 'Jetzt bestellen'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}