import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../lib/constants';

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fibreEmerald text-white shadow-lg shadow-fibreEmerald/30 transition hover:scale-110"
    >
      <MessageCircle size={28} />
    </a>
  );
}
