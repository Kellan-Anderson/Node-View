import React from "react";
import Bar from "../components/barchart";
import { useReadCypher } from "use-neo4j";
import convert from "../helper/convert";

export default function BarSelector({ highlighted, clickFunction }) {
  const query = 'match (n:meta) with collect({timestep: n.timestep, illicit:n.illicit, licit:n.licit, unknown:n.unknown}) as meta return meta';
  const key = 'meta';

  const { loading, first } = useReadCypher(query);

  let result = <div>Loading</div>;

  console.log("below")
  console.log(loading, first)

  if(first === undefined) {
    console.log("Meta data is undefined")
  } else {
    let data = first.get(key);
    data = convert(data);

    console.log("bar data", data)
    result = (
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
        {data.map((d) => 
          {
            const borderColor = parseInt(d.timestep) === highlighted ? "red-600" : "blue-600";
            return (
              <div >
                <div 
                  className={`m-2 p-1 border-2 border-${borderColor} border-dashed self-center`}
                  key={d.timestep.low} 
                  onClick={() => clickFunction(d.timestep.low)}
                  >
                  <Bar data={d.groups} />
                </div>
                <p className="text-center">timestep {d.timestep.low}</p>
              </div>
            );
          }
        )}
      </div>
    );
    }

  return result;
}

