import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  // --- Admin account ---
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "change-this-password";
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn(
      "⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not found in the environment — falling back to defaults.\n" +
      "   If you meant to set your own, make sure .env exists (cp .env.example .env) and re-run: npx prisma db seed"
    );
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } });
  console.log(`✅ Admin account ready — log in at /admin/login with:\n   email: ${email}\n   password: ${password}`);

  // --- Destinations (no images seeded — add real photos from the dashboard) ---
  const destinations = [
    { name: "Lalibela", region: "North Ethiopia", tag: "UNESCO · North", icon: "church", colorway: "art-1", order: 1,
      activityTags: ["cultural", "hiking"], avgTempC: 18, latitude: 12.0317, longitude: 39.0473,
      summary: "Eleven medieval churches carved downward out of solid volcanic rock, still active places of worship.",
      description: "Lalibela's rock-hewn churches were carved directly into the mountainside in the 12th and 13th centuries, entirely below ground level. They remain active places of Ethiopian Orthodox worship today. Go at dawn for the best light and the fewest crowds.",
      highlights: ["Bete Giyorgis (Church of St. George)", "Active pilgrimage site", "Underground tunnels connecting churches"],
      bestTimeToVisit: "October–March", duration: "2-3 days", difficulty: "Easy" },
    { name: "Axum", region: "North Ethiopia", tag: "UNESCO · North", icon: "compass", colorway: "art-2", order: 2,
      activityTags: ["cultural"], avgTempC: 20, latitude: 14.1213, longitude: 38.7269,
      summary: "Ancient obelisks and ruins from the Aksumite Empire, and the church many believe holds the Ark of the Covenant.",
      description: "Axum was the seat of the ancient Aksumite Empire, a major trading power from roughly the 1st to 7th centuries. Its towering carved obelisks and archaeological sites reflect that history, and the Church of Our Lady Mary of Zion is claimed by many Ethiopian Orthodox Christians to house the Ark of the Covenant.",
      highlights: ["Field of ancient obelisks", "Queen of Sheba's Bath", "Church of Our Lady Mary of Zion"],
      bestTimeToVisit: "October–March", duration: "1-2 days", difficulty: "Easy" },
    { name: "Gondar", region: "North Ethiopia", tag: "UNESCO · North", icon: "church", colorway: "art-3", order: 3,
      activityTags: ["cultural"], avgTempC: 19, latitude: 12.6090, longitude: 37.4671,
      summary: "17th-century castles and fortifications known as 'Africa's Camelot'.",
      description: "Gondar's Royal Enclosure holds a cluster of castles built by Ethiopian emperors from the 17th century onward, giving the city a very different architectural feel from the rest of the country. Nearby Debre Berhan Selassie church is famous for its painted ceiling of angel faces.",
      highlights: ["Fasil Ghebbi royal enclosure", "Debre Berhan Selassie church ceiling", "Fasilides' Bath"],
      bestTimeToVisit: "October–March", duration: "1-2 days", difficulty: "Easy" },
    { name: "Simien Mountains", region: "North Ethiopia", tag: "National Park · North", icon: "mountain", colorway: "art-4", order: 4,
      activityTags: ["hiking", "wildlife"], avgTempC: 11, latitude: 13.2000, longitude: 38.0333,
      summary: "Jagged escarpments, deep valleys, and gelada monkeys found nowhere else on Earth.",
      description: "A UNESCO World Heritage site known for dramatic cliffs, deep valleys, and the endemic gelada — sometimes called the 'bleeding heart monkey.' Multi-day treks with mule support and camping are the classic way to experience the park.",
      highlights: ["Gelada monkey troops", "Views from Chennek and Imet Gogo", "Multi-day trekking routes"],
      bestTimeToVisit: "October–March", duration: "3-6 days", difficulty: "Moderate to challenging" },
    { name: "Danakil Depression", region: "Afar Region", tag: "Afar Region", icon: "mountain", colorway: "art-1", order: 5,
      activityTags: ["desert", "adventure"], avgTempC: 34, latitude: 14.2417, longitude: 40.3000,
      summary: "One of the hottest, lowest places on the planet — sulphur springs, salt flats, and active lava.",
      description: "The Danakil Depression sits well below sea level and regularly ranks among the hottest inhabited places on Earth. Highlights include the Dallol sulphur springs, vast salt flats worked by camel caravans, and (conditions permitting) the lava lake of Erta Ale. Only visit as part of a organized, guided expedition.",
      highlights: ["Dallol sulphur springs", "Salt flat camel caravans", "Erta Ale lava lake (conditions permitting)"],
      bestTimeToVisit: "November–March (avoid extreme summer heat)", duration: "3-4 days", difficulty: "Challenging" },
    { name: "Harar", region: "East Ethiopia", tag: "UNESCO · East", icon: "market", colorway: "art-2", order: 6,
      activityTags: ["cultural", "city"], avgTempC: 21, latitude: 9.3141, longitude: 42.1275,
      summary: "A walled Islamic city of narrow alleys, famous for its old market and nightly hyena feeding.",
      description: "Harar Jugol, the walled old city, is considered one of the holiest cities in Islam, packed with narrow alleys, colorful houses, and over 80 mosques. Its most famous modern tradition is the nightly hyena feeding just outside the city walls.",
      highlights: ["Harar Jugol old walled city", "Nightly hyena feeding", "Arthur Rimbaud House museum"],
      bestTimeToVisit: "October–March", duration: "1-2 days", difficulty: "Easy" },
    { name: "Bale Mountains", region: "South Ethiopia", tag: "National Park · South", icon: "mountain", colorway: "art-3", order: 7,
      activityTags: ["hiking", "wildlife"], avgTempC: 10, latitude: 6.8833, longitude: 39.7500,
      summary: "Africa's highest all-weather road crosses the Sanetti Plateau, home to the rare Ethiopian wolf.",
      description: "Bale Mountains National Park protects vast Afro-alpine moorland and is the best place on Earth to see the endangered Ethiopian wolf. The Sanetti Plateau, crossed by Africa's highest all-weather road, sits above 4,000 metres.",
      highlights: ["Ethiopian wolf sightings", "Sanetti Plateau at 4,000m+", "Harenna Forest"],
      bestTimeToVisit: "November–February", duration: "2-4 days", difficulty: "Moderate" },
    { name: "Omo Valley", region: "South Ethiopia", tag: "Cultural · South", icon: "compass", colorway: "art-4", order: 8,
      activityTags: ["cultural", "adventure"], avgTempC: 27, latitude: 5.8500, longitude: 36.5667,
      summary: "Home to numerous distinct tribal communities with their own languages and traditions.",
      description: "The Lower Omo Valley is home to several distinct ethnic communities, each with their own language, dress, and customs. Responsible visits go through community-led guides and involve direct consent for photography.",
      highlights: ["Distinct tribal communities", "Traditional markets", "Community-led guiding"],
      bestTimeToVisit: "June–September or December–February", duration: "3-5 days", difficulty: "Moderate" },
    { name: "Addis Ababa", region: "Capital Region", tag: "Capital", icon: "market", colorway: "art-2", order: 9,
      activityTags: ["city", "cultural"], avgTempC: 20, latitude: 9.0250, longitude: 38.7469,
      summary: "See the 'Lucy' fossil, browse one of Africa's largest markets, and catch the view from Entoto Hill.",
      description: "Ethiopia's capital blends the National Museum (home to the 'Lucy' hominid fossil), the sprawling Merkato market, and hilltop views from Entoto. It's also the easiest base for a shorter trip focused on culture and coffee.",
      highlights: ["'Lucy' fossil at the National Museum", "Merkato open-air market", "Entoto Hill viewpoint"],
      bestTimeToVisit: "Year-round", duration: "1-3 days", difficulty: "Easy" },
  ];
  for (const d of destinations) {
    const slug = slugify(d.name);
    await prisma.destination.upsert({
      where: { slug },
      update: { ...d },
      create: { ...d, slug }
    });
  }

  // --- Hotels ---
  const hotels = [
    { name: "Sheraton Addis", city: "Addis Ababa", address: "Taitu Street, Kazanchis", latitude: 9.0193, longitude: 38.7580, distanceFromAirportKm: 6.5, tier: "lux", pricePerNight: 220, mealPlan: "breakfast",
      amenities: ["Free WiFi", "Pool", "Spa", "Airport shuttle"], rating: 4.6, order: 1,
      note: "Long-established luxury landmark near the city centre, known for its gardens and event spaces." },
    { name: "Hyatt Regency Addis Ababa", city: "Addis Ababa", address: "Meskel Square area", latitude: 9.0107, longitude: 38.7613, distanceFromAirportKm: 4.8, tier: "lux", pricePerNight: 190, mealPlan: "breakfast",
      amenities: ["Free WiFi", "Gym", "Business centre"], rating: 4.5, order: 2,
      note: "International-standard business hotel close to Bole, convenient for airport transfers." },
    { name: "Bole-area boutique hotel", city: "Addis Ababa", address: "Bole Road area", latitude: 8.9950, longitude: 38.7900, distanceFromAirportKm: 2.1, tier: "mid", pricePerNight: 70, mealPlan: "breakfast",
      amenities: ["Free WiFi", "Airport pickup"], rating: 4.1, order: 3,
      note: "A growing cluster of mid-range hotels near the airport district — easy for short layovers." },
    { name: "Piassa guesthouse", city: "Addis Ababa", address: "Piassa district", latitude: 9.0359, longitude: 38.7503, distanceFromAirportKm: 9.2, tier: "budget", pricePerNight: 25, mealPlan: "room_only",
      amenities: ["Free WiFi"], rating: 3.8, order: 4,
      note: "Simpler guesthouses in the historic Piassa district, closer to Merkato and local life." },
    { name: "Mosaique Lalibela Hotel", city: "Lalibela", address: "Near the church complex", latitude: 12.0300, longitude: 39.0450, distanceFromAirportKm: 22, tier: "mid", pricePerNight: 55, mealPlan: "half_board",
      amenities: ["Valley views", "Restaurant on-site"], rating: 4.3, order: 1,
      note: "Popular with travelers for its views over the valley and proximity to the rock churches." },
    { name: "Goha Hotel", city: "Gondar", address: "Hilltop above the city centre", latitude: 12.6000, longitude: 37.4600, distanceFromAirportKm: 18, tier: "mid", pricePerNight: 60, mealPlan: "breakfast",
      amenities: ["Panoramic views", "Restaurant"], rating: 4.2, order: 1,
      note: "Perched on a hill above the city with sweeping views — a favourite sundowner spot even for non-guests." },
    { name: "Kuriftu Resort", city: "Bahir Dar", address: "Lake Tana shoreline", latitude: 11.5900, longitude: 37.3800, distanceFromAirportKm: 12, tier: "lux", pricePerNight: 130, mealPlan: "breakfast",
      amenities: ["Lake views", "Spa", "Private beach"], rating: 4.4, order: 1,
      note: "Lakeside resort chain, popular for a relaxed stop after trekking." },
    {
      name: "Ethiopian Skylight Hotel",
      city: "Addis Ababa",
      address: "Bole International Airport Road, Bole, P.O. Box 1755",
      latitude: 8.9897,
      longitude: 38.7993,
      distanceFromAirportKm: 0.5,
      tier: "lux",
      pricePerNight: 180,
      mealPlan: "breakfast",
      amenities: [
        "Free WiFi",
        "Indoor Pool",
        "Outdoor Pool",
        "Spa",
        "Fitness Center",
        "Free Airport Shuttle",
        "7 Restaurants",
        "Bar",
        "Free Parking"
      ],
      rating: 4.7,
      order: 2,
      note: "Modern five-star hotel operated by Ethiopian Airlines, located adjacent to Addis Ababa Bole International Airport. Popular for transit stays, business travelers, and its complimentary airport shuttle."
    },
  ];
  for (const h of hotels) {
    const existing = await prisma.hotel.findFirst({ where: { name: h.name } });
    if (existing) {
      await prisma.hotel.update({ where: { id: existing.id }, data: h });
    } else {
      await prisma.hotel.create({ data: h });
    }
  }

  // --- Shopping places ---
  const places = [
    { name: "Tomoca Coffee - Piassa", category: "coffee", address: "Wavel Street, Piassa", city: "Addis Ababa", priceRange: "$",
      itemsAvailable: ["Roasted coffee beans", "Ground coffee", "Espresso"], openingHours: "7am–8pm daily",
      description: "The original branch of Ethiopia's best-known coffee roastery, in business since the 1950s. Sells packaged beans that travel well." },
    { name: "Shiro Meda Market", category: "textile", address: "Shiro Meda area", city: "Addis Ababa", priceRange: "$$",
      itemsAvailable: ["Netela shawls", "Habesha kemis fabric", "Handwoven cotton scarves"], openingHours: "Daily, mornings busiest",
      description: "The classic destination for handwoven cotton clothing and traditional scarves, with workshops nearby." },
    { name: "Shiro Meda Leather Workshops", category: "leather", address: "Shiro Meda area", city: "Addis Ababa", priceRange: "$$",
      itemsAvailable: ["Leather bags", "Belts", "Sandals"], openingHours: "Daily",
      description: "Workshops clustered around Shiro Meda known for leather bags, belts, and shoes made on-site." },
    { name: "Merkato", category: "market", address: "Merkato district", city: "Addis Ababa", priceRange: "$",
      itemsAvailable: ["Spices", "Textiles", "Household goods", "Coffee"], openingHours: "Daily, avoid after dark",
      description: "One of the largest open-air markets in Africa — extraordinary prices, but go with a local guide or trusted driver." },
  ];
  for (const p of places) {
    const existing = await prisma.shopPlace.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.shopPlace.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.shopPlace.create({ data: p });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
