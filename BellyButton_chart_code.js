function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    // buildbubbleCharts(firstSample);
    // buildgaugeCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  // buildbubbleCharts(newSample);
  // buildgaugeCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // var samples = data.samples;
    // console.log(samples);

    // Create a variable that filters the samples for the object with the desired sample number.
    // var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleValue = samples.filter(s => s.id === sample)
    //  5. Create a variable that holds the first sample in the array.
    var result = sampleValue[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels
    var sample_values = result.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(o => `OTU ${o}`).reverse()
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    var frequency = parseFloat(metadata.wfreq);
    // Filter the data for the object with the desired sample number

    // 8. Create the trace for the bar chart. 

    var barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        orientation: 'h',
        type: 'bar',
        text: otu_labels.slice(0, 10).reverse()
      }
    ];


    // ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      height: 380,
      width: 400
    };

    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot('bar', barData, barLayout);


    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      // type: "bubble",
      marker: {
        color: otu_ids,
        colorscale: 'RdBu',
        size: sample_values
      }
    }];

    // 2. Create the layout for the bubble chart.

    var bubbleLayout = {
      title: 'Bubble Chart Hover Text',
      xaxis: { title: "OTU IDs" },
      height: 500,
      width: 1000
    };


    // 3. Use Plotly to plot the data with the layout.

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var gaugedata = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: frequency,
        title: { text: "Scrub per Week", font: { size: 15, color: "black" } },
        // delta: { reference: 0, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "darkgreen" }

          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: frequency
          }
        }
      }
    ];

    var gaugelayout = {
      title: "Belly Button Washing Frequency", font: { size: 15, color: "black" },
      width: 420,
      height: 380,
      margin: { t: 100, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial", size: 15 }
    };

    Plotly.newPlot('gauge', gaugedata, gaugelayout);
  });
}











