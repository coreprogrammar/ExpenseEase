import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ScatterPlot({ data = [], width = 600, height = 300, xLabel = 'Day', yLabel = 'Amount' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x) * 1.1])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) * 1.1])
      .range([innerHeight, 0])
      .nice();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'scatter-tooltip')
      .style('position', 'absolute')
      .style('padding', '6px 12px')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // X-axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));

    // X-axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('fill', '#333')
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .text(xLabel);

    // Y-axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(6));

    // Y-axis label
    g.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('fill', '#333')
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .text(yLabel);

    // Data points
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', innerHeight)
      .attr('r', 0)
      .attr('fill', '#4F46E5')
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('r', 8).attr('fill', '#6366F1');
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`x: ${d.x}<br/>y: $${d.y.toFixed(2)}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', function (event) {
        tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('r', 4).attr('fill', '#4F46E5');
        tooltip.transition().duration(200).style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('cy', d => yScale(d.y))
      .attr('r', 4);

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

export default ScatterPlot;
