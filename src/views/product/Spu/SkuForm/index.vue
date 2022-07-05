<template>
  <div>
    <el-form label-width="80px" :model="skuInfo">
      <el-form-item label="SPU名称"> {{ spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="attrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${attrValue.id}`"
                v-for="attrValue in saleAttr.spuSaleAttrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          :data="spuImgList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            width="80"
          ></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 图片列表
      spuImgList: [],
      //spu销售属性
      spuSaleAttrList: [],
      // 平台属性
      attrList: [],
      // 收集sku数据
      skuInfo: {
        // 第一类：父组件给予的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过双向绑定收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 第三类：自己写代码
        skuDefaultImg: "string", //默认图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spuName: "",
      // 收集图片的数据字段.但目前缺少isDefault字段,提交前需要整理
      imageList: [],
    };
  },
  methods: {
    // 获取SkuForm数据
    async getData(categoryIds, row) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spuName = row.spuName;
      // 获取图片数据
      let result1 = await this.$API.spu.reqSpuImgList(row.id);
      if (result1.code === 200) {
        let list = result1.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImgList = list;
      }
      // 获取spu的销售属性
      let result2 = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (result2.code === 200) {
        this.spuSaleAttrList = result2.data;
      }
      // 获取平台属性
      let result3 = await this.$API.attr.reqAttrList(categoryIds);
      if (result3.code === 200) {
        this.attrList = result3.data;
      }
    },
    // table复选框按钮的事件
    handleSelectionChange(params) {
      // 可以获取到用户选中的图片数据,但其中缺少isDefault字段
      this.imageList = params;
    },
    changeDefault(row) {
      this.spuImgList.forEach((item) => (item.isDefault = 0));
      row.isDefault = 1;
      // 收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮事件
    cancel() {
      // 让父组件切换场景为0
      this.$emit("changeScene2");
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮事件
    async save() {
      // 整理参数
      // 整理平台属性(方式一)
      // let arr = [];
      // this.attrList.forEach((item) => {
      //   if (item.attrIdAndValueId) {
      //     // 代表当前平台属性被用户选择了
      //     const [attrId, valueId] = item.attrIdAndValueId.split(":");
      //     // 携带给服务器的参数应该是对象
      //     let obj = { attrId, valueId };
      //     arr.push(obj);
      //   }
      // });
      // this.skuInfo.skuAttrValueList = arr;

      // 整理平台属性(方式二)
      this.skuInfo.skuAttrValueList = this.attrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce(
        (prev, item) => {
          if (item.attrIdAndValueId) {
            const [saleAttrId, saleAttrValueId] =
              item.attrIdAndValueId.split(":");
            prev.push({ saleAttrId, saleAttrValueId });
          }
          return prev;
        },
        []
      );
      // 整理图片数据
      this.skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      // 发请求
      let result = await this.$API.spu.reqSaveSku(this.skuInfo);
      if (result.code === 200) {
        this.$message.success("添加sku成功");
        // 让父组件切换场景为0
        this.$emit("changeScene2");
        // 清除数据
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style scoped>
</style>