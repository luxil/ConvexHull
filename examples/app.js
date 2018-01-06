/**
 * Do: 40%
 * Konecke: 60%
 */

var bTimeUpdate = false; //true: logs times for each update function

$(function() {
    initWidgetsAndNeuralNetwork();
});

function initWidgetsAndNeuralNetwork() {
    inits();
    function inits() {
        // initialize the neural network parameters
        neuralNetwork.init(updateMessage);
        // initialize the graph configuration widget
        graphConfig.init("#graph-config");
        // initialize the network configuration widget
        nnConfig.init("#nn-config", requestNetwork);
        // initialize the network configuration info widget
        nnConfigInfo.init("#nn-config-info");
        // initialize the network graph d3 visualization
        networkGraph.init("#graph");
        // initialize the training widget
        trainingData.init("#training", trainNetwork, updateMaxIterations);
        // initialize the preview widget
        networkPreview.init("#preview");
        // initialize the info widget
        networkInfo.init("#network-info");
        requestNetwork();

        //callback functions for global classes neuralNetwork etc.
        function updateMessage(message){
            updateNetwork(message)
        }
        function requestNetwork() {
            var nnMessage = {
                "id": 0,
                "layers": graphConfig.getLayersConfig(),
                "learningRate": nnConfig.getLearningRate(),
                "activationFunction": nnConfig.getActivationFunction(),
                "maxIterations": trainingData.getMaxIterationConfig()
            };
            var message = neuralNetwork.setConfig(JSON.stringify(nnMessage));
            var graphConfigMessage = JSON.parse(message);
            newNetwork(graphConfigMessage);
        }
        function trainNetwork() {
            var trainingMsg = {"id": 1,
                "samples": trainingData.getSamples(),
                "iterations": trainingData.getIterationValue(),
                "maxIterations": trainingData.getMaxIterationConfig()
            };
            neuralNetwork.startTraining(JSON.stringify(trainingMsg));
        }
        function updateMaxIterations() {
            neuralNetwork.updateMaxIterations(JSON.stringify({"maxIterations": trainingData.getMaxIterationConfig()}));
            nnConfigInfo.updateMaxIterationsInfo(trainingData.getMaxIterationConfig());
        }
    }

    selectExercise.init("#select-exercise", inits);
}

function newNetwork(message) {
    trainingData.gotResponse(message.bMaxIterationsReached); // inform training that a response arrived
    networkGraph.load(message.graph);   //load network graph
    nnConfigInfo.setNetworkConfigInfo(message.nnConfigInfo);    //set network configuration informations
    networkPreview.paintCanvas(message.output.data); // paint output image
    networkInfo.updateInfo(message.graph); // update training info
}

function updateNetwork(message) {
    //if bTimeUpdate === true -> chronometer functions and log to console
    if(bTimeUpdate) {
        var t_start = performance.now();
        networkPreview.paintCanvas(message.output.data);
        var t1 = performance.now();
        console.log((t1 - t_start) + " milliseconds. networkPreview")

        var t0 = performance.now();
        networkGraph.update(message.graph);
        t1 = performance.now();
        console.log((t1 - t0) + " milliseconds. networkGraph")

        t0 = performance.now();
        networkInfo.updateInfo(message.graph); // update training info
        t1 = performance.now();
        console.log((t1 - t0) + " milliseconds. networkInfo")

        t0 = performance.now();
        trainingData.gotResponse(); // inform training that a response arrived
        t1 = performance.now();
        console.log((t1 - t0) + " milliseconds. trainingData")

        console.log((t1 - t_start) + " milliseconds. totalTimeUpdate")
    }
    else{
        //if maxIterations is reached don't update anything
        if(!message.bMaxIterationsReached) {
            networkPreview.paintCanvas(message.output.data);    //paint output image
            networkGraph.update(message.graph);     //update network graph
            networkInfo.updateInfo(message.graph); // update training info
            selectExercise.checkFunc();     //check whether the tasks has been solved
        }
        trainingData.gotResponse(message.bMaxIterationsReached); // inform training that a response arrived
    }
}



