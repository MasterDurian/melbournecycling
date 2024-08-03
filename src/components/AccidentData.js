import React from 'react';
import ChoroplethMap from './ChoroplethMap';
import Chart from './Chart';
import './AccidentData.css';

function AccidentData() {
    return (
        <div className="accident-data">

            <div className="main-content">
                <ChoroplethMap />
                <div className="charts">
                    <Chart title="Risk Assessment Of Bicycle Routes" />
                    <Chart title="Description" />
                </div>
            </div>
        </div>
    );
}

export default AccidentData;
