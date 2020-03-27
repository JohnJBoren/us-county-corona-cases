import React from 'react';
import { useSelector } from 'react-redux';
import { geoPath } from 'd3-geo';
import { schemeRdYlGn } from 'd3-scale-chromatic';
import { scaleThreshold } from 'd3-scale';
import { descending, max } from 'd3-array';
import { xAccessor } from '../../../utils';
import Map from './Map';
import ThresholdLegend from './ThresholdLegend';
import * as topojson from 'topojson-client';
import TopCounties from './TopCounties';
import mostRecentDataSelector from '../../../redux/selectors/most.recent.data.selector';

const Maps = () => {
  const mostRecentData = useSelector(mostRecentDataSelector);
  const topology = useSelector(state => state.global.topology);
  const geoJson = topojson.feature(topology, topology.objects.counties);

  const width = 975;
  const height = 610;
  const path = geoPath();

  const colorScale = scaleThreshold()
    .domain([1, 10, 20, 50, 100, 200, 500, max(mostRecentData, xAccessor)])
    .range(schemeRdYlGn[8].reverse());

  const topCounties = mostRecentData.sort((a, b) => descending(xAccessor(a), xAccessor(b))).slice(0, 10);

  return (
    <div className="maps content">
      <Map colorScale={colorScale} width={width} height={height} geoJson={geoJson} path={path} />
      <TopCounties counties={topCounties} />
      <ThresholdLegend colorScale={colorScale} />
      <p className="citation">
        Data Source:{' '}
        <a className="link" href="https://github.com/nytimes/covid-19-data" target="_blank" rel="noopener noreferrer">
          NY Times
        </a>
      </p>
    </div>
  );
};

export default Maps;
