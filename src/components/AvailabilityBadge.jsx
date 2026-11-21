// Text + colour so status is not shown by colour alone.
function AvailabilityBadge({ portionsLeft }) {
  if (portionsLeft <= 0) {
    return <span className="badge badge-soldout">Sold out today</span>;
  }
  if (portionsLeft <= 3) {
    return <span className="badge badge-low">Only {portionsLeft} left</span>;
  }
  return <span className="badge badge-ok">{portionsLeft} portions left</span>;
}

export default AvailabilityBadge;
