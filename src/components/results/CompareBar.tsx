import type { RankedCard } from '../../types';

interface CompareBarProps {
    selectedCards: RankedCard[];
    onCompare: () => void;
    onClear: () => void;
}

export default function CompareBar({ selectedCards, onCompare, onClear }: CompareBarProps) {
    return (
        <div className="compare-bar">
            <div className="compare-bar-cards">
                {selectedCards.map(card => (
                    <div key={card.id} className="compare-bar-card">
                        <div className="compare-bar-art">
                            <img src={card.image} alt={card.name} />
                        </div>
                        <span className="compare-bar-name">{card.issuer} {card.name}</span>
                    </div>
                ))}
            </div>
            <div className="compare-bar-actions">
                <button className="compare-bar-clear" onClick={onClear}>Clear</button>
                <button className="compare-bar-btn" onClick={onCompare}>
                    Compare Cards ({selectedCards.length})
                </button>
            </div>
        </div>
    );
}
