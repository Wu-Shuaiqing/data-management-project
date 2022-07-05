<template>
  <div>
    <!-- inline代表的是行内表单，一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cFrom">
      <el-form-item label="一级分类">
        <!-- v-model绑定的是value -->
        <el-select
          placeholder="请选择"
          v-model="cFrom.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cFrom.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cFrom.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      // 一级、二级、三级分类的数据
      category1: [],
      category2: [],
      category3: [],
      // 收集相应的一级、二级、三级分类的id
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1();
  },
  methods: {
    async getCategory1() {
      let result = await this.$API.attr.reqCategory1();
      if (result.code === 200) {
        this.category1 = result.data;
      }
    },
    // 一级分类的select时间回调，当一级发生变化时，获取二级的数据
    async handler1() {
      // 清除数据
      this.category2 = [];
      this.category3 = [];
      this.cFrom.category2Id = "";
      this.cFrom.category3Id = "";
      let result = await this.$API.attr.reqCategory2(this.cFrom.category1Id);
      if (result.code === 200) {
        this.category2 = result.data;
      }
    },
    async handler2() {
      this.category3 = [];
      this.cFrom.category3Id = "";
      let result = await this.$API.attr.reqCategory3(this.cFrom.category2Id);
      if (result.code === 200) {
        this.category3 = result.data;
      }
    },
    handler3() {
      this.$emit("getCatrgoryId", this.cFrom);
    },
  },
};
</script>

<style scoped>
</style>