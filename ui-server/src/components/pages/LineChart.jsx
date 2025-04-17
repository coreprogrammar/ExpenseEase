import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function LineChart({ data = [], width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 40, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const parseDate = d3.timeParse('%Y-%m-%d');

    const formattedData = data.map(d => ({
      date: parseDate(d.date),
      totalSpent: d.totalSpent
    }));

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, d => d.totalSpent)])
      .range([innerHeight, 0])
      .nice();

    const line = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.totalSpent))
      .curve(d3.curveMonotoneX);

    const svgContainer = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svgContainer
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat('%b %d')));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    // Line path with animation
    const path = g.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 3)
      .attr('d', line);

    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Hover points
    g.selectAll('circle')
      .data(formattedData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.totalSpent))
      .attr('r', 0)
      .attr('fill', '#4F46E5')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition().duration(200)
          .attr('r', 7)
          .attr('fill', '#4338ca');
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d3.timeFormat('%b %d')(d.date)}</strong><br/>$${d.totalSpent.toFixed(2)}`
          )
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 40}px`);
        focusLine
          .attr('x1', xScale(d.date))
          .attr('x2', xScale(d.date))
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .style('opacity', 0.4);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 40}px`);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition().duration(200)
          .attr('r', 4)
          .attr('fill', '#4F46E5');
        tooltip.style('opacity', 0);
        focusLine.style('opacity', 0);
      })
      .transition()
      .delay((d, i) => i * 80)
      .attr('r', 4);

    // Vertical hover line
    const focusLine = g.append('line')
      .attr('stroke', '#9ca3af')
      .attr('stroke-dasharray', '4 2')
      .style('opacity', 0);

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'linechart-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', '#1f2937')
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '13px')
      .style('opacity', 0);

    return () => tooltip.remove();
  }, [data, width, height]);

  return <svg ref={svgRef} width="100%" height="auto" />;
}

export default LineChart;
