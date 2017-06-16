/* 000001 */ 	(function () {
/* 000003 */ 		var sendMessage = function () {
/* 000004 */ 			var message = prompt ('Scrivi qui il messaggio:', 'Nessun messaggio');
/* 000005 */ 			print ('ricevuto', message);
/* 000006 */ 			var csrftoken = $ ('[name=csrfmiddlewaretoken]').val ();
/* 000007 */ 			var sender = $ ('[name=envelope_username]').val ();
/* 000008 */ 			var receiver = 'admin';
/* 000009 */ 			var data = dict ({'message': message, 'sender': sender, 'receiver': receiver});
/* 000014 */ 			$.ajax (dict ({'method': 'POST', 'headers': dict ({'X_CSRF_TOKEN': csrftoken, 'X-CSRFToken': csrftoken}), 'data': data, 'url': 'back/envelope', 'complete': (function __lambda__ (d) {
/* 000022 */ 				return alert ('Messaggio inviato');
/* 000022 */ 			})}));
/* 000022 */ 		};
/* 000026 */ 		var clean = function () {
/* 000026 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000027 */ 			var __iterable0__ = args;
/* 000027 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000027 */ 				var id = __iterable0__ [__index0__];
/* 000028 */ 				$ ('#{}'.format (id)).empty ();
/* 000028 */ 			}
/* 000028 */ 		};
/* 000031 */ 		var hide = function () {
/* 000031 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000032 */ 			var __iterable0__ = args;
/* 000032 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000032 */ 				var id = __iterable0__ [__index0__];
/* 000033 */ 				$ ('#{}'.format (id)).css ('visibility', 'hidden');
/* 000033 */ 			}
/* 000033 */ 		};
/* 000036 */ 		var collapse_table = function (id) {
/* 000037 */ 			if ($ ('#{} tbody tr:first-child'.format (id)).css ('visibility') == 'hidden') {
/* 000038 */ 				$ ('#{} tbody tr:first-child'.format (id)).css ('visibility', 'visible');
/* 000039 */ 				$ ('#{} tbody tr:not(:first-child)'.format (id)).show ();
/* 000039 */ 			}
/* 000040 */ 			else {
/* 000041 */ 				$ ('#{} tbody tr:first-child'.format (id)).css ('visibility', 'hidden');
/* 000042 */ 				$ ('#{} tbody tr:not(:first-child)'.format (id)).hide ();
/* 000042 */ 			}
/* 000042 */ 		};
/* 000045 */ 		var load = function (id, query) {
/* 000046 */ 			print ('load', id, query);
/* 000047 */ 			hide (id);
/* 000048 */ 			$.ajax (dict ({'method': 'GET', 'url': query, 'success': (function __lambda__ (d) {
/* 000051 */ 				return $ ('#{}'.format (id)).html (d);
/* 000051 */ 			}), 'error': (function __lambda__ (t, e) {
/* 000052 */ 				return $ ('#{}'.format (id)).html (e);
/* 000052 */ 			}), 'complete': (function __lambda__ (d) {
/* 000053 */ 				return typeset_and_show (id);
/* 000053 */ 			})}));
/* 000054 */ 			if (__in__ (id, list (['board', 'admin_board']))) {
/* 000055 */ 				window.scrollTo (0, 0);
/* 000055 */ 			}
/* 000055 */ 		};
/* 000057 */ 		var edit = function (data) {
/* 000057 */ 			if (typeof data == 'undefined' || (data != null && data .hasOwnProperty ("__kwargtrans__"))) {;
/* 000057 */ 				var data = dict ({});
/* 000057 */ 			};
/* 000058 */ 			print ('active.edit' + str (data));
/* 000059 */ 			if (!__in__ ('value', data)) {
/* 000060 */ 				data ['value'] = $ ('[name={}]'.format (data ['attr'])).val ();
/* 000060 */ 			}
/* 000061 */ 			if (__in__ ('csrf', data)) {
/* 000062 */ 				var csrftoken = data ['csrf'];
/* 000062 */ 			}
/* 000063 */ 			else {
/* 000064 */ 				var csrftoken = $ ('[name=csrfmiddlewaretoken]').val ();
/* 000064 */ 			}
/* 000065 */ 			$.ajax (dict ({'method': 'POST', 'headers': dict ({'X_CSRF_TOKEN': csrftoken, 'X-CSRFToken': csrftoken}), 'data': data, 'url': 'back/edit', 'complete': (function __lambda__ (d) {
/* 000073 */ 				return load (data ['attr'], 'html/admin-table?serial={}&attr={}'.format (data ['serial'], data ['attr']));
/* 000073 */ 			})}));
/* 000075 */ 			return false;
/* 000075 */ 		};
/* 000078 */ 		var new_model = function (serial, attr, model, csrf) {
/* 000078 */ 			if (typeof serial == 'undefined' || (serial != null && serial .hasOwnProperty ("__kwargtrans__"))) {;
/* 000078 */ 				var serial = null;
/* 000078 */ 			};
/* 000078 */ 			if (typeof attr == 'undefined' || (attr != null && attr .hasOwnProperty ("__kwargtrans__"))) {;
/* 000078 */ 				var attr = null;
/* 000078 */ 			};
/* 000078 */ 			if (typeof model == 'undefined' || (model != null && model .hasOwnProperty ("__kwargtrans__"))) {;
/* 000078 */ 				var model = null;
/* 000078 */ 			};
/* 000078 */ 			if (typeof csrf == 'undefined' || (csrf != null && csrf .hasOwnProperty ("__kwargtrans__"))) {;
/* 000078 */ 				var csrf = null;
/* 000078 */ 			};
/* 000079 */ 			print (serial, attr, model, csrf);
/* 000080 */ 			var data = dict ({});
/* 000081 */ 			data ['serial'] = serial;
/* 000082 */ 			data ['attr'] = attr;
/* 000083 */ 			data ['model'] = model;
/* 000084 */ 			$.ajax (dict ({'method': 'POST', 'headers': dict ({'X_CSRF_TOKEN': csrf, 'X-CSRFToken': csrf}), 'data': data, 'url': 'back/new', 'success': (function __lambda__ (d) {
/* 000092 */ 				return load ('admin_board', 'html/admin-model?serial={}'.format (d));
/* 000092 */ 			})}));
/* 000092 */ 		};
/* 000096 */ 		var show = function () {
/* 000096 */ 			var args = tuple ([].slice.apply (arguments).slice (0));
/* 000097 */ 			var __iterable0__ = args;
/* 000097 */ 			for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
/* 000097 */ 				var id = __iterable0__ [__index0__];
/* 000098 */ 				$ ('#{}'.format (id)).show ();
/* 000099 */ 				$ ('#{}'.format (id)).css ('visibility', 'visible');
/* 000099 */ 			}
/* 000099 */ 		};
/* 000102 */ 		var submit = function () {
/* 000103 */ 			var wrong_answer = function (d, e) {
/* 000104 */ 				if (d ['status'] == '401') {
/* 000105 */ 					load ('board', 'html/login');
/* 000105 */ 				}
/* 000106 */ 				else {
/* 000107 */ 					load ('board', 'html/solution?status=wrong&serial={}&answer={}'.format (data ['serial'], data ['answer']));
/* 000107 */ 				}
/* 000107 */ 			};
/* 000108 */ 			hide ('board');
/* 000109 */ 			var kind = $ ('[name=kind]').val ();
/* 000110 */ 			var csrftoken = $ ('[name=csrfmiddlewaretoken]').val ();
/* 000111 */ 			if (kind == 'bool') {
/* 000112 */ 				var answer = $ ('input:checked').val ();
/* 000112 */ 			}
/* 000113 */ 			else if (kind == 'multi') {
/* 000114 */ 				var answer = $ ('input:checked').val ();
/* 000114 */ 			}
/* 000115 */ 			else if (kind == 'open') {
/* 000116 */ 				var answer = $ ('#textInput').val ();
/* 000116 */ 			}
/* 000117 */ 			else {
/* 000118 */ 				var answer = 'done';
/* 000118 */ 			}
/* 000119 */ 			var required = $ ('[name=required]').val ();
/* 000121 */ 			var data = dict ({'serial': $ ('h1 small').html (), 'answer': answer, 'required': required});
/* 000125 */ 			$.ajax (dict ({'method': 'POST', 'headers': dict ({'X_CSRF_TOKEN': csrftoken, 'X-CSRFToken': csrftoken}), 'data': data, 'url': 'back/submit', 'success': (function __lambda__ (d) {
/* 000132 */ 				return load ('board', 'html/solution?status=correct&serial={}&answer={}'.format (data ['serial'], data ['answer']));
/* 000132 */ 			}), 'error': wrong_answer}));
/* 000135 */ 			return false;
/* 000135 */ 		};
/* 000138 */ 		var common_truth = function (s) {
/* 000139 */ 			if (__in__ (s.lower (), list (['true', 'vero']))) {
/* 000140 */ 				return 'true';
/* 000140 */ 			}
/* 000141 */ 			else if (__in__ (s.lower (), list (['false', 'falso']))) {
/* 000142 */ 				return 'false';
/* 000142 */ 			}
/* 000143 */ 			else {
/* 000144 */ 				var __except0__ = ValueError ('{} is not bool'.format (s));
/* 000144 */ 				__except0__.__cause__ = null;
/* 000144 */ 				throw __except0__;
/* 000144 */ 			}
/* 000144 */ 		};
/* 000147 */ 		var typeset_and_show = function (id) {
/* 000148 */ 			MathJax.Hub.Queue (list (['Typeset', MathJax.Hub]));
/* 000149 */ 			show (id);
/* 000149 */ 		};
/* 000149 */ 		__pragma__ ('<all>')
/* 000149 */ 			__all__.clean = clean;
/* 000149 */ 			__all__.collapse_table = collapse_table;
/* 000149 */ 			__all__.common_truth = common_truth;
/* 000149 */ 			__all__.edit = edit;
/* 000149 */ 			__all__.hide = hide;
/* 000149 */ 			__all__.load = load;
/* 000149 */ 			__all__.new_model = new_model;
/* 000149 */ 			__all__.sendMessage = sendMessage;
/* 000149 */ 			__all__.show = show;
/* 000149 */ 			__all__.submit = submit;
/* 000149 */ 			__all__.typeset_and_show = typeset_and_show;
/* 000149 */ 		__pragma__ ('</all>')
/* 000149 */ 	}) ();
/* 000149 */ 