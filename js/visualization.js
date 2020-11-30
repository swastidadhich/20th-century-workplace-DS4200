// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // General event type for selections, used by d3-dispatch
  // https://github.com/d3/d3-dispatch
  const dispatchString = 'selectionUpdated';
  let bubbleChart;
  let lineChart;
  let networkGraph;

  // get the csv data
  d3.csv('data/keywords.csv').then((data) => {
    bubbleChart = graphBubble()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#bubblechart', data)

    d3.json('data/graph.json').then((data) => {
      networkGraph = graphNetwork()
      ('#network', data);

      bubbleChart.selectionDispatcher()
      .on(`${dispatchString}.bc_to_nw`, networkGraph.updateSelection)
      
    });

  });

})());