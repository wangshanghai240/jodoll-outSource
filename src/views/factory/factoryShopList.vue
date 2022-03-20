<!--
 * @FileDescription: 工厂商品
 * @Author: wangpenghui
 -->
<template>
  <jod-tableList
    :dataSource="gridData"
    :columns="columns"
    :options="options"
    ref="shopList"
    :pagination="pagination"
    :dataTotal="dataTotal"
    @handleChangePage="handleChangePage"
    :expandAll="expandAll"
    :expandArr="expandArr"
    @handleSizeChange="handleSizeChange"
    @expandChange="expandChange"
    @handleSelectionChange="handleSelectionChange"
  >
    <template v-slot:header_input>
      <el-button
        type="primary"
        :size="size"
        plain
        round
        @click="searchHandler()"
      >
        {{searchShow?'搜索':'返回'}}
      </el-button>
    </template>
    <!-- 自定义行 -->
    <template slot="sourceType" slot-scope="{ row }">
      <span>{{
        row.sourceType
          ? sourceTypeData[row.sourceType - 1].label
          : row.sourceType
      }}</span>
    </template>
    <template slot="lx" slot-scope="{ row }">
      <span>{{ row.lx ? lx[row.lx - 1].label : row.lx }}</span>
    </template>
    <template slot="state" slot-scope="{ row }">
      <svg-icon
        icon-class="state2"
        class="circle"
        v-if="row.state == 0"
        style="background: #67c23a; font-size: 18px"
        @click="nodes(row)"
      />
      <svg-icon
        icon-class="state2"
        class="circle"
        v-else-if="row.state == 1"
        style="background: #e6a23c; font-size: 18px"
        @click="nodes(row)"
      />
      <svg-icon
        icon-class="state2"
        class="circle"
        v-else-if="row.state == 2"
        style="background: #f56c6c; font-size: 18px"
        @click="nodes(row)"
      />
    </template>
    <!-- 		<template slot="priority" slot-scope="{row,$index}">
			<span>{{row.priority||row.priority==0?priority[row.priority].label:row.priority}}</span>
		</template> -->
    <template slot="dqzt" slot-scope="{ row }">
      <span v-if="row.dqzt == 6.2">{{
        row.dqzt ? dqzt[7 - 1].label : row.dqzt
      }}</span>
      <span v-if="row.dqzt == 6.4">{{
        row.dqzt ? dqzt[8 - 1].label : row.dqzt
      }}</span>
      <span v-if="row.dqzt == 6.6">{{
        row.dqzt ? dqzt[9 - 1].label : row.dqzt
      }}</span>
      <span v-if="row.dqzt == 6.8">{{
        row.dqzt ? dqzt[10 - 1].label : row.dqzt
      }}</span>
      <span v-if="row.dqzt >= 7">{{
        row.dqzt ? dqzt[row.dqzt + 3].label : row.dqzt
      }}</span>
      <span v-if="row.dqzt <= 6">{{
        row.dqzt ? dqzt[row.dqzt - 1].label : row.dqzt
      }}</span>
    </template>
    <template slot="prenatalSampleState" slot-scope="{ row }">
      <span v-if="row.prenatalSampleState == 0">{{
        row.prenatalSampleState
          ? prenatalSampleState[row.prenatalSampleState].label
          : prenatalSampleState[0].label
      }}</span>
      <span v-if="row.prenatalSampleState == 1" style="color: #3cb371">{{
        row.prenatalSampleState
          ? prenatalSampleState[row.prenatalSampleState].label
          : prenatalSampleState[0].label
      }}</span>
      <span v-if="row.prenatalSampleState == 2" style="color: #9c3328">{{
        row.prenatalSampleState
          ? prenatalSampleState[row.prenatalSampleState].label
          : prenatalSampleState[0].label
      }}</span>
    </template>
    <template slot="qiliaoState" slot-scope="{ row }">
      <span>{{
        row.qiliaoState
          ? qiliaoOptions[row.qiliaoState].label
          : qiliaoOptions[0].label
      }}</span>
    </template>
    <!-- 		<template slot="line" slot-scope="{row,$index}">
			<el-progress :percentage="row.line"></el-progress>
		</template> -->
    <!-- 行按钮 -->
    <template slot="operate" slot-scope="{ row }">
      <div style="display: flex; flex-wrap: wrap; justify-content: center">
        <el-button
          :size="size"
          type="success"
          plain
          class="marginRight10"
          @click="Delivery(row)"
          v-has:outCheck
          >出货检</el-button
        >
        <el-dropdown
          split-button
          type="primary"
          :size="size"
          trigger="click"
          class="marginRight10"
          @click="Warehousing(row)"
        >
          <span class="el-dropdown-link"> 入库检 </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="check(row)" v-has:dyeConfirm>
              <span>齐料查看确认</span>
            </el-dropdown-item>
            <el-dropdown-item
              @click.native="sampleCheckChange(row)"
              v-has:edition
            >
              <span>产前样批版</span>
            </el-dropdown-item>
            <!-- <el-dropdown-item @click.native="yaodian(row)">
							<span>批版</span>
						</el-dropdown-item> -->
            <el-dropdown-item @click.native="track(row)">
              <span>跟踪日志</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="quality(row)">
              <span>品控日志</span>
            </el-dropdown-item>
			<el-dropdown-item @click.native="orderUp(row,'1')">
			  <span>面料发货</span>
			</el-dropdown-item>
			<el-dropdown-item @click.native="orderUp(row,'2')">
			  <span>辅料发货</span>
			</el-dropdown-item>
            <el-dropdown-item @click.native="testing(row)" v-has:examining>
              <span>检测报告确认</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="checkdan(row)" v-has:craft>
              <span>查看工艺单</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="confirm(row)" v-has:confirm>
              <span>确认完结</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="success" class="marginTop10 marginLeft0" plain :size="size" @click="updateShop(row)">修改</el-button> -->
      </div>
    </template>
    <!-- 展开 -->
    <template slot="expandForm" slot-scope="{ row }">
      <expand-size
        v-model="row.expandData"
        :isUpdate="true"
        v-if="row.expandData && row.expandData.length !== 0"
      ></expand-size>
      <div v-else style="height: 85px; text-align: center; line-height: 85px">
        暂无数据
      </div>
    </template>
    <!-- 表外 -->
    <template v-slot:content_context>
      <!-- 搜索 -->
      <jod-dragDialog
        v-model="searchDialog"
        title="搜索"
        :dialogStyle="{ width: '750', widthType: 'px' }"
      >
        <jod-formSearch
          labelWidth="120px"
          ref="factoryShopForm"
          :searchData="searchData"
          :searchForm="factoryShopForm"
          :searchHandle="factoryShopHandle"
        >
        </jod-formSearch>
      </jod-dragDialog>
      <!-- 明细编辑 -->
      <jod-dragDialog
        v-model="expandEditDialog"
        title="明细编辑"
        @closeDio="closeDio"
        :dialogStyle="{ width: '400', widthType: 'px' }"
      >
        <jod-formSearch
          labelWidth="120px"
          ref="expandEditForm"
          :searchData="expandEditData"
          :searchForm="expandEditForm"
          :searchHandle="expandEditHandle"
        >
        </jod-formSearch>
      </jod-dragDialog>
      <!-- 产前样 -->
      <jod-dragDialog
        v-model="SampleCheckDialog"
        class="sampleCheck"
        title="提示"
        :dialogStyle="{ width: '300', widthType: 'px' }"
        top="30vh"
      >
        <h2>是否确认产前样</h2>
        <h4>当前状态 : {{ prenatalSampleState[sampleCheckBol].label }}</h4>
        <div>
          <el-button
            type="primary"
            :size="size"
            :loading="openSampleCheck1"
            :disabled="openSampleCheck2"
            @click="openSampleCheck(true)"
            >确认</el-button
          >
          <el-button
            type="danger"
            :size="size"
            :loading="openSampleCheck2"
            plain
            :disabled="openSampleCheck1"
            @click="openSampleCheck(false)"
            >未确认</el-button
          >
        </div>
      </jod-dragDialog>
      <!-- 跟踪日志 -->
      <jod-dragDialog
        class="traceDialog"
        v-model="traceDialog"
        title="跟踪日志"
        :dialogStyle="{ width: '80', widthType: '%' }"
        :modalClose="false"
      >
        <trace-list
          v-model="traceData"
          source="factory"
          v-if="traceDialog"
        ></trace-list>
      </jod-dragDialog>
      <!-- 品控详情 -->
      <jod-dragDialog
        class="traceDialog"
        v-model="qualityControl"
        :dialogStyle="{ width: '50', widthType: '%' }"
        :modalClose="false"
        :drag="true"
        :top="'10px'"
      >
        <template v-slot:title>
          <h1 style="font-weight: bold; text-align: center; margin: 0">
            品 控 详 情
          </h1>
        </template>
        <quality-list v-model="shopId" v-if="qualityControl"></quality-list>
      </jod-dragDialog>
      <!--工作联系单-->
      <jod-dragDialog
        v-model="lianDialog"
        title="工作联系单"
        :dialogStyle="{ width: '400', widthType: 'px' }"
        @closeDio="lianCloseDio"
      >
        <lianxian-up
          v-model="beizhu"
          v-if="lianDialog"
          @lianClose="lianClose(arguments)"
        ></lianxian-up>
      </jod-dragDialog>
      <!-- 节点进度 -->
      <jod-dragDialog
        v-model="nodesDialog"
        title="进度"
        :dialogStyle="{ width: '800', widthType: 'px' }"
      >
        <nodes-list v-model="goodid" v-if="nodesDialog"></nodes-list>
      </jod-dragDialog>
      <!--入库-->
      <!-- 			<jod-dragDialog v-model="pinDialog" title="出入库" :dialogStyle="{width: '800',widthType: 'px'}" @closeDio="pinCloseDio">
				<pinkong-up v-model="pinData" v-if="pinDialog" @pinClose="pinClose(arguments)"></pinkong-up>
			</jod-dragDialog> -->
      <!--齐料确认-->
      <jod-dragDialog v-model="qiDialog" title="齐料查看确认">
        <qiliao-up
          v-model="qidata"
          v-if="qiDialog"
          @qiClose="qiClose(arguments)"
        ></qiliao-up>
      </jod-dragDialog>
      <!-- 质量检测 -->
      <jod-dragDialog
        v-model="qualityDialog"
        title="质量检测"
        top="30vh"
        :dialogStyle="{ width: '400', widthType: 'px' }"
      >
        <jod-formSearch
          labelWidth="120px"
          ref="qualityForm"
          :searchData="qualityData"
          :searchForm="qualityForm"
          :searchHandle="qualityHandle"
        >
        </jod-formSearch>
      </jod-dragDialog>
      <!--批版-->
      <!-- <jod-dragDialog v-model="piDialog" title="批版" :dialogStyle="{width: '800',widthType: 'px'}">
				<piban-up v-model="pbdata" v-if="piDialog"></piban-up>
			</jod-dragDialog> -->
      <!-- 工艺单 -->
      <jod-dragDialog
        v-model="CheckdanDialog"
        class="sampleCheck"
        title="工艺单"
        top="30vh"
      >
        <img :src="picture" />
      </jod-dragDialog>
      <!--出货检-->
      <jod-dragDialog
        v-model="shipmentDio"
        title="出货检"
        @closeDio="shipmentClose"
        top="50px"
        :dialogStyle="{ width: '1200', widthType: 'px' }"
        :drag="true"
      >
        <shipment-list
          v-model="shipmentData"
          v-if="shipmentDio"
          @shipmentClose="shipmentClose(arguments)"
        ></shipment-list>
      </jod-dragDialog>
      <!-- 入库检 -->
      <jod-dragDialog
        v-model="detailsDialog"
        class="tableDialog"
        style="padding-bottom: 50px"
        top="50px"
        :drag="true"
        v-has:putCheck
        :dialogStyle="{ width: '1200', widthType: 'px' }"
      >
        <template slot="title">
          <div style="display: flex; justify-content: space-between">
            <div style="font-size: 20px">入库检查</div>
            <!-- <el-button style="margin-right: 50px;" size="mini" type="primary" @click="goWarehousList">历史记录</el-button> -->
          </div>
        </template>
        <detail-item
          v-if="detailsDialog"
          :warehousValue="warehousValue"
          @closeDetail="closeDetail"
        ></detail-item>
      </jod-dragDialog>
      <!--工艺单-->
      <jod-dragDialog
        v-model="exportDio"
        title="工艺单"
        :dialogStyle="{ width: '1200', widthType: 'px' }"
      >
        <export-list v-model="orderid" v-if="exportDio"></export-list>
      </jod-dragDialog>
	  <!-- 面料辅料发货 -->
	  <jod-dragDialog v-model="upDio" :title="orderType==='1'?'面料发货':'辅料发货'" class="tableDialog"
	  	:dialogStyle="{width: '80',widthType: '%'}">
	  	<orderUp v-model="seletionId" :orderType="orderType" v-if="upDio"></orderUp>
	  </jod-dragDialog>
      <div class="categoryUpload" style="margin-bottom: 16px">
        <el-button type="primary" :size="size" @click="lianxianup">
          发起联系单
        </el-button>
        <el-button type="danger" :size="size" @click="exportBOM">
          辅料BOM清单导出
        </el-button>
      </div>
    </template>
  </jod-tableList>
