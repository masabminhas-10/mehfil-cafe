import { useSearchParams } from 'react-router-dom';
import MenuCard from '../components/MenuCard.jsx';
import LoadState from '../components/LoadState.jsx';
import RulesBanner from '../components/RulesBanner.jsx';
import { CATEGORIES, DIETARY_OPTIONS } from '../data/menuItems.js';

// Search, filter and sort are stored in the URL (?q=&category=&diet=&sort=)
// so browser Back from a details page returns to the same filtered list.
function MenuPage({ menu, status, loadError, onRetry, getQuantity, onAdd, onSetQuantity }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const diet = searchParams.get('diet') || 'Any';
  const sort = searchParams.get('sort') || 'recommended';

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true }); // replace: typing doesn't fill history
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  if (status !== 'ready') {
    return <LoadState status={status} loadError={loadError} onRetry={onRetry} />;
  }

  // ---- Derived list: search -> filter -> sort ----
  const searchText = query.trim().toLowerCase();
  const results = menu
    .filter((dish) => {
      const text = `${dish.name} ${dish.description} ${dish.category}`.toLowerCase();
      return text.includes(searchText);
    })
    .filter((dish) => category === 'All' || dish.category === category)
    .filter((dish) => diet === 'Any' || dish.dietary.includes(diet))
    // filter() already returned a new array, so sort() here never changes the menu state
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0; // recommended = original order
    });

  return (
    <>
      <h1>Today's menu</h1>
      <RulesBanner />

      <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor="search">Search dishes</label>
          <input
            id="search"
            type="search"
            value={query}
            placeholder="e.g. karahi, lentils, tea"
            onChange={(event) => updateParam('q', event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(event) => updateParam('category', event.target.value)}>
            <option value="All">All categories</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="diet">Dietary</label>
          <select id="diet" value={diet} onChange={(event) => updateParam('diet', event.target.value)}>
            <option value="Any">Any</option>
            {DIETARY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </form>

      <p className="result-count" aria-live="polite">
        Showing {results.length} of {menu.length} dishes
      </p>

      {/* Two different empty states */}
      {menu.length === 0 ? (
        <div className="status-box">
          <h2>No dishes published yet</h2>
          <p>The kitchen hasn't put today's menu online. Please check back after 12:00 pm or call us on 021-1234567.</p>
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            Check again
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="status-box">
          <h2>No dishes match your search</h2>
          <p>Nothing matches “{query}” with the current filters. Try a different word or clear the filters.</p>
          <button type="button" className="btn btn-primary" onClick={clearFilters}>
            Clear search and filters
          </button>
        </div>
      ) : (
        <ul className="menu-grid">
          {results.map((dish) => (
            <MenuCard
              key={dish.id}
              dish={dish}
              quantity={getQuantity(dish.id)}
              onAdd={onAdd}
              onSetQuantity={onSetQuantity}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default MenuPage;
