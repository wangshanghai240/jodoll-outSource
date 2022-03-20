 import {
 	get,
 	post,
 	del,
 	put
 } from '../request'
 
 export default {
	 columns:[
		 {
	 	label: '编号',
	 	prop: 'serial',
		width:150,
	 	align: 'center', 
	 },{
	 	label: '辅料名称',
	 	prop: 'ingredientsName',
		width:250,
	 	align: 'center',
	 },{
	 	label: '辅料编号',
	 	prop: 'ingredientsCode',
		width:140,
	 	align: 'center',
	 },{
	 	label: '检验数',
	 	prop: 'checkNum',
		width:70,
	 	align: 'center',
	 },{
	 	label: '到货数',
	 	prop: 'takeNum',
		width:70,
	 	align: 'center',
	 },{
	 	label: '检验结果',
	 	prop: 'isQualified',
		width:90,
		slot:true,
	 	align: 'center',
	 },{
	 	label: '工厂',
	 	prop: 'clientName',
		width:220,
	 	align: 'center',
	 },{
	 	label: '订单号',
	 	prop: 'orderNumber',
		width:140,
	 	align: 'center',
	 },{
	 	label: '创建时间',
	 	prop: 'createTime',
		sortable:true,
	 	align: 'center',
	 },{
	 	label: '检验员',
	 	prop: 'updateBy',
	 	align: 'center',
	 },
	 ],
	 options:{
	 	width: 50,
	 	tHeight:'77vh',
	 	headerInput: true,
	 	headerWidth: '200',
	 },
	 detailsColumns:[{
		 label: '规格',
		 prop: 'specification',
		 slot:true,
		 align: 'center',
	 },{
		 label: '外观',
		 prop: 'facade',
		 slot:true,
		 align: 'center',
	 },{
		 label: '色差',
		 prop: 'aberration',
		 slot:true,
		 align: 'center',
	 },{
		 label: '分析记录',
		 prop: 'record',
		 slot:true,
		 align: 'center',
	 },{
		 label: '检验结论',
		 prop: 'verdict',
		 slot:true,
		 align: 'center',
	 }],
	 get(url,data){
	 	return new Promise((res,rej)=>{
	 		get(url,data).then(list => {
	 			res(list)
	 		}).catch(error => {
	 			rej(error)
	 		})
	 	})
	 },
	 put(url,data){
	 	return new Promise((res,rej)=>{
	 		put(url,data).then(list => {
	 			res(list)
	 		}).catch(error => {
	 			rej(error)
	 		})
	 	})
	 },
	 post(url,data){
	 	return new Promise((res,rej)=>{
	 		post(url,data).then(list => {
	 			res(list)
	 		}).catch(error => {
	 			rej(error)
	 		})
	 	})
	 },
 }