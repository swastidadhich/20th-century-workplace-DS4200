d3.json('data/keywords.json').then(data => {
  
  let width = 700
  let height = 700

  let svg = d3.select("#vis2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('background', '#efefef');

  svg.append("text")
  .attr("x", (width / 2))             
  .attr("y", 50)
  .attr("text-anchor", "middle")  
  .style("font-size", "16px") 
  .style("text-decoration", "underline")  
  .text("Word Cloud on UberPeople.net");


  let node = svg.append("g")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr('id', d => d.keywords)
    .attr("r", d => d.count / 60)
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#69b3a2")
    .style("fill-opacity", 0.3)
    .attr("stroke", "#6B97EE")

  let text = svg.select("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
      .attr("dx", width / 2)
      .attr("dy", height / 2)
      .text(d => d.keywords)

  let simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.01).radius(60).iterations(1)) // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(data)
    .on("tick", function(d){
      node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
      text
          .attr("dx", function(d){ return d.x; })
          .attr("dy", function(d){ return d.y; })
          });
    });