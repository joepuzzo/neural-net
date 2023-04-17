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
