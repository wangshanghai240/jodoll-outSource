import request from '@/utils/request'
import axios from 'axios'
import store from '@/boots/store'

export function post(url, datas, time) {
	let timeOut = time?time:5000;
	if (datas) {
		let {page,limit,...data} = datas
		console.log(page,limit)
		if(page && limit){
			let pages = url + '/' + page +'/' + limit;
			console.log(pages)
			return request({
				url: pages,
				method: 'post',
				timeout: timeOut,
				data
			})
		}else{
			return request({
				url: url,
				method: 'post',
				timeout: timeOut,
				data:datas
			})
		}
	} else {
		return request({
			url: url,
			method: 'post',
			timeout: timeOut,
		})
	}
}

export function del(url,data, time) {
	let timeOut = time?time:5000;
	let newUrl = ''
	if(typeof data == 'number' || typeof data == 'string'){
		newUrl = data ? url + '/' + data : url;
	}else{
		let query = "";
		let str = ''
		for(let k in data){
		  query+="&"+k + "=" + data[k];
		}
		str += "?" + query.replace("&","")
		newUrl = url + str
		console.log(newUrl)
	}
	return request({
		url: newUrl,
		timeout: timeOut,
		method: 'delete'
	})
}

export function del2(url,data, time) {
	let timeOut = time?time:5000;
	return request({
		url: url,
		timeout: timeOut,
		method: 'delete',
		data
	})
	
}

export function get(url, data, time) {
	let timeOut = time?time:5000;
	if(typeof data == 'string'){
		let nUrl = url + '/' + data
		return request({
			url: nUrl,
			timeout: timeOut,
			method: 'get'
		})
	}else{
		return request({
			url: url,
			timeout: timeOut,
			method: 'get',
			params:data
		})
	}
}

export function upload(url,data,isGet,token){
	if(isGet){//婵娟
		return axios({
			headers: {
				'Authorization':token,
			},
			method:'GET',
			url:url,
			responseType: 'blob',
			params:data
		})
	}else{//晓浩
		return axios({
			headers: {
				'Authorization':token,
			},
			method:'post',
			url:url,
			responseType: 'arraybuffer',
			data
		})
	}
}

export function put(url, data, isParams, time) {
	let timeOut = time?time:5000;
	if(isParams){
		return request({
			url: url,
			timeout: timeOut,
			method: 'put',
			params:data
		})
	}else{
		return request({
			url: url,
			timeout: timeOut,
			method: 'put',
			data
		})
	}
}

// export function getInfo(token) {
// 	return request({
// 		url: '/vue-element-admin/user/info',
// 		method: 'get',
// 		params: {
// 			token
// 		}
// 	})
// }

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
