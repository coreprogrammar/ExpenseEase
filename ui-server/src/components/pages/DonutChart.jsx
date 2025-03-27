import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function DonutChart({ data = [], width = 300, height = 300, innerRadius = 70 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeSet2); // or schemeCategory10, etc.

    svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const pieGenerator = d3
      .pie()
      .value(d => d.amount)
      .sort(null);

    const arcs = pieGenerator(data);

    // Draw slices
    svg.select('g').selectAll('path')
      .data(arcs)
      .enter().append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#fff')
      .style('stroke-width', '2px');

    // Optionally add labels
    svg.select('g').selectAll('text')
      .data(arcs)
      .enter().append('text')
      .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.data.category);

  }, [data, width, height, innerRadius]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} />
    </div>
  );
}

export default DonutChart;
