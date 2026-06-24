const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const getPath = (fileName) => path.join(DATA_DIR, fileName);

// Define MongoDB Schemas
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  sizes: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  description: { type: String },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  inStock: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, default: 'customer' },
  walletBalance: { type: Number, default: 5000 },
  walletTransactions: { type: Array, default: [] }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: { type: Array, default: [] },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  shippingAddress: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String, required: true },
  paymentStatus: { type: String, default: 'Paid' }
});

const CouponSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, default: 0 },
  freeShipping: { type: Boolean, default: false },
  minPurchase: { type: Number, default: 0 },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true }
});

const ReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  reviewsList: { type: Array, default: [] }
});

// Compile Models
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Initial Seed Data
const SEED_PRODUCTS = [
  {
    id: "1",
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
    salesCount: 45
  },
  {
    id: "2",
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
    inStock: 3,
    salesCount: 68
  },
  {
    id: "3",
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
    id: "4",
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
    id: "5",
    title: "Cargo Streetwear Joggers",
    price: 1999,
    originalPrice: 2799,
    category: "streetwear",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Khaki", "Army Green"],
    description: "Utility meets style. These relaxed joggers are constructed from durable stretch cotton twill, featuring side cargo pockets, an elastic waist with drawcord, and ribbed cuffs.",
    specs: {
      Material: "98% Cotton, 2% Spandex",
      Fit: "Relaxed Jogger Fit",
      Pockets: "Two hand pockets, two cargo pockets, one back pocket",
      Care: "Wash cold inside out"
    },
    rating: 4.5,
    reviewsCount: 29,
    featured: false,
    inStock: 18,
    salesCount: 14
  }
];

const SEED_COUPONS = [
  {
    id: "c1",
    code: "WELCOME10",
    discountPercent: 10,
    freeShipping: false,
    minPurchase: 999,
    startDate: "2026-06-01",
    endDate: "2027-06-01"
  },
  {
    id: "c2",
    code: "FASHION20",
    discountPercent: 20,
    freeShipping: false,
    minPurchase: 1999,
    startDate: "2026-06-01",
    endDate: "2027-06-01"
  },
  {
    id: "c3",
    code: "FREESHIP",
    discountPercent: 0,
    freeShipping: true,
    minPurchase: 1499,
    startDate: "2026-06-01",
    endDate: "2027-06-01"
  }
];

const SEED_USERS = [
  {
    id: "u_admin",
    name: "Owner Admin",
    phone: "9999999999",
    email: "admin@a1fashion.in",
    role: "admin",
    walletBalance: 5000,
    walletTransactions: [{ date: "24/06/2026", desc: "Welcome Bonus", amount: 5000, type: "credit" }]
  }
];

// Memory Cache Variables
let cachedProducts = [];
let cachedUsers = [];
let cachedOrders = [];
let cachedCoupons = [];
let cachedReviews = {};

// Fallback status indicator
let isUsingLocalJsonDb = false;

// Local JSON file database initializer (for fallback or local offline development)
const initializeJsonDb = () => {
  isUsingLocalJsonDb = true;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(getPath('products.json'))) {
    fs.writeFileSync(getPath('products.json'), JSON.stringify(SEED_PRODUCTS, null, 2));
  }
  if (!fs.existsSync(getPath('coupons.json'))) {
    fs.writeFileSync(getPath('coupons.json'), JSON.stringify(SEED_COUPONS, null, 2));
  }
  if (!fs.existsSync(getPath('users.json'))) {
    fs.writeFileSync(getPath('users.json'), JSON.stringify(SEED_USERS, null, 2));
  }
  if (!fs.existsSync(getPath('orders.json'))) {
    fs.writeFileSync(getPath('orders.json'), JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(getPath('reviews.json'))) {
    fs.writeFileSync(getPath('reviews.json'), JSON.stringify({}, null, 2));
  }

  // Load files content into cache
  cachedProducts = JSON.parse(fs.readFileSync(getPath('products.json'), 'utf-8'));
  cachedUsers = JSON.parse(fs.readFileSync(getPath('users.json'), 'utf-8'));
  cachedCoupons = JSON.parse(fs.readFileSync(getPath('coupons.json'), 'utf-8'));
  cachedOrders = JSON.parse(fs.readFileSync(getPath('orders.json'), 'utf-8'));
  cachedReviews = JSON.parse(fs.readFileSync(getPath('reviews.json'), 'utf-8'));

  console.log("📂 Local JSON Database Initialized Successfully!");
};

