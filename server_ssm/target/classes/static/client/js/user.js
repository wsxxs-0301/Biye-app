
/***************************************用户模块*******************************************/
$(function(){
    let uinfo = localStorage['userinfo'];
    if(uinfo && $.trim(uinfo)!=""){
        uinfo  = JSON.parse(uinfo);
        $("#lusername").val(uinfo.tel);
        $("#lpasswd").val(uinfo.passwd);
        uinfo.remember = "1";
        login();
    }
});
let userinfo = null;
function login(){
    let tfdata = serializeObject($("#loginform"));
    if($.trim(tfdata.username)=="" || $.trim(tfdata.passwd) == ""){
        showLoader("请输入用户名或密码！",true);
        return;
    }
    let fdata = {};
    fdata.table="user";
    fdata.tel = tfdata.username;
    fdata.passwd = tfdata.passwd;
    ajaxCallback("findJ",fdata,function(data){
       if(!data){
           let fdata2 = {};
           fdata2.table = "user";
           fdata2.username = tfdata.username;
           fdata2.passwd = tfdata.passwd;
           ajaxCallback("findJ",fdata2,function(data2){
               if(!data2){
                    loginFail();
               }else{
                   loginSuccess(data2);
               }
           });
       }else{
            loginSuccess(data);
       }
    });
}

function loginFail(){
    showLoader("用户名或密码错误",true);
    changePage("loginpage");
}

function loginSuccess(data){
    showLoader("登录成功!",true);
    userinfo = data;
    toLastMessage();
    //toMain();
    //if(fdata.remember == "1"){
    localStorage["userinfo"] = JSON.stringify(data);
    /*}else{
        localStorage["userinfo"] = "";
    }*/
}

function toSettingPage(){
    changePage('settingpage')
}

function logout(){
    userinfo = null;
    localStorage['userinfo'] = "";
    toLogin();
}

function toRegister(){
    changePage("registerpage");
}

function toLogin(){
    $($(':input','#loginform').get(1)).val("");
    changePage("loginpage");
}

function register(){

    let fdata = serializeObject($("#registerform"));
    if($.trim(fdata.username) == "" || $.trim(fdata.passwd) == "" || $.trim(fdata.tel) == ""){
        showLoader("请填写完整信息!",true);
        return;
    }
    if(fdata.tel.length<11){
        showLoader("电话号码格式不对!",true);
        return;
    }
    if(fdata.passwd != fdata.passwd2){
        showLoader("两次密码不一致!",true);
        return;
    }
    ajaxFormUploadFile(function (r){
        fdata.img = r;
        commitRegiesterInfo(fdata);
    });
}

function commitRegiesterInfo(fdata){
    fdata.table="user";
    fdata.roletype="2";
    ajaxCallback("findJ",{table:"user",tel:fdata.username},function(d){
        if(!d){
            ajaxCallback("saveJ",fdata,function(r){
                if(r.info){
                    showLoader("注册成功!",true);
                    userinfo = fdata;
                    userinfo.id = r.info;
                    //addAddress();
                    toLogin();
                }else{
                    showLoader("注册失败请稍候再试!",true);
                }
            });
        }else{
            showLoader("用户名已存在!",true);
        }
    });
}

function myinfo(){
    if(!userinfo){
        changePage("loginpage");
        return;
    }
    changePage("userinfopage");
    $("#vusername").text(userinfo.username);
    fillFormData($("#userform"),userinfo);
}

function editUserInfo(){
    $("#editbutton").show();
}

function updateUserInfo(){
    let fdata = serializeObject($("#userform"));
    fdata.id = userinfo.id;
    /*if(uploadFileUrl){
        uplaodImg(function(r){
            fdata.img = r;
            commitUpdateUserInfo(fdata);
        });
    }else{*/
        commitUpdateUserInfo(fdata);
    //}
}

function commitUpdateUserInfo(fdata){
    fdata.table = "user";
    ajaxCallback("saveJ",fdata,function(user){
        if(user){
            showLoader("保存成功!",true);
            userinfo = fdata;
        }else{
            showLoader("保存失败,请稍候再试!",true);
        }
    });
}

function toChangePasswd(){
    $("#pusername").text("用户名:"+userinfo.username);
    changePage("passwdpage");
}

