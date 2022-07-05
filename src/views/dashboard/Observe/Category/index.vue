<template>
  <el-card>
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <el-radio-group v-model="radio" size="small">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart" ref="chart"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      radio: "全部渠道",
    };
  },
  mounted() {
    let pieChart = echarts.init(this.$refs.chart);
    let option = {
      title: {
        text: "1048",
        subtext: "视频",
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "直播" },
            { value: 580, name: "运动" },
            { value: 484, name: "电影" },
            { value: 300, name: "综艺" },
          ],
        },
      ],
    };
    pieChart.setOption(option);
    // 绑定事件
    pieChart.on("mouseover", (params) => {
      // 获取鼠标hover的那条数据，重新设置标题
      pieChart.setOption({
        title: {
          text: params.value,
          subtext: params.name,
        },
      });
    });
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart {
  width: 100%;
  height: 252px;
}
</style>