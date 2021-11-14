var data;
var selector = d3.select("#selDataset");
var samples_name = [];

const file = 'samples.json';

// Create initial thing including the drop down menu and the first set of charts/graphs  
function init() {  
    d3.json(file).then((json_data) => {  
         data = json_data;
         console.log("init():", data);
         samples_name = data.names;

         samples_name.forEach((sample) => { 
             selector
             .append("option")        
             .text(sample)        
             .property("value", sample);   
    });

    var sample_id = samples_name[0];
    buildCharts(sample_id);
    buildDemographicInfo(sample_id);

    });
};
//  END INIT FUNCTION

//  create the optionchanged function that is called in selDataset with onchange
    function optionChanged(sample_id){
        buildCharts(sample_id);
        buildDemographicInfo(sample_id);    
    };
// END OPTIONCHANGED FUNCTION

// Create the function that will build the info table. 
    function buildDemographicInfo(sample_id){
        info_data = data.metadata;
        console.log("buildDemographicInfo():", sample_id);
        var sample_metadata = d3.select("#sample-metadata");
        sample_metadata.selectAll("p").remove();
    
        info_data.forEach(row => {
            if (row.id === parseInt(sample_id)) {
                 Object.entries(row).forEach(([key, value]) => {
                      sample_metadata.append("p").text(key + ": " + value);
                 })
            }
        })
    };
// END INFO TABLE FUNCTION

// Create function to build bar and bubble chart
    function buildCharts(sample_id){

        var sample = data.samples.filter(sample => sample.id === sample_id)[0];
        var cut_point = sample.sample_values.length;
        if (cut_point > 10) {
          cut_point = 10;
        }

        var bar_chart = [{
            x: sample.sample_values.slice(0, cut_point).reverse(),
            y: sample.otu_ids.slice(0, cut_point).map(id => "otu " + id).reverse(),
            text: sample.otu_labels.slice(0, cut_point).reverse(),
            type: 'bar',
            orientation:'h'
        }]; 
        var layout = {
            title: 'Top 10 OTUs',
            margin: {
                 l: 75,
                 r: 75,
                 t: 75,
                 b: 50,
            }
       };
       Plotly.newPlot('bar', bar_chart, layout);

        var bubble_plot = [{
        x: sample.sample_values,
        y: sample.otu_ids,
        text: sample.otu_labels.slice(0, cut_point).reverse(),
        mode: 'markers',
        marker: {
             color: sample.otu_ids,
             opacity: [1, .8, .6, .4],
             size: sample.sample_values,
        }
        }];

        var layout = {
            title: 'OTUs',
            showlegend: false,
            height: 600,
            width: 930
    }
    Plotly.newPlot('bubble', bubble_plot, layout);
    };
// END CHART FUNCTION

// call main function
init();