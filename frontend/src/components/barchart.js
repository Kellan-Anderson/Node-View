import React from "react";
import useD3 from "../hooks/useD3";
import * as d3 from 'd3';
import getColor from "../helper/color";

const Bar = ({ data, click }) => {
    const ref = useD3(
        (svg) => {
            const margin = {top: 30, right: 30, bottom: 70, left: 60};
            //const width = 300;
            //const height= 400;

            const dimensions = d3.select(".bar-container").node().getBoundingClientRect();
            // Constants used by the SVG
            const height = dimensions.height;
            const width = dimensions.width;

            // TODO
            const mockData = [
                {label: "illicit", value: 5, group: 1},
                {label: "licit", value: 10, group: 2},
                {label: "unknown", value: 30, group: 3},
            ]

            svg.selectAll("*").remove();

            svg
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", 
                      `translate(${margin.left},${margin.top})`
                );

            // X axis
            const x_axis = d3
                .scaleBand()
                .range([0, width])
                .domain(mockData.map(d => d.group))
            
            svg
                .selectAll("path")
                .append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x_axis))
                .selectAll("text")
                .attr("transform", "translate(-10,0) rotate(-45)")
                .style("text-anchor", "end");
            
            // Y axis
            const y_axis = d3
                .scaleLinear()
                .domain([0, 50])
                .range([0, height]);
               
            svg
                .selectAll("path")
                .append("g")
                .call(d3.axisLeft(y_axis));
               
            // Bars
            svg
                .selectAll(".barchart")
                .data(mockData)
                .enter()
                .append("rect")
                .attr("x", d => x_axis(d.group))
                .attr("y", (d) => height - y_axis(d.value))
                .attr("width", x_axis.bandwidth())
                .attr("height", (d) => {
                    return y_axis(d.value);
                })
                .attr("fill", (d) => getColor(d.group) );
            
            console.log("parent:", svg)
        },
        [data]
    )
    
    return (
        <div className="bar-container mx-2" onClick={click}>
            <svg
                ref={ref}
                className="barchart"
            ></svg>
        </div>
    );
}

export default Bar;