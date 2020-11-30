function graphNetwork() {

	let width = 700
	let height = 700

	let margin = {
        top: 0,
        left: 50,
        right: 30,
        bottom: 35
      },
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher,
      svg;

    function chart(selector, data) {

     	let svg = d3.select(selector)
		  .append("svg")
		  .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', [100, 20, 500, 500].join(' '))
          .classed('svg-content', true)
          .style('background', '#efefef');

		  // title
		  svg.append("text")
		  .attr("x", 350)
		  .attr("y", 50)
		  .attr("text-anchor", "middle")
		  .style("font-size", "16px")
		  .style("text-decoration", "underline")
		  .text("Most Common Keyword Links on UberPeople.net");

		  var legend = svg.append("g")

		  legend.append("text")
		  .attr("x", 500)
		  .attr("y", 80)
		  .attr("text-anchor", "middle")
		  .style("font-size", "12px")
		  .style("text-decoration", "underline")
		  .text("Legend");

		  let root = legend.append("circle")
		  .attr('id', "root")
		  .attr("r", 10)
		  .attr("fill", "#69b3a2")
		  .attr("cx" ,480)
		  .attr("cy", 100)

		  legend.append("text")
		  .attr("x", 520)
		  .attr("y", 102)
          .style("text-anchor", "middle")
          .text("Keywords")
          .attr("font-size", 10)
          .style("fill", "black")

		  let subroot = legend.append("circle")
		  .attr('id', "subroot")
		  .attr("r", 10)
		  .attr("fill", "#bc6bee")
		  .attr("cx" ,480)
		  .attr("cy", 130)

		  legend.append("text")
		  .attr("x", 530)
		  .attr("y", 132)
          .style("text-anchor", "middle")
          .text("Related Words")
          .attr("font-size", 10)
          .style("fill", "black")
		
			// all the lines
		  var link = svg.append("g")
		      .attr("class", "links")
		    .selectAll("line")
		    .data(data.links)
		    .enter().append("line")
		      .attr("stroke-width", function(d) { return d.value });

		  link.append("text")
		  	.text("test")
		      .attr("dy", ".2em")
		      .style("text-anchor", "middle")
		      .attr("font-size", 8);

		  // all the node objects
		  var node = svg.append("g")
		      .attr("class", "nodes")
		    .selectAll("g")
		    .data(data.nodes)
		    .enter().append("g")

		  // all the circles in the node  
		  var circles = node.append("circle")
		      .attr("class", function(d) {
		      	if (d.group == "root") {
		      		return "nodeCircles"
		      	}
		      	else {
		      		return "nodeChildren"
		      	}
		      })
		      .attr('id', d => d.id)
		      .attr("r", 10)
		      .attr("fill", function(d) { 
		        if (d.group == "root") {
		          return "#69b3a2"
		        }
		        else {
		          return "#bc6bee"
		        }
		      })


		  // text labels of nodes
		  node.append("text")
		      .text(function(d) {
		        return d.id;
		      })
		      .attr("dy", ".2em")
		      .style("text-anchor", "middle")
		      .attr("font-size", 8);

		  node.append("title")
		      .text(function(d) { return d.id; });

		  // force simulation to push the nodes and links apart
		  var simulation = d3.forceSimulation()
		    .force("link", d3.forceLink().id(function(d) { return d.id; }))
		    .force("charge", d3.forceManyBody())
		    .force("center", d3.forceCenter(350, 350));

		  simulation
		      .nodes(data.nodes)
		      .on("tick", ticked);

		  simulation.force("link")
		      .links(data.links);

		  // on tick function
		  function ticked() {
		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });

		    node
		        .attr("transform", function(d) {
		          return "translate(" + d.x + "," + d.y + ")";
		        })
		  }

		  return chart;
		     }

	chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    console.log("heard")
    let selectedWords = [] // keep track of words in a string array
    for (let i =0; i < selectedData.length; i++) {
      selectedWords.push(selectedData[i].data.keywords)
    }
    console.log(selectedWords)
    
    if (!arguments.length) return;
    let circles = document.getElementsByClassName('nodeCircles')
    for (let i = 0; i<circles.length; i++) {
    	if (selectedWords.includes(circles[i].id)) {
    		circles[i].setAttribute("fill", "red")
    	} else {
    		circles[i].setAttribute("fill", "#69b3a2")
    	}
    }

  };

	return chart		  
}
