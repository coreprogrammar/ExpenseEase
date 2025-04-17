import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BarChart({ data = [], width = 400, height = 200 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, innerWidth])
      .padding(0.1);

    const yMax = d3.max(data, d => d.totalSpent) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0])
      .nice();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px 10px')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.month))
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', '#4F46E5')
      .on('mouseover', (e, d) => {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`<strong>${d.month}</strong><br>$${d.totalSpent.toFixed(2)}`)
          .style('left', `${e.pageX + 10}px`)
          .style('top', `${e.pageY - 20}px`);
        d3.select(e.currentTarget).attr('fill', '#4338CA');
      })
      .on('mouseout', (e) => {
        tooltip.transition().duration(200).style('opacity', 0);
        d3.select(e.currentTarget).attr('fill', '#4F46E5');
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', d => yScale(d.totalSpent))
      .attr('height', d => innerHeight - yScale(d.totalSpent));

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(yScale));

    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text('Month');

    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text('Total Spent');

    return () => tooltip.remove();
  }, [data, width, height]);

  return (
    <div className="flex justify-center w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}

export default BarChart;
