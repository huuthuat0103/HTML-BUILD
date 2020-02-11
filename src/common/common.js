function ChkIsNotNull(str) {
	if (str == null) return false;
	if (str == "NaN") return false;
	if (new String(str).valueOf() == "undefined") return false;
	var chkStr = new String(str);
	if( chkStr.valueOf() == "undefined" ) return false;
	if (chkStr == null) return false;
	if (chkStr.toString().length == 0 ) return false;  
	return true;
}

function ChkIsNull(str) {
	if (str == null) return true;
	if (str == "NaN") return true;
	if (new String(str).valueOf() == "undefined") return true;
	var chkStr = new String(str);
	if( chkStr.valueOf() == "undefined" ) return true;
	if (chkStr == null) return true;
	if (chkStr.toString().length == 0 ) return true;  
	return false;
}

function ChkIsEmpty(str) {
	if (str == null) return "";
	if (str == "NaN") return "";
	if (new String(str).valueOf() == "undefined") return "";
	var chkStr = new String(str);
	if( chkStr.valueOf() == "undefined" ) return "";
	if (chkStr == null) return "";
	if (chkStr.toString().length == 0 ) return "";  
	return str;
}

function ComSubmit(opt_formId) {
	this.formId = ChkIsNull(opt_formId) ? "searchForm" : opt_formId;
	this.url = "";
	this.method = "get";
	
	if(this.formId == "commonForm"){
		$("#commonForm").empty();
	}
	 
	this.setUrl = function setUrl(url){
		this.url = ChkIsNull(url) ? "/" : url;
	};
	
	this.setMethod = function setMethod(method){
		this.method = ChkIsNull(method) ? "get" : method;
	};
	
	this.setTarget = function setTarget(target){
		this.target = ChkIsNull(target) ? "" : target;
	};
	 
	this.addParam = function addParam(key, value){
		$("#" + this.formId).append($("<input type='hidden' name='" + key + "' id='" + key + "' value='" + value + "' />"));
	};
	 
	this.submit = function submit(){
		var frm = $("#" + this.formId)[0];
		frm.action = this.url;
		frm.method = this.method;
		frm.submit();
	};
}

//parsley validation 초기화
function initParsley() {
	var parsleyConfig = {
		trigger: false,
		errorsWrapper: '',
		errorTemplate: ''
	};

	$.each(arguments, function(index, value) {
		$("#" + value).parsley(parsleyConfig);
	});

	// validation 에러를 alert()으로 표시하게 처리
	window.Parsley.on("field:error", function(field) {
		var errorMessageStr = "";

		$.each(field.getErrorsMessages(), function(index, value) {
			if (errorMessageStr !== "") {
				errorMessageStr += "\n";
			}
			errorMessageStr += field.element.title + "은(는) " + value;
		});

		alert(errorMessageStr);
	});
}

function parsleyFormValidate(formId) {
	var parsleyConfig = {
		errorsWrapper: '',
		errorTemplate: ''
	};

	return $("form#" + formId).parsley(parsleyConfig).validate();
}

function layerOpen( el ){
	var temp = $("#" + el);
	var bg = temp.prev().hasClass("bg");    // dimmed 레이어를 감지하기 위한 boolean 변수

	if(bg)	$(".layer-wrapper").fadeIn();   // "bg" 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다.
	else	temp.fadeIn();

	// 화면의 중앙에 레이어를 띄운다.
	if (temp.outerHeight() < $(document).height()) temp.css("margin-top", "-" + temp.outerHeight()/2 + "px");
	else temp.css("top", "0px");
	if (temp.outerWidth() < $(document).width()) temp.css("margin-left", "-" + temp.outerWidth()/2 + "px");
	else temp.css("left", "0px");

	$("#_cancel").click( function(event){
		$(".layer-wrapper").fadeOut();
		event.preventDefault();
	});

	$("#_close").click( function(event){ 
		$(".layer-wrapper").fadeOut();
		event.preventDefault();
	});
	
	// 송효섭 추가
	$(".bg").click( function(event){
		$(".layer-wrapper").fadeOut();
		event.preventDefault();
	});
}

