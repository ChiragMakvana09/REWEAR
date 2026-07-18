// Run with: node utils/seedContent.js
// Seeds categories, stories, how-it-works steps, home content, and sample products
// using free hotlinked demo images (no Cloudinary upload needed for seed data).
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Story = require("../models/Story");
const HowItWorksStep = require("../models/HowItWorksStep");
const HomeContent = require("../models/HomeContent");
const Product = require("../models/Product");

const CATEGORIES = [
  { name: "Denim", icon: "👖", description: "Jeans, jackets and everything indigo.", order: 1, img: "denimjacket" },
  { name: "Dresses", icon: "👗", description: "Day dresses to evening midis.", order: 2, img: "summerdress" },
  { name: "Outerwear", icon: "🧥", description: "Coats, blazers and wool knits.", order: 3, img: "wintercoat" },
  { name: "Accessories", icon: "👜", description: "Bags, belts and statement pieces.", order: 4, img: "vintageaccessories" },
  { name: "Tops", icon: "👚", description: "Shirts, blouses and tees.", order: 5, img: "whiteshirt,women" },
  { name: "Skirts", icon: "🩱", description: "Pleated, denim and midi skirts.", order: 6, img: "pleatedskirt" },
  { name: "Footwear", icon: "👟", description: "Sneakers, heels and boots.", order: 7, img: "sneakers,women" },
  { name: "Knitwear", icon: "🧶", description: "Cosy sweaters and cardigans.", order: 8, img: "knitsweater" },
  { name: "Ethnic Wear", icon: "🥻", description: "Kurtas, sarees and festive fits.", order: 9, img: "ethnicwear,fashion" },
  { name: "Activewear", icon: "🎽", description: "Gym and athleisure staples.", order: 10, img: "activewear,fashion" },
];

const STEPS = [
  { icon: "🔍", title: "Browse Products", description: "Explore hand-picked preloved pieces sorted by size, category and condition.", order: 1 },
  { icon: "🛒", title: "Add to Cart", description: "Save your favourites to cart and keep browsing at your own pace.", order: 2 },
  { icon: "🔒", title: "Secure Checkout", description: "Pay safely through Razorpay with instant order confirmation.", order: 3 },
  { icon: "📦", title: "Fast Shipping", description: "Every order is packed with care and shipped within 48 hours.", order: 4 },
  { icon: "🚚", title: "Delivery", description: "Track your parcel in real time until it reaches your doorstep.", order: 5 },
  { icon: "💬", title: "Customer Support", description: "Questions after delivery? Our team replies within a day.", order: 6 },
];

const STORIES = [
  { userName: "Ananya Shah", location: "Ahmedabad", title: "Vintage jacket, third of the price", description: "Found a denim jacket that looks straight out of a vintage store, for a third of the price.", rating: 5 },
  { userName: "Priya Mehta", location: "Surat", title: "Honest condition notes", description: "The condition notes are so honest, no surprises when the order arrived.", rating: 5 },
  { userName: "Meher Kaur", location: "Vadodara", title: "My go-to before buying new", description: "My go-to now before buying anything new. Better for the wallet and the planet.", rating: 4 },
  { userName: "Ritika Sharma", location: "Mumbai", title: "Fast delivery, great packaging", description: "The dress arrived in two days, beautifully folded with a little thank-you note.", rating: 5 },
  { userName: "Sana Iqbal", location: "Pune", title: "Better quality than expected", description: "Genuinely surprised by the fabric quality — didn't feel secondhand at all.", rating: 5 },
  { userName: "Divya Nair", location: "Bangalore", title: "Great for occasion wear", description: "Rented the idea of buying new for a wedding, found the perfect ethnic set here instead.", rating: 4 },
  { userName: "Kavya Reddy", location: "Hyderabad", title: "Kids won't stop asking me to reorder", description: "Bought thrifted tees for my niece, she loves them more than her new ones.", rating: 5 },
  { userName: "Neha Verma", location: "Delhi", title: "Sustainable and stylish", description: "Feels good to shop without adding to landfill. Win-win for style and the planet.", rating: 5 },
  { userName: "Ishita Roy", location: "Kolkata", title: "Customer support helped instantly", description: "Had a sizing doubt, support replied within an hour and helped me exchange.", rating: 4 },
  { userName: "Aarohi Joshi", location: "Jaipur", title: "My wardrobe's best kept secret", description: "Every friend asks where my outfit is from — I just say ReWear.", rating: 5 },
];

