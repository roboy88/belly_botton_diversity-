function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array.
    var samplesData = data.samples;
    console.log(samplesData);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samplesData.filter((sampleObj) => sampleObj.id == sample);
    console.log(sampleArray);

    //  5. Create a variable that holds the first sample in the array.
    var firtSample = sampleArray[0];
    console.log(firtSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var sample_otu_ids = firtSample.otu_ids;
    var sample_otu_labels_top10 = [];
    var sample_values_top10 = [];

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var sample_otu_ids_top10 = sample_otu_ids
      .sort((a, b) => b - a)
      .slice(0, 10);
    sample_otu_ids_top10.reverse();
    console.log(sample_otu_ids_top10);

    sample_values_top10 = sample_otu_ids_top10.map(
      (id) => firtSample.sample_values[firtSample.otu_ids.indexOf(id)]
    );

    sample_otu_labels_top10 = sample_otu_ids_top10.map(
      (id) => firtSample.otu_labels[firtSample.otu_ids.indexOf(id)]
    );

    console.log(sample_values_top10);
    console.log(sample_otu_labels_top10);

    var yticks = sample_otu_ids_top10;

    // 8. Create the trace for the bar chart.
    var barData = [
      {
        x: sample_values_top10.map((values) => values),
        y: sample_otu_ids_top10.map((ids) => "OTU " + ids),
        text: sample_otu_labels_top10.map((labels) => labels),
        name: "Top 10 Bacteria Cultures Found",
        type: "bar",
        orientation: "h",
      },
    ];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    //Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: sample_otu_ids_top10.map((ids) => ids),
        y: sample_values_top10.map((values) => values),
        text: sample_otu_labels_top10.map((labels) => labels),
        mode: "markers",
        marker: {
          size: sample_values_top10.map((values) => values),
          color: sample_otu_ids_top10.map((ids) => ids),
        },
      },
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegedn: false,
      xaxis: { title: "OTU " + sample },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //Deliverable 3

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataObj = data.metadata;

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataArray = metadataObj.filter(
      (sampleObj) => sampleObj.id == sample
    );
    var firstMetadata = metadataArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wkwfreq = firstMetadata.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wkwfreq,
        title: { text: "<B>Belly Button Washing Frequency<br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ],
        },
      },
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 350,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
