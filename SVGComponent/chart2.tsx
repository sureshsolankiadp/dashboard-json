import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import us from './us.json'
import * as topojson from 'topojson-client';

const Chart2 = () => {
    const svgRef = useRef(null);
    const [populationData, setPopulationData] = useState([]);
    let countymap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))

    useEffect(() => {
        // Fetch population data and process it.
        async function fetchPopulationData() {
            try {
                const response = await fetch('./population.json'); // Adjust the file path as needed.
                const rawData = await response.json();
                const data = rawData
                    .slice(1) // Removes a header line
                    .map(([p, state, county]) => ({
                        state,
                        fips: `${state}${county}`,
                        population: +p,
                    }));
                setPopulationData(data);
            } catch (error) {
                console.error('Error fetching or processing population data:', error);
            }
        }

        fetchPopulationData();
    }, []);

    useEffect(() => {
        // The D3 code for rendering the chart, using populationData.
        if (us && populationData.length > 0) {
            const data = populationData
                .map((d) => ({
                    ...d,
                    county: countymap.get(d.fips),
                    // state: statemap.get(d.state),
                }))
                .filter((d) => d.county)
                .sort((a, b) => d3.descending(a.population, b.population));

            const radius = d3.scaleSqrt([0, d3.max(data, (d) => d.population)], [0, 40]);

            const path = d3.geoPath();

            const svg = d3.select(svgRef.current)
                .attr('width', 975)
                .attr('height', 610)
                .attr('viewBox', [0, 0, 975, 610])
                .attr('style', 'width: 100%; height: auto; height: intrinsic;');

            svg
                .append('path')
                .datum(topojson.feature(us, us.objects.nation))
                .attr('fill', '#ddd')
                .attr('d', path);

            svg
                .append('path')
                .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-linejoin', 'round')
                .attr('d', path);

            const legend = svg
                .append('g')
                .attr('fill', '#777')
                .attr('transform', 'translate(915,608)')
                .attr('text-anchor', 'middle')
                .style('font', '10px sans-serif')
                .selectAll()
                .data(radius.ticks(4).slice(1))
                .join('g');

            legend
                .append('circle')
                .attr('fill', 'none')
                .attr('stroke', '#ccc')
                .attr('cy', (d) => -radius(d))
                .attr('r', radius);

            legend
                .append('text')
                .attr('y', (d) => -2 * radius(d))
                .attr('dy', '1.3em')
                .text(radius.tickFormat(4, 's'));

            const format = d3.format(',.0f');
            svg
                .append('g')
                .attr('fill', 'brown')
                .attr('fill-opacity', 0.5)
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .selectAll()
                .data(data)
                .join('circle')
                .attr('transform', (d) => `translate(${centroid(d.county)})`)
                .attr('r', (d) => radius(d.population))
                .append('title')
                .text((d) => `${d.county.properties.name}, ${d.state.properties.name}\n${format(d.population)}`);
        }
    }, [us, populationData]);

    return <svg ref={svgRef}></svg>;
};

export default Chart2;