function changePasswd(){
    let fdata = serializeObject($("#passwdform"));
    fdata.id = userinfo.id;
    if(fdata.oldpasswd != userinfo.passwd){
        showLoader("原始密码错误！",true);
        return;
    }
    if($.trim(fdata.passwd) == ""){
        showLoader("密码不能为空！",true);
        return;
    }
    if(fdata.passwd != fdata.passwd2){
        showLoader("两次密码不一致！",true);
        return;
    }
    userinfo.passwd = fdata.passwd;
    userinfo.table="user";
    ajaxCallback("saveJ",userinfo,function(r){
        if(r){
            showLoader("保存成功!",true);
            setTimeout(function(){
                toLogin();
            },2000);
        }else{
            showLoader("保存失败,请稍候再试!",true);
        }
    });
}

function toMore(){
    changePage('morepage');
    $("#myname").text(userinfo.username);
    if(userinfo.img){
        $("#myphoto2").attr("src",fileurl+userinfo.img);
    }

    //$("#mylevel").text(":"+userinfo.qd);
}

/***************************************用户模块*******************************************/


function clickTag(el){
    if($(el).hasClass("tagfocus")){
        $(el).removeClass("tagfocus");
    }else{
        $(el).addClass("tagfocus");
    }
}
function sureBiaoqian(){
    var ysels = $("#yingshictn .tagfocus");
    var zxels = $("#zixunctn .tagfocus");
    var ysid = "";
    var zxid = "";
    /*for(var i=0;i<ysels.length;i++){
        if(ysid!=""){
            ysid += ","+$(ysels[i]).data("value");
        }else{
            ysid = $(ysels[i]).data("value");
        }
    }*/
    for(var i=0;i<zxels.length;i++){
        if(zxid!=""){
            zxid += ","+$(zxels[i]).data("value");
        }else{
            zxid = $(zxels[i]).data("value");
        }
    }

    ajaxCallback("saveJ",{tags:zxid,id:userinfo.id,table:"user"},function(data){
        userinfo.tags = zxid;
        showLoader("操作成功!",true);
    });
}

function toTags(){
    changePage('tagpage');
    ajaxCallback("listJ",{table:"type"},function(data){
        var zxhtml = '<span>设置标签:</span>';
        var yshtml = '<span>影视标签:</span>';
        var tags = userinfo.tags||"";
        var tagarray = tags.split(",");
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            //if(obj.ttype==1){
            var flag = false;
            for(var j=0;j<tagarray.length;j++){
                var tid = tagarray[j];
                if(tid==obj.id){
                    flag = true;
                    break;
                }
            }
            if(flag){
                zxhtml+='<span onclick="clickTag(this);" data-value="'+obj.id+'" class="tagitem tagfocus">'+obj.title+'</span>';
            }else{
                zxhtml+='<span onclick="clickTag(this);" data-value="'+obj.id+'" class="tagitem">'+obj.title+'</span>';
            }

            /*}else{
                yshtml+='<span onclick="clickTag(this);" data-value="'+obj.id+'" class="tagitem">'+obj.title+'</span>';
            }*/
        }

        //$("#yingshictn").html(yshtml);
        $("#zixunctn").html(zxhtml);
    });
}













/****************************************************在线收藏***********************************/
function toFavs(){
    changePage("favspage");
    ajaxCallback("listJ",{table:"type"},function (data) {
        //$("#ftypeid").refreshShowSelectMenu(data);
        listMyFav();
    });

}


function listMyFav(){
    let typeid = $("#ftypeid").val();
    let kllshow = 0;

    let sql = "select * from tbl_blog where id in ("+userinfo.favs+")";
    if(typeid){
        sql+=" and typeid="+typeid;
    }
    ajaxCallback("listSqlJ",{sql:sql},function (data) {
        $("#favslist").refreshViewList(data,function(id){
            blogDetail(id);
        },listTpl.imgtxt3,["id","img","title","typecn","ndate"]);
    })
}




function toggleFavs(){
    if(checkFavs()){
        deleteFavs();
    }else{
        saveFavs();
    }
}

function checkFavs(){
    let favs = userinfo.favs;
    let flag = false;
    $("#favbtn").text("加入收藏");
    if(favs){
        favs+="";
        let favarray = favs.split(",");
        for(let i=0;i<favarray.length;i++){
            if(favarray[i]==focusobj.id){
                $("#favbtn").text("移除收藏");
                flag = true;
                break;
            }
        }
    }


    return flag;

}


