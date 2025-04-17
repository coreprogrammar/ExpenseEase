import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function DonutChart({ data = [], width = 300, height = 300, innerRadius = 70 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const pie = d3.pie()
      .value(d => d.amount)
      .sort(null);

    const arcs = pie(data);

    const container = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "donut-tooltip")
      .style("position", "absolute")
      .style("padding", "8px 12px")
      .style("background", "#333")
      .style("color", "#fff")
      .style("font-size", "13px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    container.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .transition()
      .duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // Hover animation & tooltip
    container.selectAll('path')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', d => {
            const [x, y] = arc.centroid(d);
            return `translate(${x * 0.1}, ${y * 0.1})`;
          });

        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.data.category}</strong><br>$${d.data.amount}`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0,0)');

        tooltip.transition().duration(200).style('opacity', 0);
      });

    // Labels
    container.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .text(d => d.data.category)
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#333');

    // Clean up tooltip on unmount
    return () => tooltip.remove();

  }, [data, width, height, innerRadius]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
}

export default DonutChart;
