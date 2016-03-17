/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 3) {
			return callback('账号最短为 3 个字符');
		}
		if (loginInfo.account.length >15) {
			return callback('账号最长为 15 个字符');
		}
		if (loginInfo.password.length < 8) {
			//return callback('密码最短为 8 个字符');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		mui.ajax('http://app.jianyebao.com//api/verification.php?action=login',{
			data:{username:loginInfo.account,password:loginInfo.password},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				//json 200正确 
				if(data.errcode==200){
					return owner.createState(loginInfo.account,loginInfo.password,callback);
				}else{
					if(data.errmsg=='')
					  return callback('未知错误');
					else
					 return callback(data.errmsg);
				}
				
			},
			error:function(xhr,type,errorThrown){
				return callback('网络出现异常,请检查网络');
			}
		});
	};
	/**
	 * 验证核销码
	 **/
	owner.code = function(CodeInfo, callback) {
		callback = callback || $.noop;
		CodeInfo = CodeInfo || {};
		CodeInfo.code = CodeInfo.code || '';
		
		if (CodeInfo.code.length ==0 || CodeInfo.code == '输入串码' ) {
			return callback('请输入串码');
		}
		mui.ajax('http://app.jianyebao.com/api/verification.php?action=code',{
			data:{username:CodeInfo.username,password:CodeInfo.password,token:CodeInfo.token,code:CodeInfo.code},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				if(data.errcode==200)
					return callback(data.type);
				else
					return callback(data.errmsg);
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				return callback('网络出现异常,请检查网络');
				
			}
		});
	};
	
	
	/**
	 * 确认核销码
	 **/
	owner.updatecode = function(CodeInfo, callback) {
		callback = callback || $.noop;
		CodeInfo = CodeInfo || {};
		CodeInfo.code = CodeInfo.code || '';
		
	
		mui.ajax('http://app.jianyebao.com/api/verification.php?action=updatecode',{
			data:{username:CodeInfo.username,password:CodeInfo.password,token:CodeInfo.token,code:CodeInfo.code,type:CodeInfo.type},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				if(data.errcode==200)
					return callback('200');
				else
					return callback(data.errmsg);
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				return callback('网络出现异常,请检查网络');
				
			}
		});
	};
	
	owner.createState = function(name,password,callback) {
		var state = owner.getState();
		state.account = name;
		state.password = password;
		state.token = "88f9b256d76fedc7790013d7407126ed7a8f2cb5";
		state.host = "http://app.jianyebao.com";
		
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		var settings = owner.getSettings();
		settings.gestures = true;
		owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}
	

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));