// connectDB establishing connection and loading data into cache
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
    console.warn("⚠️ No live MongoDB Atlas connection URI provided. Using local JSON files.");
    initializeJsonDb();
    return;
  }

  try {
    console.log(`Connecting to MongoDB Atlas...`);
    // Connect with a 4s timeout to quickly fallback to local files if offline
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log("MongoDB Connected Successfully!");

    // 1. Seed Products if empty
    let dbProducts = await Product.find({});
    if (dbProducts.length === 0) {
      console.log("Seeding initial products to MongoDB...");
      await Product.insertMany(SEED_PRODUCTS);
      dbProducts = await Product.find({});
    }
    cachedProducts = dbProducts.map(p => p.toObject());

    // 2. Seed Users if empty
    let dbUsers = await User.find({});
    if (dbUsers.length === 0) {
      console.log("Seeding initial users to MongoDB...");
      await User.insertMany(SEED_USERS);
      dbUsers = await User.find({});
    }
    cachedUsers = dbUsers.map(u => u.toObject());

    // 3. Seed Coupons if empty
    let dbCoupons = await Coupon.find({});
    if (dbCoupons.length === 0) {
      console.log("Seeding initial coupons to MongoDB...");
      await Coupon.insertMany(SEED_COUPONS);
      dbCoupons = await Coupon.find({});
    }
    cachedCoupons = dbCoupons.map(c => c.toObject());

    // 4. Load Orders
    const dbOrders = await Order.find({});
    cachedOrders = dbOrders.map(o => o.toObject());

    // 5. Load Reviews
    const dbReviews = await Review.find({});
    cachedReviews = {};
    dbReviews.forEach(r => {
      cachedReviews[r.productId] = r.reviewsList;
    });

    console.log("Database Cache Initialized Successfully from MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.warn("⚠️ Falling back to local JSON file database for local development.");
    initializeJsonDb();
  }
};

module.exports = {
  connectDB,
  readProducts: () => cachedProducts,
  writeProducts: (data) => {
    cachedProducts = data;
    if (isUsingLocalJsonDb) {
      fs.writeFileSync(getPath('products.json'), JSON.stringify(data, null, 2));
    } else {
      Product.deleteMany({})
        .then(() => Product.insertMany(data))
        .catch(err => console.error("MongoDB Products Sync Failed:", err.message));
    }
  },
  readUsers: () => cachedUsers,
  writeUsers: (data) => {
    cachedUsers = data;
    if (isUsingLocalJsonDb) {
      fs.writeFileSync(getPath('users.json'), JSON.stringify(data, null, 2));
    } else {
      User.deleteMany({})
        .then(() => User.insertMany(data))
        .catch(err => console.error("MongoDB Users Sync Failed:", err.message));
    }
  },
  readOrders: () => cachedOrders,
  writeOrders: (data) => {
    cachedOrders = data;
    if (isUsingLocalJsonDb) {
      fs.writeFileSync(getPath('orders.json'), JSON.stringify(data, null, 2));
    } else {
      Order.deleteMany({})
        .then(() => Order.insertMany(data))
        .catch(err => console.error("MongoDB Orders Sync Failed:", err.message));
    }
  },
  readCoupons: () => cachedCoupons,
  writeCoupons: (data) => {
    cachedCoupons = data;
    if (isUsingLocalJsonDb) {
      fs.writeFileSync(getPath('coupons.json'), JSON.stringify(data, null, 2));
    } else {
      Coupon.deleteMany({})
        .then(() => Coupon.insertMany(data))
        .catch(err => console.error("MongoDB Coupons Sync Failed:", err.message));
    }
  },
  readReviews: () => cachedReviews,
  writeReviews: (data) => {
    cachedReviews = data;
    if (isUsingLocalJsonDb) {
      fs.writeFileSync(getPath('reviews.json'), JSON.stringify(data, null, 2));
    } else {
      const docs = Object.keys(data).map(productId => ({
        productId,
        reviewsList: data[productId]
      }));
      Review.deleteMany({})
        .then(() => Review.insertMany(docs))
        .catch(err => console.error("MongoDB Reviews Sync Failed:", err.message));
    }
  }
};
