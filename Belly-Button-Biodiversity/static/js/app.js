function buildMetadata(sample) {
  /* data route */
   // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(data){
  var panel = d3.select("#sample-metadata");
      panel.html("");
       
          Object.entries(data).forEach(function([key, value]){
            var row = panel.append("p");
              row.text(`${key}:${value}`)
          })
        });
  
  
    }
          
          
          function buildCharts(sample) {
            var plotUrl = `/samples/${sample}`;
            d3.json(plotUrl).then(function(data){

              //Build bubble chart
              // Grab values from the response json object to build the plots
              var x_value= data.otu_ids;
              var y_value= data.sample_values;
              var color= data.otu_ids;
              var size= data.sample_values;
              var texts= data.otu_labels;
            
          
              
              var bubble_chart = [{
                x: x_value,
                y: y_value,
                text: texts,
                mode:`markers`,
                marker: {
                  size: size,
                  color: color
                }
              }];
            
              var data = [bubble_chart];
           
            var layout = {
              title: "Belly Button Bacteria",
              xaxis: {title: "OTU ID"} 
            };

            
              Plotly.newPlot('bubble',bubble_chart, layout);
        

            // buildPlot();
            // @TODO: Build a Pie Chart
            // HINT: You will need to use slice() to grab the top 10 sample_values,
            // otu_ids, and labels (10 each).
            d3.json(plotUrl).then(function(data){
              var values = data.sample_values.slice(0,10);
              var labels = data.otu_ids.slice(0,10);
              var display = data.otu_labels.slice(0,10);
        
              var pie_chart = [{
                values: values,
                lables: labels,
                hovertext: display,
                type: "pie"
              }];
              Plotly.newPlot('pie',pie_chart);
            });
            });
          };   
          
        
          
        
        
            


            function init() {
              // Grab a reference to the dropdown select element
              var selector = d3.select("#selDataset");

              // Use the list of sample names to populate the select options
              d3.json("/names").then((sampleNames) => {
                sampleNames.forEach((sample) => {
                  selector
                    .append("option")
                    .text(sample)
                    .property("value", sample);
                });

                // Use the first sample from the list to build the initial plots
                const firstSample = sampleNames[0];
                buildCharts(firstSample);
                buildMetadata(firstSample);
              });
            }

            function optionChanged(newSample) {
              // Fetch new data each time a new sample is selected
              buildCharts(newSample);
              buildMetadata(newSample);
            }
          

            // Initialize the dashboard
            init(); 
