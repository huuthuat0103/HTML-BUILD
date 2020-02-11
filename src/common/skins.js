//$(function () {
//	"use strict";
//
//	$("[data-skin]").on("click", function (e) {
//		e.preventDefault();					// a태그에 대한 동작은 우선 멈추고..
//		changeSkin($(this).data("skin"));		// 스킨 변경 후
//		location.href = e.currentTarget.href;	// a태그의 href로 이동
//	});
//});

var mySkins = [
    "skin-01"
	,"skin-02"
	,"skin-03"
	,"skin-04"
	,"skin-05"
	,"skin-06"
	,"skin-07"
	,"skin-08"
	,"skin-09"
];

function changeSkin(cls) {
	$.each(mySkins, function(i) {
		$("body").removeClass(mySkins[i]);
	})

	$("body").addClass(mySkins[cls]);
	store("skin", cls);
	return false;
}
 
function setupSkin() {
	var curdate = get("today");
	var today = moment().format("YYYY-MM-DD");
	
	if(curdate && curdate != today) {
		changeSkin(Math.floor(Math.random() * 9));
	}
	else {
		var skin = get("skin");
		if (skin && $.inArray(skin, mySkins)) {
			changeSkin(skin);
		}
	}
	
	store("today", today);
}

function get(name) {
	if (typeof (Storage) !== "undefined") {
		return localStorage.getItem(name);
	} else {
		window.alert("최신 브라우저 사용을 권장합니다.");
	}
}

function store(name, val) {
	if (typeof (Storage) !== "undefined") {
		localStorage.setItem(name, val);
	} else {
		window.alert("최신 브라우저 사용을 권장합니다.");
	}
}