function PopInfo () {
	if(ChkIsNull(arguments[0])) return false;
	
	var url = "/common/popup/" + arguments[0].name;
	$.ajax({
		type: "get"
		,url: url
		,data: {
			cust_cd: arguments[0].cust_cd
			,gubn: arguments[0].gubn
			,file: arguments[0].file
			,param1: arguments[0].param1
			,param2: arguments[0].param2
		}
		,cache: false
		,dataType: "html"
		,success: function(msg){
			$("#dialog").html(msg);
			if(msg.indexOf("pop-title") != -1) {
				layerOpen("pop-layer");
			}
		}
		,error: function(xhr, status, message) {
			ajaxError(xhr, status, message);
		}
	});
}

// 이미지 관련 =============================
// 업로드한 실제 파일명
function getOriginalName(fileName) {
	var file = getFileLink(fileName);
	var idx = file.indexOf("_") + 1;
	return file.substr(idx);
}

// 저장된 원본 파일명(날짜경로 포함, 유니크값 포함, 인코딩됨)
function getFileLink(fileName) {
	var front = fileName.substr(0, 12);
	var end = fileName.substr(14);
	return front + end;
}

function checkImageType(fileName) {
	if(ChkIsNull(fileName)) return null;
	
	var pattern = /jpg$|jpeg$|png$|gif$|tif$|tiff$/i;
	return fileName.match(pattern);
}

function checkFileType(fileName) {
	if(ChkIsNull(fileName)) return null;
	
	if (checkImageType(fileName)) {
		return checkImageType(fileName);
	}
	
	var pattern = /pdf$|hwp$|ppt$|pptx$|xls$|xlsx$|doc$|docx$/i;
	return fileName.match(pattern);
}

function checkExcelType(fileName) {
	if(ChkIsNull(fileName)) return null;
	
	var pattern = /xlsx$/i;
	return fileName.match(pattern);
}

// ** 중요: 폴더, DB에 한글 파일명으로 저장됨, parameter로 넘겨줄 때는 인코딩
function setImageDisplay(gubn, cust_cd, fileName, isThumb) {
	if(ChkIsNotNull(fileName)) {
		if(checkImageType(fileName)) {
			if(isThumb) {
				return "/common/fileDisplay?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(fileName);
			}
			else {
				return "/common/fileDisplay?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(getFileLink(fileName));
			}
		}
		else {
			alert("이미지 파일만 사용해 주시기 바랍니다.");
			return "/resources/images/no-image.png";
		}
	}
	else {
		return "/resources/images/no-image.png";
	}
}

function setProfileDisplay(gubn, cust_cd, fileName, isThumb) {
	if(ChkIsNotNull(fileName)) {
		if(checkImageType(fileName)) {
			if(isThumb) {
				return "/common/fileDisplay?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(fileName);
			}
			else {
				return "/common/fileDisplay?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(getFileLink(fileName));
			}
		}
		else {
			alert("이미지 파일만 사용해 주시기 바랍니다.");
			return "/resources/images/profile.png";
		}
	}
	else {
		return "/resources/images/profile.png";
	}
}

function setFileEvent(gubn, cust_cd, fileName) {
	if(checkImageType(fileName)) {
		PopInfo({name:"gallery", gubn:gubn, cust_cd:cust_cd, file:fileName});
	}
	else {
		if(!confirm("해당 파일을 다운로드 하시겠습니까?")) return false;
		self.location = "/common/fileDisplay?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(fileName);
	}
}

function setDownload(gubn, cust_cd, fileName) {
	if(!confirm("해당 파일을 다운로드 하시겠습니까?")) return false;
	
	if(checkImageType(fileName)) {
		self.location = "/common/fileDownload?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(getFileLink(fileName));
	}
	else {
		self.location = "/common/fileDownload?gubn=" + gubn + "&cust_cd=" + cust_cd + "&fileName=" + encodeURIComponent(fileName);
	}
}

