import Plotly from 'plotly.js';
import React, { useEffect } from 'react';


const PlotlyChart = () => {
    useEffect(() => {
        // Define your data and layout
        const data = [
            {
                x: [1, 2, 3, 4, 5],
                y: [10, 11, 12, 13, 14],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Line Chart',
            },
        ];

        const layout = {
            title: 'My React Plotly Chart',
            xaxis: { title: 'X-Axis' },
            yaxis: { title: 'Y-Axis' },
        };

        // Create the plot using Plotly.newPlot
        Plotly.newPlot('plotly-chart', data, layout);
    }, []);

    return (
        <div id="plotly-chart">
        </div>
    );
};

export default PlotlyChart;
