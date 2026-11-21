
function DietaryInfo({ dietary, allergens }) {
  return (
    <div className="dietary-info">
      {dietary.length > 0 && (
        <ul className="tag-list" aria-label="Dietary">
          {dietary.map((label) => (
            <li key={label} className="tag tag-diet">
              {label}
            </li>
          ))}
        </ul>
      )}
      <p className="allergens">
        <strong>Allergens:</strong> {allergens.length > 0 ? allergens.join(', ') : 'none listed'}
      </p>
    </div>
  );
}

export default DietaryInfo;