const PRODUCTS = [
  { title: "Rust Wool Blazer", category: "Outerwear", condition: "Like New", price: 899, originalPrice: 3400, size: "M", img: "vintageblazer", rating: 4.7, soldCount: 34 },
  { title: "Sage Floral Midi", category: "Dresses", condition: "Gently Used", price: 549, originalPrice: 1800, size: "S", img: "floraldress", rating: 4.5, soldCount: 21 },
  { title: "Straight Fit Denim", category: "Denim", condition: "Like New", price: 699, originalPrice: 2100, size: "32", img: "denimjeans", rating: 4.6, soldCount: 58 },
  { title: "Tan Leather Tote", category: "Accessories", condition: "Well Loved", price: 749, originalPrice: 2600, size: "One Size", img: "leatherbag", rating: 4.3, soldCount: 15 },
  { title: "Cream Cable Knit", category: "Knitwear", condition: "Gently Used", price: 599, originalPrice: 1950, size: "M", img: "knitsweater", rating: 4.8, soldCount: 42 },
  { title: "Cotton Poplin Shirt", category: "Tops", condition: "Like New", price: 399, originalPrice: 1200, size: "L", img: "whiteshirt,women", rating: 4.4, soldCount: 27 },
  { title: "Olive Pleated Skirt", category: "Skirts", condition: "Well Loved", price: 449, originalPrice: 1500, size: "S", img: "pleatedskirt", rating: 4.2, soldCount: 11 },
  { title: "Canvas Low Sneakers", category: "Footwear", condition: "Like New", price: 649, originalPrice: 2000, size: "38", img: "sneakers,women", rating: 4.6, soldCount: 49 },
  { title: "Embroidered Kurta Set", category: "Ethnic Wear", condition: "Gently Used", price: 899, originalPrice: 2800, size: "M", img: "ethnicwear,fashion", rating: 4.7, soldCount: 19 },
  { title: "Ribbed Yoga Set", category: "Activewear", condition: "Like New", price: 499, originalPrice: 1600, size: "S", img: "activewear,fashion", rating: 4.5, soldCount: 33 },
  { title: "Charcoal Trench Coat", category: "Outerwear", condition: "Gently Used", price: 1099, originalPrice: 3900, size: "L", img: "trenchcoat,fashion", rating: 4.6, soldCount: 24 },
  { title: "Vintage Silk Scarf", category: "Accessories", condition: "Like New", price: 299, originalPrice: 950, size: "One Size", img: "silkscarf,fashion", rating: 4.4, soldCount: 30 },
];

const DESCRIPTIONS = {
  "Outerwear": "A warm layering piece, hand-checked for wear and ready for cooler days.",
  "Dresses": "Lightweight and easy to style, perfect for everyday wear or a casual outing.",
  "Denim": "Classic fit denim, broken in just enough without any visible wear.",
  "Accessories": "A versatile accessory that pairs with almost anything in your closet.",
  "Knitwear": "Soft, cosy knit — ideal for layering through the season.",
  "Tops": "A wardrobe staple top in great condition, breathable cotton fabric.",
  "Skirts": "Flattering silhouette with movement, gently worn and freshly cleaned.",
  "Footwear": "Comfortable everyday shoes with plenty of life left in them.",
  "Ethnic Wear": "Festive-ready ethnic fit, carefully preserved and freshly laundered.",
  "Activewear": "Breathable stretch fabric, great for workouts or lounging.",
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB, seeding content...");

  // Categories
  for (const c of CATEGORIES) {
    await Category.findOneAndUpdate(
      { name: c.name },
      {
        name: c.name,
        icon: c.icon,
        description: c.description,
        order: c.order,
        image: { url: `https://loremflickr.com/500/650/${c.img}?lock=${c.order}`, public_id: "" },
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${CATEGORIES.length} categories`);

  // How it works steps
  const stepCount = await HowItWorksStep.countDocuments();
  if (stepCount === 0) {
    await HowItWorksStep.insertMany(STEPS);
    console.log(`Seeded ${STEPS.length} how-it-works steps`);
  } else {
    console.log("Steps already exist, skipping");
  }

  // Stories
  const storyCount = await Story.countDocuments();
  if (storyCount === 0) {
    const docs = STORIES.map((s, i) => ({
      ...s,
      date: new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000),
      photo: { url: `https://loremflickr.com/200/200/portrait,woman?lock=${i + 100}`, public_id: "" },
    }));
    await Story.insertMany(docs);
    console.log(`Seeded ${STORIES.length} stories`);
  } else {
    console.log("Stories already exist, skipping");
  }

  // Home content
  let home = await HomeContent.findOne();
  if (!home) {
    await HomeContent.create({});
    console.log("Seeded home content");
  }

  // Products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const docs = PRODUCTS.map((p, i) => ({
      title: p.title,
      description: DESCRIPTIONS[p.category] || "A carefully preloved piece, ready for its next chapter.",
      price: p.price,
      originalPrice: p.originalPrice,
      size: p.size,
      condition: p.condition,
      category: p.category,
      rating: p.rating,
      soldCount: p.soldCount,
      stock: 3,
      images: [{ url: `https://loremflickr.com/500/650/${p.img}?lock=${i + 30}`, public_id: "" }],
    }));
    await Product.insertMany(docs);
    console.log(`Seeded ${PRODUCTS.length} products`);
  } else {
    console.log("Products already exist, skipping");
  }

  await mongoose.disconnect();
  console.log("Done.");
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
