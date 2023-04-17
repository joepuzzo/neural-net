# Image Net

## Step1: Download MNIST

**MNIST**: Modified National Institute of Standards and Technology database) is a large database of handwritten digits that is commonly used for training various image processing systems.

The files are availabe here http://yann.lecun.com/exdb/mnist/ but we have a script in runnable that will fetch them for you :)

```bash
npm run mnist
```

This will download thef following files

```
train-images-idx3-ubyte.gz:  training set images (9912422 bytes)
train-labels-idx1-ubyte.gz:  training set labels (28881 bytes)
t10k-images-idx3-ubyte.gz:   test set images (1648877 bytes)
t10k-labels-idx1-ubyte.gz:   test set labels (4542 bytes)
```

## Step2: Train a model

### Basic Training

In order to train a model all you need to do is run the following

```bash
npm run train my_model
```

Example Output:

```
Training with 100 hidden nodes and 5 epochs
Creating a new model: my_model
Training epoch: 1
Training epoch: 2
Training epoch: 3
Training epoch: 4
Training epoch: 5
Saving model: my_model
Accuracy: 95.72%
```

### Training parameters

If you want to change the default parameters do so as follows

```bash
npm run train bad_model -- --hidden-nodes 20 --epochs 3
```

Example Output:

```
Training with 20 hidden nodes and 3 epochs
Creating a new model: bad_model
Training epoch: 1
Training epoch: 2
Training epoch: 3
Saving model: bad_model
Accuracy: 75.02%
```

### Running Pre Trained Models

In order to run a previously trained model all you need to do is give it the name of the model

```bash
npm run train my_model
```

Example Output:

```
Loading model: my_model
Accuracy: 95.72%
```
