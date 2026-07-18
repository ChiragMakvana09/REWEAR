const Category = require("../models/Category");
const Story = require("../models/Story");
const HowItWorksStep = require("../models/HowItWorksStep");
const HomeContent = require("../models/HomeContent");
const ContactMessage = require("../models/ContactMessage");
const Newsletter = require("../models/Newsletter");
const cloudinary = require("../config/cloudinary");

// ============ CATEGORIES ============

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch categories", error: err.message });
  }
};

exports.getCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch categories", error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;
    const image = req.file ? { url: req.file.path, public_id: req.file.filename } : undefined;
    const category = await Category.create({ name, description, icon, order, image });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: "Could not create category", error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const fields = ["name", "description", "icon", "order", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) category[f] = req.body[f];
    });

    if (req.file) {
      if (category.image?.public_id) {
        try { await cloudinary.uploader.destroy(category.image.public_id); } catch (e) {}
      }
      category.image = { url: req.file.path, public_id: req.file.filename };
    }

    await category.save();
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: "Could not update category", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (category.image?.public_id) {
      try { await cloudinary.uploader.destroy(category.image.public_id); } catch (e) {}
    }
    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete category", error: err.message });
  }
};

// ============ STORIES ============

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ isActive: true }).sort({ date: -1 });
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch stories", error: err.message });
  }
};

exports.getStoriesAdmin = async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch stories", error: err.message });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { userName, location, title, description, rating, date } = req.body;
    const photo = req.file ? { url: req.file.path, public_id: req.file.filename } : undefined;
    const story = await Story.create({ userName, location, title, description, rating, date, photo });
    res.status(201).json({ story });
  } catch (err) {
    res.status(500).json({ message: "Could not create story", error: err.message });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const fields = ["userName", "location", "title", "description", "rating", "date", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) story[f] = req.body[f];
    });

    if (req.file) {
      if (story.photo?.public_id) {
        try { await cloudinary.uploader.destroy(story.photo.public_id); } catch (e) {}
      }
      story.photo = { url: req.file.path, public_id: req.file.filename };
    }

    await story.save();
    res.json({ story });
  } catch (err) {
    res.status(500).json({ message: "Could not update story", error: err.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (story.photo?.public_id) {
      try { await cloudinary.uploader.destroy(story.photo.public_id); } catch (e) {}
    }
    await story.deleteOne();
    res.json({ message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete story", error: err.message });
  }
};

// ============ HOW IT WORKS STEPS ============

exports.getSteps = async (req, res) => {
  try {
    const steps = await HowItWorksStep.find().sort({ order: 1, createdAt: 1 });
    res.json({ steps });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch steps", error: err.message });
  }
};

exports.createStep = async (req, res) => {
  try {
    const { icon, title, description, order } = req.body;
    const step = await HowItWorksStep.create({ icon, title, description, order });
    res.status(201).json({ step });
  } catch (err) {
    res.status(500).json({ message: "Could not create step", error: err.message });
  }
};

exports.updateStep = async (req, res) => {
  try {
    const step = await HowItWorksStep.findById(req.params.id);
    if (!step) return res.status(404).json({ message: "Step not found" });
    const fields = ["icon", "title", "description", "order"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) step[f] = req.body[f];
    });
    await step.save();
    res.json({ step });
  } catch (err) {
    res.status(500).json({ message: "Could not update step", error: err.message });
  }
};

exports.deleteStep = async (req, res) => {
  try {
    const step = await HowItWorksStep.findById(req.params.id);
    if (!step) return res.status(404).json({ message: "Step not found" });
    await step.deleteOne();
    res.json({ message: "Step deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete step", error: err.message });
  }
};

// Reorder: body = { order: [stepId1, stepId2, ...] } in desired order
exports.reorderSteps = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ message: "order must be an array of step ids" });

    await Promise.all(
      order.map((id, index) => HowItWorksStep.findByIdAndUpdate(id, { order: index }))
    );
    const steps = await HowItWorksStep.find().sort({ order: 1 });
    res.json({ steps });
  } catch (err) {
    res.status(500).json({ message: "Could not reorder steps", error: err.message });
  }
};

// ============ HOME CONTENT (singleton) ============

exports.getHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = await HomeContent.create({});
    res.json({ homeContent: content });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch home content", error: err.message });
  }
};

exports.updateHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = new HomeContent({});

    const fields = ["heroTitle", "heroSubtitle", "heroButtonText", "promoBannerText", "footerTagline"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) content[f] = req.body[f];
    });

    if (req.body.socialLinks) {
      const social = typeof req.body.socialLinks === "string" ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
      content.socialLinks = { ...content.socialLinks.toObject(), ...social };
    }

    if (req.files?.heroImage?.[0]) {
      const f = req.files.heroImage[0];
      if (content.heroImage?.public_id) {
        try { await cloudinary.uploader.destroy(content.heroImage.public_id); } catch (e) {}
      }
      content.heroImage = { url: f.path, public_id: f.filename };
    }

    if (req.files?.promoBannerImage?.[0]) {
      const f = req.files.promoBannerImage[0];
      if (content.promoBannerImage?.public_id) {
        try { await cloudinary.uploader.destroy(content.promoBannerImage.public_id); } catch (e) {}
      }
      content.promoBannerImage = { url: f.path, public_id: f.filename };
    }

    await content.save();
    res.json({ homeContent: content });
  } catch (err) {
    res.status(500).json({ message: "Could not update home content", error: err.message });
  }
};

// ============ CONTACT MESSAGES ============

exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: "Message sent", contact });
  } catch (err) {
    res.status(500).json({ message: "Could not send message", error: err.message });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch messages", error: err.message });
  }
};

exports.markMessageRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ message: "Could not update message", error: err.message });
  }
};

exports.deleteContactMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete message", error: err.message });
  }
};

// ============ NEWSLETTER ============

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) return res.json({ message: "You're already subscribed!" });
    await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Could not subscribe", error: err.message });
  }
};

exports.getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ subscribers });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch subscribers", error: err.message });
  }
};
