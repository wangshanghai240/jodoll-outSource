/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
	const valid_map = ['admin', 'wang', 'editor', 'custom', '20977', '04498', '00042']
	return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
	const reg =
		/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
	return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
	const reg = /^[a-z]+$/
	return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
	const reg = /^[A-Z]+$/
	return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
	const reg = /^[A-Za-z]+$/
	return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
	const reg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
	if (typeof str === 'string' || str instanceof String) {
		return true
	}
	return false
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isNumber(num) {
	const reg = /^[0-9]*$/
	return reg.test(num)
}
/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
	if (typeof Array.isArray === 'undefined') {
		return Object.prototype.toString.call(arg) === '[object Array]'
	}
	return Array.isArray(arg)
}

export function filterUrl(str) { // 特殊字符转义
	str += ''; // 隐式转换
	str = str.replace(/{/g, '%7B');
	str = str.replace(/"/g, '%2522');
	str = str.replace(/}/g, '%7D');
	// str = str.replace(/%/g, '%25');
	// str = str.replace(/\+/g, '%2B');
	// str = str.replace(/ /g, '%20');
	// str = str.replace(/\//g, '%2F');
	// str = str.replace(/\?/g, '%3F');
	// str = str.replace(/&/g, '%26');
	// str = str.replace(/\=/g, '%3D');
	// str = str.replace(/#/g, '%23');
	return str;
}
export function existenceArrs(list1, list2) {
	return new Promise((res, rej) => {
		let obj = {
			arr1: [],
			arr2: []
		}
		let newArr = list2.map(item => item.value)
		list1.forEach(item => {
			let bol = newArr.includes(item);
			console.log(item, '是否存在', bol)
			if (bol) {
				obj['arr1'].push(item)
			} else {
				obj['arr2'].push(item)
			}
		})
		res(obj)
	})
}
// 防抖
export function debounce(fn, delay) {
	var delay = delay || 200;
	var timer;
	return function() {
		var th = this;
		var args = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			timer = null;
			fn.apply(th, args);
		}, delay);
	};
}
// 节流
export function throttle(fn, interval) {
	let valid = true
	return function() {
		let that = this
		let args = arguments
		if (!valid) {
			return false
		}
		fn.apply(that, args)
		valid = false
		setTimeout(() => {
			valid = true;
		}, interval)
	}
}
//base64转img
export function base64ImgtoFile(dataurl, filename = 'file') {
	let arr = dataurl.split(',')
	let mime = arr[0].match(/:(.*?);/)[1]
	let suffix = mime.split('/')[1]
	let bstr = atob(arr[1])
	let n = bstr.length
	let u8arr = new Uint8Array(n)
	while (n--) {
	  u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], `${filename}.${suffix}`, {
	  type: mime
	})
}
//url转obj
export function urlTransformationObj(addressUrl){
	let obj ={}
	var str = addressUrl.split("&")
	for (var i = 0; i < str.length; i++) {
	    var a = str[i].split('=')
	    obj[a[0]] = a[1]
	}
	return obj
}
