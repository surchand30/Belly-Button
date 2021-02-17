function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("./static/js/samples.json").then((data) => {
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
  d3.json("./static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
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
  d3.json("./static/js/samples.json").then((data) => {
    console.log(data);
  
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var meta = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    var metadataArray = meta.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.

    var result = resultArray[0];
    
    var result1 = metadataArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = result.otu_ids;
    var otu_label = result.otu_labels;
    var sample_value = result.sample_values;

    // 3. Create a variable that holds the washing frequency.

    var washfreq = result1.wfreq;
    

      // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

   var otu_slice = otu_id.slice(0,10);
   
   var otu_id_append = [];
   for (let i=0; i< otu_slice.length; i++) {
    otu_id_append[i] = "OTU " + otu_slice[i];
   }
   
   var sample_slice = sample_value.slice(0,10);

   var otu_label_slice = otu_label.slice(0,10);
    console.log(otu_label_slice);

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: sample_slice.reverse(),
      y: otu_id_append.reverse(),
      name: "Bar Graph",
      type: "bar",
      orientation: "h"
        };
    
       var barData = [barTrace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    
    // 10. Use Plotly to plot the data with the layout.
       Plotly.newPlot("barchart", barData, barLayout);

       // 1. Create the trace for the bubble chart.

      var trace1 = {
      x: otu_id,
      y: sample_value,
      text:otu_label,
      type:"bubbles",
      mode:'markers',
      marker:{
        color:otu_id,
        /*opacity: [1, 0.8, 0.6, 0.4],*/
        size:sample_value
      }
    };

       var bubbleData = [trace1];
       console.log(bubbleData);

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      hovermode: otu_label
        };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var data = 
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreq,
        title: {text: "Belly Button Washing Frequency <br> Scrubs per week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2,4], color: "orange" },
            { range: [4,6], color: "yellow" },
            { range: [6,8], color: "lightgreen" },
            { range: [8,10], color: "darkgreen" },
          ]
        }
      };
   
    var gaugeData = [data];
    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  font: { color: "black", family: "Arial" }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}