<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片，action：上传地址。 list-type：文件列表的类型。file-list：照片墙要展示的数据（数组），且数组元素必须有name、url属性 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}个未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性
        </el-button>
        <el-table border style="margin-top: 12px" :data="spu.spuSaleAttrList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名"></el-table-column>
          <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 将图片地址赋值给这个属性，用于预览
      dialogImageUrl: "",
      // 图片预览的对话框显示
      dialogVisible: false,
      // spu信息
      spu: {
        category3Id: 0,
        description: "", //描述
        spuName: "", //spu名称
        tmId: "", //品牌id
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 销售属性和属性值
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //品牌信息
      spuImgList: [], //SPU图片
      saleAttrList: [], //平台全部的销售属性
      attrIdAndName: "", //收集未选择的销售属性id
    };
  },
  methods: {
    // 照片墙删除某张图片时触发
    handleRemove(file, fileList) {
      // file：删除的图片
      // fileList：剩余的图片
      // console.log(file, fileList);
      // 收集照片墙图片的数据，暂时存放到spuImgList中（因为元素中有name、url属性，提交前需要处理）
      this.spuImgList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // 收集图片信息
      this.spuImgList = fileList;
    },
    // 初始化SpuForm数据（由父组件调用）
    async initSpuData(spu) {
      // 获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
        console.log("成功1");
      }
      // 获取品牌数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
        console.log("成功2");
      }
      // 获取SPU图片
      let spuImgResult = await this.$API.spu.reqSpuImgList(spu.id);
      if (spuImgResult.code == 200) {
        // 由于照片墙显示图片的数据是数组，里面的元素要有name和url字段，需要先处理一下数据
        let imgArr = spuImgResult.data;
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImgList = imgArr;
        console.log("成功3");
      }
      // 获取平台全部的销售属性（一共3个）
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
        console.log("成功4");
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      // 向spu对象的spuSaleAttrList中添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndName = "";
    },
    // 添加属性值
    addSaleAttrValue(row) {
      // 添加响应式属性：inputVisible控制input和button切换
      this.$set(row, "inputVisible", true);
      // inputValue收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    // el-input失去焦点
    handleInputConfirm(row) {
      // 验证：新增的属性值不能为空
      if (row.inputValue.trim() == "") {
        this.$message.warning("属性值不能为空");
        row.inputVisible = false;
        return;
      } else if (
        row.spuSaleAttrValueList.some(
          (item) => item.saleAttrValueName == row.inputValue.trim()
        )
      ) {
        this.$message.error("不能添加重复的属性值");
        return;
      }
      // 切换为显示button
      row.inputVisible = false;
      // 新增的销售属性值需要收集的字段有2个：baseSaleAttrId（销售属性的id）、saleAttrValueName（销售属性值）
      // 整理新增的销售属性值
      let newAttrValue = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue,
      };
      // 新增
      row.spuSaleAttrValueList.push(newAttrValue);
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数，对于修改操作，由于initSpuData获取数据时，spu被赋值，其中category3Id、id等已经有了，用户输入的数据也大部分双向绑定或整理完毕，需要整理的只有照片墙的数据
      // 对于图片，需要携带imgName、imgUrl字段
      this.spu.spuImageList = this.spuImgList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url,
        };
      });
      // 发请求
      let result = await this.$API.spu.reqAddOrUpadteSpu(this.spu);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("修改成功");
        // 通知父组件切换到场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清空数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加spu按钮的时候发请求（由父组件调用）
    async addSpuData(category3Id) {
      // 添加spu时收集category3Id
      this.spu.category3Id = category3Id;
      // 获取品牌数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
        console.log("成功2");
      }
      // 获取平台全部的销售属性（一共3个）
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
        console.log("成功4");
      }
    },
    // 取消按钮
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "修改" });
      // 清空数据
      // Object.assign：合并对象
      // this._data：所有响应式数据
      // this.$options：当前组件的配置对象，执行data()函数，返回的就是data中return的空对象
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 从已有的数组中过滤出来
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>