//** 중요: 파일명이 틀리거나 파일이 삭제되거나 서버가 다운될 때 이미지 에러 무한루프 막아줌
function setImageError(tag) {
	$(tag).error(function () {
		$(tag).unbind("error");
		$(tag).prop("src", "/resources/images/profile.png");
	});
}
// ==================================

// 이메일 형식 체크 
function emailCheck(email) {
	var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/; 
	if(exptext.test(email) == false) { 
		// 이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우 
		alert("이메일형식이 올바르지 않습니다."); 
		return false; 
	}
	return true; 
} 

// 특수문자 여부 체크
function checkSpecial(str) { 
	var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi; 
	if (special_pattern.test(str) == true) { 
		return true; 
	} 
	else { 
		return false; 
	} 
}

// 전화번호 형식 체크
function isPhone(phoneNum) { 
	var regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/; 
	var myArray; 
	
	if(regExp.test(phoneNum)) { 
		myArray = regExp.exec(phoneNum); 
		return true; 
	} 
	else { 
		regExp = /(02)([0-9]{3,4})([0-9]{4})$/; 
		if(regExp.test(phoneNum)) { 
			myArray = regExp.exec(phoneNum); 
			return true; 
		}
		else { 
			regExp = /(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/; 
			if(regExp.test(phoneNum)) { 
				myArray = regExp.exec(phoneNum); 
				return true; 
			}
			else {
				return false; 
			}
		} 
	}
}

// 전화번호 포맷으로 변환
function formatPhone(phoneNum) { 
	phoneNum = phoneNum.replace(/[^0-9]/g, '');
	
	if(isPhone(phoneNum)) { 
		var rtnNum; 
		var regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/; 
		var myArray; 
		
		if(regExp.test(phoneNum)) { 
			myArray = regExp.exec(phoneNum); 
			rtnNum = myArray[1]+'-' + myArray[2]+'-'+myArray[3]; 
			return rtnNum; 
		} 
		else { 
			regExp = /(02)([0-9]{3,4})([0-9]{4})$/; 
			if(regExp.test(phoneNum)) { 
				myArray = regExp.exec(phoneNum); 
				rtnNum = myArray[1]+'-'+myArray[2]+'-'+myArray[3]; 
				return rtnNum; 
			} 
			else { 
				regExp = /(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/; 
				if(regExp.test(phoneNum)) { 
					myArray = regExp.exec(phoneNum); 
					rtnNum = myArray[1]+'-'+myArray[2]+'-'+myArray[3]; 
					return rtnNum; 
				} 
				else { 
					return phoneNum;
				}
			} 
		} 
	} 
	else { 
		return phoneNum; 
	} 
}

// 사업자등록번호 형식 체크
function isIdNum(idNum) { 
	var regExp = /([1-9]{1}[0-9]{2})([0-9]{2})([0-9]{5})$/; 
	var myArray; 
	
	if(regExp.test(idNum)) { 
		myArray = regExp.exec(idNum); 
		return true; 
	} 
	else { 
		return false; 
	}
}

// 사업자등록번호 포맷으로 변환
function formatIdNum(idNum) { 
	idNum = idNum.replace(/[^0-9]/g, '');
	if(idNum.length > 10) return idNum;
	
	if(isIdNum(idNum)) { 
		var rtnNum; 
		var regExp = /([1-9]{1}[0-9]{2})([0-9]{2})([0-9]{5})$/; 
		var myArray; 
		
		if(regExp.test(idNum)) { 
			myArray = regExp.exec(idNum); 
			rtnNum = myArray[1]+'-' + myArray[2]+'-'+myArray[3]; 
			return rtnNum; 
		} 
		else { 
			return idNum;
		} 
	} 
	else { 
		return idNum; 
	} 
}

// ID 포맷
function formatID(str) { 
	str = str.replace(/[^a-zA-Z0-9_-]/g, '');
	return str;
}

function formatCode(str) { 
	str = str.replace(/[^a-zA-Z0-9\-]/g, '');
	return str;
}

function formatProc(str) { 
	str = str.replace(/[^a-zA-Z]/g, '').toUpperCase();
	return str;
}

function formatUppercase(str) { 
	str = str.replace(/[^a-zA-Z0-9\/\ \_\-\.\,\&\(\)]/g, '').toUpperCase();
	return str;
}

function formatUppercaseKo(str) { 
	str = str.replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣\/\ \_\-\.\,\&\(\)]/g, '').toUpperCase();
	return str;
}

