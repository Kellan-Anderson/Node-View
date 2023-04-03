import React from "react";
import { useReadCypher } from "use-neo4j";
import Bar from "../components/barchart";
import convert from "../helper/convert";

export default function BarWrapper({timestep}) {
  const key = '{groups: [{illicit: n.illicit, licit: n.licit, unknown: n.unknown}]}'
  const query = `match (n:meta {timestep: ${timestep}}) return ${key}`;
  /* match (n:meta {timestep: 1}) return n {groups: [{illicit: n.illicit, licit: n.licit, unknown: n.unknown}]} */

  const { loading, first } = useReadCypher(query);
  let result = <div>Loading</div>

  if(first === undefined) {
    console.log('Bar wrapper data undefined')
  } else {
    let data = first.get(key);
    console.log(data);
    data = 
      [
        {label: 'illicit', value: data.groups[0].illicit.low, group: 1},
        {label: 'licit', value: data.groups[0].licit.low, group: 2},
        {label: 'unknown', value: data.groups[0].unknown.low, group: 3},
      ]

    result = (
      <Bar data={data} />
    );
  }

  return result;
}