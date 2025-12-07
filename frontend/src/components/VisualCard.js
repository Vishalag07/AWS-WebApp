import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const VisualCard = ({ card, index }) => {
  const [cardRef, , hasIntersected] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <div
      ref={cardRef}
      className={`visual-card ${hasIntersected ? 'revealed' : ''}`}
      style={{ '--stagger-delay': `${index * 120}ms` }}
      tabIndex={0}
      role="article"
      aria-label={`${card.title} - ${card.stat}`}
    >
      <div className="visual-icon" aria-hidden="true">{card.icon}</div>
      <div className="visual-content">
        <div className="visual-title">{card.title}</div>
        <div className="visual-stat">{card.stat}</div>
      </div>
      <div className="visual-lines" aria-hidden="true">
        <div className="visual-line"></div>
        <div className="visual-line"></div>
      </div>
    </div>
  );
};

const VisualCardsGrid = ({ cards }) => {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-grid">
        {cards.map((card, index) => (
          <VisualCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
};

export default VisualCardsGrid;

