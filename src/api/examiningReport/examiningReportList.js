import { get , post , del , put , upload} from '../request'
import api from '@/api/index.js'
const pickerBeginDateAfter = {
	disabledDate: (time) => {
		return time.getTime() < Date.now()
	}
};
const typeOptions = [{
	value:1,
	label:'辅料'
},{
	value:2,
	label:'面料'
},{
	value:3,
	label:'成衣/加工'
}]
export default{
	typeOptions:typeOptions,
	columns: [{
		label: '报告编号',
		prop: 'examiningNo',
		align: 'center',
	},{
		label: '类型',
		prop: 'type',
		slot:true,
		align: 'center',
	},{
		label: '物品编号',
		prop: 'surfaceMaterialNo',
		align: 'center',
	},{
		label: '创建时间',
		prop: 'createTime',
		align: 'center',
	},{
		label: '创建人',
		prop: 'createBy',
		align: 'center',
	}],
	options: {
		selection: true,
		width: 50,
		tHeight:'77vh',
		headerInput: true,
		headerWidth: '300',
	},
	searchData:{
		daterange:[],
		examiningNo:'',
		surfaceMaterialNo:'',
		type:''
	},
	searchForm:[{
		type: "Daterange",
		label: "起止时间:",
		prop: "daterange",
		change: res => {
			console.log(res)
		}
	},{
		type: "Input",
		label: "报告编号:",
		prop: "examiningNo",
		//icon: 'el-icon-more',
		style:"width:200px",
		onClick: res => {
			console.log(res)
		},
		placeholder: "请输入报告编号",
	},{
		type: "Input",
		label: "物品编号:",
		prop: "surfaceMaterialNo",
		//icon: 'el-icon-more',
		style:"width:200px",
		onClick: res => {
			console.log(res)
		},
		placeholder: "请输入物品编号",
	},{
		type: "Select",
		clearable:true,
		label: "类型:",
		prop: "type",
		options: typeOptions,
		placeholder: "请选择类型",
		style:"width:200px",
		change: row => "",
	}],
	addEXA:[{
		type: "Input",
		label: "报告编号:",
		prop: "examiningNo",
		//icon: 'el-icon-more',
		style:"width:200px",
		onClick: res => {
			console.log(res)
		},
		placeholder: "请输入报告编号",
		rules: [{
			required: true,
			message: "请输入报告编号",
			trigger: "blur"
		}]
	},{
		type: "Input",
		label: "物品编号:",
		prop: "surfaceMaterialNo",
		//icon: 'el-icon-more',
		style:"width:200px",
		onClick: res => {
			console.log(res)
		},
		placeholder: "请输入物品编号",
		rules: [{
			required: true,
			message: "请输入物品编号",
			trigger: "blur"
		}]
	}],
	get(url,params) {
		return new Promise((res, rej) => {
			get(url,params).then(getRes => {
				res(getRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	post(url,data){
		return new Promise((res, rej) => {
			post(url,data).then(postRes => {
				res(postRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	put(url,data){
		return new Promise((res, rej) => {
			put(url,data).then(putRes => {
				res(putRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	del(url,id){
		return new Promise((res, rej) => {
			del(url,id).then(delRes => {
				res(delRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	}
}