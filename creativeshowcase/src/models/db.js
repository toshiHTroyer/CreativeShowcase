import mongoose from 'mongoose';

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.DSN);
}

// User Schema with reference to Portfolio
const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }
});


// Portfolio Schema with embedded settings, array of references to its categories
const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: String,
  specialty: String,
  coverImage: String,
  url: { type: String, required: true },
  portfolioSettings: {
    isPublic: { type: Boolean, default: true },
    customColorScheme: {
      primary: String,
      secondary: String,
      accent: String,
    }
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

// Category Schema with embedded projects
const CategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  name: { type: String, required: true },
  projects: [{
    title: { type: String, required: true },
    description: String,
    projectContent: {
      contentType: String,
      content: { type: String, required: true },
      caption: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export { User, Portfolio, Category };