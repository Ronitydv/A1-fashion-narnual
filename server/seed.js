require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const SEED_PRODUCTS = [
  {
    title: "A1 Signature Denim Jacket",
    price: 2499,
    originalPrice: 3499,
    category: "streetwear",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Classic Blue", "Midnight Black"],
    description: "Crafted from heavy-duty, premium cotton denim, this signature jacket features custom steel buttons, chest flap pockets, and a timeless relaxed fit. The perfect layer for a classic, masculine silhouette.",
    specs: {
      Material: "100% Rigid Premium Cotton Denim",
      Fit: "Relaxed Classic Fit",
      Wash: "Medium indigo wash with hand scraping",
      Care: "Machine wash cold inside out, tumble dry low"
    },
    rating: 4.8,
    reviewsCount: 24,
    featured: true,
    inStock: 15,
    salesCount: 45 // Seeded high sales for bestseller status
  },
  {
    title: "Oversized Premium Hoodie",
    price: 1899,
    originalPrice: 2499,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80",
    sizes: ["M", "L", "XL"],
    colors: ["Charcoal Grey", "Olive Green", "Sand Beige"],
    description: "Elevate your lounge style with this heavyweight fleece hoodie. Featuring dropped shoulders, a double-lined hood without drawcords for a clean aesthetic, and rib-knit cuffs and hem.",
    specs: {
      Material: "80% Cotton, 20% Polyester Heavyweight Fleece (400 GSM)",
      Fit: "Oversized Fit",
      Details: "Kangaroo pocket, double-layered hood",
      Care: "Cold wash with like colors"
    },
    rating: 4.7,
    reviewsCount: 38,
    featured: true,
    inStock: 3, // Low stock triggers front-end warning banner
    salesCount: 68 // Top bestseller
  },
  {
    title: "Slim-Fit Structured Blazer",
    price: 4599,
    originalPrice: 5999,
    category: "suits",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    sizes: ["M", "L", "XL"],
    colors: ["Navy Blue", "Deep Black"],
    description: "A sharp, modern blazer tailored for a modern fit. Featuring notch lapels, double back vents, and a partially lined interior for lightweight structure. Transition from board meetings to evening dinners seamlessly.",
    specs: {
      Material: "70% Wool, 30% Polyester",
      Fit: "Slim / Structured Fit",
      Pockets: "Two patch pockets, one welt chest pocket, inner slip pocket",
      Care: "Dry clean only"
    },
    rating: 4.9,
    reviewsCount: 16,
    featured: true,
    inStock: 8,
    salesCount: 12
  },
  {
    title: "Classic Oxford Cotton Shirt",
    price: 1499,
    originalPrice: 1999,
    category: "shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Classic White", "Light Blue", "Pink"],
    description: "An absolute wardrobe essential, this Oxford shirt is spun from long-staple cotton for durability and softness. Finished with a button-down collar, box pleat at the back, and a chest pocket.",
    specs: {
      Material: "100% Oxford Cotton",
      Fit: "Regular Fit",
      Collar: "Button-down",
      Care: "Machine wash warm, iron if needed"
    },
    rating: 4.6,
    reviewsCount: 42,
    featured: false,
    inStock: 50,
    salesCount: 30
  },
  {
    title: "Cargo Streetwear Joggers",
    price: 1999,
    originalPrice: 2799,
    category: "streetwear",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    sizes: ["M", "L", "XL"],
    colors: ["Military Green", "Stealth Black"],
    description: "Merging utility with comfort, these cargo joggers are constructed from durable stretch-twill. Features multi-pocket details, elastic waistband with long drawstrings, and gathered ankle cuffs.",
    specs: {
      Material: "98% Cotton twill, 2% Elastane",
      Fit: "Tapered Utility Fit",
      Hardware: "Matte black snap-button pocket covers",
      Care: "Machine wash cold"
    },
    rating: 4.5,
    reviewsCount: 29,
    featured: true,
    inStock: 22,
    salesCount: 54 // High sales (bestseller)
  },
  {
    title: "Minimalist Leather Chelsea Boots",
    price: 3499,
    originalPrice: 4999,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80",
    sizes: ["S", "M", "L"],
    colors: ["Tobacco Suede", "Onyx Black Leather"],
    description: "These Chelsea boots are hand-fashioned from select split-suede leather. Featuring flexible elastic side panels, a rear pull tab, and a durable crepe sole for unmatched day-long comfort.",
    specs: {
      Material: "Genuine Suede Upper, Leather lining",
      Sole: "Crepe natural rubber sole",
      Style: "Chelsea boot with pull tab",
      Care: "Use suede brush and protector spray"
    },
    rating: 4.8,
    reviewsCount: 19,
    featured: false,
    inStock: 12,
    salesCount: 20
  },
  {
    title: "Tech-Wear Utility Windbreaker",
    price: 2799,
    originalPrice: 3999,
    category: "streetwear",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
    sizes: ["M", "L", "XL"],
    colors: ["Obsidian Black", "Cyberpunk Grey"],
    description: "Engineered to keep you dry and comfortable. This windbreaker is made from water-resistant ripstop nylon, featuring heat-sealed zippers, an adjustable toggle hood, and multiple hidden utility pockets.",
    specs: {
      Material: "100% Water-resistant Ripstop Nylon",
      Fit: "Modern Athleisure Fit",
      Features: "Reflective detailing, underarm ventilation eyelets",
      Care: "Machine wash cold, delicate cycle"
    },
    rating: 4.6,
    reviewsCount: 11,
    featured: false,
    inStock: 4, // Low stock warning
    salesCount: 9
  },
  {
    title: "Premium Linen Summer Shirt",
    price: 1799,
    originalPrice: 2299,
    category: "shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sand Beige", "Ocean Breeze Blue", "Sage Green"],
    description: "Woven from breathable French flax linen, this relaxed-fit shirt is pre-washed for extra softness. Features a camp collar and a clean French placket, ideal for tropical climates and seaside retreats.",
    specs: {
      Material: "100% Pure Flax Linen",
      Fit: "Relaxed Summer Fit",
      Collar: "Camp/Cuban Collar",
      Care: "Wash cold, hang dry (embrace the natural linen texture!)"
    },
    rating: 4.7,
    reviewsCount: 31,
    featured: true,
    inStock: 25,
    salesCount: 35
  }
];

const SEED_COUPONS = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    freeShipping: false,
    minPurchase: 0,
    startDate: "2026-06-01",
    endDate: "2027-06-01"
  },
  {
    code: "A1STYLE",
    discountPercent: 15,
    freeShipping: false,
    minPurchase: 1999,
    startDate: "2026-06-01",
    endDate: "2027-06-01"
  },
  {
    code: "FREESHIP",
    discountPercent: 0,
    freeShipping: true,
    minPurchase: 1499,
    startDate: "2026-06-01",
    endDate: "2027-06-01"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/a1_fashion');
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Existing data cleared.');

    // Seed default Admin
    const adminUser = await User.create({
      name: "Owner Admin",
      phone: "9999999999",
      email: "admin@a1fashion.in",
      role: "admin",
      walletBalance: 5000,
      walletTransactions: [{ desc: "Welcome Bonus", amount: 5000, type: "credit" }]
    });
    console.log(`Seeded Owner Admin (Phone: 9999999999, Role: ${adminUser.role})`);

    // Seed Products
    await Product.insertMany(SEED_PRODUCTS);
    console.log('Seeded 8 Men\'s catalog products successfully.');

    // Seed Coupons
    await Coupon.insertMany(SEED_COUPONS);
    console.log('Seeded default promo codes with date limits.');

    console.log('Seeding Database Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
