// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
      let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
      let resultObject = metadata.filter(sampleObject => sampleObject.id == sample);
      let result = resultObject[0];
    // Use d3 to select the panel with id of `#sample-metadata`
      let panelID = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      panelID.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
      for (key in result){
        panelID.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
      };
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
      let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultObject = samples.filter(sampleObject => sampleObject.id == sample);
    let result = resultObject[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuID = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValue = result.sample_values;
    // Build a Bubble Chart
    let bubbleChart = {
      title: "Bacteria Cultures per Sample",
      margin: { t:0 },
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {'title': "Number of Bacteria"},
      margin: { t:30 }
    };

    let bubbleData = [
      {
        x: otuID,
        y: sampleValue,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValue,
          color: otuID,
          colorscale: "Earth"
        }
      }
    ];
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleChart);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuID.map(otuID => `OTU ${otuID}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [
      {y: yticks.slice(0,10).reverse(),
        x: sampleValue.slice(0,10).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type:"bar",
        orientation: "h",
      }
    ];

    let barChart = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 30, l:150},
      xaxis: {'title': "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barChart);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      dropDown.append("option").text(names[i]).property("value", names[i]);
    };

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
