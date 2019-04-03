/**
 * @Author: Created By McChen
 * @Date: 2019/4/3
 * @Mail: mcchen.club@gmail.com
 */

(function (root, factory) {
	if (typeof exports === 'object') {  // 判断是否支持node模块
		module.exports = factory();

	} else if (typeof define === 'function' && define.amd) {    // 判断是否支持AMD
		define(factory);

	} else if (typeof define == "function" && define.cmd) {
		define(function (require, exports, module) {
			module.exports = factory();
		})
	} else {    // 全局
		root.Utils = factory();
	}
})(this, function () {
	/**============================
	 private
	 ==============================*/
	function pageLockHandler(e) {
		e.preventDefault();
	}

	var __utils = {
		version: "0.0.1",
		timestamp: "2019/4/3",

		/**
		 * @function format the date
		 * @param {Number} time(时间戳)
		 * @param {String} format(格式)Eg: 'yyyy-MM-dd HH:mm:ss'
		 */
		formatTime: function (time, format) {
			if (!time) return
			var t = new Date(time);
			var tf = function (i) {
				return ( i < 10 ? '0' : '') + i
			};
			return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
				switch (a) {
					case 'yyyy':
						return tf(t.getFullYear());
						break;
					case 'MM':
						return tf(t.getMonth() + 1);
						break;
					case 'mm':
						return tf(t.getMinutes());
						break;
					case 'dd':
						return tf(t.getDate());
						break;
					case 'HH':
						return tf(t.getHours());
						break;
					case 'ss':
						return tf(t.getSeconds());
						break;
				}
			})
		},

		/**
		 * @function get systemType and appType
		 * @return {Object}
		 * @use {Object}.{type}.{param} = {Boolean}
		 * @type systemType/appType
		 * @params isIos/inWx/inApp/inJdApp/inJrApp/inWyApp
		 **/
		getBrowserInfo: function () {
			var ua = navigator.userAgent.toLowerCase();
			var isIos = ua.indexOf('ipad') > -1 || ua.indexOf('iphone') > -1 || false;
			var mqq = ua.indexOf("_sq_") > -1 || false;
			var wx = ua.indexOf('micromessenger') > -1 || false;
			var jdApp = ua.indexOf('jdapp') > -1 || false;
			var jrApp = ua.indexOf('jdjr') > -1 || ua.indexOf('android-async-http') > -1 || false;
			var wyApp = ua.indexOf('walletclient') > -1 || false;
			var jdStock = ua.indexOf("jdstock") > -1 || false;

			var systemType = {
				iOS: isIos,
				Android: !isIos
			};
			var appType = {
				mqq: mqq,
				wx: wx,
				jdApp: jdApp,
				jrApp: jrApp,
				wyApp: wyApp,
				jdStock: jdStock
			};
			return {
				systemType: systemType,
				appType: appType
			};
		},

		/**
		 * @function get cookie by name
		 * @return {String}
		 * @param {String} name
		 **/
		getCookie: function (name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(";");
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == " ") c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},

		/**
		 * @function get the value of url string
		 * @param {String} name
		 **/
		getUrlString: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURIComponent(r[2]);
			return null;
		},

		/**
		 * @function lock the screen
		 **/
		pageLock: function () {
			document.addEventListener("touchmove", pageLockHandler, {capture: false, passive: false})
		},

		/**
		 * @function unlock the screen
		 **/
		pageUnlock: function () {
			document.removeEventListener("touchmove", pageLockHandler, {capture: false})
		},

		/**
		 * @function show toast
		 * @param text {String}
		 **/
		showToast: function (text) {
			$("body").append('<div class="jm-toast"><div class="jm-toast-content">' + text + '</div></div>');
			return this;
		},

		/**
		 * @function show toast
		 * @param text {String}
		 **/
		hideToast: function () {
			$(".jm-toast").length > 0 && $(".jm-toast").remove();
		},

		/**
		 * @function show loading
		 **/
		showLoading: function () {
			$("body").append('<div class="jm-loading"><div class="jm-loading-content"></div></div>');
			return this;
		},

		/**
		 * @function hide loading
		 **/
		hideLoading: function () {
			$(".jm-loading").length > 0 && $(".jm-loading").remove();
		},
	};

	if (typeof exports === 'object') {  // 判断是否支持node模块
		var Utils = __utils;
	} else {    // window 下
		var Utils = Object.create(__utils);
	}
	return Utils;
});
