# ⛽ Cheap Fuel Finder

**Cheap Fuel Finder** helps you find the **cheapest fuel stations nearby**, because nobody likes paying more than they should 🚗💨

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Leaflet**, it fetches live fuel prices from public Italian databases and displays them on an interactive map.

---

## 🧠 How It Works

1. 🌍 **Enter an address** in the search field
2. 📍 **Select** one of the suggested locations
3. ⚙️ **Choose a fuel** type
4. 💰 **Search nearby stations** instantly fetches the cheapest options around
5. 🧭 **You can:**
   - Search by address
   - Adjust the search radius
   - Filter by fuel type
6. 📊 **Results appear:**
   - As markers on the map
   - As cards in a right-side results panel

---

## 🧰 Tech Stack

- ⚛️ **Next.js**
- 💙 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **Shadcn/ui**
- 🗺️ **React Leaflet**
- 🌐 **Next-intl**

---

## 🌍 Internationalization (i18n)

The application supports **Italian** and **English** using `next-intl`.
Localized routes are handled through the App Router.

### Supported locales

- `it`
- `en`

---

## 🗂️ Data Sources

Cheap Fuel Finder relies on open and public data only:

- 🇮🇹 [Public Italian Fuel Price service](https://carburanti.mise.gov.it/ospzSearch/home/)
- 🏙️ OpenStreetMap geocoding for free address autocomplete
- 🧱 OpenStreetMap tiles for map rendering
