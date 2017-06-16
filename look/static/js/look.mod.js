/* 000001 */ 	(function () {
/* 000004 */ 		var clean = function () {
/* 000004 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000005 */ 			var __iterable0__ = args;
/* 000005 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000005 */ 				var id = __iterable0__ [__index0__];
/* 000006 */ 				$ ('#{}'.format (id)).empty ();
/* 000006 */ 			}
/* 000006 */ 		};
/* 000009 */ 		var hide = function () {
/* 000009 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000010 */ 			var __iterable0__ = args;
/* 000010 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000010 */ 				var id = __iterable0__ [__index0__];
/* 000011 */ 				$ ('#{}'.format (id)).hide ();
/* 000011 */ 			}
/* 000011 */ 		};
/* 000014 */ 		var load = function (id, query) {
/* 000015 */ 			clean (id);
/* 000016 */ 			show ('loadingBoard');
/* 000017 */ 			var success = function (d) {
/* 000018 */ 				$ ('#{}'.format (id)).html (d);
/* 000019 */ 				hide ('loadingBoard');
/* 000019 */ 			};
/* 000022 */ 			$.ajax (dict ({'method': 'GET', 'url': 'html/?{}'.format (query), 'success': success, 'error': (function __lambda__ (d) {
/* 000024 */ 				return load (id, 'command=error');
/* 000024 */ 			})}));
/* 000024 */ 		};
/* 000028 */ 		var loadMessage = function (id, msg) {
/* 000029 */ 			load (id, 'command=message&message={}'.format (encodeURIComponent (msg)));
/* 000029 */ 		};
/* 000031 */ 		var show = function () {
/* 000031 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000032 */ 			var __iterable0__ = args;
/* 000032 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000032 */ 				var id = __iterable0__ [__index0__];
/* 000033 */ 				$ ('#{}'.format (id)).show ();
/* 000033 */ 			}
/* 000033 */ 		};
/* 000036 */ 		var hookAdmin = function () {
/* 000037 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000038 */ 			clean ('goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000039 */ 			load ('activeBoard', 'command=admin');
/* 000040 */ 			show ('activeBoard', 'navbar');
/* 000040 */ 		};
/* 000043 */ 		var hookChangePassword = function () {
/* 000044 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000045 */ 			var username = $ ("input[name='username']").val ();
/* 000046 */ 			var old_passplain = $ ("input[name='old_passplain']").val ();
/* 000047 */ 			var new_passplain = $ ("input[name='new_passplain']").val ();
/* 000048 */ 			print (username, old_passplain, new_passplain);
/* 000049 */ 			if (changepassword (username, old_passplain, new_passplain)) {
/* 000050 */ 				loadMessage ('goodnews', 'La password è stata cambiata');
/* 000051 */ 				show ('goodnews');
/* 000051 */ 			}
/* 000052 */ 			else {
/* 000053 */ 				loadMessage ('badnews', 'Non è stato possibile cambiare la password');
/* 000054 */ 				show ('badnews');
/* 000054 */ 			}
/* 000055 */ 			load ('navbar', 'command=navbar');
/* 000056 */ 			load ('activeBoard', 'command=profile');
/* 000057 */ 			show ('navbar', 'activeBoard');
/* 000057 */ 		};
/* 000060 */ 		var changepassword = function (username, old_passplain, new_passplain) {
/* 000061 */ 			var httpPost = function (theUrl) {
/* 000062 */ 				var xmlHttp = new XMLHttpRequest;
/* 000063 */ 				xmlHttp.open ('POST', theUrl, false);
/* 000064 */ 				xmlHttp.send (null);
/* 000065 */ 				return tuple ([xmlHttp.status, xmlHttp.responseText]);
/* 000065 */ 			};
/* 000066 */ 			var __left0__ = httpPost ('back/?command=changepassword&username={}&old_passplain={}&new_passplain={}'.format (username, old_passplain, new_passplain));
/* 000066 */ 			var status = __left0__ [0];
/* 000066 */ 			var text = __left0__ [1];
/* 000067 */ 			if (status == 200) {
/* 000068 */ 				return text;
/* 000068 */ 			}
/* 000069 */ 			else {
/* 000070 */ 				print ('error in change password');
/* 000071 */ 				return false;
/* 000071 */ 			}
/* 000071 */ 		};
/* 000075 */ 		var hookContent = function () {
/* 000076 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000077 */ 			clean ('goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000078 */ 			load ('activeBoard', 'command=content');
/* 000079 */ 			show ('activeBoard', 'navbar');
/* 000079 */ 		};
/* 000082 */ 		var hookLogin = function () {
/* 000083 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000084 */ 			var username = login ();
/* 000085 */ 			clean ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000086 */ 			if (!(username)) {
/* 000087 */ 				loadMessage ('badnews', 'Non è stato possibile accedere. Ritenta o contatta il tuo insegnante');
/* 000088 */ 				show ('badnews');
/* 000088 */ 			}
/* 000089 */ 			load ('navbar', 'command=navbar&username={}'.format (username));
/* 000090 */ 			load ('welcomeBoard', 'command=welcomeBoard&username={}'.format (username));
/* 000091 */ 			show ('navbar', 'welcomeBoard');
/* 000091 */ 		};
/* 000094 */ 		var login = function () {
/* 000095 */ 			var username = $ ("input[name='username']").val ();
/* 000096 */ 			var password = $ ("input[name='password']").val ();
/* 000097 */ 			var httpGet = function (theUrl) {
/* 000098 */ 				var xmlHttp = new XMLHttpRequest;
/* 000099 */ 				xmlHttp.open ('GET', theUrl, false);
/* 000100 */ 				xmlHttp.send (null);
/* 000101 */ 				return tuple ([xmlHttp.status, xmlHttp.responseText]);
/* 000101 */ 			};
/* 000102 */ 			var __left0__ = httpGet ('back/?command=login&username={}&password={}'.format (username, password));
/* 000102 */ 			var status = __left0__ [0];
/* 000102 */ 			var text = __left0__ [1];
/* 000103 */ 			if (status == 200) {
/* 000104 */ 				$.cookie ('authtoken', text);
/* 000105 */ 				return username;
/* 000105 */ 			}
/* 000106 */ 			else {
/* 000107 */ 				return false;
/* 000107 */ 			}
/* 000107 */ 		};
/* 000109 */ 		var hookLogout = function () {
/* 000110 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000111 */ 			clean ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000112 */ 			$.removeCookie ('authtoken');
/* 000113 */ 			load ('navbar', 'command=navbar');
/* 000114 */ 			load ('welcomeBoard', 'command=welcomeBoard');
/* 000115 */ 			show ('navbar', 'welcomeBoard');
/* 000115 */ 		};
/* 000118 */ 		var hookMain = function () {
/* 000119 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000120 */ 			clean ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000121 */ 			try {
/* 000122 */ 				var username = unmask ($.cookie ('authtoken'));
/* 000122 */ 			}
/* 000122 */ 			catch (__except0__) {
/* 000124 */ 				var username = null;
/* 000124 */ 			}
/* 000125 */ 			load ('navbar', 'command=navbar&username={}'.format (username));
/* 000126 */ 			load ('welcomeBoard', 'command=welcomeBoard&username={}'.format (username));
/* 000127 */ 			show ('navbar', 'welcomeBoard');
/* 000127 */ 		};
/* 000130 */ 		var unmask = function (token) {
/* 000131 */ 			var httpGet = function (theUrl) {
/* 000132 */ 				var xmlHttp = new XMLHttpRequest;
/* 000133 */ 				xmlHttp.open ('GET', theUrl, false);
/* 000134 */ 				xmlHttp.send (null);
/* 000135 */ 				return tuple ([xmlHttp.status, xmlHttp.responseText]);
/* 000135 */ 			};
/* 000136 */ 			var __left0__ = httpGet ('back/?command=unmask&token={}'.format (token));
/* 000136 */ 			var status = __left0__ [0];
/* 000136 */ 			var text = __left0__ [1];
/* 000137 */ 			if (status == 200) {
/* 000138 */ 				return text;
/* 000138 */ 			}
/* 000139 */ 			else {
/* 000140 */ 				print ('unmask request', token);
/* 000141 */ 				return false;
/* 000141 */ 			}
/* 000141 */ 		};
/* 000144 */ 		var hookNewClassroom = function () {
/* 000145 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000146 */ 			var ref = $ ("input[name='ref']").val ();
/* 000147 */ 			var httpPost = function (theUrl) {
/* 000148 */ 				var xmlHttp = new XMLHttpRequest;
/* 000149 */ 				xmlHttp.open ('POST', theUrl, false);
/* 000150 */ 				xmlHttp.send (null);
/* 000151 */ 				return xmlHttp.status;
/* 000151 */ 			};
/* 000152 */ 			if (httpPost ('back/?command=newClassroom&ref={}'.format (ref)) == 200) {
/* 000153 */ 				loadMessage ('goodnews', 'La classe è stata creata con successo');
/* 000154 */ 				show ('goodnews');
/* 000154 */ 			}
/* 000155 */ 			else {
/* 000156 */ 				loadMessage ('badnews', 'Non è stato possibile creare il profilo');
/* 000157 */ 				show ('badnews');
/* 000157 */ 			}
/* 000158 */ 			load ('activeBoard', 'command=admin');
/* 000159 */ 			show ('navbar', 'activeBoard');
/* 000159 */ 		};
/* 000162 */ 		var hookProfile = function () {
/* 000163 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000164 */ 			clean ('goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000165 */ 			load ('activeBoard', 'command=profile');
/* 000166 */ 			show ('navbar', 'activeBoard');
/* 000166 */ 		};
/* 000169 */ 		var hookSignup = function () {
/* 000170 */ 			hide ('navbar', 'goodnews', 'badnews', 'welcomeBoard', 'activeBoard');
/* 000171 */ 			if (signup ()) {
/* 000172 */ 				loadMessage ('goodnews', 'Il profilo è stato creato con successo');
/* 000173 */ 				show ('goodnews');
/* 000173 */ 			}
/* 000174 */ 			else {
/* 000175 */ 				loadMessage ('badnews', 'Non è stato possibile creare il profilo');
/* 000176 */ 				show ('badnews');
/* 000176 */ 			}
/* 000177 */ 			load ('navbar', 'command=navbar');
/* 000178 */ 			load ('welcomeBoard', 'command=welcomeBoard');
/* 000179 */ 			show ('navbar', 'welcomeBoard');
/* 000180 */ 			return false;
/* 000180 */ 		};
/* 000183 */ 		var signup = function () {
/* 000184 */ 			var username = $ ("input[name='username']").val ();
/* 000185 */ 			var password = $ ("input[name='password']").val ();
/* 000186 */ 			var httpPost = function (theUrl) {
/* 000187 */ 				var xmlHttp = new XMLHttpRequest;
/* 000188 */ 				xmlHttp.open ('POST', theUrl, false);
/* 000189 */ 				xmlHttp.send (null);
/* 000190 */ 				return xmlHttp.status;
/* 000190 */ 			};
/* 000191 */ 			if (httpPost ('back/?command=signup&username={}&password={}'.format (username, password)) == 200) {
/* 000192 */ 				return true;
/* 000192 */ 			}
/* 000193 */ 			else {
/* 000194 */ 				return false;
/* 000194 */ 			}
/* 000194 */ 		};
/* 000196 */ 		load ('navbar', 'command=navbar');
/* 000197 */ 		load ('welcomeBoard', 'command=welcomeBoard');
/* 000198 */ 		show ('welcomeBoard');
/* 000199 */ 		hide ('loadingBoard');
/* 000199 */ 		__pragma__ ('<all>')
/* 000199 */ 			__all__.changepassword = changepassword;
/* 000199 */ 			__all__.clean = clean;
/* 000199 */ 			__all__.hide = hide;
/* 000199 */ 			__all__.hookAdmin = hookAdmin;
/* 000199 */ 			__all__.hookChangePassword = hookChangePassword;
/* 000199 */ 			__all__.hookContent = hookContent;
/* 000199 */ 			__all__.hookLogin = hookLogin;
/* 000199 */ 			__all__.hookLogout = hookLogout;
/* 000199 */ 			__all__.hookMain = hookMain;
/* 000199 */ 			__all__.hookNewClassroom = hookNewClassroom;
/* 000199 */ 			__all__.hookProfile = hookProfile;
/* 000199 */ 			__all__.hookSignup = hookSignup;
/* 000199 */ 			__all__.load = load;
/* 000199 */ 			__all__.loadMessage = loadMessage;
/* 000199 */ 			__all__.login = login;
/* 000199 */ 			__all__.show = show;
/* 000199 */ 			__all__.signup = signup;
/* 000199 */ 			__all__.unmask = unmask;
/* 000199 */ 		__pragma__ ('</all>')
/* 000199 */ 	}) ();
/* 000199 */ 