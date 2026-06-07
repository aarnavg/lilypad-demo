import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function SupportBubble({
  open,
  attention,
  onClick,
}: {
  open: boolean;
  attention: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative">
      {attention && !open && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-[#ef765f]/35"
            animate={{ scale: [1, 1.42], opacity: [0.65, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="absolute -right-1 -top-1 z-10 grid size-5 place-items-center rounded-full border-2 border-[#fffaf0] bg-[#ef765f] text-[9px] font-bold text-white">
            1
          </span>
        </>
      )}
      <motion.button
        type="button"
        aria-label={open ? "Close Lily support" : "Open Lily support"}
        aria-expanded={open}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="relative grid size-16 place-items-center overflow-hidden rounded-full border border-white/20 bg-[#1d4935] text-[#fffaf0] shadow-[0_18px_45px_rgba(24,68,48,.35)]"
      >
        <span className="absolute inset-1 rounded-full border border-white/10" />
        {open ? <MessageCircle size={25} /> : <Sparkles size={25} />}
      </motion.button>
    </div>
  );
}
