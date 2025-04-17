import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function StackedBarChart({ data = [], keys = [], width = 600, height = 300 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length || !keys.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const parseDate = d3.timeParse('%Y-%m-%d');

    data.forEach(d => {
      d.date = parseDate(d.date);
    });

    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
      .range([innerHeight, 0])
      .nice();

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSet2);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px 10px')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const groups = g.selectAll('g.layer')
      .data(stackedData)
      .enter().append('g')
      .attr('class', 'layer')
      .attr('fill', d => color(d.key));

    groups.selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xScale(d.data.date))
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('width', xScale.bandwidth())
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]));

    // Tooltip behavior
    groups.selectAll('rect')
      .on('mouseover', (event, d) => {
        const key = d3.select(event.currentTarget.parentNode).datum().key;
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`<strong>${key}</strong>: $${(d[1] - d[0]).toFixed(2)}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
        d3.select(event.currentTarget).attr('opacity', 0.7);
      })
      .on('mousemove', event => {
        tooltip.style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', event => {
        tooltip.transition().duration(200).style('opacity', 0);
        d3.select(event.currentTarget).attr('opacity', 1);
      });

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d')))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale));

    // X Axis Label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text('Date');

    // Y Axis Label
    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text('Amount');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`);

    keys.forEach((key, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(${i * 120}, 0)`);

      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', color(key));

      legendRow.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('fill', '#333')
        .attr('font-size', '12px')
        .text(key);
    });

    return () => tooltip.remove();
  }, [data, keys, width, height]);

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

export default StackedBarChart;
