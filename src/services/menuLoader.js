
import { menuItems } from '../data/menuItems.js';

const DELAY_MS = 700;

export function loadMenu(demoSettings) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (demoSettings.failLoading) {
        reject(new Error('The menu could not be loaded. Please check your connection and try again.'));
        return;
      }
      if (demoSettings.emptyMenu) {
        resolve([]);
        return;
      }

      let items = menuItems.map((item) => ({ ...item }));

      if (demoSettings.lowStock) {

        items = items.map((item) => {
          if (item.id === 'chicken-karahi') return { ...item, portionsLeft: 1 };
          if (item.id === 'seekh-kabab') return { ...item, portionsLeft: 0 };
          return item;
        });
      }
      resolve(items);
    }, DELAY_MS);
  });
}
