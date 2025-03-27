import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BarChart({ data = [], width = 400, height = 200 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    console.log('BarChart data:', data);
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings

    // Define margins and calculate inner dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set svg dimensions
    svg.attr('width', width).attr('height', height);

    // X scale: uses the 'month' property of data objects
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, innerWidth])
      .padding(0.1);

    // Y scale: uses 'totalSpent'
    const yMax = d3.max(data, d => d.totalSpent) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    // Append group for chart elements with margins applied
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.month))
      .attr('y', d => yScale(d.totalSpent))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.totalSpent))
      .attr('fill', '#4F46E5');

    // Draw X axis with rotated labels
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');

    // Draw Y axis
    g.append('g')
      .call(d3.axisLeft(yScale));

  }, [data, width, height]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} />
    </div>
  );
}

export default BarChart;
