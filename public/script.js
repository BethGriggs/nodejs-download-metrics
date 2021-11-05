// Set graph sizes
const margin = {
  top: 50,
  right: 75,
  bottom: 50,
  left: 75,
};
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create chart showing total downloads per day based on totals.csv
function createTotalChart() {
  // Create SVG
  const svg = d3.select('#total')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform',
      `translate(${margin.left},${margin.top})`);

  // Load total downloads
  d3.csv('./summaries/total.csv',

    (d) => ({
      date: d3.timeParse('%Y-%m-%d')(d.date),
      downloads: d.downloads,
    }),
    (data) => {
      // x-axis
      const x = d3.scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width]);
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // y-axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => +d.downloads)])
        .range([height, 0]);
      svg.append('g')
        .call(d3.axisLeft(y));

      // line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#43853d')
        .attr('stroke-width', 0.5)
        .attr('d', d3.line()
          .x((d) => x(d.date))
          .y((d) => y(d.downloads)));
    });
}

createTotalChart();
