<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCatrgoryId="getCatrgoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="margin-top: 10px" :data="records">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加Sku"
                @click="addSku(row)"
              >
              </HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改Spu"
                @click="updateSpu(row)"
              >
              </HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前Spu的全部Sku列表"
                @click="handler(row)"
              >
              </HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除Spu"
                  slot="reference"
                >
                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout="prev, pager, next, jumper,->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScene2="changeScene2" />
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      categoryIds: {},
      // 三级分类的id
      category3Id: "",
      page: 1, //当前页码
      limit: 3, //每页展示几条数据
      records: [], //spu列表数据
      total: 0, //数据总条数
      scene: 0, //0：显示Spu列表数据，1：添加/修改Spu，2：添加Sku // 并控制三级联动是否可操作
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  methods: {
    // 三级联动的自定义事件，将子组件的id传给父组件
    getCatrgoryId(categoryId) {
      this.categoryIds = categoryId;
      this.category3Id = categoryId.category3Id;
      this.getSpuList();
    },
    // 获取spu列表数据
    async getSpuList(pager = 1) {
      this.page = pager;
      // 携带3个参数page、limit、category3Id
      let result = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页器按钮回调（整合到getSpuList中了）
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getSpuList();
    // },
    // 分页器每页条数改变的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件SpuForm发请求(2个)
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改spu
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm，并调用其中的方法
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件的回调（SpuForm）
    changeScene({ scene, flag }) {
      // flag是为了区分保存按钮是添加还是修改
      // 切换场景
      this.scene = scene;
      // 重新获取数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku
    addSku(row) {
      // 切换场景为2
      this.scene = 2;
      // 父组件调用子组件的方法，让子组件发请求获取数据（3个请求）
      this.$refs.sku.getData(this.categoryIds, row);
    },
    // skuForm通知父组件修改场景
    changeScene2() {
      this.scene = 0;
    },
    // 查看sku列表
    async handler(row) {
      // 保存spu信息
      this.spu = row;
      console.log(row);
      // 让对话框可见
      this.dialogTableVisible = true;
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code === 200) {
        this.skuList = result.data;
        // 隐藏lodaing效果
        this.loading = false;
      }
    },
    // 对话框关闭前的回调
    close(done) {
      // 让loading属性再次变为真
      this.loading = true;
      // 清空sku列表数据
      this.skuList = [];
      // 关闭对话框
      done();
    },
  },
};
</script>

<style scoped>
</style>