import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function PieChart({ data = [], width = 400, height = 400, innerRadius = 80 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeSet2);
    const pieGenerator = d3.pie().value(d => d.amount).sort(null);
    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius);
    const arcs = pieGenerator(data);
    
    const g = svg.append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
    
    g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#fff')
      .attr('stroke-width', '2px');
    
    g.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.data.category);
  }, [data, width, height, innerRadius]);

  return <svg ref={svgRef} width={width} height={height} />;
}

export default PieChart;
