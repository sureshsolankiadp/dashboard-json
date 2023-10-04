import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

interface LinePlotProps {
    data: number[];
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
}

const LinePlot: React.FC<LinePlotProps> = ({
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40
}) => {
    const gx = useRef<SVGGElement | null>(null);
    const gy = useRef<SVGGElement | null>(null);
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data) as [number, number], [height - marginBottom, marginTop]);
    const line = d3.line<number>().x((d, i) => x(i)).y(y);

    useEffect(() => {
        if (gx.current) {
            d3.select(gx.current).call(d3.axisBottom(x));
        }
    }, [gx, x]);

    useEffect(() => {
        if (gy.current) {
            d3.select(gy.current).call(d3.axisLeft(y));
        }
    }, [gy, y]);

    return (
        <svg width={width} height={height}>
            <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
            <g ref={gy} transform={`translate(${marginLeft},0)`} />
            <path fill="none" stroke="currentColor" strokeWidth={1.5} d={line(data) || ""} />
            <g fill="white" stroke="currentColor" strokeWidth={1.5}>
                {data.map((d, i) => (<circle key={i} cx={x(i) || 0} cy={y(d) || 0} r={2.5} />))}
            </g>
        </svg>
    );
};

export default LinePlot;
