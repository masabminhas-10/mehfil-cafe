// Clearly labelled demo controls for testing edge cases (loading failure, empty data, changed stock).
function DemoSettingsPage({ settings, onChange }) {
  function toggle(event) {
    const { name, checked } = event.target;
    onChange((prev) => ({ ...prev, [name]: checked }));
  }

  return (
    <section aria-labelledby="demo-heading">
      <h1 id="demo-heading">Demo settings</h1>
      <p>These switches are for testing only. They change what the mock menu loader returns and are saved in this browser.</p>

      <fieldset className="demo-options">
        <legend>Simulate</legend>
        <label>
          <input type="checkbox" name="failLoading" checked={settings.failLoading} onChange={toggle} />
          Loading failure (menu request fails)
        </label>
        <label>
          <input type="checkbox" name="emptyMenu" checked={settings.emptyMenu} onChange={toggle} />
          Empty menu (no dishes published)
        </label>
        <label>
          <input type="checkbox" name="lowStock" checked={settings.lowStock} onChange={toggle} />
          Changed availability (Chicken Karahi → 1 left, Seekh Kabab → sold out)
        </label>
      </fieldset>
      <p className="hint">Tip: add 2+ Chicken Karahi and a Seekh Kabab first, then turn on “Changed availability” and open Your order.</p>
    </section>
  );
}

export default DemoSettingsPage;
