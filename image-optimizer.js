// image-optimizer.js

const sharp = require('sharp');
const fs = require('fs/promises');
const path = require('path');

const SOURCE_IMAGE = 'profile.jpg';
const OUTPUT_DIR = 'dist';
const OUTPUT_IMAGE = 'profile.jpg';

async function optimizeImage() {
  const sourcePath = path.join(__dirname, SOURCE_IMAGE);
  const outputPath = path.join(__dirname, OUTPUT_DIR, OUTPUT_IMAGE);

  try {
    // 1. dist klasörünün varlığını kontrol et
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // 2. Görseli sıkıştır ve çıktı klasörüne yaz
    await sharp(sourcePath)
      .resize(400) // Örneğin, maksimum genişliği 400px olarak ayarla (isteğe bağlı)
      .jpeg({ quality: 80 }) // JPEG kalitesini %80'e düşür
      .toFile(outputPath);

    console.log(`✅ Görsel optimize edildi ve şu konuma kopyalandı: ${outputPath}`);
  } catch (error) {
    console.error('❌ Görsel optimizasyonunda hata oluştu:', error.message);
    // Hata durumunda işlemi sonlandır
    process.exit(1);
  }
}
optimizeImage();
