import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3';
import "./graph.css";

const Graph = ({data}) => {
  const ref = useD3(
    (svg) => {
      const height = 150; //d3.select(".graph").style("height");
      const width = 300; //d3.select(".graph").style("width");

      /*
      const drag = (simulation) => {
        const dragStarted = (event) => {
          if(!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        const dragged = (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        const dragended = (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3.drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragended);
      }*/
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

      const ticked = () => {
        link
          .attr("x1", function(d) { 
            console.log(d);
            return d.source.x;
          })
          .attr("y1", function(d) {
            console.log(d);
            return d.source.y;
          })
          .attr("x2", function(d) {
            console.log(d);
            return d.target.x;
          })
          .attr("y2", function(d) {
            console.log(d);
            return d.target.y;
          });

        node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      }

      const simulation = d3
          .forceSimulation(data.nodes)
          .force("link", d3.forceLink().id(d => d.name).links(data.links))
          .force("charge", d3.forceManyBody().strength(-30))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);

      const node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", (d) => {
          return "red";
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );
                  
      const link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
          return 3;
        });
    },
    [data.length]
  )

  return (
    <svg
    ref={ref}
    className="graph">

    </svg>
  );
}

export default Graph;