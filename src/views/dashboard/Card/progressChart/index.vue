<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    // 初始化echarts实例
    let lineChart = echarts.init(this.$refs.charts);
    let option = {
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          // 柱宽度
          barWidth: 15,
          color: "orange",
          // 显示柱的背景
          showBackground: true,
          // 柱的背景颜色
          backgroundStyle: {
            color: "#eee",
          },
          // 文本标签
          label: {
            show: true,
            // 改变文本内容
            formatter: "|",
            color: "orange",
            position: "right",
          },
        },
      ],
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
    lineChart.setOption(option);
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>