import fs from "fs";
import zlib from "zlib";

// const fetch = require("node-fetch");

const mnistFiles = [
  {
    url: "http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz",
    name: "train-images-idx3-ubyte.gz",
  },
  {
    url: "http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz",
    name: "train-labels-idx1-ubyte.gz",
  },
  {
    url: "http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz",
    name: "t10k-images-idx3-ubyte.gz",
  },
  {
    url: "http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz",
    name: "t10k-labels-idx1-ubyte.gz",
  },
];

const dataDirectory = "data";

// Ensure the data directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}

// Helper function to download and save a file
async function downloadFile(url, path) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(path, buffer);
}

// Download and unzip MNIST dataset files
(async () => {
  for (const file of mnistFiles) {
    const outputPath = `${dataDirectory}/${file.name}`;
    console.log(`Downloading ${file.url}...`);
    await downloadFile(file.url, outputPath);
    console.log(`Downloaded and saved ${file.url} to ${outputPath}`);

    // Unzip the file
    console.log(`Unzipping ${outputPath}...`);
    const gunzip = zlib.createGunzip();
    const input = fs.createReadStream(outputPath);
    const output = fs.createWriteStream(outputPath.replace(".gz", ""));
    input.pipe(gunzip).pipe(output);
    console.log(`Unzipped ${outputPath}`);
  }
})();
