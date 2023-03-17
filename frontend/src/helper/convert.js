export default function convert(data) {
  console.log("convert data: ", data)
  const rtn = [];
  data.forEach((d) => {
    rtn.push({
      timestep: d.timestep,
      groups: [
        {label: "illicit", value: d.illicit.low, group: 1},
        {label: "licit",   value: d.licit.low,   group: 2},
        {label: "unknown", value: d.unknown.low, group: 3},
      ]
    })
  })
  return rtn;
}