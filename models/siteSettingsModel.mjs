import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'Class Room Writers' },
    siteLogo: { type: String, default: '/assets/logo.svg' },
    heroTitle: { type: String, default: 'Thoughts Meet Words' },
    heroSubtitle: {
      type: String,
      default:
        'Explore authentic writings from students, sharing their feelings, experiences, and imaginative stories that inspire.',
    },
    footerText: {
      type: String,
      default:
        "In Bangladesh, students often memorize answers for exams without really engaging with writing as a craft. Sadly, they lack the motivation or platforms to express themselves freely in writing. That's where this site comes in! We're offering a space where you can write about anything—no topic is off-limits.",
    },
    categories: [
      {
        name: { type: String, required: true },
        image: { type: String, default: '' },
      },
    ],
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    aboutPage: {
      name: { type: String, default: 'Fakharuddin Pentu' },
      email: { type: String, default: 'pintu.eng@gmail.com' },
      imageUrl: { type: String, default: '/assets/admin.png' },
      aboutText: {
        type: String,
        default:
          "Hey there! I've always imagined how great it would be to have a writing website just for students, and now it's finally a reality!\n\nThis space is all about breaking free from those stiff, boring syllabi. It's your chance to unleash your creativity and let your imagination soar—no idea is too wild! Let's dive into this adventure together!",
      },
      roles: {
        type: [
          {
            title: { type: String, default: '' },
            organization: { type: String, default: '' },
          },
        ],
        default: [
          { title: 'Current Lecturer', organization: 'Comilla Govt. College, Comilla' },
          { title: 'Former Lecturer', organization: 'Chauddagram Govt. College, Comilla' },
          { title: 'Former Assistant Director', organization: 'Anti-Corruption Commission - Bangladesh' },
        ],
      },
      socialLinks: {
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        facebook: { type: String, default: '' },
        email: { type: String, default: '' },
      },
    },
    contactPage: {
      heading: { type: String, default: 'Contact Us' },
      description: {
        type: String,
        default:
          "I'd love to hear from you! Whether you have questions, feedback, or want to share your own writing journey, reach out to me. Your thoughts are important, and together we can inspire creativity and connection. Let's build a vibrant community of young writers!",
      },
      phone1: { type: String, default: '+8801675697313' },
      phone2: { type: String, default: '+8801912033727' },
      email1: { type: String, default: 'pintu.eng@gmail.com' },
      email2: { type: String, default: 'classroomwriters@gmail.com' },
      address1: { type: String, default: 'Police Line, Adarsha Sadar' },
      address2: { type: String, default: 'Cumilla 3500' },
      mapEmbedUrl: {
        type: String,
        default:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.7776947401735!2d91.1724365!3d23.468481999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37547ed5ea38a001%3A0xa888b09fb49bc32!2sPolice%20Line%2C%20Cumilla!5e0!3m2!1sen!2sbd!4v1728494003876!5m2!1sen!2sbd',
      },
      formHeading: { type: String, default: 'Drop Us a Message' },
      formDescription: {
        type: String,
        default: 'Your email address will not be published. All the fields are required.',
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
