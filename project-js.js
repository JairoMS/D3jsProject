var ratingData = {}; 

ratingData.dataX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
ratingData.dataY = [5, 8, 3, 1, 14, 9, 9, 2, 7, 8];


const LIST_RATING = ['ch1001', 'ch1002', 'ch1003'];
const LIST_BANDWIDTH = ['RF available (Mbps)', 'IP avaiable (Mpbs)', 'IP traffic (Mbps)'];
const LIST_ASD = ['Current ASD', 'NO SW ASD'];

// setting the rating list
d3.select('.rating').select('ul').selectAll('li')
  .data(LIST_RATING)
  .enter()
  .append('li').classed('rating',true).append('input').attr('type', 'checkbox').attr('checked',true); 

d3.select('.rating').selectAll('li')
  .data(LIST_RATING)
  .append('label').text(d => d);   

// setting the bandwidth list
d3.select('.bandwidth').select('ul').selectAll('li')
  .data(LIST_BANDWIDTH)
  .enter()
  .append('li').classed('bandwidth',true).append('input').attr('type', 'checkbox').attr('checked',true); 

d3.select('.bandwidth').selectAll('li')
  .data(LIST_BANDWIDTH)
  .append('label').text(d => d);

// setting the ASD list
d3.select('.asd').select('ul').selectAll('li')
  .data(LIST_ASD)
  .enter()
  .append('li').classed('asd',true).append('input').attr('type', 'checkbox').attr('checked',true); 

d3.select('.asd').selectAll('li')
  .data(LIST_ASD)
  .append('label').text(d => d);

// ===================================== plot ratings ==============================================--

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width  = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".rating-graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// List of groups (here I have one group per column)
var allGroup = ["valueA", "valueB", "valueC"];
// Reformat the data: we need an array of arrays of {x, y} tuples
var dataReady = {};

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv", function(data) 
{
  // Reformat the data: we need an array of arrays of {x, y} tuples
  dataReady = allGroup.map( function(grpName) 
  { // .map allows to do something for each element of the list
    return {
      name: grpName,
      values: data.map(function(d) 
      {
        return {time: d.time, value: +d[grpName]};
      })
    };
  });
  // I strongly advise to have a look to dataReady with
  // console.log(data)
  // console.log(dataReady)
  
  svg.selectAll("myLines")
     .data(dataReady)
     .enter()
     .append("path")
     .attr("d", function(d){ return line(d.values) } )
     .attr("stroke", function(d){ return myColor(d.name) })
     .style("stroke-width", 4)
     .style("fill", "none");  

});

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
                  .domain(allGroup)
                  .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
            .domain([0,10])
            .range([ 0, width ]);         

  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
            .domain( [0,20])
            .range([ height, 0 ]);

  svg.append("g").call(d3.axisLeft(y));

  // Add the lines
  var line = d3.line()
               .x(function(data) { return x(+data.time) })
               .y(function(data) { return y(+data.value) }); 
 


