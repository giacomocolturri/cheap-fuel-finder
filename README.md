# ⛽ Cheap Fuel Finder

**Cheap Fuel Finder** helps you find the **cheapest fuel stations nearby**, because nobody likes paying more than they should 🚗💨

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Leaflet**, it fetches live fuel prices from public Italian databases and displays them on an interactive map.

---

## 🧠 How It Works

1. 🌍 **Get your location** — the browser tries to detect your GPS position
2. 💰 **Search nearby stations** — instantly fetches the cheapest options around
3. 📍 **No GPS? No problem!** — defaults to _Milan, Italy_
4. 🧭 **You can:**
   - Search by address
   - Adjust the search radius
   - Filter by fuel type
5. 📊 **Results appear:**
   - As markers on the map
   - As cards in a right-side results panel

---

## 🧰 Tech Stack

- ⚛️ **Next.js**
- 💙 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui**
- 🗺️ **React Leaflet**

---

## 🗂️ Data Sources

Cheap Fuel Finder relies on open and public data only:

- 🇮🇹 [Public Italian Fuel Price service](https://carburanti.mise.gov.it/ospzSearch/home/)
- 🏙️ OpenStreetMap geocoding for free address autocomplete
- 🧱 OpenStreetMap tiles for map rendering
