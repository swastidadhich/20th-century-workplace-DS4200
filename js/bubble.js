function graphBubble() {

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

    function chart(selector, dataFromCsv) {

        // set the data as children for d3.pack
        let dataset = {
            "children": dataFromCsv
        }

        // the diameter of the bubbles for d3.pack
        let diameter = 200; 

          // d3.pack to create bubbles algorithm
          let bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

            // append the svg that we will draw on
            svg = d3.select(selector)
            .append('svg')
              .attr('preserveAspectRatio', 'xMidYMid meet')
              .attr('viewBox', [50, 0, 205, 250].join(' '))
      
            svg = svg.append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              // title
              svg.append("text") 
                .attr("y", 13)
                .attr("x", 100)
                .attr("text-anchor", "middle")
                .style("font-size", "7px")
                .style("text-decoration", "underline")
                .attr('margin-bottom', 200)
                .text("Most Used Keywords on UberPeople.net")
                .style("fill", "rgb(0, 0, 0)")

            // all the bubbles in the graph
            let nodes = d3.hierarchy(dataset)
            .sum(function(d) { 
                return d.count; });

            // individual nodes
            let node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })

            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return `translate(${d.x}, ${d.y + 8})`
            })
            .attr("cx", 410).attr("cy", 190)

            // add the actual circles
            node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", "#1BBBDE")

            // append the keywords inside the circle
            node.append("text")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.keywords;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                if ((d.r/3.5) < 1.5) {
                  return 2
                } 
                else {
                return d.r/3.5; // font size is 1/3 radius
            }})
            .style("fill", "black")
        
        d3.select(self.frameElement)
            .style("height", diameter + "px");


    // brush code (referenced from Cody Dunne's example)
    svg.call(brush);

    // Highlight points when brushed
    function brush(g) {
      const brush = d3.brush() // Create a 2D interactive brush
        .on('start brush', highlight) // When the brush starts/continues do...
        .on('end', brushEnd) // When the brush ends do...
        .extent([
          [0,0],
          [208,208]
        ]);
        
      ourBrush = brush;

      g.call(brush); // Adds the brush to this element

      // Highlight the selected circles
      function highlight(event, d) {
        if (event.selection === null) return;
        const [
          [x0, y0],
          [x1, y1]
        ] = event.selection;
        console.log(x0,x1,y0,y1)
        let circles = svg.selectAll('circle')
        circles.classed("selected", function(d){ 
          return (x0 <= d.x + d.r && d.x - d.r <= x1 && y0 <= d.y + 8 + d.r && d.y + 8 - d.r <= y1)
        })

        // Let other charts know about our selection
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, svg.selectAll('.selected').data());
        console.log(svg.selectAll('.selected').data());
      }
      
      function brushEnd(event, d){
        // We don't want infinite recursion
        if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
          d3.select(this).call(brush.move, null);
        }
      }
    }        
            
            return chart;
    }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // linking (is not required)
  // chart.updateSelection = function (selectedData) {
  //   let selectedWords = [] // keep track of words in a string array
  //   for (let i =0; i < selectedData.length; i++) {
  //     selectedWords.push(selectedData[i].keywords)
  //   }
  //   if (!arguments.length) return;
  //   let circles = svg.selectAll('circle')
  //   circles.classed("selected", function(d){ // if bubble is selected, color it
  //     return selectedWords.includes(d.data.keywords)
  //   })
  // };

    return chart;
}