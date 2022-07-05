<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCatrgoryId="getCatrgoryId" :show="!showTable" />
    </el-card>
    <el-card>
      <div v-show="showTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrList.length"
          @click="addAttr"
          >添加属性
        </el-button>
        <!-- 表格：展示商品属性 -->
        <el-table border :data="attrList" style="margin-top: 10px">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 4px 5px 4px 0"
                >{{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="editAttr(row)"
                style="margin-right: 8px"
              >
              </el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.attrName}？`"
                @onConfirm="daleteAttr(row.id)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改属性的位置 -->
      <div v-show="!showTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName">
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="showTable = true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值">
            <template slot-scope="{ row, $index }">
              <!-- input和span切换 -->
              <el-input
                placeholder="请输入属性值"
                v-model="row.valueName"
                size="mini"
                v-show="row.inputShow"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              >
              </el-input>
              <span
                v-show="!row.inputShow"
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}？`"
                @onConfirm="daleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="showTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 接收商品属性的字段
      attrList: [],
      // 控制表格的显示与隐藏
      showTable: true,
      // 收集新增属性/修改属性(每行的属性数据)
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //服务器需要区分是几级id
      },
      // 三级分类的3个id,用于再次发送请求获取数据
      categoryId: {},
      // 三级分类的id
      category3Id: "",
    };
  },
  methods: {
    // 自定义事件的回调
    getCatrgoryId(categoryId) {
      // 发请求获取商品基础属性的数据
      this.getAttrList(categoryId);
      console.log(categoryId);
      this.categoryId = categoryId;
      this.category3Id = categoryId.category3Id;
    },
    // 获取平台属性的数据（当确定三级分类，就向服务器发请求获取数据进行展示）
    async getAttrList(categoryId) {
      let result = await this.$API.attr.reqAttrList(categoryId);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性的按钮
    addAttr() {
      // 切换table的显示与隐藏
      this.showTable = false;
      // 清除数据(收集新增或修改的数据),并收集其中的一条数据:三级分类的id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改属性的按钮
    editAttr(row) {
      this.showTable = false;
      // 将选中的属性数据拷贝后赋值给attrInfo（为了防止两者指向同一对象，互相影响数据）
      // 用深拷贝：数据有多层，这里采用lodash中的深拷贝方法，也可以用JSON.parse(JSON.stringify(row))
      this.attrInfo = cloneDeep(row);
      // 每个属性值添加一个标记，用于input和span切换
      // 下面的写法可以添加inputShow字段，但不是响应式的数据，因为Vue无法探测普通的新增属性，（这是给一个对象添加一个新的属性，Vue监测不到变化）
      // this.attrInfo.attrValueList.forEach((item) => (item.inputShow = false));
      // 应使用$set
      this.attrInfo.attrValueList.forEach((item) =>
        this.$set(item, "inputShow", false)
      );
    },
    // 添加属性值按钮
    addAttrValue() {
      // attrId是属性的id，添加属性时，还没有相应的id，所以目前带给服务器的id是undefined
      // valueName是属性值
      // this.attrInfo.attrValueList是响应式数据，对于这个数组的变化，如push，是在变化数组里的元素，Vue底层是可以监测到的（响应式的数组方法）
      this.attrInfo.attrValueList.push({
        valueName: "",
        // 修改会携带attrId，新增时为undefined
        attrId: this.attrInfo.id,
        // 每个属性值添加一个标记，用于input和span切换
        inputShow: true,
      });
      // 新增的input自动聚焦(一定是数组的末尾项)
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // input切换为span（查看模式）
    toLook(row) {
      // 新增的属性值不能和已有的重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 数组里面最后一个元素就是row，判断时要排除，只让row和其他的做判断
        if (row !== item) {
          return row.valueName.trim() == item.valueName.trim();
        }
      });
      // 没输入内容不能切换（先删除空格再做判断）
      if (row.valueName.trim() == "") {
        this.$message.warning("请输入内容");
      } else if (isRepeat) {
        this.$message.error("请勿输入重复的属性值");
      } else {
        row.inputShow = false;
      }
    },
    // span切换为input（编辑模式）
    toEdit(row, index) {
      row.inputShow = true;
      // 获取input节点，自动聚焦
      // index是个数字，且是个变量，不能.index
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
      // 需要注意，如果当时使用v-if对span和input进行切换，点击span应切换为input，但对于浏览器而言，vue会等函数体全部执行完再去渲染DOM
      // 因此无法一点击就获取到input，需要用$nextTick，让元素的获取等渲染完毕再执行，保证input已经存在
      //（本次采用v-show，可以获取节点，但无法聚焦，因此还是使用$nextTick，获取更新后的DOM）
    },
    // 删除属性值气泡确认框确认回调（注意element版本）
    daleteAttrValue(index) {
      // 当前删除属性值的操作不需要发请求，点击保存的时候统一发送就可以了
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存(添加或修改属性)
    async addOrUpdateAttr() {
      // 整理参数:
      // 1.如果添加了值为空的属性,不应该提交给服务器
      // 2.提交给服务器的字段中不应该有inputShow字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤出属性值不为空的
          if (item.valueName !== "") {
            // 删除其中的inputShow属性（delete操作符是js原生）
            delete item.inputShow;
            return true;
          }
        }
      );
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.showTable = true;
        this.$message.success("保存成功");
        // 再次获取平台属性进行展示
        this.getAttrList(this.categoryId);
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    // 删除属性
    async daleteAttr(id) {
      let result = await this.$API.attr.reqDeleteAttr(id);
      if (result.code === 200) {
        this.$message.success("删除成功");
        this.getAttrList(this.categoryId);
      } else {
        this.$message.error("删除失败");
      }
    },
  },
};
</script>

<style scoped>
</style>