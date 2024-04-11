let rootip = "localhost";
let rootUrl = "http://"+rootip+":8088/";
let fileurl = rootUrl+"upload/";
let clientUrl = rootUrl+"database/";
let uploadUrl = rootUrl+"database/upload";
let _editorUpload = clientUrl+"editorUploadJ";
let _editorUploadVideo = clientUrl+"editorUploadVideoJ";



var _focusaddresselid = null;
window.addEventListener('message', function(event) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    var loc = event.data;
    if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        var latlng = loc.latlng;
        var address = loc.poiaddress;
        $("#"+_focusaddresselid).val(address);
        __fromlocation = true;
        goback();
    }
}, false);


function toSelectAddressPage(elid){
    _focusaddresselid = elid;
    changePage('selectaddresspage');
}