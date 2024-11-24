import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Telefon',
    details: '+49 (0) 4721 123456',
    link: 'tel:+4947211234567',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'E-Mail',
    details: 'info@snackshop-cuxhaven.de',
    link: 'mailto:info@snackshop-cuxhaven.de',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Adresse',
    details: 'Poststraße 33, 27474 Cuxhaven',
    link: 'https://goo.gl/maps/your-location',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Öffnungszeiten',
    details: 'Mo-Sa: 8:30 - 23:00 Uhr\nSo: 12:00 - 18:00 Uhr',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6">Kontakt</h1>
            <p className="text-xl text-zinc-300">
              Haben Sie Fragen oder Anregungen? Wir sind für Sie da!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/50 p-6 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4 text-blue-500">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-zinc-300 whitespace-pre-line">
                  {info.details}
                </p>
                {info.link && (
                  <a
                    href={info.link}
                    className="text-blue-500 hover:text-blue-400 mt-2 inline-block"
                  >
                    {info.title === 'Adresse' ? 'Auf Karte anzeigen' : info.details}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Schreiben Sie uns
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Betreff
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Nachricht
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Wird gesendet...' : 'Nachricht senden'}
              </button>
              {status === 'success' && (
                <p className="text-green-500 text-center">
                  Ihre Nachricht wurde erfolgreich gesendet!
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-center">
                  Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-800 rounded-xl overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.9248670759454!2d8.705145776891016!3d53.86821037259407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b40f3e8d5e9bcd%3A0x4b3d0b8dd11d0c0!2sPoststra%C3%9Fe%2033%2C%2027474%20Cuxhaven!5e0!3m2!1sde!2sde!4v1690000000000!5m2!1sde!2sde"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