$.datepicker.regional['ko'] = {
	closeText: '닫기',
	prevText: '이전달',
	nextText: '다음달',
	currentText: '오늘',
	monthNames: [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
	monthNamesShort: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ],
	dayNames: [ '일', '월', '화', '수', '목', '금', '토' ],
	dayNamesShort: [ '일', '월', '화', '수', '목', '금', '토' ],
	dayNamesMin: [ '일', '월', '화', '수', '목', '금', '토' ],
	weekHeader: 'Wk',
	dateFormat: 'yy-mm-dd',
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: ''
};

$.datepicker.setDefaults($.datepicker.regional['ko']);

function initStartEndDatepicker(startDateElementId, endDateElementId) {
	var startDatepicker = $("#" + startDateElementId);
	var endDatepicker = $("#" + endDateElementId);

	var startDatePickerOptions = {
		'changeMonth': true,
		'changeYear': true,
		'maxDate': endDatepicker.val(),
		'onClose': function(datepicker) {
			endDatepicker.datepicker('option', 'minDate', datepicker);
		}
	};

	var endDatePickerOptions = {
		'changeMonth': true,
		'changeYear': true,
		'minDate': startDatepicker.val(),
		'onClose': function(datepicker) {
			startDatepicker.datepicker('option', 'maxDate', datepicker);
		}
	};

	startDatepicker.datepicker(startDatePickerOptions);
	endDatepicker.datepicker(endDatePickerOptions);
}

function initDatepickerByClass() {
	var options = {
		'changeMonth': true,
		'changeYear': true,
		dateFormat: 'yy-mm-dd'
	};

	$.each(arguments, function(index, value) {
		$(document).find("." + value).removeClass("hasDatepicker").datepicker(options);
	});
}

// 해당월 첫날
function getFirstDate(yymm) {
	return moment(yymm).format("YYYY-MM-DD");
}

//해당월 마지막날
function getLastDate(yymm) {
	var sdate = moment(yymm).format("YYYY-MM-DD");
	return moment(sdate).endOf("month").format("YYYY-MM-DD");
}

//검색일 셋팅
function setDate(val) {
	var today = new Date();

	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate();

	if (month < 10) {
		month = "0" + month;
	}
	
	if (day < 10) {
		day = "0" + day;
	}
	
	if(document.searchForm.endDate) {
		document.searchForm.endDate.value = year + '-' + month + '-' + day;
	}
	if(document.searchForm.endFrontDate) {
		document.searchForm.endFrontDate.value = '';	
	}	
	
	if (val == "01") {
	} 
	else if (val == "07") {
		today.setDate(today.getDate() - parseInt(val));
		
		year = today.getFullYear();
		month = today.getMonth() + 1;
		day = today.getDate();

		if (month < 10) {
			month = "0" + month;
		}
		
		if (day < 10) {
			day = "0" + day;
		}
	} 
	else {
		today.setMonth(today.getMonth() - parseInt(val));
		
		year = today.getFullYear();
		month = today.getMonth() + 1;
		day = today.getDate();

		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
	}
	
	if(document.searchForm.startDate) {
		document.searchForm.startDate.value = year + '-' + month + '-' + day;
	}
	if(document.searchForm.startFrontDate) {
		document.searchForm.startFrontDate.value = '';
	}
}

