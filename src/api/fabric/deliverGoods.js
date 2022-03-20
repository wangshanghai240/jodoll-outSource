import { get , post , del , put} from '../request'

export default {
	modelOptions:[{
		label:'面料',
		value:1
	},{
		label:'辅料',
		value:2
	},{
		label:'工厂订单',
		value:3
	}],
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(list => {
				res(list.data)
			}).catch(error => {
				rej(error)
			})
		})
	}
}