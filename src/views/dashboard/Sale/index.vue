<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 头部左侧 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="body">
      <el-row>
        <el-col :span="18">
          <barChart :title="title" :listState="listState" />
        </el-col>
        <el-col :span="6">
          <rankList :title="title" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import barChart from "./barChart";
import rankList from "./rankList";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  components: {
    barChart,
    rankList,
  },
  data() {
    return {
      activeName: "sale",
      // 收集日历数据
      date: [],
    };
  },
  computed: {
    // 计算属性：标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  methods: {
    setDay() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
>>> .el-card__header {
  border-bottom: none;
  padding-bottom: 0;
}
>>> .el-card__body {
  padding-top: 10px;
}
.box-card {
  margin: 10px 0;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 220px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
</style>