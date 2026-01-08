import SiteSettings from '../models/siteSettingsModel.mjs';
import Blog from '../models/blogsModel.mjs';

const ABOUT_DEFAULTS = {
  name: 'Fakharuddin Pentu',
  email: 'pintu.eng@gmail.com',
  imageUrl: '/assets/admin.png',
  aboutText:
    "Hey there! I've always imagined how great it would be to have a writing website just for students, and now it's finally a reality!\n\nThis space is all about breaking free from those stiff, boring syllabi. It's your chance to unleash your creativity and let your imagination soar—no idea is too wild! Let's dive into this adventure together!",
  roles: [
    { title: 'Current Lecturer', organization: 'Comilla Govt. College, Comilla' },
    { title: 'Former Lecturer', organization: 'Chauddagram Govt. College, Comilla' },
    { title: 'Former Assistant Director', organization: 'Anti-Corruption Commission - Bangladesh' },
  ],
  socialLinks: { linkedin: '', twitter: '', facebook: '', email: '' },
};

const CONTACT_DEFAULTS = {
  heading: 'Contact Us',
  description:
    "I'd love to hear from you! Whether you have questions, feedback, or want to share your own writing journey, reach out to me. Your thoughts are important, and together we can inspire creativity and connection. Let's build a vibrant community of young writers!",
  phone1: '+8801675697313',
  phone2: '+8801912033727',
  email1: 'pintu.eng@gmail.com',
  email2: 'classroomwriters@gmail.com',
  address1: 'Police Line, Adarsha Sadar',
  address2: 'Cumilla 3500',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.7776947401735!2d91.1724365!3d23.468481999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37547ed5ea38a001%3A0xa888b09fb49bc32!2sPolice%20Line%2C%20Cumilla!5e0!3m2!1sen!2sbd!4v1728494003876!5m2!1sen!2sbd',
  formHeading: 'Drop Us a Message',
  formDescription: 'Your email address will not be published. All the fields are required.',
};

// Get site settings (create default if not exists, seed about/contact to DB)
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        aboutPage: ABOUT_DEFAULTS,
        contactPage: CONTACT_DEFAULTS,
      });
    }

    // Seed aboutPage and contactPage to DB if missing
    let needsSave = false;
    if (!settings.aboutPage || !settings.aboutPage.name) {
      settings.aboutPage = { ...ABOUT_DEFAULTS, ...(settings.aboutPage?.toObject?.() || settings.aboutPage || {}) };
      if (!settings.aboutPage.roles || settings.aboutPage.roles.length === 0) {
        settings.aboutPage.roles = ABOUT_DEFAULTS.roles;
      }
      if (!settings.aboutPage.socialLinks) {
        settings.aboutPage.socialLinks = ABOUT_DEFAULTS.socialLinks;
      }
      needsSave = true;
    }
    if (!settings.contactPage || !settings.contactPage.heading) {
      settings.contactPage = { ...CONTACT_DEFAULTS, ...(settings.contactPage?.toObject?.() || settings.contactPage || {}) };
      needsSave = true;
    }

    if (needsSave) {
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update site settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const { heroTitle, heroSubtitle, footerText, socialLinks, aboutPage, contactPage } = req.body;

    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (footerText !== undefined) settings.footerText = footerText;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;
    if (aboutPage !== undefined) {
      settings.aboutPage = { ...settings.aboutPage?.toObject?.() || settings.aboutPage || {}, ...aboutPage };
    }
    if (contactPage !== undefined) {
      settings.contactPage = { ...settings.contactPage?.toObject?.() || settings.contactPage || {}, ...contactPage };
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a category (with file upload)
export const addCategory = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    // Build image URL from uploaded file
    let image = '';
    if (req.files && req.files['categoryImage']) {
      const url = req.protocol + '://' + req.get('host');
      image = url + '/' + req.files['categoryImage'][0].filename;
    }

    if (!image) return res.status(400).json({ message: 'Category image is required' });

    const exists = settings.categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    settings.categories.push({ name, image });
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a category (with optional file upload)
export const updateCategory = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    const oldName = req.params.name;
    const { name } = req.body;

    const catIndex = settings.categories.findIndex(
      (c) => c.name.toLowerCase() === oldName.toLowerCase()
    );
    if (catIndex === -1) return res.status(404).json({ message: 'Category not found' });

    // Check for duplicate name (if name is changing)
    if (name && name.toLowerCase() !== oldName.toLowerCase()) {
      const duplicate = settings.categories.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (duplicate) return res.status(400).json({ message: 'A category with that name already exists' });
    }

    const newName = name || settings.categories[catIndex].name;

    // Update image if a new file was uploaded
    if (req.files && req.files['categoryImage']) {
      const url = req.protocol + '://' + req.get('host');
      settings.categories[catIndex].image = url + '/' + req.files['categoryImage'][0].filename;
    }

    settings.categories[catIndex].name = newName;

    // Update blogs if name changed
    if (name && name.toLowerCase() !== oldName.toLowerCase()) {
      await Blog.updateMany(
        { category: new RegExp(`^${oldName}$`, 'i') },
        { $set: { category: newName } }
      );
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    const categoryName = req.params.name;

    // Check if any blogs use this category
    const blogCount = await Blog.countDocuments({
      category: new RegExp(`^${categoryName}$`, 'i'),
    });
    if (blogCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category: ${blogCount} blog(s) are using it. Reassign them first.`,
      });
    }

    settings.categories = settings.categories.filter(
      (c) => c.name.toLowerCase() !== categoryName.toLowerCase()
    );
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
