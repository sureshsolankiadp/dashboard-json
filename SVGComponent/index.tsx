import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3-geo';
import * as d3Selection from 'd3-selection';
import topologyData from './data.json'

const SVGComponent: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3Selection.select(svgRef.current);

        const pathGenerator = d3.geoPath();

        svg
            .selectAll('path')
            .data(topologyData.objects.subunits.geometries)
            .enter()
            .append('path')
            .attr('d', (geometry: any) => {
                console.log('====================================');
                console.log(geometry);
                console.log('====================================');
                return (pathGenerator(geometry))
            })
            .style('fill', 'none')
            .style('stroke', 'blue');
    }, []);

    return <svg ref={svgRef} width={500} height={500}></svg>;
};

export default SVGComponent;



export const spike = (length: number, width = 8) =>
    `M${-width / 2},0L0,${-length}L${width / 2},0`;


export interface Root {
    type: string
    arcs: number[][][]
    transform: Transform
    objects: Objects
    crs: Crs
}

export interface Transform {
    scale: number[]
    translate: number[]
}

export interface Objects {
    districts: Districts
}

export interface Districts {
    type: string
    geometries: Geometry[]
}

export interface Geometry {
    arcs: number[][]
    type: string
    properties: Properties
}

export interface Properties {
    dt_code: string
    district: string
    st_code: string
    year: string
    st_nm: string
}

export interface Crs {
    type: string
    properties: Properties2
}

export interface Properties2 {
    name: string
}
