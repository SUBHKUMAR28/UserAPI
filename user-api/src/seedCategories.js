require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/category.model');

const categories = [
  {
    name: 'Mobile',
    slug: 'mobile',
    spec_fields: [
      { key: 'ram', label: 'RAM', placeholder: 'e.g. 8GB' },
      { key: 'storage', label: 'Storage', placeholder: 'e.g. 128GB' },
      { key: 'battery', label: 'Battery', placeholder: 'e.g. 5000mAh' },
      { key: 'screen_size', label: 'Screen Size', placeholder: 'e.g. 6.5 inch' },
      { key: 'processor', label: 'Processor', placeholder: 'e.g. Snapdragon 8 Gen 2' },
      { key: 'camera', label: 'Camera', placeholder: 'e.g. 50MP + 12MP' },
    ],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    spec_fields: [
      { key: 'power_consumption', label: 'Power Consumption', placeholder: 'e.g. 100W' },
      { key: 'warranty_type', label: 'Warranty Type', placeholder: 'e.g. 1 Year Brand Warranty' },
      { key: 'voltage', label: 'Voltage', placeholder: 'e.g. 220V' },
      { key: 'connectivity', label: 'Connectivity', placeholder: 'e.g. Bluetooth, WiFi' },
    ],
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    spec_fields: [
      { key: 'size', label: 'Size', placeholder: 'e.g. M, L, XL, 32, 34' },
      { key: 'color', label: 'Color', placeholder: 'e.g. Red, Black' },
      { key: 'material', label: 'Material', placeholder: 'e.g. Cotton, Polyester' },
      { key: 'gender', label: 'Gender', placeholder: 'e.g. Men, Women, Unisex, Kids' },
      { key: 'fit_type', label: 'Fit Type', placeholder: 'e.g. Regular, Slim, Loose' },
      { key: 'pattern', label: 'Pattern', placeholder: 'e.g. Solid, Printed, Striped' },
      { key: 'sleeve_type', label: 'Sleeve Type', placeholder: 'e.g. Full Sleeve, Half Sleeve' },
      { key: 'occasion', label: 'Occasion', placeholder: 'e.g. Casual, Formal, Party' },
    ],
  },
  {
    name: 'Appliances',
    slug: 'appliances',
    spec_fields: [
      { key: 'power_consumption', label: 'Power Consumption', placeholder: 'e.g. 1500W' },
      { key: 'capacity', label: 'Capacity', placeholder: 'e.g. 7Kg' },
      { key: 'energy_rating', label: 'Energy Rating', placeholder: 'e.g. 5 Star' },
      { key: 'warranty_period', label: 'Warranty Period', placeholder: 'e.g. 2 Years' },
    ],
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding categories...');

    // Purani categories clear karo agar duplicate avoid karna ho
    await Category.deleteMany({});

    await Category.insertMany(categories);

    console.log('✅ 4 Categories with spec_fields seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedCategories();