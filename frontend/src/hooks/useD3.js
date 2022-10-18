import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const useD3 = (renderGraph, dependancies) => {
    const ref = useRef();

    useEffect(() => {
        renderGraph(d3.select(ref.current));
        return () => {};
    }, dependancies);

    return ref;
}

export default useD3;