function setFrontDate(val) {
	var today = new Date();

	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate();

	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	
	if(document.searchForm.startDate) {
		document.searchForm.startDate.value = '';	
	}
	document.searchForm.startFrontDate.value = year + '-' + month + '-' + day;
	
	if (val == "01") {
	} 
	else if (val == "10") {
		today.setDate(today.getDate() + parseInt(val));
		
		year = today.getFullYear();
		month = today.getMonth() + 1;
		day = today.getDate();

		if (month < 10) {
			month = "0" + month;
		}
		
		if (day < 10) {
			day = "0" + day;
		}
	} 
	else {
		today.setMonth(today.getMonth() + parseInt(val));
		
		year = today.getFullYear();
		month = today.getMonth() + 1;
		day = today.getDate();

		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
	}
	
	if(document.searchForm.endDate) {
		document.searchForm.endDate.value = '';	
	}
	document.searchForm.endFrontDate.value = year + '-' + month + '-' + day;
}

function setCurDate(gubn) {
	if(document.searchForm.curDate) {
		var curDate = document.searchForm.curDate.value
		var curdt = new Date(curDate);
		
		if (gubn == "back") {
			curdt.setDate(curdt.getDate() - 1);
		}
		else if (gubn == "next") {
			curdt.setDate(curdt.getDate() + 1);
		}
		
		year = curdt.getFullYear();
		month = curdt.getMonth() + 1;
		day = curdt.getDate();
		
		if (month < 10) {
			month = "0" + month;
		}
		
		if (day < 10) {
			day = "0" + day;
		}
		
		document.searchForm.curDate.value = year + '-' + month + '-' + day;
	}
}

function clearForm(form) {
	var elements = form.elements;
	form.reset();

	for (i = 0; i < elements.length; i++) {
		var tag_name = elements[i].tagName.toLowerCase();
		var field_type = elements[i].type.toLowerCase();

		if(tag_name == "input") {
			switch (field_type) {
			case "text":
			case "password":
			/*case "hidden":*/
				elements[i].value = "";
				break;
			case "radio":
			case "checkbox":
				if (elements[i].value == "") {
					elements[i].checked = true;
				}
				else {
					elements[i].checked = false;
				}
				break;
			}
			
			setDate("07");
		}
		else if(tag_name == "select") {
			if(elements[i].classList.contains("selectpicker") == false
					&& elements[i].name != "fact_cd") {
				elements[i].value = "";
			}
		}
		else if(tag_name == "textarea") {
			elements[i].innerHTML = "";
		}
	}
}

function setDisableForm(form, flag) {
	var elements = form.elements;
	form.reset();

	for (i = 0; i < elements.length; i++) {
		var tag_name = elements[i].tagName.toLowerCase();
		var field_type = elements[i].type.toLowerCase();

		if(tag_name == "input") {
			switch (field_type) {
			case "text":
			case "password":
			case "radio":
			case "checkbox":
				elements[i].disabled  = flag;
				break;
			}
		}
		else if(tag_name == "select" || tag_name == "textarea") {
			elements[i].disabled  = flag;
		}
	}
}

function markFileSize(file_size) {
	var byteSize = Math.round(file_size / 1024 * 100) * .01;
	var suffix = 'KB';

	if (byteSize > 1000) {
		byteSize = Math.round(byteSize * .001 * 100) * .01;
		suffix = 'MB';
	}

	var sizeParts = byteSize.toString().split('.');

	if (sizeParts.length > 1) {
		byteSize = sizeParts[0] + '.' + sizeParts[1].substr(0, 2);
	} else {
		byteSize = sizeParts[0];
	}

	return byteSize + suffix;
}

