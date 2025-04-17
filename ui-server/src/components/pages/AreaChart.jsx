import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function AreaChart({ data = [], width = 600, height = 300, xLabel = 'Date', yLabel = 'Total Spent' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map(d => ({ ...d, date: parseDate(d.date) }));

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.totalSpent)])
      .range([innerHeight, 0])
      .nice();

    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.totalSpent))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(''))
      .attr('stroke-opacity', 0.1);

    // Area path
    g.append('path')
      .datum(formattedData)
      .attr('fill', '#4F46E5')
      .attr('opacity', 0.5)
      .attr('d', area)
      .attr('clip-path', 'url(#clip)');

    // Line path (outline)
    g.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#4F46E5')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.totalSpent))
        .curve(d3.curveMonotoneX));

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px 10px')
      .style('background', 'rgba(0,0,0,0.75)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    g.selectAll('circle')
      .data(formattedData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.totalSpent))
      .attr('r', 4)
      .attr('fill', '#6366F1')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition().duration(150).attr('r', 7);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`Date: ${d3.timeFormat('%b %d')(d.date)}<br/>Amount: $${d.totalSpent.toFixed(2)}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', event => {
        tooltip.style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).transition().duration(150).attr('r', 4);
        tooltip.transition().duration(200).style('opacity', 0);
      });

    // X Axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text(xLabel);

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale));

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text(yLabel);

    return () => tooltip.remove();
  }, [data, width, height, xLabel, yLabel]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

export default AreaChart;
