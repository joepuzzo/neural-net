import fs from "fs";
import NeuralNetwork from "./neural-network.js";

// functions to load the MNIST data and convert images to arrays:
function readMNISTData(dataPath, labelPath, numSamples) {
  const imageFile = fs.readFileSync(dataPath);
  const labelFile = fs.readFileSync(labelPath);

  const images = [];
  const labels = [];

  const numRows = 28;
  const numColumns = 28;

  for (let i = 0; i < numSamples; i++) {
    const imgOffset = 16 + numRows * numColumns * i;
    const image = [];

    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numColumns; x++) {
        const idx = numRows * y + x;
        const pixel = imageFile[imgOffset + idx] / 255; // Normalize pixel value
        image.push(pixel);
      }
    }

    images.push(image);
    labels.push(labelFile[i + 8]);
  }

  return { images, labels };
}

function createTargetArray(label) {
  const target = Array(10).fill(0);
  target[label] = 1;
  return target;
}

const numInputNodes = 28 * 28;
const numHiddenNodes = 100;
const numOutputNodes = 10;

const args = process.argv.slice(2);
const modelName = args[0] || "default";

let neuralNetwork;
let shouldTrain = true;

// Only
if (fs.existsSync(`data/models/${modelName}.json`)) {
  console.log(`Loading model: ${modelName}`);
  neuralNetwork = NeuralNetwork.loadModel(modelName);
  shouldTrain = false;
} else {
  console.log(`Creating a new model: ${modelName}`);
  neuralNetwork = new NeuralNetwork(
    numInputNodes,
    numHiddenNodes,
    numOutputNodes
  );
}

// Only train if its a new model
if (shouldTrain) {
  const numTrainingSamples = 60000;
  const numEpochs = 5;
  const trainData = readMNISTData(
    "data/train-images-idx3-ubyte",
    "data/train-labels-idx1-ubyte",
    numTrainingSamples
  );

  for (let epoch = 0; epoch < numEpochs; epoch++) {
    console.log(`Training epoch: ${epoch + 1}`);
    for (let i = 0; i < numTrainingSamples; i++) {
      const input = trainData.images[i];
      const target = createTargetArray(trainData.labels[i]);
      neuralNetwork.train(input, target);
    }
  }

  console.log(`Saving model: ${modelName}`);
  neuralNetwork.saveModel(modelName);
}

// Test the neural network's predictions
const numTestSamples = 10000;
const testData = readMNISTData(
  "data/t10k-images-idx3-ubyte",
  "data/t10k-labels-idx1-ubyte",
  numTestSamples
);

let correctPredictions = 0;

for (let i = 0; i < numTestSamples; i++) {
  const input = testData.images[i];
  const prediction = neuralNetwork.predict(input);
  const predictedLabel = prediction.indexOf(Math.max(...prediction));
  const actualLabel = testData.labels[i];

  if (predictedLabel === actualLabel) {
    correctPredictions++;
  }
}

const accuracy = (correctPredictions / numTestSamples) * 100;
console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