function limitFileUpload(originSize, limitSize) {
	var convertSize = markFileSize(originSize);
	var sizeMark = convertSize.substr(convertSize.length-2);
	var fileSize = convertSize.substring(0, (convertSize.length-2));
	
	var convertLimit = (limitSize * 1024) * .001;
	
	if(sizeMark == "MB" && fileSize > convertLimit) {
		return true;
	}
	return false;
}

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.left = function(len) {
	if (this.length == 0 || this.length < len) return this;
	return this.substring(0, len);
}

String.prototype.right = function(len) {
	if (this.length == 0 || this.length < len) return this;
	return this.substring(this.length - len, this.length);
}

String.prototype.mid = function(pos, len) {
	if (this.length == 0 || this.length < pos) return "";
	if (this.length < (pos + len)) len = this.length - pos;
	return this.substring(pos, pos + len);
}

String.prototype.comma = function(gubn) {
	var num = this.toString().split(".");
	num[0] = num[0].replace(/[^0-9]/g, "");
	if(num[1]) {
		num[1] = num[1].replace(/[^0-9]/g, "");
	}
	
	if (this.toString().trim().left(1) != "-") {
		if(num[0].length == 0 || isNaN(num[0])) return "";
	}
	
	var positive = num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (this.toString().trim().left(1) == "-") {
		positive = "-" + positive;
	}
	
	if(gubn) {
		gubn = gubn.replace(/[^0-9]/g, "");	
		
		if(typeof num[1] == "undefined") {
			return positive;
		}
		else if(num[1] == "") {
			positive = positive + ".";
		}
		else {
			positive = positive + "." + (num[1] + "000").substring(0, (num[1].length < gubn ? num[1].length : gubn));
		}
	}
	
	return positive;
}

Number.prototype.comma = String.prototype.comma;

//정수 지정자리 반올림 (값, 자릿수) - 엑셀의 ROUND
function Round(n, pos) {
	n = n.toFixed(0);
	var digits = Math.pow(10, pos);
	var sign = 1;
	if (n < 0) {
		sign = -1;
	}

	// 음수이면 양수처리후 반올림 한 후 다시 음수처리
	n = n * sign;
	var num = Math.round(n / digits) * digits;
	num = num * sign;
	return num;
}

// 정수 지정자리 올림 (값, 자릿수) - 엑셀의 ROUNDUP
function Ceiling(n, pos) {
	// Ceiling(450.0000006) -> 451이 되므로 toFixed로 소수점 버림
	n = n.toFixed(0);
	var digits = Math.pow(10, pos);
	var num = Math.ceil(n / digits) * digits;
	return num;
}

// 정수 지정자리 버림 (값, 자릿수) - 엑셀의 ROUNDDOWN
function Floor(n, pos) {
	n = n.toFixed(0);
	var digits = Math.pow(10, pos);
	var num = Math.floor(n / digits) * digits;
	return num;
}

//소수점 지정자리 반올림 (값, 자릿수)
function RoundP(n, pos) {
	var digits = Math.pow(10, pos);
	var sign = 1;
	if (n < 0) {
		sign = -1;
	}

	// 음수이면 양수처리후 반올림 한 후 다시 음수처리
	n = n * sign;
	var num = Math.round(n * digits) / digits;
	num = num * sign;
	return num.toFixed(pos);
}

// 소수점 지정자리 버림 (값, 자릿수)
function FloorP(n, pos) {
	var digits = Math.pow(10, pos);
	var sign = 1;
	if (n < 0) {
		sign = -1;
	}

	// 음수이면 양수처리후 반올림 한 후 다시 음수처리
	n = n * sign;
	var num = Math.floor(n * digits) / digits;
	num = num * sign;
	return num.toFixed(pos);
}

// 자릿수에 맞춰 0 붙이기
function pad(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
}

// 바늘 시계용 
function updateClock(){
    var now = moment(),
        second = now.seconds() * 6,
        minute = now.minutes() * 6 + second / 60,
        hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

    $("#tHour").css("transform", "rotate(" + hour + "deg)");
    $("#tMinute").css("transform", "rotate(" + minute + "deg)");
    $("#tSecond").css("transform", "rotate(" + second + "deg)");
}

