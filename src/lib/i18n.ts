// Lightweight, dependency-free i18n. Covers UI chrome (nav, buttons, labels,
// footer) in each supported language. Content entered through the admin
// dashboard (destination descriptions, hotel notes, etc.) stays in whatever
// language the admin writes it in — translating user-generated content is a
// separate, larger feature (see README "Next steps").

export const LOCALES = ["en", "am", "fr", "zh", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  am: "አማርኛ",
  fr: "Français",
  zh: "中文",
  ar: "العربية",
};

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.gallery": "Gallery",
  "nav.destinations": "Destinations",
  "nav.hotels": "Stay",
  "nav.shopping": "Shop",
  "nav.connect": "Connect",
  "hero.eyebrow": "13 months of sunshine",
  "hero.title": "The cradle of humankind, still telling its own story.",
  "hero.lede": "Rock-hewn churches, ancient obelisks, coffee born in its highlands, and people eager to show you around.",
  "hero.cta.destinations": "Explore destinations",
  "hero.cta.connect": "Find a local guide",
  "footer.tagline": "Content managed from the admin dashboard.",
  "common.readMore": "Read more",
  "common.viewAll": "View all",
  "common.night": "night",
  "common.from": "from",
  "hotels.mealplan.room_only": "Room only",
  "hotels.mealplan.breakfast": "Breakfast included",
  "hotels.mealplan.half_board": "Half board",
  "hotels.mealplan.full_board": "Full board",
  "hotels.tier.budget": "Budget",
  "hotels.tier.mid": "Mid-range",
  "hotels.tier.lux": "Luxury",
  "connect.title": "Connect with locals & fellow travelers",
  "connect.subtitle": "A public board — local guides and hosts can offer to help, and travelers can find each other to explore together.",
};

const am: Dict = {
  "nav.home": "መነሻ",
  "nav.gallery": "ማዕከለ-ስዕላት",
  "nav.destinations": "መዳረሻዎች",
  "nav.hotels": "ማረፊያ",
  "nav.shopping": "ግብይት",
  "nav.connect": "ይገናኙ",
  "hero.eyebrow": "የ13 ወራት ፀሐይ",
  "hero.title": "የሰው ልጅ መገኛ፣ አሁንም የራሷን ታሪክ የምትተርክ ሀገር።",
  "hero.lede": "ከድንጋይ የተፈለፈሉ አብያተ ክርስቲያናት፣ ጥንታዊ ሐውልቶች፣ በደጋማ ቦታዎቿ የተወለደ ቡና፣ እና ሊያስጎበኙዎት ዝግጁ የሆኑ ሰዎች።",
  "hero.cta.destinations": "መዳረሻዎችን ይመልከቱ",
  "hero.cta.connect": "የአካባቢ መሪ ያግኙ",
  "footer.tagline": "ይዘቱ ከአስተዳደር ዳሽቦርድ ይተዳደራል።",
  "common.readMore": "ተጨማሪ ያንብቡ",
  "common.viewAll": "ሁሉንም ይመልከቱ",
  "common.night": "ሌሊት",
  "common.from": "ከ",
  "hotels.mealplan.room_only": "ክፍል ብቻ",
  "hotels.mealplan.breakfast": "ቁርስ ተካትቷል",
  "hotels.mealplan.half_board": "ግማሽ ምግብ",
  "hotels.mealplan.full_board": "ሙሉ ምግብ",
  "hotels.tier.budget": "ኢኮኖሚ",
  "hotels.tier.mid": "መካከለኛ",
  "hotels.tier.lux": "የቅንጦት",
  "connect.title": "ከአካባቢው ሰዎች እና ተጓዦች ጋር ይገናኙ",
  "connect.subtitle": "የአካባቢ መሪዎች እርዳታ የሚያቀርቡበት፣ ተጓዦችም አብረው ለመጓዝ የሚገናኙበት ይፋዊ ሰሌዳ።",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.gallery": "Galerie",
  "nav.destinations": "Destinations",
  "nav.hotels": "Séjour",
  "nav.shopping": "Boutiques",
  "nav.connect": "Connexion",
  "hero.eyebrow": "13 mois de soleil",
  "hero.title": "Le berceau de l'humanité, qui écrit encore sa propre histoire.",
  "hero.lede": "Des églises taillées dans la roche, d'anciens obélisques, un café né dans ses hauts plateaux, et des habitants prêts à vous faire découvrir leur pays.",
  "hero.cta.destinations": "Explorer les destinations",
  "hero.cta.connect": "Trouver un guide local",
  "footer.tagline": "Contenu géré depuis le tableau de bord d'administration.",
  "common.readMore": "Lire la suite",
  "common.viewAll": "Voir tout",
  "common.night": "nuit",
  "common.from": "à partir de",
  "hotels.mealplan.room_only": "Chambre seule",
  "hotels.mealplan.breakfast": "Petit-déjeuner inclus",
  "hotels.mealplan.half_board": "Demi-pension",
  "hotels.mealplan.full_board": "Pension complète",
  "hotels.tier.budget": "Économique",
  "hotels.tier.mid": "Milieu de gamme",
  "hotels.tier.lux": "Luxe",
  "connect.title": "Connectez-vous avec des locaux et d'autres voyageurs",
  "connect.subtitle": "Un espace public — guides et hôtes locaux proposent leur aide, et les voyageurs se retrouvent pour explorer ensemble.",
};

