import React from 'react';
import { motion } from 'motion/react';

interface EditorialRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  serifWords?: string[];
  delay?: number;
  stagger?: number;
  id?: string;
}

export const EditorialReveal: React.FC<EditorialRevealProps> = ({
  text,
  as = 'h2',
  className = '',
  serifWords = [],
  delay = 0.05,
  stagger = 0.05,
  id,
}) => {
  const Tag = as;
  const words = text.trim().split(/\s+/);
  const normalizedSerif = serifWords.map((w) => w.toLowerCase());

  return (
    <Tag
      id={id}
      className={`max-w-full break-words ${className}`}
      style={{ textWrap: 'balance' }}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="inline-block max-w-full"
      >
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
          const isSerif = normalizedSerif.includes(cleanWord);

          return (
            <span
              key={`${word}-${index}`}
              className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0 pb-[0.08em] -mb-[0.08em]"
            >
              <motion.span
                variants={{
                  hidden: { y: '95%', opacity: 0, filter: 'blur(6px)' },
                  visible: {
                    y: '0%',
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.65,
                      delay: delay + index * stagger,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className={`inline-block ${
                  isSerif ? 'font-serif-editorial italic font-normal tracking-normal' : ''
                }`}
                style={{ willChange: 'transform, opacity, filter' }}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
};