// Ajax 에러 시 alert 표시
function ajaxError(xhr, status, message) {
	if (message != "abort") {
		if (xhr.status == 200) {
			var contentType = xhr.getResponseHeader("Content-Type");
			if(ChkIsNotNull(contentType)) {
				if(contentType.toLowerCase().indexOf("text/html") != -1) {
					window.location.reload();
				}
			}
			else {
				alert("데이터 수신 오류" + (xhr ? "\r상태: " + xhr.statusText : "") + "\r" + status + "\r" + message);
			}
		}
		else {
			alert("데이터 수신 오류" + (xhr ? "\r상태: " + xhr.statusText : "") + "\r" + status + "\r" + message);
		}
	}
}

function fnMoveFocus(event) {
	var curIndex = 0;
	var preIndex = 0;
	var nextIndex = 0;
	
	if($(document).find(".rudder").length == 0) return false;
	
	$.each($(document).find(".rudder"), function(index, item) {
		if(item == event.target) {
			curIndex = index;
		}
	});
	
	// 왼쪽, 오른쪽은 제외 : input 내 커서 이동을 위해.. 중요!!
	
	// 위로 
	if (event.keyCode == 38) {
		preIndex = curIndex - 1;
		
		if(event.target == document) {
			$($(document).find(".rudder")[0]).select();
		}
		else {
			if(preIndex > -1) {
				$($(document).find(".rudder")[preIndex]).select();
			}
			else {
				$($(document).find(".rudder")[$(document).find(".rudder").length - 1]).select();
			}
		}
	}
	// 아래로
	else if (event.keyCode == 40) {
		nextIndex = curIndex + 1;
		
		if(event.target == document) {
			$($(document).find(".rudder")[0]).select();
		}
		else {
			if($(document).find(".rudder").length > nextIndex) {
				$($(document).find(".rudder")[nextIndex]).select();
			}
			else {
				$($(document).find(".rudder")[0]).select();
			}
		}
	}
	// 엔터
	else if (event.keyCode == 13) {
		var form = $(event.target).closest("form").prop("name");
		if(ChkIsNotNull(form)) {
			$("#" + form).find(".enter-data:visible").trigger("click");
		}
		else {
			goCheck();
		}
	}
}

function getPDF(pdf_ort, pdf_id, pdf_name) {
	var html_width = $("#" + pdf_id).width();
	var html_height = $("#" + pdf_id).height();
	var margin_top_left = 50;
	var img_width = html_width;
	var img_height = html_height;
	
	var pdf_width = 0;
	var pdf_height = 0;
	
	if(pdf_ort == "p") {
		pdf_width = html_width + (margin_top_left * 2);
		pdf_height = Math.ceil(pdf_width * 1.41428) + (margin_top_left * 2);
	}
	else if(pdf_ort == "l") {
		pdf_width = html_width + (margin_top_left * 2);
		pdf_height = (pdf_width * 0.70707) + (margin_top_left * 2);
	}
	else {
		return false;
	}
	
	var pdf_pages = Math.ceil(html_height/pdf_height)-1;

	html2canvas($("#" + pdf_id),
		{onrendered: function(canvas) {
			canvas.getContext("2d");
			
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			var pdf = new jsPDF(pdf_ort, "pt",  [pdf_width, pdf_height]);
		    pdf.addImage(imgData, 'JPG', margin_top_left, margin_top_left, img_width, img_height);
			
			for (var i = 1; i <= pdf_pages; i++) { 
				pdf.addPage(pdf_width, pdf_height);
				pdf.addImage(imgData, 'JPG', margin_top_left, -(pdf_height * i) + (margin_top_left * 4), img_width, img_height);
			}
			
		    pdf.save(pdf_name + ".pdf");
		}
    });
};