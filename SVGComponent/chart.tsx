import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from './data.json';
import Plotly from 'plotly.js-basic-dist';

const data: any = us
const Chart = () => {
    const svgRef = useRef(null);

    const dummyData = [
        { name: 'Circle A', coordinates: [22.2587, 71.1924], value: 10 },
        { name: 'Circle B', coordinates: [26.8467, 80.9462], value: 20 },
        { name: 'Circle C', coordinates: [15.2993, 74.1240], value: 15 },
    ];

    const T = d3.transition().duration(300);
    const color = "red"

    useEffect(() => {
        const width = 975;
        const height = 610;
        const path = d3.geoPath();

        const zoom = d3.zoom()
            .scaleExtent([1, 7])
            .on("zoom", zoomed);

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, height])
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("style", "max-width: 100%; height: auto;")
            .on("click", reset);



        const g = svg.append("g");

        const states = g.append("g")
            .attr("fill", "#444")
            .attr("cursor", "pointer")
            .selectAll("path")
            .data(topojson.feature(data, data.objects.districts).features)
            .join("path")
            .on("click", clicked)
            .attr("d", path);

        states.append("title")
            .text((d: any) => d.properties.name);

        g.append("path")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path(topojson.mesh(data, data.objects.states, (a, b) => a !== b)));

        svg.select('.circles')
            .selectAll('circle')
            .data(dummyData)
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .attr('r', 0)
                        .attr('cx', (d) => path(d.coordinates[0]))
                        .attr('cy', (d) => path(d.coordinates[1]))
                        .attr('fill-opacity', 0.25)
                        .style('cursor', 'pointer')
                        .attr('pointer-events', 'all')
                        .call((enter) => {
                            enter.append('title');
                        }),
                (update) => update,
                (exit) => exit.call((exit) => exit.transition(T).attr('r', 0).remove())
            )
            .call((sel) => {
                sel
                    .transition()
                    .attr('fill', color)
                    .attr('stroke', 'black')
                    .attr('r', (d) => d.value);
            });

        svg.call(zoom);
        function reset() {
            states.transition().style("fill", null);
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
        }

        function clicked(event: { stopPropagation: () => void; target: any; }, d: d3.GeoPermissibleObjects) {
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            event.stopPropagation();
            states.transition().style("fill", null);
            d3.select(event.target).transition().style("fill", "red");
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                d3.pointer(event, svg.node())
            );
        }

        function zoomed(event: { transform: any; }) {
            const { transform } = event;
            g.attr("transform", transform);
            g.attr("stroke-width", 1 / transform.k);
        }
    }, [us]);

    return (
        <svg ref={svgRef}>
            <g className="circles" />
        </svg>
    );
}

export default Chart;
