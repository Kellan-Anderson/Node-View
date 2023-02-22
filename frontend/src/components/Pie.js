import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3'

const Pie = ({ data }) => {
    const ref = useD3(
        (svg) => {
            const width = 450;
            const height = 450;
            const margin = 40;


            const ratioData = [
                {label: "illicit", value: 0},
                {label: "licit", value: 0},
                {label: "unknown", value: 0},
            ]
            
            data.forEach(node => {
                if(node.group === "1") {
                    ratioData[0].value++;
                }
                else if(node.group === "2") {
                    ratioData[1].value++;
                }
                else {
                    ratioData.unknown++;
                }
            });

            const colorScale = d3
                .scaleSequential()
                .interpolator(d3.interpolateCool)
                .domain([0, ratioData.length])
            
            svg
                .selectAll("*")
                .remove();
            
            svg
                .attr('width', width)
                .attr('height', height)
                .append("g")
                .attr('transform', `translate(${width/2}, ${height/2})`);
            
            const arcGenerator = d3
                .arc()
                .innerRadius(0)
                .outerRadius(Math.min(height, width) - margin);
            
            const pieGenerator = d3
                .pie()
                .padAngle(0)
                .value(d => d.value);

            const arc = svg
                .selectAll()
                .data(pieGenerator(ratioData))
                .enter();
            
            arc
                .append('path')
                .attr('d', arcGenerator)
                .style('fill', (_, i) => colorScale(i))
                .style('stroke', '#ffffff')
                .style('stroke-width', 0);
               
            arc
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .text((d) => d.data.label)
                .style('fill', '#ffffff')
                .attr('transform', (d) => {
                    const [x, y] = arcGenerator.centroid(d);
                    return `translate(${x}, ${y})`;
                });
        },
        [data]
    );

    return (
        <div className="pieChart">
            <svg
                ref={ref}
                className="pie"></svg>
        </div>
    );
}


export default Pie;