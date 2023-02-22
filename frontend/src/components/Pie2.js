import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3'

const Pie2 = ({ data }) => {
    const ref = useD3(
        (svg) => {
            // Set dimensions and margins
            var width = 450
            var height = 450
            var margin = 40

            // Adjust radius to fit inside react page
            var radius = Math.min(width, height) / 2 - margin

            // Append svg object to the page divider
            svg
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Dummy data
            var first_timestep = {a: 9, b: 20}
            var second_timestep = {a: 6, b: 16}

            // Color scheme
            var color = d3.scaleOrdinal()
                .domain(["a", "b"])
                .range(d3.schemeDark2);

            // Refreshes the chart for each timestep
            function update(data) {

                // Give each part of the pie a value
                var pieGen = d3.pie()
                    .value(function(d) {return d.value; })
                    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} )

                // Give the data a path
                var u = svg
                    .selectAll("path")
                    .data(pieGen(data));

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
                    .attr('fill', function(d){ return(color(d.data.key)) })
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 1)

                // Remove any irrelevant groups
                u
                    .exit()
                    .remove()
            }

            // Update the chart back to the first timestep
            update(first_timestep)
        },
        [data]
    );

    return (<>
        <svg
            ref={ref}
            className="Pie2"></svg>
    </>);
}

export default Pie2