</template>

<script>
import factoryShopList from "@/api/factory/factoryShopList.js";
import trace from "../controller/traceLog/traceLogList.vue";
import expandSize from "../orderShop/components/expandSize.vue";
import quality from "../controller/qualityLog/qualityList.vue";
import shipment from "./components/deliveryList.vue";
import { throttle, debounce } from "@/utils/validate.js";
import { loading } from "@/utils";
import { mapGetters } from "vuex";
import orderUp from './components/shopUp/orderUp.vue'
import nodes from "./components/nodes.vue";
import lianxidan from "../orderShop/components/lianxidanT.vue";
import pinkong from "./components/pinkong.vue";
import qiliao from "./components/qiliao.vue";
import piban from "./components/piban.vue";
import detailItem from "./components/warehouseDetails.vue";
import exportlist from "../technology/components/export.vue";
export default {
  computed: {
    ...mapGetters(["size", "token", "userInfo"]),
  },
  components: {
    traceList: trace,
    qualityList: quality,
    expandSize: expandSize,
    lianxianUp: lianxidan,
    nodesList: nodes,
    pinkongUp: pinkong,
    qiliaoUp: qiliao,
    pibanUp: piban,
    shipmentList: shipment,
    detailItem: detailItem,
    exportList: exportlist,
	'orderUp':orderUp,
  },
  data() {
    return {
	  searchShow:true,//是否显示搜索按钮
	  upDio:false,//面料辅料发货
	  orderType:'1',//发货类型1为面料2为辅料
	  seletionId:null,//发货必要id
      //工艺单
      exportDio: false,
      orderid: [],
      orderNumbers: [],
      CheckdanDialog: false,
      picture: "",
      piDialog: false,
      pbdata: "",
      qiDialog: false,
      qidata: "",
      shipmentDio: false, //出货检
      shipmentData: "",
      nodesDialog: false,
      goodid: "",
      lianDialog: false,
      hezhu: [],
      loading: null,
	    confirmData:{},
      gridData: [], //源数据
      columns: factoryShopList.columns,
      options: factoryShopList.options,
      sourceTypeData: factoryShopList.sourceTypeData, //来源类型
      lx: factoryShopList.lx, //类型
      dqzt: factoryShopList.dqzt, //状态
      priority: factoryShopList.priorityOptions,
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
      dataTotal: 0, //总条数
      multipleSelection: [], //勾选
      expandAll: null, //展开项
      expandArr: [],
      shopId: null, //商品id
      traceData: {
        id: "",
        code: "",
        name: "",
        status: "",
        routers: "",
      },
      //搜索
      searchDialog: false,
      searchData: JSON.parse(JSON.stringify(factoryShopList.searchData)),
      factoryShopForm: factoryShopList.factoryShopForm,
      factoryShopHandle: [
        {
          label: "搜索",
          type: "primary",
          loading: false,
          handle: (res) => {
            this.$refs["factoryShopForm"].$refs["searchForm"].validate(
              (valid) => {
                if (valid) {
                  console.log("1", this.searchData);
                  this.factoryShopHandle[0].loading = true;
                  this.pagination.currentPage = 1;
                  this.getShopList()
                    .then((res) => {
                      let { data } = res;
                      this.searchDialog = false;
                      this.$message.success("搜索成功");
                      this.factoryShopHandle[0].loading = false;
                      this.gridData = data.records;
                      this.dataTotal = data.total;
                    })
                    .catch((err) => {
                      this.factoryShopHandle[0].loading = false;
                    });
                } else {
                  console.log("error submit!!");
                  return false;
                }
              }
            );
          },
          hide: false,
        },
        {
          label: "重置",
          type: "warning",
          handle: (res) => {
            this.$refs["factoryShopForm"].$refs["searchForm"].resetFields();
          },
          hide: false,
        },
        {
          label: "取消",
          type: "info",
          handle: (res) => {
            this.searchDialog = false;
          },
          hide: false,
        },
      ],
      //展开
      expandChangeRow: null,
      expandColumns: factoryShopList.expandColumns,
      expandEditDialog: false,
      expandEditData: {
        id: "",
        count: "",
        size: "",
      },
      expandEditForm: factoryShopList.expandEditForm,
      expandEditHandle: [
        {
          label: "提交",
          type: "primary",
          loading: false,
          handle: (res) => {
            this.$refs["expandEditForm"].$refs["searchForm"].validate(
              (valid) => {
                if (valid) {
                  console.log(this.expandEditData);
                  this.expandEditHandle[0].loading = true;
                  factoryShopList
                    .put(this.api.category, this.expandEditData)
                    .then((res) => {
                      this.$set(
                        this.expandChangeRow,
                        "count",
                        this.expandEditData["count"]
                      );
                      this.$set(
                        this.expandChangeRow,
                        "size",
                        this.expandEditData["size"]
                      );
                      this.expandEditHandle[0].loading = false;
                      this.$message.success("修改成功");
                      this.expandEditDialog = false;
                    })
                    .catch((err) => {
                      this.expandEditHandle[0].loading = false;
                    });
                } else {
                  console.log("error submit!!");
                  return false;
                }
              }
            );
          },
          hide: false,
        },
        {
          label: "取消",
          type: "info",
          handle: (res) => {
            this.$refs["expandEditForm"].$refs["searchForm"].resetFields();
            this.expandEditDialog = false;
          },
          hide: false,
        },
      ],
      //产前样
      SampleCheckDialog: false,
      prenatalSampleState: factoryShopList.prenatalSampleState,
      sampleCheckBol: 0,
      openSampleCheck1: false,
      openSampleCheck2: false,
      //齐料
      qiliaoOptions: factoryShopList.qiliaoOptions,
      //跟踪日志
      traceDialog: false,
      //品控日志
      qualityControl: false,
      purchaseId: "", //id
      // 确认完结
      dialogFormVisible: false,
      qualityDialog: false, //质量检测
      qualityData: {
        qualityCheck: "",
        fileUpload: [],
        surfaceMaterialNo: "",
      },
      qualityForm: [
        {
          type: "RadioButton",
          label: "检测:",
          prop: "qualityCheck",
          change: (res) => {
            if (res == 2 && this.qualityForm.length == 1) {
              let arr = [
                {
                  type: "Input",
                  label: "质检编号:",
                  prop: "surfaceMaterialNo",
                  placeholder: "请输入质检编号",
                  rules: [
                    {
                      required: true,
                      message: "请输入质检编号",
                      trigger: "blur",
                    },
                  ],
                },
                {
                  type: "fileUpload",
                  label: "检测报告:",
                  headers: { Authorization: this.token },
                  prop: "fileUpload",
                  upload: process.env.VUE_APP_BASE_URL + this.api.uploadQualit,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        console.log(value);
                        if (value.length == 0) {
                          return callback(new Error("文件不能为空"));
                        } else {
                          callback();
                        }
                      },
                      trigger: "blur",
                    },
                  ],
                },
              ];
              this.qualityForm = this.qualityForm.concat(arr);
            } else {
              console.log(this.qualityForm);
              if (this.qualityForm.length !== 1) {
                this.qualityForm.splice(1, 2);
              }
            }
            console.log(res);
          },
          radios: [
            {
              value: 2,
              label: "通过",
            },
            {
              value: 1,
              label: "不通过",
            },
          ],
          rules: [
            {
              required: true,
              message: "请确定检测结果",
              trigger: "change",
            },
          ],
        },
      ],
      qualityHandle: [
        {
          label: "确认",
          type: "primary",
          loading: false,
          handle: (res) => {
            this.$refs["qualityForm"].$refs["searchForm"].validate((valid) => {
              if (valid) {
                let { fileUpload, qualityCheck, surfaceMaterialNo, goodsCode } =
                  { ...this.qualityData };
                this.qualityHandle[0].loading = true;

                console.log("检测确认");
                let form = {
                  id: this.purchaseId,
                  qualityCheck,
                  goodsCode,
                };
                console.log(qualityCheck);
                if (qualityCheck == 2) {
                  form["filePath"] = fileUpload[0].response.data.fileHttpPath;
                  form["surfaceMaterialNo"] = surfaceMaterialNo;
                }
                console.log(form);
                //对接接口
                factoryShopList
                  .post(this.api.examfactoryOrder, form)
                  .then((res) => {
                    this.$message.success("检测成功");
                    this.qualityDialog = false;
                  });
              } else {
                console.log("error submit!!");
                return false;
              }
            });
          },
          hide: false,
        },
        {
          label: "取消",
          type: "info",
          handle: (res) => {
            this.$nextTick(() => {
              this.$refs["qualityForm"].$refs["searchForm"].resetFields();
              this.qualityDialog = false;
            });
          },
          hide: false,
        },
      ],
      detailsDialog: false,
      warehousValue: {}, //详情数据
      orderNumber: null, //订单号
    };
  },
  created() {
    this.loading = loading(document.getElementsByClassName("app-main")[0]);
    this.searchData.orderNumber = this.$route.query.id;
	if(this.$route.params.type){
		let {type,...data}= this.$route.params;
		let obj = {
			'type':type,
			'search':data
		}
		this.searchData['skipParam'] = obj;
		this.searchShow = false;
	}
    this.searchData["merchandiser"] = this.userInfo.account;
  },
  mounted() {
    console.log("1", this.searchData.orderNumber);
    this.getShopList()
      .then((res) => {
        let { data } = res;
        console.log(res)
        this.dataTotal = data.total;
        this.gridData = data.records;
        this.loading.close();
      })
      .catch((err) => {
        this.loading.close();
      });
  },
  methods: {
	  getShopList() {
	    // if(this.searchData.orderNumber == undefined){
	    // 	this.searchData.orderNumber = '1'
	    // }
	    // let data = {...this.searchData}
	    let { delivery, ...data } = { ...this.searchData };
	    this.$store.dispatch("user/setSearch", { delivery, ...data });
	    data = { ...data, deliveryStart: delivery[0], deliveryEnd: delivery[1] };
	    data["page"] = this.pagination["currentPage"];
	    data["limit"] = this.pagination["pageSize"];
	    console.log("data", data);
	    this.expandAll = false;
	    this.expandArr = [];
	    return factoryShopList.post(this.api.eShopList, data);
	  },
	  //搜索
	  searchHandler(){
	  	if(!this.searchShow){
	  		this.$router.go(-1)
	  	}else{
	  		this.searchDialog = true
	  	}
	  },
	  handleChangePage(value) {
	    console.log(value);
	    this.pagination["currentPage"] = value;
	    this.loading = loading(document.getElementsByClassName("app-main")[0]);
	    this.getShopList()
	      .then((res) => {
	        let { data } = res;
	        this.gridData = data.records;
	        this.dataTotal = data.total;
	        this.loading.close();
	      })
	      .catch((err) => {
	        this.loading.close();
	      });
	  },
	  handleSizeChange(value) {
	    console.log(value);
	    this.pagination["currentPage"] = 1;
	    this.pagination["pageSize"] = value;
	    this.loading = loading(document.getElementsByClassName("app-main")[0]);
	    this.getShopList()
	      .then((res) => {
	        let { data } = res;
	        this.gridData = data.records;
	        this.dataTotal = data.total;
	        this.loading.close();
	      })
	      .catch((err) => {
	        this.loading.close();
	      });
	  },
	  handleSelectionChange(list) {
	    this.multipleSelection = list;
	  },
	  //产前样批版
	  sampleCheckChange(row) {
	    // if(row.dqzt < 4 ){
	    //                 this.$message.warning('该商品还未产前样齐料确认，不可进行产前样批版操作！')
	    // }else if(row.craftId <= 0){ // nqz增加craftId判断，>0 代表商品工艺单有存在
	    //                 this.$message.warning('该商品没有制作工艺单，不可进行产前样批版操作！')
	    //             }else{
	    //                 this.$router.push({path:'/factory/approval',query:{id:row.id}})//,query:{id:row.orderNumber}
	    // }
	    this.$router.push({ path: "/factory/approval", query: { id: row.id } }); //,query:{id:row.orderNumber}
	    // this.shopId = row.id;
	    // if(row.prenatalSampleState){
	    // 	this.sampleCheckBol = row.prenatalSampleState -1;
	    // }else{
	    // 	this.sampleCheckBol = row.prenatalSampleState;
	    // }
	    // this.SampleCheckDialog = true
	  },
	  openSampleCheck(bol) {
	    this.openSampleCheck1 = bol;
	    this.openSampleCheck2 = !bol;
	    let form = {
	      id: this.shopId,
	      prenatalSampleState: bol ? 2 : 1,
	    };
	    console.log(form);
	    factoryShopList
	      .put(this.api.updateShop, form)
	      .then((res) => {
	        this.getShopList()
	          .then((resp) => {
	            this.$message.success("修改成功");
	            let { data } = resp;
	            if (bol) {
	              this.openSampleCheck1 = false;
	            } else {
	              this.openSampleCheck2 = false;
	            }
	            this.gridData = data.records;
	            this.dataTotal = data.total;
	            this.SampleCheckDialog = false;
	          })
	          .catch((err) => {
	            this.SampleCheckDialog = false;
	            if (bol) {
	              this.openSampleCheck1 = false;
	            } else {
	              this.openSampleCheck2 = false;
	            }
	          });
	      })
	      .catch((err) => {
	        if (bol) {
	          this.openSampleCheck1 = false;
	        } else {
	          this.openSampleCheck2 = false;
	        }
	      });
	  },
	  //入库
	  Warehousing(row) {
	    console.log(row);
	    this.orderNumber = row.orderNumber;
	    if (row.dqzt < 7) {
	      this.$message.warning("出货检完成后才可以进行入库检！");
	    } else {
	      let { sl, id, spmc, ghsmc, dlmc, spdm, isAcc } = row;
	      this.warehousValue = { sl, id, spdm, spmc, ghsmc, dlmc, isAcc };
	      this.detailsDialog = true;
	    }
	  
	    // if(row.delivery == 1){
	    // 	this.pinData = {id:row.id,type:0,ghsdm:row.ghsdm,orderNumber:row.orderNumber}
	    // 	this.pinDialog = true
	    // }else{
	    // 	this.$message.warning('请先进行出货检')
	    // }
	  },
	  //出库
	  Delivery(row) {
	    if (row.dqzt < 5) {
	      this.$message.warning("你还有前置流程未操作，不可进行出货检！");
	    } else if (row.qiliaoState !== 2) {
	      this.$message.warning("大货齐料确认后才可以进行出货检！");
	    } else if (row.prenatalSampleState !== 1) {
	      this.$message.warning("产前样批版尚未通过，不可后续操作！");
	    } else {
	      this.shipmentData = {
	        goodsId: row.id,
	        tempState: row.goodsOutCheckState,
	        factoryName: row.ghsmc,
	        goodsCode: row.spdm,
	        goodsName: row.spmc,
	        number: row.sl,
	        type: 0,
	        isAcc: row.isAcc,
	      };
	      this.shipmentDio = true;
	    }
	  },
	  //跟踪日志
	  track(row) {
	    // this.shopId = row.id;
	    this.traceData["id"] = row.id;
	    this.traceData["code"] = row.spdm;
	    this.traceData["name"] = row.spmc;
	    this.traceData["status"] = row.dqzt;
	    this.traceData["routers"] = "0"; //注：用于区分跟踪日志新增 by 王 2021/6/18
	    this.traceDialog = true;
	  },
	  //品控日志
	  quality(row) {
	    console.log(row);
	    this.shopId = row.id;
	    this.qualityControl = true;
	  },
	  //展开编辑
	  expandEdit(row) {
	    console.log(row);
	    this.expandChangeRow = row;
	    this.expandEditDialog = true;
	    this.$nextTick(() => {
	      this.expandEditData["id"] = row.id;
	      this.expandEditData["count"] = row.count;
	      this.co["size"] = row.size;
	    });
	  },
	  expandChange(row, expandedRows) {
	    if ((row.id && !row.expandData) || row.expandData.length == 0) {
	      factoryShopList.get(this.api.category, row.id).then((res) => {
	        let { data } = res;
	        //orderData.expandNum(data);
	        this.$set(row, "expandData", data);
	      });
	    }
	  },
	  closeDio() {
	    this.$refs["expandEditForm"].$refs["searchForm"].resetFields();
	  },
	  //工作联系单
	  lianxianup() {
	    console.log(this.multipleSelection);
	    this.beizhu = [];
	    for (var i = 0; i < this.multipleSelection.length; i++) {
	      this.beizhu.push(
	        "工厂订单:" +
	          this.multipleSelection[i].ghsmc +
	          ";" +
	          this.multipleSelection[i].lx +
	          ";" +
	          this.multipleSelection[i].spdm
	      );
	    }
	    this.lianDialog = true;
	  },
	  //节点对接
	  nodes(row) {
	    this.goodid = row.id;
	    this.nodesDialog = true;
	  },
	  //批版
	  // yaodian(row){
	  // 	console.log('row',row)
	  // 	this.pbdata = row
	  // 	this.piDialog = true
	  // },
	  check(row) {
	    this.qidata = row;
	    this.qiDialog = true;
	  },
	  //跟踪日志关闭前调用
	  closeTrace() {
	    this.getShopList().then((res) => {
	      let { data } = res;
	      this.gridData = data.records;
	      this.dataTotal = data.total;
	      this.loading.close();
	      // let idrow = []
	      // // console.log('gridDate',this.gridData)
	      // for(var i = 0;i<datagrid.length;i++){
	      // 	if(i == 0){
	      // 		idrow[0] = datagrid[i].id
	      // 	}else{
	      // 		idrow[0] = idrow[0] +','+datagrid[i].id
	      // 	}
	      // }
	      // this.getpiban(idrow).then(list=>{
	      // 	var linedata = list.data
	      // 	for(var j = 0;j<datagrid.length;j++){
	      // 		datagrid[j]["line"] = (parseInt(linedata[j].value) / 4 * 100)
	      // 	}
	      // 	console.log(datagrid)
	      // 	this.loading.close();
	      // 	this.gridData = datagrid
	      // })
	    });
	  },
	  lianClose(value) {
	    this.lianDialog = false;
	  },
	  lianCloseDio(value) {
	    this.lianDialog = value;
	  },
	  pinClose(value) {
	    console.log("1", value);
	    var len = "";
	    if (value[0] == 1) {
	      len = value[1];
	      this.gridData[len].delivery = 1;
	    } else {
	      this.gridData[len].warehousing = 1;
	    }
	    this.pinDialog = false;
	  },
	  pinCloseDio(value) {
	    console.log("2", value);
	    this.pinDialog = value;
	  },
	  qiClose(value) {
	    if (value[0]) {
	      this.getShopList()
	        .then((res) => {
	          let { data } = res;
	          this.dataTotal = data.total;
	          this.gridData = data.records;
	          this.qiDialog = false;
	        })
	        .catch((err) => {
	          this.qiDialog = false;
	        });
	    } else {
	      this.qiDialog = false;
	    }
	  },
	  //检测报告
	  testing(row) {
	    console.log(row);
	    this.purchaseId = row.id;
	    if (row.qualityCheck == 2 && this.qualityForm.length == 1) {
	      let arr = [
	        {
	          type: "Input",
	          label: "质检编号:",
	          prop: "surfaceMaterialNo",
	          placeholder: "请输入质检编号",
	          rules: [
	            {
	              required: true,
	              message: "请输入质检编号",
	              trigger: "blur",
	            },
	          ],
	        },
	        {
	          type: "fileUpload",
	          label: "检测报告:",
	          headers: { Authorization: this.token },
	          prop: "fileUpload",
	          upload: process.env.VUE_APP_BASE_URL + this.api.uploadQualit,
	          rules: [
	            {
	              required: true,
	              validator: (rule, value, callback) => {
	                console.log(value);
	                if (value.length == 0) {
	                  return callback(new Error("文件不能为空"));
	                } else {
	                  callback();
	                }
	              },
	              trigger: "blur",
	            },
	          ],
	        },
	      ];
	      this.qualityForm = this.qualityForm.concat(arr);
	      this.$nextTick(() => {
	        this.qualityData["qualityCheck"] = row.qualityCheck;
	        this.qualityData["goodsCode"] = row.spdm;
	        this.qualityDialog = true;
	      });
	    } else {
	      console.log(row.qualityCheck);
	  
	      this.$nextTick(() => {
	        if (row.qualityCheck !== 2) {
	          this.qualityForm.splice(1, 2);
	        }
	        this.qualityData["qualityCheck"] = row.qualityCheck;
	        this.qualityData["goodsCode"] = row.spdm;
	        this.qualityDialog = true;
	      });
	    }
	  },
	  checkdan(row) {
	    factoryShopList
	      .get(this.api.detailByGoods, { goodsId: row.id })
	      .then((res) => {
	        if (res.code == 0) {
	          if (res.data) {
	            //有关联 直接跳转编辑
	            // this.$router.push({path:'/technology/tecaddList',query:{goodsId:row.id,path:3}})
	            //携带参数跳转操作
	            this.orderid = [row.id, 1];
	            this.exportDio = true;
	          } else {
	            this.$message.warning("工艺单不存在");
	          }
	        }
	      });
	  },
	  // 确认完结按钮
	  confirm(row) {
	    // 二次确认
	    this.$confirm('是否确认无误','提示',{
	  	  confirmButtonText:'确定',
	  	  cancelButtonText:'取消',
	  	  type:'warning'
	    }).then(()=>{
	  	  factoryShopList.put(this.api.dqzt,{'id':row.id},true).then(res=>{
	      console.log(res)
	  		   this.$message.success(res.message);
	      //确认完结之后重新刷新列表，即重新发起请求
	       this.getShopList().then(res=>{
	         this.gridData = res.data.records
	         this.loading.close();
	       })
	  	  })
        // 点击取消
	    },()=>{
        this.$message.info('已取消确认')
        // 捕获错误
      }).catch((error)=>{
        console.log(error)
      })
	  },
	  // 确认完结网络请求
	  // confirminfo(){
	  // 	// 发送请求
	  // 	factoryShopList.put('/outsource/eshopOrMeetingGoods/dqzt?id='+this.confirmData.id)
	  // 	// 信息提示
	  // 	.then(res =>{
	  // 		this.$message.success('确认成功')
	  // 	}).catch((err)=>{
	  // 		console.log(err)
	  // 	})
	  // 	// 点击确定
	  // 	 this.dialogFormVisible= !this.dialogFormVisible
	  // },
	  shipmentClose(value) {
	    console.log(value);
	    if (value[0] == false) {
	      this.getShopList()
	        .then((res) => {
	          let { data } = res;
	          this.gridData = data.records;
	          this.dataTotal = data.total;
	          this.loading.close();
	          this.shipmentDio = false;
	        })
	        .catch((err) => {
	          this.loading.close();
	          this.shipmentDio = false;
	        });
	    } else {
	      this.shipmentDio = false;
	    }
	  },
	  //历史记录
	  goWarehousList() {
	    // this.$router.push({
	    // 	path: '/factory/factoryWarehousing',
	    // 	params:
	    // })
	    this.$router.push({
	      name: "factory_Warehousing",
	      params: { id: this.warehousValue.id, orderNumber: this.orderNumber },
	    });
	  },
	  closeDetail(value) {
	    this.detailsDialog = value;
	  },
	  exportBOM() {
	    this.orderNumbers = [];
	    if (this.multipleSelection.length == 0) {
	      this.$message.warning("请勾选所导出的商品");
	      return;
	    }
	    this.loading = loading(document.getElementsByClassName("qualityList")[0]);
	    for (var i = 0; i < this.multipleSelection.length; i++) {
	      this.orderNumbers.push(this.multipleSelection[i].id);
	    }
	    let obj = {
	      orderNumbersOrIds: this.orderNumbers.join(","),
	      type: "2",
	    };
	    let url = process.env.VUE_APP_BASE_URL + this.api.exportBOM;
	    factoryShopList.upload(url, obj, this.token, true).then((response) => {
	      this.loading.close();
	      if (!response) return;
	      console.log(response);
	      const { data, headers } = response;
	      const fileName = headers["content-disposition"].replace(
	        /\w+;filename=(.*)/,
	        "$1"
	      );
	      const blob = new Blob([data], { type: "application/vnd.ms-excel" });
	      console.log(blob);
	      const blobURL = window.URL.createObjectURL(blob);
	      const tempLink = document.createElement("a");
	      tempLink.download = decodeURI(fileName);
	      tempLink.style.display = "none";
	      tempLink.href = blobURL;
	      document.body.appendChild(tempLink);
	      tempLink.click();
	      document.body.removeChild(tempLink);
	      // 释放
	      window.URL.revokeObjectURL(blobURL);
	    });
	  },
	  // 面料辅料发货
	  orderUp(row,value){
	  	console.log(row);
		this.upDio = true;
		this.orderType = value;
	  	this.seletionId = row.id;
	  },
  },
};
</script>

<style lang="scss" scoped>
/deep/.traceDialog .el-dialog__body {
  padding: 0 20px 30px 20px !important;
}
.circle {
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  cursor: pointer;
}
</style>
