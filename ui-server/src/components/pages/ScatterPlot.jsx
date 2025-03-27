import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ScatterPlot({ data = [], width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([innerHeight, 0])
      .nice();
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    g.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', '#4F46E5');
    
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));
      
    g.append('g')
      .call(d3.axisLeft(yScale));
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}

export default ScatterPlot;
