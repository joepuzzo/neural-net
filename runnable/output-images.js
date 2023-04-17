import fs from "fs";
import { PNG } from "pngjs";

const dataDirectory = "data";

// Function to save the first 100 images from the MNIST dataset
async function saveImages(dataPath, labelPath, outputDirectory) {
  // Read the image and label files
  const imageFile = fs.readFileSync(dataPath);
  const labelFile = fs.readFileSync(labelPath);

  // Check the magic number of the image file to ensure it's a valid MNIST dataset file
  const magicNumber =
    (imageFile[0] << 24) |
    (imageFile[1] << 16) |
    (imageFile[2] << 8) |
    imageFile[3];
  if (magicNumber !== 0x00000803) {
    throw new Error(`Invalid magic number in ${dataPath}: ${magicNumber}`);
  }

  // Read the number of images, rows, and columns from the image file
  const numImages =
    (imageFile[4] << 24) |
    (imageFile[5] << 16) |
    (imageFile[6] << 8) |
    imageFile[7];
  const numRows =
    (imageFile[8] << 24) |
    (imageFile[9] << 16) |
    (imageFile[10] << 8) |
    imageFile[11];
  const numColumns =
    (imageFile[12] << 24) |
    (imageFile[13] << 16) |
    (imageFile[14] << 8) |
    imageFile[15];

  // Loop through the first 100 images
  for (let i = 0; i < 100; i++) {
    // Read the label for the current image
    const label = labelFile[i + 8];

    // Create a new PNG object with the dimensions of the image
    const png = new PNG({ width: numColumns, height: numRows });

    // Calculate the offset in the image file for the current image
    const imgOffset = 16 + numRows * numColumns * i;

    // Loop through the rows and columns of the image
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numColumns; x++) {
        // Calculate the index of the current pixel in the image file
        const idx = numRows * y + x;
        // Read the pixel value from the image file
        const pixel = imageFile[imgOffset + idx];
        // Calculate the index of the current pixel in the PNG data
        const pngIdx = idx << 2;

        // Set the RGBA values of the current pixel in the PNG data
        png.data[pngIdx] = pixel;
        png.data[pngIdx + 1] = pixel;
        png.data[pngIdx + 2] = pixel;
        png.data[pngIdx + 3] = 0xff;
      }
    }

    // Save the PNG image to the output directory
    const outputPath = `${outputDirectory}/${label}-${i}.png`;
    png.pack().pipe(fs.createWriteStream(outputPath));
  }
}

// ... (previous code with comments) ...

// Main function to save the first 100 images from each MNIST dataset file
(async () => {
  const datasets = [
    {
      dataPath: `${dataDirectory}/train-images-idx3-ubyte`,
      labelPath: `${dataDirectory}/train-labels-idx1-ubyte`,
      outputDir: `${dataDirectory}/train-images`,
    },
    {
      dataPath: `${dataDirectory}/t10k-images-idx3-ubyte`,
      labelPath: `${dataDirectory}/t10k-labels-idx1-ubyte`,
      outputDir: `${dataDirectory}/t10k-images`,
    },
  ];

  for (const dataset of datasets) {
    if (!fs.existsSync(dataset.outputDir)) {
      fs.mkdirSync(dataset.outputDir);
    }

    await saveImages(dataset.dataPath, dataset.labelPath, dataset.outputDir);
    console.log(
      `Saved first 100 images from ${dataset.dataPath} to ${dataset.outputDir}`
    );
  }
})();
