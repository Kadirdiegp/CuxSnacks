import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Users, MapPin } from 'lucide-react';

const teamMembers = [
  {
    name: 'Ramadan',
    role: 'Geschäftsführer',
    image: '/team/ramadan.jpg', // Platzhalterbild
  },
  {
    name: 'Amar',
    role: 'Geschäftsführer',
    image: '/team/amar.jpg', // Platzhalterbild
  },
  {
    name: 'Safwan',
    role: 'Geschäftsführer',
    image: '/team/safwan.jpg', // Platzhalterbild
  },
];

const values = [
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: 'Qualität',
    description: 'Wir bieten nur die besten Produkte für unsere Kunden an.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Leidenschaft',
    description: 'Unsere Arbeit ist unsere Berufung.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Gemeinschaft',
    description: 'Wir sind mehr als ein Geschäft - wir sind Teil der Community.',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Lokal',
    description: 'Verwurzelt in Cuxhaven, für unsere Region.',
  },
];

export default function About() {
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
            <h1 className="text-4xl font-bold mb-6">Über Uns</h1>
            <p className="text-xl text-zinc-300">
              Willkommen bei Ihrem lokalen Snack-Shop in Cuxhaven. Wir sind stolz darauf, Ihnen eine große Auswahl an hochwertigen Produkten anzubieten.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Unser Team</h2>
            <p className="text-xl text-zinc-300">
              Die Menschen hinter Ihrem Snack-Shop
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-20 blur-3xl scale-125" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-10 blur-3xl scale-150" />
                </div>
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 relative">{member.name}</h3>
                <p className="text-zinc-300 relative">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Unsere Werte</h2>
            <p className="text-zinc-400">
              Was uns antreibt und was wir Ihnen bieten möchten.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-zinc-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Unser Standort</h2>
            <p className="text-zinc-400">
              Besuchen Sie uns in der Poststraße 33, 27474 Cuxhaven
            </p>
          </motion.div>

          <div className="bg-zinc-800 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.9248670759454!2d8.705145776891016!3d53.86821037259407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b40f3e8d5e9bcd%3A0x4b3d0b8dd11d0c0!2sPoststra%C3%9Fe%2033%2C%2027474%20Cuxhaven!5e0!3m2!1sde!2sde!4v1690000000000!5m2!1sde!2sde"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
