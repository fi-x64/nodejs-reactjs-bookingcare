import { useState, useEffect, useRef } from "react";
import "./Statistic.scss";
import BarChart from "../../../components/Charts/BarChart";
import LineChart from "../../../components/Charts/LineChart";
import PieChart from "../../../components/Charts/PieChart";
import { UserData } from "./Data";

function Statistic({ statisticWeek, statisticPatientAddress }) {


    // useEffect(async () => {
    //     res = await handleStatisticBookingWeek();
    // }, res)

    // var [statisticWeek, setStatisticWeek] = useState(
    //     {
    //         labels: res.data.map((data) => data.date),
    //         datasets: [
    //             {
    //                 label: "Total",
    //                 data: res.data.map((data) => data.dateCount),
    //                 backgroundColor: [
    //                     "rgba(75,192,192,1)",
    //                     "#ecf0f1",
    //                     "#50AF95",
    //                     "#f3ba2f",
    //                     "#2a71d0",
    //                 ],
    //                 borderColor: "black",
    //                 borderWidth: 2,
    //             },
    //         ],
    //     }
    // );

    return (
        <div className="Statistic">
            <div style={{ width: 700 }}>
                <BarChart chartData={statisticWeek} />
            </div>
            <div style={{ width: 700 }}>
                <LineChart chartData={statisticPatientAddress} />
            </div>
            {/* <div style={{ width: 700 }}>
                <PieChart chartData={userData} />
            </div> */}
        </div>
    );
}

export default Statistic;