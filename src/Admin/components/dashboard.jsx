import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Select } from "antd";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataTickets = {
    week: [400, 600, 500, 700],
    month: [2000, 2500, 2200],
    quarter: [7000, 7500, 6800],
};

const dataRepairs = {
    week: [5, 8, 6, 9],
    month: [20, 18, 22],
    quarter: [60, 65, 55],
};

const labels = {
    week: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    month: ["Tháng 1", "Tháng 2", "Tháng 3"],
    quarter: ["Q1", "Q2", "Q3"],
};

const ManagerDashboardContent = () => {
    const [timeRange, setTimeRange] = useState("week");

    return (
        <div style={{ padding: 20, maxWidth: "1200px", margin: "0 auto", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Select
                    value={timeRange}
                    onChange={setTimeRange}
                    style={{ width: 200 }}
                    options={[
                        { value: "week", label: "Tuần" },
                        { value: "month", label: "Tháng" },
                        { value: "quarter", label: "Quý" },
                    ]}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ width: "100%", maxWidth: "500px", height: "300px", marginBottom: 40 }}>
                    <Bar
                        data={{
                            labels: labels[timeRange],
                            datasets: [
                                {
                                    label: "Lượt vé",
                                    data: dataTickets[timeRange],
                                    backgroundColor: "#8884d8",
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Total of ticket'
                                }
                            }
                        }}
                        height={200}
                    />
                </div>
                <div style={{ width: "100%", maxWidth: "500px", height: "300px" }}>
                    <Pie
                        data={{
                            labels: labels[timeRange],
                            datasets: [
                                {
                                    label: "Số lần sửa chữa",
                                    data: dataRepairs[timeRange],
                                    backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Total of repair'
                                }
                            }
                        }}
                        height={200}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboardContent;