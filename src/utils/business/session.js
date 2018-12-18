const LOGIN_USER = 'LOGIN_USER';
const PRIVDATA = 'PRIVDATA';
const PATHS = 'PATHS';
const MODULEMAP = 'MODULEMAP';

export default {
	setLoginUser (user) {
		if (typeof (user) === 'object') {
			window.sessionStorage.setItem(LOGIN_USER, JSON.stringify(user));	
		} else {
			window.sessionStorage.setItem(LOGIN_USER, '');
		}
	},
	getLoginUser () {
		let jsonstr = window.sessionStorage.getItem(LOGIN_USER);
		if (jsonstr && jsonstr !== '') {
			try {
				return JSON.parse(jsonstr);
			} catch (e) {
				console.error(e);
				return null;
			}
		}
		return null;
	},
	setPrivData (data) {
		window.sessionStorage.setItem(PRIVDATA, JSON.stringify(data));
	},
	getPrivData () {
		let jsonstr = window.sessionStorage.getItem(PRIVDATA);
		if (jsonstr && jsonstr !== '') {
			try {
				return JSON.parse(jsonstr);
			} catch (e) {
				console.error(e);
				return null;
			}
		}
		return null;
	},
	setPaths (data) {
		window.sessionStorage.setItem(PATHS, JSON.stringify(data));
	},
	getPaths () {
		let jsonstr = window.sessionStorage.getItem(PATHS);
		if (jsonstr && jsonstr !== '') {
			try {
				return JSON.parse(jsonstr);
			} catch (e) {
				console.error(e);
				return null;
			}
		}
		return null;
	},
	setModuleMap (data) {
		window.sessionStorage.setItem(MODULEMAP, JSON.stringify(data));
	},
	getModuleMap () {
		let jsonstr = window.sessionStorage.getItem(MODULEMAP);
		if (jsonstr && jsonstr !== '') {
			try {
				return JSON.parse(jsonstr);
			} catch (e) {
				console.error(e);
				return null;
			}
		}
		return null;
	}
};
