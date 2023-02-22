import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3'


const Donut = ({ data }) => {
    console.log("data:", data);
    const ref = useD3((svg) => {

        // Get the timestep data
        var licit = 0;
        var illicit = 0;
        var unknown = 0;

        data.forEach(node => {
            if(node.group === "1") {
                illicit++;
            }
            else if(node.group === "2") {
                licit++;
            }
            else {
                unknown++;
            }
        });
        
        const ratioData = [{licit}, {illicit}, {unknown}]

        // Set dimensions and margins
        const width = 450
        const height = 450
        const margin = 40

        // The radius of the pieplot is half the width or half the height
        const radius = Math.min(width, height) / 2 - margin

        // Append svg object to the divider
        svg
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Color licit and illicit nodes
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .padAngle(0)
            .value(function(d) {return d.value; });
        
       // const data_ready = pie()

        // Build the chart
        svg
            .selectAll("*")
            .data(pie(ratioData))
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(100)         // Size of donut hole
                .outerRadius(radius)      // Size of donut
            )
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

    }, [data]);


    return (
        <>
            <svg
                ref={ref}
                className='donut'
            ></svg>
        </>
    );
}


export default Donut;