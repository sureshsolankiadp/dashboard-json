// src/components/HexbinMap.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HexbinMap = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const width = 928;
        const height = 581;
        const projection = d3.geoAlbersUsa().scale((4 / 3) * width).translate([width / 2, height / 2]);

        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto;");

        const hexbin = d3.hexbin()
            .extent([[0, 0], [width, height]])
            .radius(10)
            .x(d => d.xy[0])
            .y(d => d.xy[1]);
        const bins = hexbin(walmarts.map(d => ({ xy: projection([d.longitude, d.latitude]), date: d.date })))
            .map(d => (d.date = new Date(d3.median(d, d => d.date)), d))
            .sort((a, b) => b.length - a.length);

        const color = d3.scaleSequential(d3.extent(bins, d => d.date), d3.interpolateSpectral);
        const radius = d3.scaleSqrt([0, d3.max(bins, d => d.length)], [0, hexbin.radius() * Math.SQRT2]);

        svg.append("g")
            .attr("transform", "translate(580,20)")
            .append(() => legend({
                color,
                title: "Median opening year",
                width: 260,
                tickValues: d3.utcYear.every(5).range(...color.domain()),
                tickFormat: d3.utcFormat("%Y")
            }));

        svg.append("path")
            .datum(stateMesh)
            .attr("fill", "none")
            .attr("stroke", "#777")
            .attr("stroke-width", 0.5)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.geoPath(projection));

        svg.append("g")
            .selectAll("path")
            .data(bins)
            .join("path")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("d", d => hexbin.hexagon(radius(d.length)))
            .attr("fill", d => color(d.date))
            .attr("stroke", d => d3.lab(color(d.date)).darker())
            .append("title")
            .text(d => `${d.length.toLocaleString()} stores\n${d.date.getFullYear()} median opening`);
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default HexbinMap;