function saveFavs(){
    let favs = userinfo.favs;
    if(favs){
        favs+="";
        let favarray = favs.split(",");
        let flag = true;
        for(let i=0;i<favarray.length;i++){
            if(favarray[i]==focusobj.id){
                flag = false;
                break;
            }
        }
        if(flag){
            favs+=","+focusobj.id;
        }
    }else{
        favs = focusobj.id;
    }

    ajaxCallback("saveJ",{table:"user",favs:favs,id:userinfo.id},function (data) {
        showLoader("操作成功!",true);
        userinfo.favs = favs;
        checkFavs();
        addFavCount();
    })

}

function addFavCount(){
    let favcount = focusobj.favcount||0;
    favcount+=1;
    ajaxCallback("saveJ",{table:"blog",id:focusobj.id,favcount:favcount},function (data) {

    });
}

function deleteFavs(gid){
    let id = gid || focusobj.id;
    let favs = userinfo.favs;
    let tfavs = "";
    if(favs){
        favs+="";
        let favarray = favs.split(",");
        for(let i=0;i<favarray.length;i++){
            if(favarray[i]==id){
                continue;
            }else{
                if(tfavs==""){
                    tfavs = favarray[i];
                }else{
                    tfavs+=","+favarray[i];
                }
            }
        }

    }

    ajaxCallback("saveJ",{table:"user",favs:tfavs,id:userinfo.id},function (data) {
        showLoader("操作成功!",true);
        userinfo.favs = tfavs;
        if(gid){
            toFavs();
        }else{
            checkFavs();
        }

    })

}







/****************************************************在线收藏***********************************/


function toDaka(){
    changePage('dakapage');
    ajaxCallback("listJ",{uid:userinfo.id,table:"daka"},function(data){
        $("#dakalist").refreshViewList(data,null,listTpl.txt1list2,["id","ndate"]);
    });
}

function daka(){
    let ndate = getNdateNian();
    ajaxCallback("listJ",{uid:userinfo.id,ndate:ndate,table:"daka"},function(data){
        if(data&&data.length){
            showLoader("已经打过了!",true);
        }else{
            ajaxCallback("saveJ",{uid:userinfo.id,ndate:ndate,table:"daka"},function(data2){
                toDaka();
            });
        }
    });
}


function addFs(uid){
    ajaxCallback("findJ",{table:"user",id:uid},function (fuser) {
        let fs = fuser.fs;
        if(fs){
            fs+=1;
        }else{
            fs = 1;
        }
        ajaxCallback("saveJ",{table:"user",id:uid,fs:fs},function (data) {

        });
    });

}


function toTouxiang(){
    changePage('touxiangpage');
    showAttach("pt1",userinfo.img);
}
function saveTouxiang(){
    ajaxFormUploadFile(function (r){
        if(r){
            userinfo.img = r;
            ajaxCallback("saveJ",{id:userinfo.id,img:r,table:"user"},function (data) {
                showLoader("操作成功!",true);
                toMore();
            });
        }

    })
}





function charge(){
    let money = $("#money").val();
    let umoney = userinfo.money || 0;
    if(umoney){
        umoney+=money*1;
    }else{
        umoney = money*1;
    }
    userinfo.money = umoney;
    ajaxCallback("saveJ",{id:userinfo.id,table:"user",money:umoney},function(data){
        showLoader("操作成功!",true);
        toMyMoney();
    });
}

function disCharge(total,cb){
    let umoney = userinfo.money || 0;
    if(umoney*1<total*1){
        showLoader("余额不足!",true);
        return false;
    }else{
        userinfo.money = umoney*1-total*1;
        ajaxCallback("saveJ",{id:userinfo.id,table:"user",money:userinfo.money},function(data){
            cb && cb();
        });
    }

}

function toMyMoney(){
    changePage('moneypage');
    $("#lingqian").text((userinfo.money||0)+"元");
}





function toForget(){
    changePage("forgetpage");
}

function saveForget(){
    var fdata = serializeObject($("#forgetform"));
    fdata.table = "user";
    ajaxCallback("findJ",{table:"user",username:fdata.username,tel:fdata.tel},function (data) {
        if(data){
            ajaxCallback("saveJ",{table:"user",id:data.id,passwd:fdata.passwd},function (data) {
                toLogin();
            });
        }else{
            showLoader("用户不存着!",true);
        }
    });
}