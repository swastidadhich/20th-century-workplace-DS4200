let parseDate = d3.timeParse('%m/%d/%Y');
var slices = []
var dispatch = d3.dispatch('selectionUpdated');

function lineChart(data){

    let maxDate  = d3.max(data, function(d){return d.date; });
    let minDate  = d3.min(data, function(d){return d.date; });
    let maxCount = d3.max(data, function(d){return d.count;});

    let width  = 1500;
    let height = 500;
    let margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };

    // source: https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/    
    // d3.nest was retired, d3.group is the build-in function and was not working
    // works like a dictionary, i.e. if Array for 'covid' exists, add it to existing
    // else create a new wordObject
    data.forEach((word) => { 
        
        let wordObject = slices.find(el => el.id === word.word );

        if (!wordObject) { 
          wordObject = { 
            id: word.word,
            values: [{
              date: +word.date,
              count: +word.count
            }]
          }
          slices.push(wordObject)
          
        } else { 
          slices[slices.findIndex(el => el.id === word.word)].values.push({
            date: +word.date,
            count: +word.count
          })
        }
      });

    let svg = d3.select('#linechart')
    .append('svg')
    .attr('width' , width)
    .attr('height', height)
    .style('background', '#efefef');

    let chartGroup = svg
    .append('g')
    .attr('transform','translate(' + margin.left +',' + margin.top + ')');

    let xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width - margin.left - margin.right]);

    let yScale = d3.scaleLinear()
    .domain([0, maxCount])
    .range([height - margin.bottom - margin.top, 0]);

    let xAxis = d3.axisBottom(xScale);
    chartGroup.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
      .call(xAxis);

    let yAxis = d3.axisLeft(yScale);
      chartGroup.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(0, 0)')
    .call(yAxis);

    let line = d3.line()
    .x(function(d){return xScale(d.date);})    
    .y(function(d){return yScale(d.count);})

    let lines = svg.selectAll("lines")
      .data(slices)
      .enter()
      // creates <g> block for each line
      .append("g")
        .attr('transform', 'translate(50,50)')

    lines.append("path")
    .attr("id", function(d) { return d.id }) // the id is the keyword
    .attr('class', 'line')
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", "#000000")

    // title
    chartGroup.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Keyword Mentions in Posts on UberPeople.net");

    // text label for the x axis
    // adjusted from D3 Axis Label Reference
    chartGroup.append("text")             
    .attr("transform",
            "translate(" + (width/2) + " ," + 
                             (height - margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .text("Days")
    .attr('class' , 'axisLabel');

    // text label for the y axis
    // adjusted from D3 Axis Label Reference
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x",0 - (height / 2) + margin.top)
    .style("text-anchor", "middle")
    .text("Count")
    .attr('class' , 'axisLabel');  
  }

d3.csv('data/data.csv', function(d) {
    return {
      date: parseDate(d.date),
      word : d.word,
      count: +d.count
    };
}).then(lineChart);

dispatch.on("selectionUpdated", function(selectedData) {
  console.log("heard")
  if (!arguments.length) return;

      // array for selected lines from dispatch call
      let selectedLines = [];
      for (let i = 0; i < selectedData.length; i++) { // first go through and construct an array with all the selected word strings
        let word = selectedData[i].keywords || selectedData[i].data.keywords
        selectedLines.push(word);
      }

      // get all lines matching id with keywords
      let lines = document.getElementsByClassName('line');
      for (let i = 0; i < lines.length; i++) { // go through all the lines and show/hide depending on if the word is selected or not
        if (selectedLines.includes(lines[i].id)) {
          lines[i].style.display = 'block'
        } else {
          lines[i].style.display = 'none'
        }
      }
    });