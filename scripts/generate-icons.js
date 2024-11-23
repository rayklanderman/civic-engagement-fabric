import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const shortcutSizes = [192];

async function generateIcons() {
  const iconsDir = join(__dirname, '../public/icons');

  // Ensure icons directory exists
  await fs.mkdir(iconsDir, { recursive: true });

  // Generate main app icons
  for (const size of sizes) {
    await sharp(join(iconsDir, 'base-icon.svg'))
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`Generated ${size}x${size} app icon`);
  }

  // Generate shortcut icons
  for (const size of shortcutSizes) {
    await sharp(join(iconsDir, 'bills.svg'))
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, 'bills.png'));
    console.log(`Generated ${size}x${size} bills icon`);

    await sharp(join(iconsDir, 'counties.svg'))
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, 'counties.png'));
    console.log(`Generated ${size}x${size} counties icon`);
  }
}

generateIcons().catch(console.error);
