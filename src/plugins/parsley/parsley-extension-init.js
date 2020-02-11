// alert 메세지로 표시
window.Parsley.on('form:error', function(formInstance){

	var message = "";

	// You have access to each field instance with `formInstance.fields`
	for (var idx in formInstance.fields)
	{
		if ( formInstance.fields[idx].validate() !== true )
		{
			var title = formInstance.fields[idx].$element[0].title ? formInstance.fields[idx].$element[0].title : "";
			var errorMessage = formInstance.fields[idx].getErrorsMessages();

			message = title + "은(는) " + errorMessage;

			break;
		}
	}

	if ( message !== "" )
		alert(message);
});

// parsley custom validator
// 비밀번호 확인 값 체크
window.Parsley.addValidator('passwordconfirm', {
	validateString: function(value, passwordId) {
		var password = $('#' + passwordId).val();

		return value === password;
	},
	messages: {
		ko: '비밀번호와 값이 다릅니다.'
	}
});

window.Parsley.addValidator('dupcheck', {
	validateString: function (value, dupFieldId) {
		var dupFiledValue = $('#'+dupFieldId).val();

		return dupFiledValue === 'true';
	},
	messages: {
		ko: '중복확인이 필요합니다.'
	}
});

window.Parsley.addValidator('autocheck', {
	validateString: function (value, dupFieldId) {
		var dupFiledValue = $('#'+dupFieldId).val();

		return dupFiledValue === 'true';
	},
	messages: {
		ko: '올바르지 않습니다.'
	}
});

window.Parsley.addValidator('savecheck', {
	validateString: function (value, dupFieldId) {
		var dupFiledValue = $('#'+dupFieldId).val();
		
		return dupFiledValue === 'true';
	},
	messages: {
		ko: '등록된 정보만 사용이 가능합니다.'
	}
});

window.Parsley.addValidator('imagefile', {
	validateString: function (value) {
		var imageFileExtension = ["jpg","png","jpeg"];
		var extension = value.toLowerCase().replace(/^.*\./, '');

		return $.inArray(extension, imageFileExtension) !== -1;
	},
	messages: {
		ko: '이미지파일만 업로드가 가능합니다.'
	}
});

window.Parsley.addValidator('maxFileSize', {
  validateString: function(_value, maxSize, parsleyInstance) {
    var files = parsleyInstance.$element[0].files;
    return files.length != 1  || files[0].size <= maxSize * 1024 * 1024;
  },
  requirementType: 'integer',
  messages: {
	ko: '%s Mb 이하의 파일만 업로드가 가능합니다.'
  }
});

window.Parsley.addValidator('decimalone', {
	validateString: function (value) {
		var pattern = /^\d*(\.\d{0,1})?$/;

		return pattern.test(value);
	},
	messages: {
		ko: '숫자만 입력가능하며, 소수점 한자리까지 입력이 가능합니다.'
	}
});

window.Parsley.addValidator('decimaltwo', {
	validateString: function (value) {
		var pattern = /^[-]\d*(\.\d{0,1})?$/;

		return pattern.test(value);
	},
	messages: {
		ko: '숫자만 입력가능하며, 소수점 한자리까지 입력이 가능합니다.'
	}
});

window.Parsley.addValidator('mailcheck', {
	validateString: function (value) {
		var pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

		return pattern.test(value);
	},
	messages: {
		ko: '형식이 올바르지 않습니다.'
	}
});

window.Parsley.addValidator('telcheck', {
	validateString: function (value) {
		var pattern = /^\d{2,3}-\d{3,4}-\d{4}$/;

		return pattern.test(value);
	},
	messages: {
		ko: '형식이 올바르지 않습니다.'
	}
});

window.Parsley.addValidator('custidnumcheck', {
	validateString: function (value) {
		var pattern = /^\d{3}-\d{2}-\d{5}$/;

		return pattern.test(value);
	},
	messages: {
		ko: '형식이 올바르지 않습니다.'
	}
});


window.Parsley.addValidator('hexcodecheck', {
	validateString: function (value) {
		var pattern = /^#(?:[0-9a-f]{3}){1,2}$/i;

		return pattern.test(value);
	},
	messages: {
		ko: '형식이 올바르지 않습니다.'
	}
});