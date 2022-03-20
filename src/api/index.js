export default{
	login:'/outsource/login',//登入
	logout:'/outsource/logout',//登出
	
	message: 'ws://192.168.100.72:8096/outsource/websocket/',

	userInfo:'/outsource/user/info',//获取用户信息
	
	//首页
	categoryByParent:'/outsource/category/categoryByParent',//获取所有品类
	findMerchandiser:'/outsource/category/findMerchandiser',//获取所有跟单员
	homepage:'/outsource/eshopOrMeetingGoods/homepage',//看板数据
	
	//待办
	holdTasks:'/outsource/holdTasks',//查询
	updateAll:'/outsource/holdTasks/updateAll',//是否全部忽略
	putHoldTasks:'/outsource/holdTasks',//待办转已办
	
	//订货会
	orderList:'/outsource/orderMeeting/list',//所有订货列表
	operationMeeting:'/outsource/orderMeeting',//post新增订货会(page/limit 分页查询),get查询,delete删除
	updateMeeting:'/outsource/orderMeeting/update',//修改订货会
	meetingUpload:'/outsource/eshopOrMeetingGoods/upload/import',//导入商品明细
	importExcel:'/outsource/upload/importExcel',//导入数量明细
	generatesource:'/outsource/fabricDemandGoods/source',//生成面料需求单
	generateIngredients:'/outsource/ingredientsDemand/generateIngredients',//生成辅料需求单
	generateFactoryOrder:'/outsource/factoryOrder/generateFactoryOrderByGoods',//生成工厂订单
	generateBySource:'/outsource/factoryOrder/generateFactoryOrderBySource',
	getOrderMeeting:'/outsource/accessories/getOrderMeetingAccessories',
	uploadOrderAndFile:'/outsource/qualityControl/uploadOrderAndFile',//订货会工艺单上传
	exportBOM:'/outsource/factoryOrder/exportBOM',
 
	//商品
	eShopList:'/outsource/eshopOrMeetingGoods',//post新增(page/limit 分页查询),get查询,delete删除
	updateShop:'/outsource/eshopOrMeetingGoods/update',//修改
	confirm:'/outsource/eshopOrMeetingGoods/dqzt' , //商品确认完结
	getAccessoriesNum: '/outsource/accessories/getAccessoriesNum',//获取BOM单据编号
	note:'/outsource/accessories/note',//根据单据插入BOM
	exportShop:'/outsource/eshopOrMeetingGoods/upload/export',//导出
	category:'/outsource/category',//数量明细
	nodes:'/outsource/goodsNode/nodes',
	status:'/outsource/goodsNode/status',
	call1:'/outsource/goodsNode/cal1',
	call2:'/outsource/goodsNode/cal2',
	contract:'/outsource/oaProcess/contractList',
	employeeList:'/outsource/oaProcess/employeeList',
	contactCheck:'outsource/oaProcess/contactCheck',
	listByGoodsIds:'outsource/goodsSupplierChange/listByGoodsId',
	uploadOrderAndFile:'/outsource/qualityControl/uploadOrderAndFile',//商品工艺单上传
	categoryByBig:'/outsource/category/categoryByBig',//获取商品品类
	detailByGoods:'/outsource/craft/detailByGoods',//查看工艺单

	//品控
	getQuality: '/outsource/qualityControl/list',//获取品控
	listByGoodsId:'/outsource/qualityControl/listByGoodsId',//获取商品的品控
	modifyQuality:'/outsource/qualityControl',//获取商品的品控详情
	postQuality: '/outsource/qualityControl/manualInput',//新增品控
	createCheck:'/outsource/qualityControl/createCheck',//创建品控检查记录
	checkPage:'/outsource/qualityControl/checkPage',//分页品控
	findByCheckId:'/outsource/qualityControl/findByCheckId',//获取列表详情
	addQuality:'/outsource/qualityControl/addQuality',//只新增要点品控
	
	edition:'/outsource/edition',//获取品控详情 (新)
	
	//产前样
	findEditionSign:'/outsource/edition/findEditionSign',//获取产前样
	merchandiser:'/outsource/edition/merchandiser',//跟单员
	skip:'/outsource/edition/skip',//跳过
	development:'/outsource/edition/development',//设计开发
	product:'/outsource/edition/product',//生产部
	technology:'/outsource/edition/technology',//技术部
	quality:'/outsource/edition/quality',//品质部
	qualityConfirm:'/outsource/edition/confirm',//整体
	findSize:'/outsource/edition/findSize',//跟单员获取尺码
	findValue:'/outsource/edition/findValue',//跟单员获取规格数据

	//上传
	uploadQualit:'/outsource/upload/multipart',//上传
	multipartByCraft:'/outsource/upload/multipartByCraft',//工艺单上传
	importCraftExcel:'/outsource/upload/importCraftExcel',//工艺单导入
	
	//下载
	download:'/outsource/upload/download',//下载

	//质检报告
	selectPage:'/outsource/examiningReport/selectPage',//质检列表
	examiningReport:'/outsource/examiningReport',

	//跟踪日志
	getTraceLog:'/outsource/traceLog',//查询
	detailTraceLog:'/outsource/traceLog/detail',//详情
	traceLogModel:'/outsource/traceLog/model',

	//面料-需求
	getDemandList:'/outsource/fabricDemandList',//面料需求清单
	getDemandDetail:'/outsource/fabricDemandList/detail',//需求详情
	fabricExport:'/outsource/fabricDemandList/export',//导出
	getFabricCode:'/outsource/fabricDemandList/materialList',//预投单面料code
	addDemand:'/outsource/fabricDemandList/prePurchase',//预设单
	updateDemand:'/outsource/fabricDemandList',//put修改预投单
	fabricDemandGoods:'/outsource/fabricDemandGoods',//生成面料
	express:'/outsource/fabricDemandList/express',//发货
	//面料-采购
	getPurchaseList:'/outsource/fabricPurchase',
	getPurchaseDetail:'/outsource/fabricPurchase/detail',
	generatePurchase:'/outsource/fabricDemandList/purchase',//生成采购
	exam:'/outsource/fabricPurchase/exam',
	fabircPurExport:'/outsource/fabricPurchase/export',//导出
	supplierOrder:'/outsource/fabricPurchase/supplierOrder',//供应商订单
	supplierOrderMass:'/outsource/fabricPurchase/supplierOrderMass',//批量生成供应商订单
	confirm:'/outsource/fabricSupplierOrder/confirm',//合同确认 get合同函 put 合同确认
	detail:'/outsource/fabricSupplierOrder/detail',
	entry:'/outsource/fabricPurchase/entry',//入库
	fabricSupplierOrderList:'/outsource/fabricSupplierOrder/fabricSupplierOrderList', //入库通知列表
	ingredientsSupplierOrderList:'/outsource/ingredientsSupplierOrder/ingredientsSupplierOrderList',
	fabricPurchaseDetail:'/outsource/entryCheck/fabricPurchaseDetail',//面料采购入库 详情
	fabricDetail:'/outsource/entryCheck/fabricDetail',//入库检列表 详情
	addFabricDetail:'/outsource/entryCheck/addFabricDetail',//面料入库更新操作
	fabricEntryCheck:'/outsource/entryCheck/fabricEntryCheck',//面料入库检列表
	addOpinion:'/outsource/entryCheck/addOpinion',//面料入库 不合格后续
	//工厂
	fabricEntryExport:'/outsource/entryCheck/fabricExport',//入库检列表 导出	//工厂
	factoryOrder:'/outsource/factoryOrder',
	contractProcess:'/outsource/factoryOrder/contractProcess',//发起合同流程
	deleteFactoryOrder:'/outsource/factoryOrder/deleteFactoryOrder',//删除订单
	fabricList:'outsource/factoryOrder/fabricList',
	ingredientsList:'outsource/factoryOrder/ingredientsList',
	sendFabric:'outsource/factoryOrder/sendFabric',
	sendIngredients:'outsource/factoryOrder/sendIngredients',
	sendFabricList:'outsource/factoryOrder/sendFabricList',
	sendIngredientsList:'outsource/factoryOrder/sendIngredientsList',
	confirms:'outsource/factoryOrder/upload/view/confirm',
	confirmMoneyAndDate:'outsource/factoryOrder/confirmMoneyAndDate',//确认金额和时间
	completeState:'outsource/factoryGoodsMaterial/completeState',
	completeStatepost:'outsource/factoryGoodsMaterial/completeState',
	goodsWarehousing:'outsource/goodsWarehousing/save',
	goodsWarehousingupdate:'outsource/goodsWarehousing/update',
	goodsWarehousingId:'outsource/goodsWarehousing/isWarehousing',
	getOrderContract:'outsource/factoryOrder/getOrderContract',
	updateOrderContract:'outsource/factoryOrder/updateOrderContract',
	examfactoryOrder:'outsource/factoryOrder/exam',
	getGoodsWarehousing:'/outsource/factoryOrder/goodsWarehousing',//商品入库通知 get获取 post提交
	goodsIntoPage:'/outsource/factoryOrder/goodsIntoPage',//入库检列表
	goodsIntoDetail:'/outsource/factoryOrder/goodsIntoDetail',//入库检详情
	factoryAdd:'/outsource/factoryOrder/goodsIntoDetail/add',//入库检新增
	factoryUpdate:'/outsource/factoryOrder/goodsIntoDetail/update',//入库检更新
	factoryStandard:'/outsource/factoryOrder/goodsIntoDetail/standard',//尺码数据
	factoryPart:'/outsource/factoryOrder/goodsIntoDetail/part',//规格列表
	showMerchandiser:'/outsource/factoryOrder/showMerchandiser',//跟单员列表
	allot:'/outsource/factoryOrder/allot',//分配跟单员
	dqzt:'/outsource/eshopOrMeetingGoods/dqzt',//完结
	
	//出库检
	goodsOutcheck:'outsource/goodsOutCheck',//查询
	getgoodsoutcheck:'outsource/goodsOutCheck/getGoodsOutCheck',//获取出库检信息
	getgoodsoutcheckId:'outsource/goodsOutCheck/getGoodsOutCheckById',//获取已输入的出库检
	saveOrTemp:'outsource/goodsOutCheck/saveOrTemp',//提交保存
	backUpload:'outsource/goodsOutCheck/backUpload',//回签关联
	
	//批版
	deleteIsPass:'/outsource/ratify/deleteIsPass',
	getIsPass:'/outsource/ratify/getIsPass',
	putIsPass:'/outsource/ratify/getIsPass',
	saveIsPass:'/outsource/ratify/saveIsPass',
	getIsPassSchedule:'/outsource/ratify/getIsPassSchedule',
	findContent:'/outsource/edition/findContent',//获取跟单员数据

	//辅料-需求
	addIngredientsDemand:'/outsource/ingredientsDemand/generateByGoodsId', //生成需求
	ingredientsDemand:'/outsource/ingredientsDemand',
	ingredientsDetail:'/outsource/ingredientsDemand/detail',  //详情
	addIngredientPurchase:'/outsource/ingredientsDemand/purchase',  // 生成采购单
	exportIngredient:'/outsource/ingredientsDemand/export',  // 辅料导出
	getIngredientsCode:'/outsource/ingredientsDemand/ingredientsList',//预投单辅料code
	addPrePurchase:'/outsource/ingredientsDemand/prePurchase',//预设单
	//辅料-采购
	getIngredientPurchase:'/outsource/ingredientsPurchase',
	getIngredientPurchaseDetail:'/outsource/ingredientsPurchase/detail', //辅料采购详情
	ingredientPurchaseEntry:'/outsource/ingredientsPurchase/entry', //入库
	ingredientPurchaseExport:'/outsource/ingredientsPurchase/export', //导出
	addIngredientSupplierOrder:'/outsource/ingredientsPurchase/addSupplierOrder', //生成供应商订单
	addSupplierOrderMass:'/outsource/ingredientsPurchase/addSupplierOrderMass',//批量生成订单
	//辅料供应商订单
	ingredientSupplierOrder:'/outsource/ingredientsSupplierOrder',
	contractConfirm:'/outsource/ingredientsSupplierOrder/contractConfirm',
	ingredientSupplierOrderDetail:'/outsource/ingredientsSupplierOrder/detail', //详情
	ingConfirm:'/outsource/ingredientsSupplierOrder/confirm',//辅料合同函查看
	//辅料出库检
	ingCheckDetail:'/outsource/entryCheck/ingredientsDetail',//入库检详情
	ingEntryCheck:'/outsource/entryCheck/ingredientsEntryCheck',//入库检查询
	ingPurchaseDetail:'/outsource/entryCheck/ingredientsPurchaseDetail',//采购单入库检详情
	addIngDetail:'/outsource/entryCheck/addIngredientsDetail',//更新辅料入库检
	ingaddOpinion:'/outsource/entryCheck/addOpinion',//审核意见

	//面料供应商订单
	fabricSupplierOrder:'/outsource/fabricSupplierOrder',//分页
	supplier:'/outsource/fabricSupplierOrder/supplier',//获取供应商

	//流程信息
	processInfo:'/outsource/processList',
	infoUpdate:'/outsource/processList/update',
	//节点
	getProNodes:'/outsource/processNode/nodes',//获取流程下的所有节点
	processNode:'/outsource/processNode',
	update:'/outsource/processNode/update',
	deleteNodes:'/outsource/processNode/delete',
	cal:'/outsource/processNode/cal',//节点测算
	cal1:'/outsource/processNode/cal1',//节点测算 
	
	//工艺要点
	getcraftRequire:'/outsource/craftRequire',//分页查询数据
	postcraftRequire:'/outsource/craftRequire',//新增数据
	putcraftRequire:'/outsource/craftRequire',//修改数据
	deletecraftRequire:'/outsource/craftRequire',//删除数据
	//工艺列表
	getcraft:'/outsource/craft',//查询
	postcraft:'/outsource/craft',//新增,修改
	deletecraft:'/outsource/craft',//删除
	getcraftcopy:'/outsource/craft/copy',//复制
	getbinding:'/outsource/craft/binding',//商品和工艺单绑定
	getdetail:'/outsource/craft/detail',//查看详情
	craftExport:'/outsource/craft/craftExport',
	//工艺要求
	getTemplate:'/outsource/processRequirementTemplate',//工艺要求模板
	postTemplate:'/outsource/processRequirementTemplate/',//新增工艺要求
	putTemplate:'/outsource/processRequirementTemplate/',//修改工艺要求
	checkTemplate:'/outsource/processRequirementTemplate',//查询工艺要求
	deleteTemplate:'/outsource/processRequirementTemplate/',//删除工艺要求
	//工艺单规格
	specification:'/outsource/specification',//获取规格列表/{id}为删除
	partPage:'/outsource/part/partPage',//获取部位
	standardPage:'/outsource/part/standardPage',//获取尺码
	saveStandardTable:'/outsource/specification/saveStandardTable',//提交规格表
	findPartAndSeries:'/outsource/specification/findPartAndSeries',//查看详情
	copy:'/outsource/specification/copy',//工艺单复制

	//erp获取工厂
	getERP: '/erp/erpData/supplier', // get  params supplierName

	//系统日志
	sysLogList:'/outsource/sysLog',
	
	//设计师
	getDesigner:'/outsource/designer/getList',//获取设计师
	addDesigner:'/outsource/designer/add',//新增
	deleteDesigner:'/outsource/designer/delete',//删除
	updateDesigner:'/outsource/designer/update',//修改
	
	upload:'https://jsonplaceholder.typicode.com/posts/'
}
