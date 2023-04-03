import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3';
import getColor from "../helper/color.js";

const Pie = ({ data }) => {
    const ref = useD3(
        (svg) => {
            
            // Set dimensions and margins
            const dimensions = d3.select(".pieTin").node().getBoundingClientRect();
            console.log(d3.select(".pieTin"))

            const height = dimensions.height;
            const width = dimensions.width;
            const margin = 40

            // Adjust radius to fit inside react page
            const radius = Math.min(width, height) / 2 - margin

            svg
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${width} ${height}`);

            const ratioData = [
                {label: "illicit", value: 0, group: 1},
                {label: "licit", value: 0, group: 2},
                {label: "unknown", value: 0, group: 3},
            ]
            
            data.forEach(node => {
                if(node.group === "1") {
                    ratioData[0].value++;
                }
                else if(node.group === "2") {
                    ratioData[1].value++;
                }
                else {
                    ratioData[2].value++;
                }
            });

            svg.selectAll("*").remove();

            // Append svg object to the page divider
            svg
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Refreshes the chart for each timestep

            // Give each part of the pie a value
            var pieGen = d3.pie()
                .value(function(d) {return d.value; })
                .sort(function(a, b) { return d3.ascending(a.key, b.key);} )

            // Give the data a path
            var u = svg
                .selectAll("*")
                .selectAll("path")
                .data(pieGen(ratioData));

            // Create the pie chart
            u
                .enter()
                .append('path')
                .merge(u)
                .transition()
                .duration(1000)
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', (d) => { return getColor(d.data.group) })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)

            // Remove any irrelevant groups
            u
                .exit()
                .remove()

        },
        [data]
    );

    // classname pieTin can be renamed to pie container
    return (
        <div className="pieTin h-full">
            <svg
                ref={ref}
                className="Pie inline-block absolute">

                </svg>
        </div>
    );
}

export default Pie