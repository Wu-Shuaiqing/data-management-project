<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <!-- data：表格组件将来需要展示的数据（一定是数组类型的） -->
    <!-- border是给表格添加边框 -->
    <!-- column的属性 -->
    <!-- label：显示的标题 -->
    <!-- width：对应列的宽度 -->
    <!-- align：对齐方式 -->
    <!-- prop: 对应列内容的字段名 -->
    <!-- 注意:elementUI中的table组件是一列一列来展示数据的 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <!-- row是作用域插槽回传的每条数据 -->
          <img :src="row.logoUrl" alt="" style="height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器（当前页，数据总条数，每页展示的条数，每页可展示的条数设置，分页器布局，[页码按钮的数量]） -->
    <!-- @size-change="handleSizeChange" 改变每页展示的数据条数时触发,并传递选中的page-sizes
      @current-change="handleCurrentChange" 改变页码时触发,并传递页码-->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout=" prev, pager, next, jumper,->, sizes, total"
      :pager-count="7"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 对话框 -->
    <!-- :visible.sync用于控制对话框显示与隐藏 -->
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 表单 -->
      <!-- model属性:收集表单数据到哪个对象身上（将来表单验证也需要这个属性） -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据,不能使用v-model,因为不是表单元素 -->
          <!-- action:设置图片上传的地址 -->
          <!-- on-success:可以监测到图片上传成功,上传成功则执行一次 -->
          <!-- before-upload:上传图片之前执行一次 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2Mb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdataTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义校验规则
    // rule：规则，value：用户输入的文本，callback：放行函数
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 分页器第几页
      page: 1,
      // 每页展示数据条数
      limit: 5,
      // 总数据条数
      total: 0,
      // 当前页展示的数据
      records: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // 收集的品牌信息，这个对象身上属性不能乱写，需要根据接口文档
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证的规则
      rules: {
        //  品牌名称的规则
        // required：表示该字段必须校验
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change",
          // },
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        // logo的规则
        logoUrl: [{ required: true, message: "请选择品牌logo" }],
      },
    };
  },
  // 组件挂载完毕就发请求
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取列表数据的方法,分页器传递pager参数进来,不传则默认值为1
    async getPageList(pager = 1) {
      this.page = pager;
      // 获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(
        this.page,
        this.limit
      );
      console.log(result);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 改变每页展示的数据条数时触发
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit;
      // 发送请求
      this.getPageList();
    },
    // 点击添加品牌
    showDialog() {
      this.dialogFormVisible = true;
      // 清除数据,避免上次未提交的还显示在这里
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 修改品牌
    updateTradeMark(row) {
      // row:当前用户选中的品牌的信息
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给tmForm进行展示
      // 不能直接将row赋值给tmForm,而是利用扩展运算符,相当于将一份row的浅拷贝赋值给tmForm
      // 如果直接赋值,tmForm接收的就是服务器返回的这个品牌对象,表格中双向绑定的数据就能定位到这个品牌,弹窗里修改时即使不保存,界面也会发生相应变化
      // 拷贝以后赋值,tmForm接收的就是一个新的对象,弹窗修改即是在操作一组新的数据,并非当前定位的这个品牌.
      this.tmForm = { ...row };
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res,file都是是上传成功后返回给前端的数据
      this.tmForm.logoUrl = res.data; // 收集图片数据,将来要带给服务器
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2; //图片大小是否小于2M

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加品牌或修改品牌的确定按钮
    addOrUpdataTradeMark() {
      // 当全部验证字段通过，再去写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段符合条件success为true，否则为false
        if (success) {
          this.dialogFormVisible = false;
          // 发请求(添加/修改)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 弹出信息(饿了么组件message):添加成功/修改成功
            this.$message({
              message: this.tmForm.id ? "修改成功" : "添加成功",
              type: "success",
            });
            // 重新获取列表数据进行展示
            // 如果是添加品牌,跳转到最后一页;如果是修改品牌,应该留在当前页
            this.getPageList(
              this.tmForm.id
                ? this.page
                : Math.floor(this.total / this.limit + 1)
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      console.log(row);
      // 弹框
      this.$confirm(`是否确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            // 如果删除成功
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取列表数据
            this.getPageList(
              this.records.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>