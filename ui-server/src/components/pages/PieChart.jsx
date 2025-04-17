import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function PieChart({ data = [], width = 400, height = 400, innerRadius = 80 }) {
  const svgRef = useRef();
  const [activeCategories, setActiveCategories] = useState(new Set(data.map(d => d.category)));

  useEffect(() => {
    if (!data.length) return;

    const filteredData = data.filter(d => activeCategories.has(d.category));
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 40;
    const boundedWidth = width - margin * 2;
    const boundedHeight = height - margin * 2;

    const radius = Math.min(boundedWidth, boundedHeight) / 2;
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const pie = d3.pie().value(d => d.amount).sort(null);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px 10px')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const arcs = pie(filteredData);

    const path = g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('fill', d => color(d.data.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (e, d) {
        d3.select(this).transition().duration(200).attr('transform', 'scale(1.08)');
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(`<strong>${d.data.category}</strong>: $${d.data.amount}`)
          .style('left', e.pageX + 10 + 'px')
          .style('top', e.pageY - 20 + 'px');
      })
      .on('mousemove', function (e) {
        tooltip
          .style('left', e.pageX + 10 + 'px')
          .style('top', e.pageY - 20 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('transform', 'scale(1)');
        tooltip.transition().duration(200).style('opacity', 0);
      });

    // Animate pie chart slices
    path
      .transition()
      .duration(800)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate(
          { startAngle: 0, endAngle: 0 },
          d
        );
        return t => arc(interpolate(t));
      });

    return () => tooltip.remove();
  }, [data, width, height, innerRadius, activeCategories]);

  const toggleCategory = (category) => {
    const newSet = new Set(activeCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setActiveCategories(newSet);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {data.map(d => (
          <div
            key={d.category}
            className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
              activeCategories.has(d.category)
                ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                : 'bg-gray-100 border-gray-300 text-gray-500 line-through'
            }`}
            onClick={() => toggleCategory(d.category)}
          >
            {d.category}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PieChart;
