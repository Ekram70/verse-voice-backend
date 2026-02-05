import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models
import Blog from './models/blogsModel.mjs';
import User from './models/usersModel.mjs';
import SiteSettings from './models/siteSettingsModel.mjs';

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t42mo3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Read allBlogs data from frontend
// We need to extract the data from the JS file
const allBlogsContent = readFileSync(
  join(__dirname, '..', 'frontend', 'data', 'allBlogs.js'),
  'utf-8'
);

// Remove the export statement and evaluate the array
const cleanedContent = allBlogsContent
  .replace('export default allBlogs;', '')
  .replace('const allBlogs = ', '');

// Use Function constructor to safely evaluate the array literal
const allBlogs = new Function(`return ${cleanedContent}`)();

async function seed() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Blog.deleteMany({});
    await User.deleteMany({});
    await SiteSettings.deleteMany({});
    console.log('Cleared existing data');

    // Create superuser admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@versevoice.com',
      password: hashedPassword,
      isSuperUser: true,
    });
    await admin.save();
    console.log('Created admin user: admin@versevoice.com / Admin@123');

    // Insert all blogs
    const blogsToInsert = allBlogs.map((blog) => ({
      category: blog.category,
      isFeatured: blog.isFeatured || false,
      isPopular: blog.isPopular || false,
      title: blog.title,
      content: blog.description,
      createdBy: {
        name: blog.authorName,
        avatar: blog.authorAvatar || '',
      },
      authorDetails: blog.authorDetails || '',
      timeRead: blog.timeRead || '3 mins read',
      publishDate: new Date(blog.publishDate) || new Date(),
      blogPicUrl: blog.imgUrl || '',
      likesCount: 0,
      comments: [],
    }));

    const insertedBlogs = await Blog.insertMany(blogsToInsert);
    console.log(`Inserted ${insertedBlogs.length} blogs`);

    // Extract unique categories from blogs
    const categoryMap = {};
    allBlogs.forEach((blog) => {
      if (!categoryMap[blog.category]) {
        categoryMap[blog.category] = blog.categoryImg || '';
      }
    });

    const categories = Object.entries(categoryMap).map(([name, image]) => ({
      name,
      image,
    }));

    // Create default site settings
    const settings = new SiteSettings({
      heroTitle: 'Thoughts Meet Words',
      heroSubtitle:
        'Explore authentic writings from students, sharing their feelings, experiences, and imaginative stories that inspire.',
      footerText:
        "In Bangladesh, students often memorize answers for exams without really engaging with writing as a craft. Sadly, they lack the motivation or platforms to express themselves freely in writing. That's where this site comes in! We're offering a space where you can write about anything—no topic is off-limits. Whether you're interested in fiction, social issues, or personal experiences, you can explore your voice and ideas with full freedom.\n\nWriting is more than just a subject for exams; it's a life skill. It helps you think critically, express your thoughts clearly, and solve problems creatively. Plus, the more you practice, the better your results will be—without memorizing answers! Writing here will help you improve not just for your exams, but for life.",
      categories,
      socialLinks: {
        twitter: '',
        linkedin: '',
        instagram: '',
      },
      aboutPage: {
        name: 'Fakharuddin Pentu',
        email: 'pintu.eng@gmail.com',
        imageUrl: '/assets/admin.png',
        aboutText:
          "Hey there! I've always imagined how great it would be to have a writing website just for students, and now it's finally a reality!\n\nThis space is all about breaking free from those stiff, boring syllabi. It's your chance to unleash your creativity and let your imagination soar\u2014no idea is too wild! Let's dive into this adventure together!",
        roles: [
          { title: 'Current Lecturer', organization: 'Comilla Govt. College, Comilla' },
          { title: 'Former Lecturer', organization: 'Chauddagram Govt. College, Comilla' },
          { title: 'Former Assistant Director', organization: 'Anti-Corruption Commission - Bangladesh' },
        ],
        socialLinks: { linkedin: '', twitter: '', facebook: '', email: '' },
      },
      contactPage: {
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
      },
    });
    await settings.save();
    console.log(`Created site settings with ${categories.length} categories`);

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@versevoice.com / Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
