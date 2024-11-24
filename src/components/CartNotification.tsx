import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface CartNotificationProps {
  show: boolean;
  productName: string;
  onClose: () => void;
}

export default function CartNotification({ show, productName, onClose }: CartNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-4 right-4 z-50 md:left-1/2 md:-translate-x-1/2 md:max-w-md"
        >
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-full">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <p className="font-medium">
                {productName} wurde zum Warenkorb hinzugefügt
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-green-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
