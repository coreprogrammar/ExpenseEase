import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function StackedBarChart({ data = [], keys = [], width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length || !keys.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const parseDate = d3.timeParse('%Y-%m-%d');

    data.forEach(d => {
      d.date = parseDate(d.date);
    });
    
    const stackGenerator = d3.stack().keys(keys);
    const series = stackGenerator(data);
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
      .range([innerHeight, 0])
      .nice();
    
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    g.selectAll('g')
      .data(series)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xScale(d.data.date))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', innerWidth / data.length - 2);
    
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));
      
    g.append('g')
      .call(d3.axisLeft(yScale));
  }, [data, keys, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}

export default StackedBarChart;
