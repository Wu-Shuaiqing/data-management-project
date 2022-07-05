<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <el-dropdown>
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="body">
      <el-row :gutter="20">
        <el-col :span="12"><lineChart /></el-col>
        <el-col :span="12"><lineChart /></el-col>
      </el-row>
      <!-- 表格 -->
      <!-- :default-sort="{ prop: 'date', order: 'descending' }" -->
      <el-table :data="tableData" class="table" border>
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column label="搜索关键字"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        class="pagination"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import lineChart from "./lineChart";
export default {
  name: "Search",
  components: {
    lineChart,
  },
  data() {
    return {
      tableData: [{}],
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.table {
  font-size: 12px;
  margin: 10px 0;
}
.pagination {
  text-align: right;
}
</style>