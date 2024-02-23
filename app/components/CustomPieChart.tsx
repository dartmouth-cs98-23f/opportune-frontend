import { VictoryPie } from 'victory';

function CustomPieChart({ data }) {
    return (
        <VictoryPie
            data={data}
            innerRadius={60}
            radius={100}
            cornerRadius={5}
            padAngle={({ datum }) => 5}
            style={{ labels: { fontSize: 10, fontWeight: 'bold'} }}
            colorScale={["#173F5F", "#ED553B", "#3CAEA3", "#F6D55C", "#20639B"]}
        />
    )
}

export default CustomPieChart;