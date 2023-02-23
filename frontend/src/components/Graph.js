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

      // Constants used by the SVG
      const height = 300;
      const width = 300;

      // Reset our graph in the case of a state change
      svg.selectAll("*").remove();

      // Add required aspects to the svg
      svg
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 300 300");

      // Define how we would like our simulation to act
      const simulation = d3
          .forceSimulation(data.nodes)
          .force("link", d3.forceLink().id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-3))
          .force("center", d3.forceCenter(width / 2, height / 2));
        
        // Functions to define what happens when a user clicks on an app
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
          .attr("r", 5)
          .attr("fill", (d) => {
            console.log(d)
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
      const ticked = () => {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
 
        node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
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
    <div className="graphContainer">
      <svg
      ref={ref}
      className="graph">

      </svg>
    </div>
  );
}

export default Graph;