

let editor;
let editor2;

function setHtmlNote(html,elid){
    if(html.indexOf("http://")==-1){
        html = html.replace(/upload/g,fileurl);
    }
    $("#"+elid).html(html);
}

function fillFormData(formEL, obj, isStatus) {
    $.each(obj, function(index, item) {
        formEL.find("[name=" + index + "]").val(item);
    });
}
function serializeObject(form) {
    let o = {};
    $.each(form.serializeArray(), function(index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
        } else {
            o[this['name']] = this['value'];
        }
    });
    return o;
};
function getSearchParam(p){
    let search = window.location.search;
    if (/^[#\?]/.test(search))
        search = search.slice(1);
    let a = search.split("&"),
        o = {};
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split("=");
        o[b[0]] = b[1];
    }
    return o[p];
}
function ajaxCallback(action, data, cb,notshow) {
    if(!clientUrl){
        alert("请先设置服务端根路径");
        return;
    }
    !notshow && showLoader("请稍后...");
    data = data || {};
    let retrytimes = 5;
    let count = 0;
    let connectServer = function(){
        !notshow && showLoader("请稍后...");
        $.ajax({
            type: "GET",
            url: clientUrl + action,
            dataType: "jsonp",
            jsonp: "callback",
            contentType: "text/html; charset=utf-8",
            data: data,
            timeout:50000,
            async:true,
            success: function (data) {
                hideLoader();
                cb(data);
                console.log("success");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideLoader();
                console.log("error:"+XMLHttpRequest+" textStatus:"+textStatus+" errorThrown"+errorThrown);
            },
            complete:function(XMLHttpRequest, textStatus){
                console.log("complete:"+XMLHttpRequest+"textStatus:"+textStatus);
                if(textStatus == "timeout"){
                    if(count<retrytimes){
                        count++;
                        connectServer();
                        console.log(count);
                    }else{
                        showLoader("连接服务器超时！",true);
                    }

                }
            }
        });
    };
    connectServer();
}
/**
 * 判断是否所有的属性都有值
 * @param obj
 * @returns {boolean}
 */
function checkObjectValue(obj) {
    for(let p in obj){
        if(obj[p]!=undefined && obj[p]!=null){
            if($.trim(obj[p]) == ""){
                return true;
            }
        }
    }
    return false;
}

function getObjectById(id,goodlist){
    for(let i=0;i<goodlist.length;i++){
        let good = goodlist[i];
        if(good.id == id){
            return good;
        }
    }
    return null;
}






let BETTER_SCROLL;
function initBetterScroll(elid){
    BETTER_SCROLL  = BetterScroll.createBScroll(document.getElementById(elid), {directionY:1,tap:true,click:true});
}



let scrolls = {};

function setScroll(type, wapper) {
    if (scrolls[type]) {
        scrolls[type].refresh();
    } else {
        scrolls[type] = new IScroll(wapper, {
            snap: false,
            bounceTime: 300,
            fadeScrollbars: true,
            mouseWheel: true,
            click: true
        });
    }

    return scrolls[type];
}

function setHScroll(type, wapper) {
    if (scrolls[type]) {
        scrolls[type].refresh();
    } else {
        scrolls[type] = new IScroll(wapper, {scrollX: true, scrollY: false});
    }
    return scrolls[type];
}


function getFileType(str){
    let index=str.lastIndexOf('.');
    let strtype=str.substr(index,4);
    strtype=strtype.toLowerCase();
    return strtype;
}



/*
function ajaxFormUploadFile(cb){
    $("#uploadForm" ).ajaxForm({
        url : uploadUrl,
        type:"post",
        beforeSubmit: function(){
            return true;
        },
        success : function(r){
            $("#uploadForm" )[0].reset();
            cb && cb(r);
        },
        xhr: function() {
            let xhr = $.ajaxSettings.xhr();
            //绑定上传进度的回调函数
            xhr.upload.addEventListener('progress', function(e){
                let totalsize = e.totalSize;
                let currentsize = e.position;
                let percent = parseInt((currentsize/totalsize)*100);
                showLoader("正在上传图片 "+percent+"%...");
            }, false);
            return xhr;//一定要返回，不然jQ没有XHR对象用了
        },
        resetForm:false
    }).submit();
}
*/


function getNdate(ntime) {
    ntime = ntime || Date.now();
    var time = new Date(ntime);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var second = time.getSeconds();
    if (eval(month) < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (hour < 10) {
        hour = "0" + hour
    }

    if (min < 10) {
        min = "0" + min
    }

    if (second < 10) {
        second = "0" + second
    }

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":"
        + second;
}

function getNdateNian(ntime) {
    ntime = ntime || Date.now();
    var time = new Date(ntime);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var second = time.getSeconds();
    if (eval(month) < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (hour < 10) {
        hour = "0" + hour
    }

    if (min < 10) {
        min = "0" + min
    }

    if (second < 10) {
        second = "0" + second
    }

    return year + "-" + month + "-" + day;
}

let _showimgel = null;
let _showimgel2 = null;

function getFileInput(iel){
    _showimgel = getShowEl(iel);
    document.getElementById('selectimginput').click();
}
function showPicImg(files){
    showFileAttach(files,_showimgel);
    $(".fileitemctn").removeClass("xztpbk");
}
function getFileInput2(iel){
    _showimgel2 = getShowEl(iel);
    document.getElementById('selectimginput2').click();

}

function getShowEl(iel){
    let el;
    if (iel.nodeName=="DIV"){
        el = iel;
    }else{
        el = $(iel).prev();
    }
    return el;
}

function showPicImg2(files){
    showFileAttach(files,_showimgel2);
    $(".fileitemctn").removeClass("xztpbk");
}





function ajaxFormUploadFile(cb){
    ajaxFormUploadFileAction("uploadForm",cb);
}
function ajaxFormUploadFile2(cb){
    ajaxFormUploadFileAction("uploadForm2",cb);
}


function ajaxFormUploadFileAction(elid,cb){
    let formData = new FormData($("#"+elid)[0]);
    $.ajax({
        url: uploadUrl ,  /*这是处理文件上传的servlet*/
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (r) {
            cb && cb(r);
            $("#uploadForm2")[0].reset();
            $("#uploadForm")[0].reset();
            $(".fileitemctn").empty();
            $(".fileitemctn").addClass("xztpbk");
        },
        error: function (r) {
            cb && cb("");
        }
    });
}



function isMusic(str){
    let houzui = GetExtensionFileName(str);
    houzui = houzui.toLowerCase();
    if(houzui=="mp3" || houzui=="wma" || houzui=="acc" || houzui=="aac"){
        return true;
    }else{
        return false;
    }
}


function GetExtensionFileName(pathfilename)
{
    let reg = /(\\+)/g;
    let pfn = pathfilename.replace(reg, "#");
    let arrpfn = pfn.split("#");
    let fn = arrpfn[arrpfn.length - 1];
    let arrfn = fn.split(".");
    return arrfn[arrfn.length - 1];
}

function isImg(str){
    let houzui = GetExtensionFileName(str);
    houzui = houzui.toLowerCase();
    if(houzui=="jpg" || houzui=="jpeg" || houzui=="png" || houzui=="gif" || houzui=="bmp"){
        return true;
    }else{
        return false;
    }
}

function isVideo(str){
    let houzui = GetExtensionFileName(str);
    houzui = houzui.toLowerCase();
    if(houzui=="mp4" || houzui=="3gp" || houzui=="avi" || houzui=="mepg" || houzui=="ogg"){
        return true;
    }else{
        return false;
    }
}

function showFileAttach(files,showel){
    let file = files[0];
    let filename = file['name'];
    let fileURL = window.URL.createObjectURL(file);
    let imgel = getShowHtml(filename,fileURL);
    $(showel).html(imgel);
}

function showAttach(elid,filename){
    let fileURL = fileurl+filename;
    let imgel = getShowHtml(filename,fileURL);
    $("#"+elid).html(imgel);
}

function getShowHtml(filename,fileURL){
    let imgel="";
    if(filename){
        if(isImg(filename)){
            imgel = "<img style='width: 100%' src='"+fileURL+"' />";
        }else if(isVideo(filename)){
            imgel = "<video controls style='width: 100%' src='"+fileURL+"' ></video>";
        }else if(isMusic(filename)){
            imgel = "<audio controls style='width: 100%' src='"+fileURL+"' ></audio>";
        }else{
            imgel = "<a href='"+fileURL+"'>"+filename+"</a>";
        }
    }

    return imgel;
}



//异步上传结束

function createEditor(){
    if(editor==null){
        let E = window.wangEditor;
        editor = new E('#editor');
        // 或者 let editor = new E( document.getElementById('editor') )
        editor.config.uploadImgShowBase64 = false;   // 使用 base64 保存图片
        editor.config.uploadImgServer = _editorUpload;
        editor.config.uploadVideoServer = _editorUploadVideo;
        editor.config.uploadFileName = 'file';
        editor.config.uploadVideoName = 'file';
        editor.config.uploadVideoHooks = {
            // 上传视频之前
            before: function(xhr) {
                console.log(xhr)

                // 可阻止视频上传
                /*return {
                    prevent: true,
                    msg: '需要提示给用户的错误信息'
                }*/
            },
            // 视频上传并返回了结果，视频插入已成功
            success: function(xhr) {
                console.log('success', xhr)
            },
            // 视频上传并返回了结果，但视频插入时出错了
            fail: function(xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传视频出错，一般为 http 请求的错误
            error: function(xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传视频超时
            timeout: function(xhr) {
                console.log('timeout')
            },
            // 视频上传并返回了结果，想要自己把视频插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
            customInsert: function(insertVideoFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
                insertVideoFn(fileurl+result.data.url)
            }
        }

        editor.config.uploadImgHooks = {
            // 上传视频之前
            before: function(xhr) {
                console.log(xhr)

                // 可阻止视频上传
                /*return {
                    prevent: true,
                    msg: '需要提示给用户的错误信息'
                }*/
            },
            // 视频上传并返回了结果，视频插入已成功
            success: function(xhr) {
                console.log('success', xhr)
            },
            // 视频上传并返回了结果，但视频插入时出错了
            fail: function(xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传视频出错，一般为 http 请求的错误
            error: function(xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传视频超时
            timeout: function(xhr) {
                console.log('timeout')
            },
            // 视频上传并返回了结果，想要自己把视频插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
            customInsert: function(insertImgFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
                insertImgFn(fileurl+result.data[0])
            }
        }
        editor.create();
    }
}


function createEditor2(){
    if(editor2==null){
        let E = window.wangEditor;
        editor2 = new E('#editor2');
        // 或者 let editor2 = new E( document.getElementById('editor2') )
        editor2.config.uploadImgShowBase64 = false;   // 使用 base64 保存图片
        editor2.config.uploadImgServer = _editorUpload;
        editor2.config.uploadVideoServer = _editorUploadVideo;
        editor2.config.uploadFileName = 'file';
        editor2.config.uploadVideoName = 'file';
        editor2.config.uploadVideoHooks = {
            // 上传视频之前
            before: function(xhr) {
                console.log(xhr)

                // 可阻止视频上传
                /*return {
                    prevent: true,
                    msg: '需要提示给用户的错误信息'
                }*/
            },
            // 视频上传并返回了结果，视频插入已成功
            success: function(xhr) {
                console.log('success', xhr)
            },
            // 视频上传并返回了结果，但视频插入时出错了
            fail: function(xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传视频出错，一般为 http 请求的错误
            error: function(xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传视频超时
            timeout: function(xhr) {
                console.log('timeout')
            },
            // 视频上传并返回了结果，想要自己把视频插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
            customInsert: function(insertVideoFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
                insertVideoFn(fileurl+result.data.url)
            }
        }

        editor2.config.uploadImgHooks = {
            // 上传视频之前
            before: function(xhr) {
                console.log(xhr)

                // 可阻止视频上传
                /*return {
                    prevent: true,
                    msg: '需要提示给用户的错误信息'
                }*/
            },
            // 视频上传并返回了结果，视频插入已成功
            success: function(xhr) {
                console.log('success', xhr)
            },
            // 视频上传并返回了结果，但视频插入时出错了
            fail: function(xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传视频出错，一般为 http 请求的错误
            error: function(xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传视频超时
            timeout: function(xhr) {
                console.log('timeout')
            },
            // 视频上传并返回了结果，想要自己把视频插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
            customInsert: function(insertImgFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
                insertImgFn(fileurl+result.data[0])
            }
        }
        editor2.create();
    }
}


let _mySwiper = null;
function  initSwiper(){
    if(_mySwiper){
        return;
    }
    setTimeout(function (){
        ajaxCallback("listJ",{table:"notice"},function(data){
            let html = "";
            let len = 5;
            if(data.length<5){
                len = data.length-1;
            }
            for(let i=0;i<=len;i++){
                let obj = data[i];
                html+='<div onclick="toNotice('+obj.id+');" style="height: 200px; background-image: url('+fileurl+obj.img+');background-size: 100% 100%;"  class="swiper-slide"></div>';
            }

            $("#swiperctn").html(html);
            _mySwiper = new Swiper ('.swiper-container', {
                direction: 'horizontal',
                loop: true,

                // 如果需要分页器
                pagination: '.swiper-pagination',
                autoplay: 3000

                // 如果需要前进后退按钮
                //nextButton: '.swiper-button-next',
                //prevButton: '.swiper-button-prev',

                // 如果需要滚动条
                //scrollbar: '.swiper-scrollbar'
            });

        });
    },500);

}








$.fn.extend({
    refreshTypeList:function(records,cb,idName="id",attrName="title"){
        let html = "";
        if(records && records.length){
            for(let i=0;i<records.length;i++){
                let title = records[i][attrName];
                let id = records[i][idName];
                html+=`<li>
                        <h2 data-id="${id}" class="titlenavfocus">${title}</h2>
                    </li>`
            }
            $(this).html(html);
        }else{
            $(this).html("");
        }

    $(this).on("click",function(e){
            let t = e.target;
            let typeid = $(t).data("id");
            let title = $(t).text();
            cb && cb(typeid,title)
        });
    }
});


$.fn.extend({
    refreshViewList:function(records,cb,moban=1,colums,btntxt,cb2,cb3,cb4,cb5,cb6){
        let html = "";
        let tpl = moban.tpl;
        colums = colums||moban.colums;
        $(this).removeClass(moban.className).addClass(moban.className);
        if(records && records.length){
            for(let i=0;i<records.length;i++){
                let li = rrplace(tpl,colums,records[i]);
                html+=li;
            }
            $(this).html(html);
            if (btntxt){
                $(this).find(".listbtn").text(btntxt);
            }

        }else{
            $(this).html("");
        }

        $(this).find("li").on("click",function(e){
            let t = e.currentTarget;
            let id = $(t).data("id");
            let at = e.target;
            if($(at).prop("tagName")=="A"){
                if($(at).hasClass("listbtn")){
                    cb2 && cb2(id,at);
                }else if($(at).hasClass("listbtn1")){
                    cb3 && cb3(id,at);
                }else if($(at).hasClass("listbtn2")){
                    cb4 && cb4(id,at);
                }else if($(at).hasClass("listbtn3")){
                    cb5 && cb5(id,at);
                }else if($(at).hasClass("listbtn4")){
                    cb6 && cb6(id,at);
                }
            }else{
                cb && cb(id,at);
            }
        });
    }
});


let listTpl = {
    generalList3: {
        tpl: `<li data-id="%s">
                <h2>%s %s</h2>
                <p>%s</p>
            </li>`, className: "listview", colums: ["id", "title", "note", "ndate"]
    },
    txt3list1: {
        tpl: `<li data-id="%s">
                <h2>%s</h2>
                <p>%s</p>
                <p>%s</p>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "txt3list1", colums: ["id", "title", "note", "ndate"]
    },
    mtxt3: {
        tpl: `<li data-id="%s" class="noimg1">
                <h2>%s</h2>
                <p>%s</p>
                <span>%s</span>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "listview1", colums: ["id", "title", "note", "ndate"]
    },
    mtxt2: {
        tpl: `<li data-id="%s" class="noimg1">
                <h2>%s</h2>
                <p>%s</p>
                <span></span>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "listview1", colums: ["id", "title", "note"]
    },
    mtxt1: {
        tpl: `<li data-id="%s" class="noimg1">
                <h2>%s</h2>
                <p></p>
                <span></span>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "listview1", colums: ["id", "title"]
    },
    mimgtxt3: {
        tpl: `<li data-id="%s">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2>
                <p>%s</p>
                <span>%s</span>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "listview1", colums: ["id", "img", "title", "note", "ndate"]
    },
    mimgtxt3good: {
        tpl: `<li data-id="%s">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2>
                <p>%s</p>
                <span style="color: #D6400B;">价格:%s元</span>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "listview1", colums: ["id", "img", "gname", "note", "price"]
    },
    mimgtxt2: {
        tpl: `<li data-id="%s">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2>
                <p>%s</p>
                <span></span>
                <div class="optctn">
                    <a href="#" class="listbtn"></a>
                </div>
            </li>`, className: "listview1", colums: ["id", "img", "title", "note", "ndate"]
    },
    imgtxt3: {
        tpl: `<li data-id="%s">
                <img class="list2item1" src="${fileurl}/%s" alt="">
                <div class="list2item2">
                    <h2>%s</h2>
                    <p>%s</p>
                </div>
                <div class="list2item3">
                    <p>%s</p>
                    <a class="list2opt listbtn" href="#"></a>
                </div>
            </li>`, className: "listview2", colums: ["id", "img", "title", "note"]
    },
    imgtxt3user: {
        tpl: `<li data-id="%s">
                <img class="list2item1" src="${fileurl}/%s" alt="">
                <div class="list2item2">
                    <h2>%s %s %s</h2>
                    <p>%s</p>
                </div>
                <div class="list2item3">
                    <p>%s</p>
                    <a class="list2opt listbtn" href="#"></a>
                </div>
            </li>`, className: "listview2", colums: ["id", "img", "title", "note"]
    },
    imgtxt2: {
        tpl: `<li data-id="%s">
                <img class="list2item1" src="${fileurl}/%s" alt="">
                <div class="list2item2">
                    <h2>%s</h2>
                    <p>%s</p>
                </div>
                <div class="list2item3">
                    <p></p>
                    <a class="list2opt listbtn" href="#"></a>
                </div>
            </li>`, className: "listview2", colums: ["id", "img", "title"]
    },
    imgtxt2select: {
        tpl: `<li data-id="%s">
                <img class="list2item1" src="${fileurl}/%s" alt="">
                <div class="list2item2">
                    <h2>%s</h2>
                    <p>%s</p>
                </div>
                <div class="list2item3">
                    <p></p>
                    <input name="imgtxt2select" %s value="%s" type="checkbox" class="list2opt listbtn listcheck" />
                </div>
            </li>`, className: "listview2", colums: ["id", "img", "title","note","flag","id"]
    },
    imgtxt1: {
        tpl: `<li data-id="%s">
                <img class="list2item1" src="${fileurl}/%s" alt="">
                <div class="list2item2">
                    <h2>%s</h2>
                    <p></p>
                </div>
                <div class="list2item3">
                    <p></p>
                    <a class="list2opt listbtn" href="#"></a>
                </div>
            </li>`, className: "listview2", colums: ["id", "img", "title"]
    },
    imggridtxt3: {
        tpl: `<li data-id="%s" class="griditem1">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2><a href="#">%s</a>
                <p>%s</p>
            </li>`, className: "gridlist1", colums: ["id", "img", "title", "note", "ndate"]
    },
    imggridtxt2: {
        tpl: `<li data-id="%s" class="griditem1">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2><a href="#"></a>
                <p>%s</p>
            </li>`, className: "gridlist1", colums: ["id", "img", "title", "note"]
    },
    imggridtxt1: {
        tpl: `<li data-id="%s" class="griditem1">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2><a href="#"></a>
                <p></p>
            </li>`, className: "gridlist1", colums: ["id", "img", "title"]
    },
    bimgtxt3: {
        tpl: `<li data-id="%s" class="bigimglistitem">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2>
                <p>%s</p>
                <a href="#">%s</a>
            </li>`, className: "bigimglist", colums: ["id", "img", "title", "note", "ndate"]
    },
    bimgtxt2: {
        tpl: `<li data-id="%s" class="bigimglistitem">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2>
                <p>%s</p>
                <a href="#"></a>
            </li>`, className: "bigimglist", colums: ["id", "img", "title", "note"]
    },
    bimgtxt1: {
        tpl: `<li data-id="%s" class="bigimglistitem">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2>
                <p></p>
                <a href="#"></a>
            </li>`, className: "bigimglist", colums: ["id", "img", "title"]
    },
    pbimgtxt3: {
        tpl: `<li data-id="%s" class="pubuitem1">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2><a href="#">%s</a>
                <p>%s</p>
            </li>`, className: "gridpubulist1", colums: ["id", "img", "title", "note", "ndate"]
    },
    pbimgtxt2: {
        tpl: `<li data-id="%s" class="pubuitem1">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2><a href="#"></a>
                <p>%s</p>
            </li>`, className: "gridpubulist1", colums: ["id", "img", "title", "note"]
    },
    pbimgtxt1: {
        tpl: `<li data-id="%s" class="pubuitem1">
                <img src="${fileurl}/%s" alt="">
                <h2>%s</h2><a href="#"></a>
                <p></p>
            </li>`, className: "gridpubulist1", colums: ["id", "img", "title"]
    },
    replaylist1: {
        tpl: `<li data-id="%s">
                <span>%s</span><span>%s</span>
                <p>%s</p>
            </li>`, className: "txt3list2", colums: ["id", "username", "ndate", "note"]
    },
    txt2list2: {
        tpl: `<li data-id="%s">
                <span>%s</span><span>%s</span>
            </li>`, className: "txt3list2", colums: ["id", "username", "ndate"]
    },
    txt1list2: {
        tpl: `<li data-id="%s">
                <span>%s</span>
            </li>`, className: "txt3list2", colums: ["id", "ndate"]
    },
    blogoptlist: {
        tpl: `
                <li data-id="%s">
                    <div class="bl1userctn">
                        <img src="${fileurl}/%s" alt="">
                        <div class="bl1datectn">
                            <p>%s</p>
                            <p>%s</p>
                        </div>
                        <!--<a class="bl1gzbtn listbtn" href="#"></a>-->
                    </div>
                    <h2 class="bl1title">%s</h2>
                    <img class="bl1img" src="${fileurl}/%s" alt="">
                    <div class="bl1optctn">
                        <a class="bgiconleftbtn zanicon1 listbtn1" href="#">%s</a>
                        <a class="bgiconleftbtn caiicon1 listbtn2" href="#">%s</a>
                        <a class="bgiconleftbtn pinglunicon1 listbtn3" href="#">%s</a>
                        <a class="bgiconleftbtn fenxiangicon1 listbtn4" href="#">%s</a>
                    </div>
                </li>`,
        className: "bloglistview1",
        colums: ["id", "uimg", "username", "ndate", "title", "img", "zan", "cai", "pinglun", "fenxiang"]
    },
    shoplist1: {
        tpl: `<li data-id="%s" data-typeid="%s">
                            <img src="${fileurl}/%s" alt="">
                            <h2>%s</h2>
                            <p>%s</p>
                            <span>%s元</span>
                            <div class="list1opctn">
                                <div class="jiajianctn">
                                    <a href="#"></a><span data-id="%s" class="goodcount">%s</span><a href="#"></a>
                                </div>
                            </div>
                        </li>`,
        className: "list1op",
        colums: ["id","typeid", "img","gname","note","price","id","carcount"]
    },
    shopcarlist1: {
        tpl: `<li data-id="%s">
                            <img src="${fileurl}/%s" alt="">
                            <h2>%s</h2>
                            <p>%s</p>
                            <span>%s元</span>
                            <div class="list1opctn">
                                <div class="jiajianctn">
                                    <a href="#"></a><span data-id="%s" class="goodcount">%s</span><a href="#"></a>
                                </div>
                            </div>
                        </li>`,
        className: "list1op",
        colums: ["id", "img","gname","note","price","id","carcount"]
    },
    shoptypelist1: {
        tpl: `<li data-id="%s">%s</li>`,
        className: "typelist1",
        colums: ["id", "title"]
    },
    titlenavlist: {
        tpl: `<li data-id="%s"><h2>%s</h2></li>`,
        className: "titlenav",
        colums: ["id", "title"]
    },
    billList1: {
        tpl: `<li style="padding: 10px;" data-id="%s">
                <h2>%s</h2>
                <p>总价:%s元</p>
                <p style="color: red;">状态:%s</p>
                <div class="optctn">
                    <a href="#" class="listbtn" style="font-size: 14px;">%s</a>
                </div>
            </li>`, className: "txt3list1", colums: ["id", "gnames", "total", "statecn","ndate"]
    }
}

function showModel(htmlstr) {
    let modelmask = $("#modelmaskglobal")[0];
    if(modelmask){

    }else{
        $('body').append(`<div class="modelmask" id="modelmaskglobal">
        <div class="modeldialog">
            <div class="modelcontainer" id="modelcontainer">
            
            </div>
        </div>
    </div>`);
    }
    $("#modelcontainer").html(htmlstr);
    $("#modelmaskglobal").show();

}

function hideModel(){
    $("#modelmaskglobal").hide();
}

function html2txt(str){
    let nstr = str.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
    return nstr;
}

function htmlNote2txt(arry){
    for (const arryElement of arry) {
        arryElement['note'] = html2txt(arryElement['note']);
    }
    return arry;
}

function toTest(){
    //window.location.href="timutest.html?uid="+userinfo.id;
    toframe("timutest.html?uid="+userinfo.id);
}

function toframe(url){
    changePage("webcontent");
    $("#webiframe").attr("src",url);
}



