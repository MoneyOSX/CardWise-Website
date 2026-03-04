export default function FilterChips({
    activeFilter,
    onFilterChange
}: {
    activeFilter: string,
    onFilterChange: (f: string) => void
}) {
    const filters = ['All Cards', 'Lifetime Free', 'Best Cashback', 'Travel', 'Shopping'];

    return (
        <div className="filter-row">
            {filters.map(f => (
                <div
                    key={f}
                    className={`filter-chip ${f === activeFilter ? 'active' : ''}`}
                    onClick={() => onFilterChange(f)}
                >
                    {f}
                </div>
            ))}
        </div>
    );
}
