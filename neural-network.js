import fs from "fs";

class NeuralNetwork {
  // Step1: ------------------------------------------------------------------------------
  // Define the NeuralNetwork class and its constructor,
  // which initializes the number of input, hidden, and output nodes,
  // as well as the weights and biases.

  constructor(inputNodes, hiddenNodes, outputNodes) {
    // This variable represents the number of input nodes (neurons) in the neural network.
    // In this case, it is set to the total number of pixels in the input image, which is 28 * 28 = 784 for the MNIST dataset.
    this.inputNodes = inputNodes;

    // This variable represents the number of hidden nodes (neurons) in the neural network.
    // It is a hyperparameter that you can experiment with to find the optimal number of hidden nodes for your specific problem.
    this.hiddenNodes = hiddenNodes;

    // This variable represents the number of output nodes (neurons) in the neural network.
    // In this case, it is set to 10, as there are 10 possible digits (0-9) in the MNIST dataset.
    this.outputNodes = outputNodes;

    // -- Initialize random weights and biases for input-hidden and hidden-output layers --

    // This variable is a matrix that holds the weights connecting the input nodes to the hidden nodes.
    // Each element in the matrix represents the weight of a connection between a specific input node and a specific hidden node.
    this.weights_ih = this.randomMatrix(hiddenNodes, inputNodes);

    // This variable is a matrix that holds the weights connecting the hidden nodes to the output nodes.
    // Each element in the matrix represents the weight of a connection between a specific hidden node and a specific output node.
    this.weights_ho = this.randomMatrix(outputNodes, hiddenNodes);

    // This variable is a matrix that holds the bias values for the hidden nodes.
    // The bias is an additional parameter that is added to the weighted sum of the inputs before passing through the activation function.
    // Each hidden node has its own bias value.
    this.bias_h = this.randomMatrix(hiddenNodes, 1);

    // This variable is a matrix that holds the bias values for the output nodes.
    // Like the hidden nodes, each output node has its own bias value.
    // The bias is added to the weighted sum of the inputs from the hidden nodes before passing through the activation function.
    this.bias_o = this.randomMatrix(outputNodes, 1);

    // Set the learning rate
    // The learning rate is a hyperparameter that controls the step size or the rate at which the neural network
    // updates its weights and biases during the training process.
    // It determines how much the model should adjust its parameters in response to the error it calculates at each step.
    // A smaller learning rate means the model will make smaller adjustments to the weights and biases,
    // which can result in a more accurate model, but the training process will take longer.
    // On the other hand, a larger learning rate may allow the model to learn more quickly,
    // but it can result in less accurate predictions and unstable convergence because the model overshoots the optimal solution.
    this.learningRate = 0.1;
  }

  // Generate a matrix with random values between -1 and 1
  randomMatrix(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 2 - 1)
    );
  }

  // Activation function (sigmoid)
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // Derivative of the sigmoid function
  sigmoidDerivative(x) {
    return x * (1 - x);
  }

  // Step2: ------------------------------------------------------------------------------
  // Training

  train(input, target) {
    // Convert input and target arrays to matrices
    const inputMatrix = input.map((x) => [x]);
    const targetMatrix = target.map((x) => [x]);

    // Forward propagation: input -> hidden
    const hidden = this.multiplyMatrix(this.weights_ih, inputMatrix);
    for (let i = 0; i < this.hiddenNodes; i++) {
      hidden[i][0] += this.bias_h[i][0];
      hidden[i][0] = this.sigmoid(hidden[i][0]);
    }

    // Forward propagation: hidden -> output
    const output = this.multiplyMatrix(this.weights_ho, hidden);
    for (let i = 0; i < this.outputNodes; i++) {
      output[i][0] += this.bias_o[i][0];
      output[i][0] = this.sigmoid(output[i][0]);
    }

    // Calculate output error (target - output)
    const outputError = this.subtractMatrix(targetMatrix, output);

    // Calculate hidden error (transpose of weights_ho * outputError)
    const hiddenError = this.multiplyMatrix(
      this.transposeMatrix(this.weights_ho),
      outputError
    );

    // Update weights and biases for the input-hidden layer
    for (let i = 0; i < this.hiddenNodes; i++) {
      for (let j = 0; j < this.inputNodes; j++) {
        const deltaWeight =
          this.learningRate *
          hiddenError[i][0] *
          this.sigmoidDerivative(hidden[i][0]) *
          inputMatrix[j][0];
        this.weights_ih[i][j] += deltaWeight;
      }
      const deltaBias =
        this.learningRate *
        hiddenError[i][0] *
        this.sigmoidDerivative(hidden[i][0]);
      this.bias_h[i][0] += deltaBias;
    }
  }

  predict(input) {
    // Convert input array to matrix
    const inputMatrix = input.map((x) => [x]);

    // Forward propagation: input -> hidden
    const hidden = this.multiplyMatrix(this.weights_ih, inputMatrix);
    for (let i = 0; i < this.hiddenNodes; i++) {
      hidden[i][0] += this.bias_h[i][0];
      hidden[i][0] = this.sigmoid(hidden[i][0]);
    }

    // Forward propagation: hidden -> output
    const output = this.multiplyMatrix(this.weights_ho, hidden);
    for (let i = 0; i < this.outputNodes; i++) {
      output[i][0] += this.bias_o[i][0];
      output[i][0] = this.sigmoid(output[i][0]);
    }

    return output.map((x) => x[0]);
  }

  // Matrix multiplication
  multiplyMatrix(a, b) {
    const result = Array.from({ length: a.length }, () =>
      Array.from({ length: b[0].length }, () => 0)
    );
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  // Matrix subtraction
  subtractMatrix(a, b) {
    const result = Array.from({ length: a.length }, () =>
      Array.from({ length: a[0].length }, () => 0)
    );
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[0].length; j++) {
        result[i][j] = a[i][j] - b[i][j];
      }
    }
    return result;
  }

  // Transpose matrix
  transposeMatrix(matrix) {
    const result = Array.from({ length: matrix[0].length }, () =>
      Array.from({ length: matrix.length }, () => 0)
    );
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  }

  // Step3:
  // Saving and loading models
  saveModel(modelName) {
    if (!fs.existsSync("data/models")) {
      fs.mkdirSync("data/models", { recursive: true });
    }

    const model = {
      inputNodes: this.inputNodes,
      hiddenNodes: this.hiddenNodes,
      outputNodes: this.outputNodes,
      weights_ih: this.weights_ih,
      weights_ho: this.weights_ho,
      bias_h: this.bias_h,
      bias_o: this.bias_o,
    };

    fs.writeFileSync(`data/models/${modelName}.json`, JSON.stringify(model));
  }

  static loadModel(modelName) {
    const modelData = JSON.parse(
      fs.readFileSync(`data/models/${modelName}.json`)
    );

    const neuralNetwork = new NeuralNetwork(
      modelData.inputNodes,
      modelData.hiddenNodes,
      modelData.outputNodes
    );

    neuralNetwork.weights_ih = modelData.weights_ih;
    neuralNetwork.weights_ho = modelData.weights_ho;
    neuralNetwork.bias_h = modelData.bias_h;
    neuralNetwork.bias_o = modelData.bias_o;

    return neuralNetwork;
  }
}

export default NeuralNetwork;
