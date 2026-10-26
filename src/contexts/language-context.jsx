import { createContext, useContext, useEffect, useState } from "react";

const text = {
  en: {
    // Navigation and language selector
    mainNavigation: "Main navigation",
    mobileNavigation: "Mobile navigation",
    home: "Home",
    store: "Store",
    materials: "Materials",
    about: "About",
    aboutAccent: "Us",
    aboutUs: "About Us",
    contact: "Contact",
    contactUs: "Contact Us",
    us: "Us",
    shop: "Shop",
    english: "English",
    arabic: "العربية",
    inquiryList: "Inquiry List",
    menu: "Menu",
    wishlist: "Wishlist",
    profile: "Profile",

    // Footer
    footerDescription:
      "Thoughtful furniture for calm, comfortable and beautiful everyday living.",
    footerStartInquiry: "Start an inquiry",
    footerExplore: "Explore",
    footerContact: "Get in touch",
    footerRights: "Made for living beautifully.",

    // Search
    search: "Search",
    searchFurniture: "Search furniture...",
    searchProducts: "Search products",
    openSearch: "Open search",

    // Hero
    heroImageAlt: "FurniCasa modern living room furniture",
    heroKicker: "PREMIUM FURNITURE",
    heroTitle: "Furniture for Modern Living",
    heroFurniture: "Furniture",
    heroFor: "for",
    heroModernLiving: "Modern Living",
    heroDescription:
      "Discover high-quality furniture that brings comfort, style, and functionality to your home.",
    shopNow: "Shop Now",
    exploreCollection: "Explore Collection",

    // Status bar
    statusHighlights: "FurniCasa highlights",
    happyCustomers: "Happy Customers",
    premiumProducts: "Premium Products",
    citiesDelivery: "Cities Delivery",
    customerRating: "Customer Rating",

    // Categories
    shopByCategory: "Shop by Category",
    categoryDescription: "Explore our furniture collection for every room.",
    seeAll: "See All",
    rotateCategoryArrow: "Rotate category arrow",
    sofas: "Sofas",
    beds: "Beds",
    diningSets: "Dining Sets",
    storage: "Storage",
    loungeChairs: "Lounge Chairs",
    coffeeTables: "Coffee Tables",
    bookshelves: "Bookshelves",
    officeFurniture: "Office Furniture",

    // Store banner, filters, and products
    our: "Our",
    storeKicker: "EXPLORE OUR COLLECTION",
    storeDescription:
      "Explore our curated furniture collection, thoughtfully designed to bring comfort and warmth to every room.",
    furnitureCategories: "Furniture categories",
    filterAll: "All",
    filterSofas: "Sofas",
    filterBeds: "Beds",
    filterDining: "Dining",
    filterStorage: "Storage",
    filterChairs: "Chairs",
    filterTables: "Tables",
    filterOutdoor: "Outdoor",
    productModernSofa: "Modern Sofa",
    productLoungeChair: "Lounge Chair",
    productDiningTable: "Wooden Dining Table",
    productComfortBed: "Comfort Bed",
    productWoodenCabinet: "Wooden Cabinet",
    productBookshelf: "Bookshelf",
    productCoffeeTable: "Coffee Table",
    productOfficeChair: "Office Chair",
    noProductsFound: "No products found.",
    loadingProducts: "Loading products...",
    loadingCategories: "Loading categories...",
    noCategoriesFound: "No categories are currently available.",
    loadingMaterials: "Loading materials...",
    noMaterialsFound: "No materials are currently available.",
    imageUnavailable: "Image unavailable",
    addToInquiry: "Add to inquiry",
    removeFromInquiry: "Remove from inquiry",

    // Inquiry
    inquiryTitle: "Product Inquiry",
    inquiryEmpty: "Your inquiry list is empty.",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    remove: "Remove",
    inquiryTotal: "Inquiry Total",
    continueBrowsing: "Continue Browsing",
    inquireViaWhatsApp: "Inquire via WhatsApp",
    whatsappMessageIntro: "Hello, I would like to inquire about:",
    whatsappEstimatedTotal: "Estimated total",

    // Materials
    materialsDescription:
      "From responsibly sourced wood to durable metals and soft, lasting fabrics, every material is chosen for its quality, everyday comfort, and timeless beauty—so your furniture feels as good for years as it does today.",
    sustainableEcoFriendly: "Sustainable & Eco-Friendly",
    sustainableDescription:
      "We care for your home and the planet by using responsibly sourced materials.",
    builtToLast: "Built to Last",
    builtToLastDescription:
      "Premium materials ensure strength, comfort and long-lasting quality.",
    solidWood: "Solid Wood",
    solidWoodDescription: "Strong, durable and timeless natural beauty.",
    engineeredWood: "Engineered Wood",
    engineeredWoodDescription: "Cost-effective and stable for modern living.",
    metal: "Metal",
    metalDescription: "Adds strength and a modern touch.",
    fabricLeather: "Fabric & Leather",
    fabricLeatherDescription: "Comfortable, stylish and easy to maintain.",

    // Contact
    contactDescription:
      "We’d love to hear from you. Get in touch for inquiries, support, or custom orders.",
    aboutDescription:
      "At FurniCasa, we bring comfort, quality, and modern design together to help every home feel warm, calm, and truly yours.",
    aboutStoryKicker: "THE FURNICASA PROMISE",
    aboutStoryTitle: "Made to feel like home",
    aboutStoryDescription:
      "We believe furniture should do more than fill a room. Every FurniCasa piece brings together honest materials, comfortable forms and lasting details for spaces you will love living in.",
    aboutStoryNote: "Comfort, character and quality in every corner.",
    thoughtfulDesign: "Thoughtful Design",
    thoughtfulDesignDescription:
      "Timeless pieces designed to make everyday spaces feel comfortable and considered.",
    qualityFirst: "Quality First",
    qualityFirstDescription:
      "Carefully selected materials and dependable craftsmanship made for daily living.",
    madeForLiving: "Made for Living",
    madeForLivingDescription:
      "Warm, practical details that help every room feel welcoming and easy to enjoy.",
    ourLocation: "Our Location",
    contactAddress: "123 Furniture Street, Lahore, Pakistan",
    emailUs: "Email Us",
    contactEmail: "support@furnicasa.com",
    callUs: "Call Us",
    contactPhone: "+92 300 1234567",
    workingHours: "Working Hours",
    workingHoursTime: "Mon - Sat: 9:00 AM - 7:00 PM",
    sendUsMessage: "Send us a Message",
    yourName: "Your Name",
    yourEmail: "Your Email",
    subject: "Subject",
    yourMessage: "Your Message",
    sendMessage: "Send Message",
  },

  ar: {
    // Navigation and language selector
    mainNavigation: "التنقل الرئيسي",
    mobileNavigation: "التنقل عبر الهاتف",
    home: "الرئيسية",
    store: "المتجر",
    materials: "المواد",
    about: "عن",
    aboutAccent: "نحن",
    aboutUs: "من نحن",
    contact: "اتصل",
    contactUs: "اتصل بنا",
    us: "بنا",
    shop: "تسوّق",
    english: "English",
    arabic: "العربية",
    inquiryList: "قائمة الاستفسارات",
    menu: "القائمة",
    wishlist: "قائمة الأمنيات",
    profile: "الملف الشخصي",

    // Footer
    footerDescription:
      "أثاث مدروس لحياة يومية هادئة ومريحة وجميلة.",
    footerStartInquiry: "ابدأ استفسارك",
    footerExplore: "استكشف",
    footerContact: "تواصل معنا",
    footerRights: "مصمم لحياة أجمل.",

    // Search
    search: "بحث",
    searchFurniture: "ابحث عن الأثاث...",
    searchProducts: "ابحث عن المنتجات",
    openSearch: "فتح البحث",

    // Hero
    heroImageAlt: "أثاث غرفة معيشة عصري من فورني كاسا",
    heroKicker: "أثاث فاخر",
    heroTitle: "أثاث لحياة عصرية",
    heroFurniture: "أثاث",
    heroFor: "لحياة",
    heroModernLiving: "عصرية",
    heroDescription:
      "اكتشف أثاثًا عالي الجودة يجمع بين الراحة والأناقة والعملية ليمنح منزلك أجواءً مميزة.",
    shopNow: "تسوّق الآن",
    exploreCollection: "اكتشف المجموعة",

    // Status bar
    statusHighlights: "مميزات فورني كاسا",
    happyCustomers: "عملاء سعداء",
    premiumProducts: "منتجات فاخرة",
    citiesDelivery: "مدن نوصل إليها",
    customerRating: "تقييم العملاء",

    // Categories
    shopByCategory: "تسوّق حسب الفئة",
    categoryDescription: "اكتشف مجموعتنا من الأثاث لكل غرفة.",
    seeAll: "عرض الكل",
    rotateCategoryArrow: "تدوير سهم الفئة",
    sofas: "أرائك",
    beds: "أسرّة",
    diningSets: "أطقم طعام",
    storage: "وحدات تخزين",
    loungeChairs: "كراسي استرخاء",
    coffeeTables: "طاولات قهوة",
    bookshelves: "أرفف كتب",
    officeFurniture: "أثاث مكتبي",

    // Store banner, filters, and products
    our: "",
    storeKicker: "اكتشف مجموعتنا",
    storeDescription:
      "تصفّح مجموعتنا المختارة من الأثاث، المصممة بعناية لتمنح كل غرفة الراحة والدفء.",
    furnitureCategories: "فئات الأثاث",
    filterAll: "الكل",
    filterSofas: "أرائك",
    filterBeds: "أسرّة",
    filterDining: "طعام",
    filterStorage: "تخزين",
    filterChairs: "كراسي",
    filterTables: "طاولات",
    filterOutdoor: "خارجي",
    productModernSofa: "أريكة عصرية",
    productLoungeChair: "كرسي استرخاء",
    productDiningTable: "طاولة طعام خشبية",
    productComfortBed: "سرير مريح",
    productWoodenCabinet: "خزانة خشبية",
    productBookshelf: "رف كتب",
    productCoffeeTable: "طاولة قهوة",
    productOfficeChair: "كرسي مكتب",
    noProductsFound: "لم يتم العثور على منتجات.",
    loadingProducts: "جارٍ تحميل المنتجات...",
    loadingCategories: "جارٍ تحميل الفئات...",
    noCategoriesFound: "لا توجد فئات متاحة حاليًا.",
    loadingMaterials: "جارٍ تحميل المواد...",
    noMaterialsFound: "لا توجد مواد متاحة حاليًا.",
    imageUnavailable: "الصورة غير متاحة",
    addToInquiry: "أضف للاستفسار",
    removeFromInquiry: "إزالة من الاستفسار",

    // Inquiry
    inquiryTitle: "استفسار عن المنتجات",
    inquiryEmpty: "قائمة الاستفسارات فارغة.",
    decreaseQuantity: "تقليل الكمية",
    increaseQuantity: "زيادة الكمية",
    remove: "إزالة",
    inquiryTotal: "إجمالي الاستفسار",
    continueBrowsing: "متابعة التصفح",
    inquireViaWhatsApp: "استفسر عبر واتساب",
    whatsappMessageIntro: "مرحبًا، أود الاستفسار عن:",
    whatsappEstimatedTotal: "الإجمالي التقديري",

    // Materials
    materialsDescription:
      "من الأخشاب المستدامة إلى المعادن المتينة والأقمشة الناعمة، نختار كل مادة بعناية لجودتها وراحتها اليومية وجمالها الذي يدوم.",
    sustainableEcoFriendly: "مستدام وصديق للبيئة",
    sustainableDescription:
      "نهتم بمنزلك وبكوكبنا، لذلك نستخدم مواد من مصادر مسؤولة.",
    builtToLast: "جودة تدوم",
    builtToLastDescription:
      "تضمن موادنا الفاخرة المتانة والراحة والجودة طويلة الأمد.",
    solidWood: "خشب طبيعي",
    solidWoodDescription: "قوي ومتين بجمال طبيعي يدوم.",
    engineeredWood: "خشب هندسي",
    engineeredWoodDescription: "عملي وثابت ومناسب للحياة العصرية.",
    metal: "معدن",
    metalDescription: "يمنح الأثاث المتانة والطابع العصري.",
    fabricLeather: "قماش وجلد",
    fabricLeatherDescription: "مريح وأنيق وسهل العناية.",

    // Contact
    contactDescription:
      "يسعدنا التواصل معك. راسلنا للاستفسارات أو الدعم أو الطلبات الخاصة.",
    aboutDescription:
      "في فورني كاسا، نجمع بين الراحة والجودة والتصميم العصري لنمنح كل منزل أجواءً دافئة وهادئة تشبهك.",
    aboutStoryKicker: "وعد فورني كاسا",
    aboutStoryTitle: "مصمم ليشبه منزلك",
    aboutStoryDescription:
      "نؤمن بأن الأثاث يجب أن يكون أكثر من مجرد قطع تملأ الغرفة. تجمع كل قطعة من فورني كاسا بين المواد الصادقة والأشكال المريحة والتفاصيل التي تدوم.",
    aboutStoryNote: "راحة وشخصية وجودة في كل زاوية.",
    thoughtfulDesign: "تصميم مدروس",
    thoughtfulDesignDescription:
      "قطع خالدة مصممة لتمنح المساحات اليومية راحة وأناقة متوازنة.",
    qualityFirst: "الجودة أولًا",
    qualityFirstDescription:
      "مواد مختارة بعناية وحرفية موثوقة تناسب الاستخدام اليومي.",
    madeForLiving: "مصمم للحياة",
    madeForLivingDescription:
      "تفاصيل عملية ودافئة تجعل كل غرفة أكثر ترحيبًا وسهولة للاستمتاع.",
    ourLocation: "موقعنا",
    contactAddress: "123 شارع الأثاث، لاهور، باكستان",
    emailUs: "راسلنا",
    contactEmail: "support@furnicasa.com",
    callUs: "اتصل بنا",
    contactPhone: "+92 300 1234567",
    workingHours: "ساعات العمل",
    workingHoursTime: "الإثنين - السبت: 9:00 ص - 7:00 م",
    sendUsMessage: "أرسل لنا رسالة",
    yourName: "اسمك",
    yourEmail: "بريدك الإلكتروني",
    subject: "الموضوع",
    yourMessage: "رسالتك",
    sendMessage: "إرسال الرسالة",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem("furnicasa-language");

      if (savedLanguage === "en" || savedLanguage === "ar") {
        setLanguage(savedLanguage);
      }
    } catch {
      // Keep English as the safe fallback when browser storage is unavailable.
    } finally {
      setLanguageReady(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!languageReady) return;

    try {
      window.localStorage.setItem("furnicasa-language", language);
    } catch {
      // The selected language still works for the current page if storage fails.
    }
  }, [language, languageReady]);

  const translate = (key, targetLanguage = language) =>
    text[targetLanguage]?.[key] ?? text.en[key] ?? key;

  const t = (key) => translate(key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
