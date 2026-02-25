const sharp = require('sharp');
const fs = require('fs/promises');
const path = require('path');

const SOURCE_IMAGE = 'assets/images/profile.jpg';
const OUTPUT_DIR = 'public/dist';
const OUTPUT_IMAGE = 'profile.jpg';

async function optimizeImage() {
  const sourcePath = path.resolve(SOURCE_IMAGE);
  const outputPath = path.resolve(OUTPUT_DIR, OUTPUT_IMAGE);

  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await sharp(sourcePath)
      .resize(400)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    console.log(`✅ Image optimized to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Image optimization error:', error.message);
  }
}

optimizeImage();
