import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const convertImage = async (inputPath: string): Promise<void> => {
    try {
        // extract directory
        const dir = path.dirname(inputPath)
        // remove file extension
        const name = path.basename(inputPath, path.extname(inputPath));

        const output = path.join(dir, `${name}.png`);

        // convert to png
        await sharp(input)
            .png()
            .toFile(output);

        console.log(`Image converted successfully: ${output}`);
    } catch (error) {
        console.error('Error converting image:', error);
    }
};

const convertFolder = async (inputDir: string): Promise<void> => {
    const outputDir = path.join(inputDir, '/jpg-to-png/');

    // create the output directory if it does not exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // read the contents of the input directory
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Error reading input directory:', err);
            return;
        }

        // filter for .jpg or .jpeg files
        const imageFiles = files.filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'));

        // process each image file
        imageFiles.forEach(file => {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, `${path.parse(file).name}.png`);

            // convert and save the image
            sharp(inputPath)
                .png()
                .toFile(outputPath)
                .then(() => console.log(`${file} converted to PNG.`))
                .catch(error => console.error('Error converting image:', error));
        });
    });
};

const convert = async (input: string) => {
    try {
        const stats = fs.statSync(input);

        if (stats.isDirectory()) {
            await convertFolder(input);
        } else if (stats.isFile()) {
            const ext = path.extname(input).toLowerCase();
            if (ext === '.jpg' || ext === '.jpeg') {
                await convertImage(input);
            }
        }
    } catch (error) {
        console.error('Error accessing input path: ', error);
    }

    return 0;
}

// process command line arguments
const args = process.argv.slice(2);
const input = args[0]

// validate command line arguments
if (!args || args.length > 1) {
    console.error('Usage: ts-node jpg-to-png.ts /path/to/image.jpg|jpeg');
    process.exit(1);
}


convert(input);