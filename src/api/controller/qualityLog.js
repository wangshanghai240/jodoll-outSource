import { get , post , del , put } from '../request'


export default{
	get(url,data){
		return new Promise((res,rej)=>{
			get(url, data).then(obj => {
				res(obj)
			}).catch(error => {
				rej(error)
			})
		})
	},
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(obj=>{
				res(obj)
			}).catch(err=>{
				rej(err)
			})
		})
	}
}