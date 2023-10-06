import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';

function PlotChart() {
    useEffect(() => {
        const data = [
            {
                type: 'scattergeo',
                mode: 'markers',
                locations: ['FRA', 'DEU', 'RUS', 'ESP'],
                marker: {
                    size: [20, 30, 15, 10],
                    color: [10, 20, 40, 50],
                    cmin: 0,
                    cmax: 50,
                    colorscale: 'Greens',
                    colorbar: {
                        title: 'Some rate',
                        ticksuffix: '%',
                        showticksuffix: 'last',
                    },
                    line: {
                        color: 'black',
                    },
                },
                name: 'europe data',
            },
        ];

        const layout = {
            geo: {
                scope: 'europe',
                resolution: 50,
            },
        };

        Plotly.newPlot('myDiv', data, layout);
    }, []);

    return <div id="myDiv" />;
}

export default PlotChart;
