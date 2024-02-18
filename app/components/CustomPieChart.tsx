import { VictoryPie } from 'victory';

function CustomPieChart({ data }) {
    return (
        <VictoryPie
            data={data}
            radius={({ datum }) => 30 + datum.y * 100}
            innerRadius={30}
            cornerRadius={5}
            padAngle={({ datum }) => 5 }
            animate={{duration: 2000}}
        />
    )
}

export default CustomPieChart;