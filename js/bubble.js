d3.json('data/main.json').then(data => {

  // graph sizes
  let width = 700
  let height = 700
  var dispatcher = d3.dispatch("selector")

  // add svg to vis2
  let svg = d3.select("#vis2")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style('background', '#efefef');

  // append the title
  svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 50)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Word Cloud on UberPeople.net");

  // all the bubbles(nodes) of the json
  let node = svg.append("g")
  .selectAll("circle")
  .data(data.nodes)
  .enter()
  .append("circle")
    .attr('id', d => d.id)
    .attr("r", 
      d => {
        if (isNaN(d.count)){
        return 5
      }
      else{
        return d.count / 60 
      }})
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#69b3a2")
    .style("fill-opacity", 0.3)
    .attr("stroke", "#6B97EE")
    .on('click', (event, d) => {
    
      if (!d3.select(event.currentTarget).classed('selected')) {
        d3.select(event.currentTarget).classed('selected', true)

        // dispatch call here
        

      } else {
        d3.select(event.currentTarget).classed('selected', false)
        // dispatch call here
    }
  })
     .on('mouseover', (event, d) => {
    console.log("hello");
    if (!d3.select(event.currentTarget).classed('selected')) {
      d3.select(event.currentTarget).classed('selected', true)
      // dispatch call here

    } else if (d3.select(event.currentTarget).classed('selected')) {
      d3.select(event.currentTarget).classed('selected', true)
      // dispatch call here
    }
    ;
  })

  .on('mouseout', (event, d) => {
    if (d3.select(event.currentTarget).classed('selected')) {
      d3.select(event.currentTarget).classed('selected', true)
      // dispatch call here
    } else if (d3.select(event.currentTarget).classed('selected')) {
      d3.select(event.currentTarget).classed('selected', false)
      // dispatch call here
    };
  })

    // all the keyword labels of the json
  let text = svg.select("g")
    .selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("dx", width / 2)
    .attr("dy", height / 2)
    .text(d => d.id)

  // force usage referenced from Yan Holtz
  // to move the bubbles on initiation
  let simulation = d3.forceSimulation()
  .force("center", d3.forceCenter().x(width / 2).y(
      height / 2)) // Attraction to the center of the svg area
  .force("charge", d3.forceManyBody().strength(
      0.5)) // Nodes are attracted one each other of value is > 0
  .force("collide", d3.forceCollide().strength(.01).radius(60).iterations(1)) // Force that avoids circle overlapping

// Apply these forces to the nodes/text and update their positions.
  simulation
  .nodes(data.nodes)
  .on("tick", function (d) {
    node
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    text
    .attr("dx", function (d) {
      return d.x;
    })
    .attr("dy", function (d) {
      return d.y;
    })
  })
});