import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3';
import getColor from "../helper/color";
import "./graph.css";

/**
 * Graph component for our app, takes data and uses a custom hook to render our graph to the screen
 * @param {*} Data The data for our graph to render
 * @returns The graph component
 */
const Graph = ({data}) => {
  const ref = useD3(
    (svg) => {

      const dimensions = d3.select(".graphContainer").node().getBoundingClientRect();
      // Constants used by the SVG
      const height = dimensions.height;
      const width = dimensions.width;

      //console.log(`Width: ${width}, Height: ${height}`)

      // Reset our graph in the case of a state change
      svg.selectAll("*").remove();


      // Add required aspects to the svg
      svg
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("height", height)
        .attr("width", width);

      // Define how we would like our simulation to act
      const simulation = d3
          .forceSimulation(data.nodes)
          .force("link", d3.forceLink().id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-3))
          .force("center", d3.forceCenter(width / 2, height / 2));
        
        // Functions to define what happens when a user clicks on an app
        const checkX = (event) => {
          return event.subject.fx >= 0 && event.subject.fx <= width;
        }
        const checkY = (event) => {
          return event.subject.fy >= 0 && event.subject.fy <= width;
        }
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }
      
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }
      
        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        // Defines our links on the screen
        const link = svg
          .append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(data.links)
          .enter()
          .append("line")
          .attr("stroke-width", function(d) {
            return Math.sqrt(d.value);
          });

        // Defines our nodes on the screen
        const node = svg
          .append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(data.nodes)
          .enter()
          .append("circle")
          .attr("r", 7)
          .attr("fill", (d) => {
            return getColor(d.group);
          })
          .call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          );

        // Adds titles to nodes
        node.append("title").text((d) => { return d.id; });

      // Defines the action for how nodes act over time
      const limitPosition = (value, direction) => {
        if (value < 0) return 0;
        else if(direction === "x") return value > width ? width : value;
        else if(direction === "y") return value > height ? height : value;
      }

      const ticked = () => {
        link
          .attr("x1", (d) => limitPosition(d.source.x, "x") )
          .attr("y1", (d) => limitPosition(d.source.y, "y") )
          .attr("x2", (d) => limitPosition(d.target.x, "x") )
          .attr("y2", (d) => limitPosition(d.target.y, "y") );
 
        node
          .attr("cx", (d) => limitPosition(d.x, "x") )
          .attr("cy", (d) => limitPosition(d.y, "y") );
      }

      // Add the ticked method, nodes and links to our simulation
      simulation
        .nodes(data.nodes)
        .on("tick", ticked);

      simulation
        .force("link")
        .links(data.links);
    },
    [data]
  );

  // SVG Containing the graph
  return (
    <div className="graphContainer h-full w-full">
      <svg
      ref={ref}
      className="inline-block absolute">

      </svg>
    </div>
  );
}

export default Graph;