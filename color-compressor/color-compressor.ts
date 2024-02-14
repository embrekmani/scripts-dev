import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const compressImage = async (input: string) => {
    try {
        // extract directory
        const dir = path.dirname(input)
        // remove file extension
        const name = path.basename(input, path.extname(input));
        const output = path.join(dir, `${name}-cc.png`);

        // compress to lowest possible amount of colors
        await sharp(input)
            .png({ compressionLevel: 9, colours: 2, quality: 0, force: true })
            .toFile(output)

        console.log(`Image compressed and saved to ${output}`);
    } catch (error) {
        console.log('Error compressing image: ', error);
    }
}

const compressFolder = async (input: string) => {
    const dir = path.join(input, '/color-compressor/');

    // create the output directory if it does not exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // read the contents of the input directory
    fs.readdir(input, (err, files) => {
        if (err) {
            console.error('Error reading input directory:', err);
            return;
        }

        // filter for .png files
        const imageFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

        // process each image file
        imageFiles.forEach(file => {
            const image = path.join(input, file);
            const output = path.join(dir, `${path.parse(file).name}.png`);

            // compress to lowest possible amount of colors
            sharp(image)
                .png({ compressionLevel: 9, colours: 2, quality: 0, force: true })
                .toFile(output)
        });
    });
}

const compress = async (input: string) => {
    try {
        const stats = fs.statSync(input);

        if (stats.isDirectory()) {
            await compressFolder(input);
        } else if (stats.isFile()) {
            const ext = path.extname(input).toLowerCase();
            if (ext === '.png') {
                await compressImage(input);
            }
        }
    } catch (error) {
        console.error('Error accessing input path: ', error);
    }

    return 0;
}

const [input] = process.argv.slice(2);

if (!input) {
    console.log('Usage: ts-node color-compress.ts /path/to/image.png');
    process.exit(1);
}


compress(input);