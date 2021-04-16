const LIST_RATING = ['ch1001', 'ch1002', 'ch1003'];
const LIST_BANDWIDTH = ['RF available', 'IP avaiable', 'IP traffic'];
// const LIST_BANDWIDTH = ['RF available (Mbps)', 'IP avaiable (Mpbs)', 'IP traffic (Mbps)'];
const LIST_ASD = ['Current ASD', 'NO SW ASD'];

// setting the rating list
d3.select('.rating').select('ul').selectAll('li')
  .data(LIST_RATING)
  .enter()
  .append('li').classed('rating',true).append('input').attr('type', 'checkbox').attr('checked',true)
  .on('change', (d) => 
    {
      currentOpacity = d3.selectAll("." + d).style("opacity")
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + d).transition().duration(100).style("opacity", (currentOpacity == 1) ? 0:1)
    }
  ); 

var myColor = d3.scaleOrdinal().domain(LIST_RATING).range(d3.schemeSet2);

d3.select('.rating').selectAll('li')
  .data(LIST_RATING)
  .append('label').text(d => d).style("color", d => myColor(d));   

// setting the bandwidth list
d3.select('.bandwidth').select('ul').selectAll('li')
  .data(LIST_BANDWIDTH)
  .enter()
  .append('li').classed('bandwidth',true).append('input').attr('type', 'checkbox').attr('checked',true)
  .on('change', (d) => 
    {
      console.log(d)
      currentOpacity = d3.selectAll("." + d.replace(" ","")).style("opacity")
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + d.replace(" ","")).transition().duration(100).style("opacity", (currentOpacity == 1) ? 0:1)
      
    }
  );  

var myColorB = d3.scaleOrdinal().domain(LIST_RATING).range(d3.schemeSet2);

d3.select('.bandwidth').selectAll('li')
  .data(LIST_BANDWIDTH)
  .append('label').text(d => d+' (Mbps)').style("color", d => myColorB(d));

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
var margin = {top: 10, right: 30, bottom: 20, left: 30},
    width  = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".rating-graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Retrieve data and plot it
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv", function(data) 
{
  var allGroup = ["valueA", "valueB", "valueC"];
  var dataReady = allGroup.map( function(grpName) 
  { 
    return {
      id: LIST_RATING[allGroup.indexOf(grpName)],
      values: data.map(function(d) 
      {
        return {time: d.time, value: +d[grpName]};
      })
    };
  });
  
  svg.selectAll('myLines')
    .data(dataReady, d => d.id)
    .enter()
    .append("path")
    .attr("class", d => d.id)
    .attr("d", d => line(d.values) )
    .attr("stroke", d => myColor(d.id))
    .style("stroke-width", 4)
    .style("fill", "none");  

});

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
             .x(d => x(+d.time))
             .y(d => y(+d.value));

// ===================================== plot bandwidth-graph ==============================================--

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 30},
    width  = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_bandwidth = d3.select(".bandwidth-graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Retrieve data and plot it
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv", function(data) 
{
  var allGroup = ["valueA", "valueB", "valueC"];
  var dataReady = allGroup.map( function(grpName) 
  { 
    return {
      id: LIST_BANDWIDTH[allGroup.indexOf(grpName)],
      values: data.map(function(d) 
      {
        return {time: d.time, value: +d[grpName]*Math.random()};
      })
    };
  });
  
  console.log(dataReady)
  svg_bandwidth.selectAll('myLines')
    .data(dataReady, d => d.id)
    .enter()
    .append("path")
    .attr("class", d => d.id.replace(" ",""))
    .attr("d", d => line(d.values) )
    .attr("stroke", d => myColorB(d.id))
    .style("stroke-width", 4)
    .style("fill", "none");  

});

// Add X axis --> it is a date format
var xb = d3.scaleLinear()
          .domain([0,10])
          .range([ 0, width ]);         

svg_bandwidth.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xb));

// Add Y axis
var yb = d3.scaleLinear()
          .domain( [0,20])
          .range([ height, 0 ]);

svg_bandwidth.append("g").call(d3.axisLeft(yb));

// Add the lines
var line = d3.line()
             .x(d => xb(+d.time))
             .y(d => yb(+d.value));             


