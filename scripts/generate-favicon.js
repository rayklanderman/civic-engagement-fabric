import favicons from 'favicons';
import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, '..', 'public');

const configuration = {
    path: "/",
    appName: "Sauti",
    appShortName: "Sauti",
    appDescription: "Kenyan Civic Engagement Platform",
    background: "#ffffff",
    theme_color: "#BB0000",
    lang: "en-US",
    icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        favicons: true,
        windows: false,
        yandex: false,
    }
};

(async () => {
    try {
        // First, create the SVG logo
        const logoSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" fill="#BB0000"/>
            <text x="256" y="256" font-family="Arial Black" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle">
                SAUTI
            </text>
        </svg>`;

        await fs.writeFile(join(OUTPUT_DIR, 'logo.svg'), logoSvg);

        const response = await favicons(join(OUTPUT_DIR, 'logo.svg'), configuration);

        // Create the output directory if it doesn't exist
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Save the generated files
        await Promise.all(
            response.images.map(image =>
                fs.writeFile(join(OUTPUT_DIR, image.name), image.contents)
            )
        );

        console.log('Favicon generation completed!');
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