const zh: Dict = {
  "nav.home": "首页",
  "nav.gallery": "图库",
  "nav.destinations": "目的地",
  "nav.hotels": "住宿",
  "nav.shopping": "购物",
  "nav.connect": "社区连接",
  "hero.eyebrow": "阳光普照的十三个月",
  "hero.title": "人类的摇篮，至今仍在讲述自己的故事。",
  "hero.lede": "凿岩而建的教堂、古老的方尖碑、诞生于高原的咖啡，还有热情愿意带你游览的当地人。",
  "hero.cta.destinations": "探索目的地",
  "hero.cta.connect": "寻找当地向导",
  "footer.tagline": "内容由管理后台统一管理。",
  "common.readMore": "阅读更多",
  "common.viewAll": "查看全部",
  "common.night": "晚",
  "common.from": "起",
  "hotels.mealplan.room_only": "仅含房间",
  "hotels.mealplan.breakfast": "含早餐",
  "hotels.mealplan.half_board": "半食宿",
  "hotels.mealplan.full_board": "全食宿",
  "hotels.tier.budget": "经济型",
  "hotels.tier.mid": "中档",
  "hotels.tier.lux": "豪华",
  "connect.title": "与当地人和其他旅行者建立联系",
  "connect.subtitle": "一个公开的留言板——当地向导和房东可以提供帮助，旅行者也可以在这里结伴同行。",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.gallery": "معرض الصور",
  "nav.destinations": "الوجهات",
  "nav.hotels": "الإقامة",
  "nav.shopping": "التسوق",
  "nav.connect": "تواصل",
  "hero.eyebrow": "13 شهرًا من أشعة الشمس",
  "hero.title": "مهد البشرية، ما زالت تروي قصتها الخاصة.",
  "hero.lede": "كنائس منحوتة في الصخر، ومسلات قديمة، وقهوة وُلدت في مرتفعاتها، وأناس متحمسون لاصطحابك في جولة.",
  "hero.cta.destinations": "استكشف الوجهات",
  "hero.cta.connect": "ابحث عن مرشد محلي",
  "footer.tagline": "المحتوى تتم إدارته من لوحة التحكم.",
  "common.readMore": "اقرأ المزيد",
  "common.viewAll": "عرض الكل",
  "common.night": "ليلة",
  "common.from": "ابتداءً من",
  "hotels.mealplan.room_only": "غرفة فقط",
  "hotels.mealplan.breakfast": "شامل الإفطار",
  "hotels.mealplan.half_board": "نصف إقامة",
  "hotels.mealplan.full_board": "إقامة كاملة",
  "hotels.tier.budget": "اقتصادي",
  "hotels.tier.mid": "متوسط",
  "hotels.tier.lux": "فاخر",
  "connect.title": "تواصل مع السكان المحليين والمسافرين الآخرين",
  "connect.subtitle": "لوحة عامة — يقدم فيها المرشدون والمضيفون المحليون المساعدة، ويجد فيها المسافرون بعضهم البعض لاستكشاف الوجهات معًا.",
};

const DICTS: Record<Locale, Dict> = { en, am, fr, zh, ar };

export function getDictionary(locale: Locale): Dict {
  return DICTS[locale] || en;
}

export function t(locale: Locale, key: string): string {
  return DICTS[locale]?.[key] ?? en[key] ?? key;
}

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
