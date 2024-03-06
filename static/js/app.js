// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read data from website json
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data)=> {
        //console.log(data)

        // get the id data to the dropdown menu
        //console.log(data.names)
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        //loads initial dropdown menu option (ID 940) match example
        let first_id = data.names[0];
        buildMetadata(first_id)
        buildCharts(first_id)
    });
}

// call dropdown
function optionChanged(newSample) {
    // d3 dropdown
    let dropdownMenu = d3.select("#selDataset");
    // Value assign
    let patient_no = dropdownMenu.property("value");
    //console.log(patient_no)

    //charts
    buildCharts(patient_no);
    buildMetadata(patient_no)
}

// build chart data
function buildCharts(sample) {
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];

        //group 
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // top 10
        let OTU_toplabels = (result.otu_ids.slice(0, 10)).reverse();
        // macth form 
        let OTU_id = OTU_toplabels.map(d => "OTU " + d);
        // top 10
        let labels =  result.otu_labels.slice(0,10);        
        
        //sorts values by number 
        let sorted_bar = sample_values.sort(function sortFunction(a,b) {
            return b-a;
        });
        
        //largest to small
        let sortedtop_values = sorted_bar.slice(0,10).reverse();

    
       //horizontal bar chart code
       let barchart = [{
        type: 'bar',
        x: sortedtop_values,
        y: OTU_id,
        text: otu_labels,
        orientation: 'h'
        }];
      
      Plotly.newPlot('bar', barchart);
        
        //bubble chart come back finsih later
        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: {t:0},
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'},
        };
        let bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: 'Earth'
                }
            }
        ];
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

// metadaa pull 
function buildMetadata(sample) {
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
        let metadata = data.metadata;
        // apply filter
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];

        let PANEL = d3.select('#sample-metadata');
        PANEL.html('');

        for (element in result){
            PANEL.append('h6').text(`${element.toUpperCase()}: ${result[element]}`);
        };

    });
}

init();