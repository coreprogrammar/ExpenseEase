import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function LineChart({ data = [], width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const parseDate = d3.timeParse('%Y-%m-%d');

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => parseDate(d.date)))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalSpent)])
      .range([innerHeight, 0])
      .nice();

    const lineGenerator = d3.line()
      .x(d => xScale(parseDate(d.date)))
      .y(d => yScale(d.totalSpent))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4F46E5')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));
      
    g.append('g')
      .call(d3.axisLeft(yScale));
      
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}

export default LineChart;
