$(function(){
    $("div[data-role='header']").addClass("pageheader");
    $("div[data-role='main']").addClass("pagecontainer");
    $("div[data-role='footer'] ul").addClass("pagefooter");
    $("div[data-role='footer']").find("li").addClass("footeritem");
    $("ul[data-role='listview']").addClass("listview");
    $("a[data-icon='home']").addClass("icon-shouye");
    $("a[data-icon='cloud']").addClass("icon-faxian");
    $("a[data-icon='tag']").addClass("icon-biaoqian");
    $("a[data-icon='user']").addClass("icon-wode");
    $("a[data-icon='comment']").addClass("icon-xiaoxi");
    $("a[data-icon='info']").addClass("icon-huodong");
    let uls = $("div[data-role='navbar']").find("ul");
    for (let ul in uls) {
        if(!$(uls[ul]).hasClass("pagefooter")){
            $(uls[ul]).addClass("titlenav");
        }
    }
});

let mobiletool={
    confirmDialog:false,
    confirmBack:null
};

function changePage(id, animation) {
    animation = animation || randAnimation(id);
    $.mobile.changePage($("#" + id), {transition: animation});
}

function confirmCallback(flag){
    mobiletool.confirmBack && mobiletool.confirmBack(flag);
    hideLoader();
}

function randAnimation(id){
    let animation=['pop','fade','pop','fade','fade','fade','fade','flow','slide','slide'];
    let r = parseInt(10*Math.random());
    return "fade";//animation[r];
    /*if(id=="touzi" || id=="jiekuan"  || id=="home"  || id=="wode" ){
        return "none";
    }else{
        return "fade";
    }*/

}


//显示加载器
function showLoader(str, textonly, textVisible, theme, html) {
    textonly = textonly || false;
    textVisible = textVisible || true;
    theme = theme || "b";
    html = html || "";
    //显示加载器.for jQuery Mobile 1.2.0
    $.mobile.loading('show', {
        text: str, //加载器中显示的文字
        textVisible: textVisible, //是否显示文字
        theme: theme,        //加载器主题样式a-e
        textonly: textonly,   //是否只显示文字
        html: html           //要显示的html内容，如图片等
    });
    if (textonly) {
        setTimeout(function () {
            hideLoader();
        }, 2000);
    }
}

function showTipTimer(str,callback){
    var textonly = true;
    var textVisible = true;
    var theme = "b";
    var html = html || "";
    //显示加载器.for jQuery Mobile 1.2.0
    $.mobile.loading('show', {
        text: str, //加载器中显示的文字
        textVisible: textVisible, //是否显示文字
        theme: theme,        //加载器主题样式a-e
        textonly: textonly,   //是否只显示文字
        html: html           //要显示的html内容，如图片等
    });
    setTimeout(function () {
        hideLoader();
        callback && callback();
    }, 1000);
}

function showConfirm(str,cb) {
    mobiletool.confirmBack = cb;
    var html = "<div><h1>"+str+"</h1><a href='#' onclick='confirmCallback(1);' class='ui-btn ui-btn-a'>确定</a><a href='#' onclick='confirmCallback(0);' class='ui-btn ui-btn-a'>取消</a></div>";
    //显示加载器.for jQuery Mobile 1.2.0
    $.mobile.loading('show', {
        text: str, //加载器中显示的文字
        textVisible: true, //是否显示文字
        theme: "b",        //加载器主题样式a-e
        textonly: true,   //是否只显示文字
        html: html           //要显示的html内容，如图片等
    });
    mobiletool.confirmDialog = true;
}

function showAlert(str,cb) {
    mobiletool.confirmBack = cb;
    var html = "<div><h1>"+str+"</h1><a href='#' onclick='confirmCallback(1);' class='ui-btn ui-btn-a'>确定</a></div>";
    //显示加载器.for jQuery Mobile 1.2.0
    $.mobile.loading('show', {
        text: str, //加载器中显示的文字
        textVisible: true, //是否显示文字
        theme: "b",        //加载器主题样式a-e
        textonly: true,   //是否只显示文字
        html: html           //要显示的html内容，如图片等

    });
    mobiletool.confirmDialog = true;
}

//隐藏加载器.for jQuery Mobile 1.2.0
function hideLoader() {
    //隐藏加载器
    $.mobile.loading('hide');
    mobiletool.confirmDialog = false;
}

function goback(){
   /* let activePageId = $.mobile.activePage.attr('id');
    if(activePageId=="blankpage"){
        toMain();
    }else{*/
        $.mobile.back();
    //}


}



function rrplace(tpl,colums,records,index){
    index = index || 0;
    let int = tpl.indexOf("%s");
    if(int!=-1){
        let p = colums[index];
        let str = records[p];
        if(p=="note"){
            str = html2txt(str);
        }
        if(p=="carcount"){
            str = (str || 0);
        }
        if(str){
            tpl = tpl.replace("%s",str);
        }else{
            if(str===0){
                tpl = tpl.replace("%s",str);
            }else{
                tpl = tpl.replace("%s","");
            }
        }

        index++;
        return rrplace(tpl,colums,records,index);
    }else{
        return tpl;
    }
}

$.fn.extend({
    refreshShowListView:function(records){
        let attr = $(this).data("property");
        if(attr && records && records.length){
            attr = JSON.parse(attr);
            let html = "";
            let tpl = attr.tpl;
            let colums = attr.colums;
            for(let i=0;i<records.length;i++){
                let li = rrplace(tpl,colums,records[i]);
                html+=li;
            }
            $(this).html(html);
            $(this).listview('refresh');
        }else{
            $(this).html("");
            $(this).listview('refresh');
        }
    }
});

$.fn.extend({
    refreshShowSelectMenu:function(records,placeholder,id,text){
        let html = "";
        id = id || "id";
        text = text || "title";
        let i = 0;
        if(placeholder){
            html = '<option value="" selected="selected">'+placeholder+'</option>';
        }else{
            if(records && records.length){
                let boj = records[0];
                html = '<option value="'+boj[id]+'" selected="selected">'+boj[text]+'</option>';
                i = 1;
            }
        }

        if(records && records.length){


            let tpl = '<option value="%s">%s</option>';
            let colums = [id,text];

            for(;i<records.length;i++){
                let op = rrplace(tpl,colums,records[i]);
                html+=op;
            }
        }
        $(this).html(html);
    }
});

$.fn.extend({
    refreshInsertView:function(records){
        let attr = $(this).data("property");
        if(attr && records && records.length){
            attr = JSON.parse(attr);
            let html = "";
            let tpl = attr.tpl;
            let colums = attr.colums;
            for(let i=0;i<records.length;i++){
                let li = rrplace(tpl,colums,records[i]);
                html+=li;
            }
            $(this).html(html);
        }else{
            $(this).html("");
        }
    }
});
