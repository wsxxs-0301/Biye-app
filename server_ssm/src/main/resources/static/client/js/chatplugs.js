


/********************************8聊天相关全局变量*************/
let chattimmer = null;
let iftobutton = true;

let isRecordStart = false;
let counttimmer = null;
let ___count = 0;
let __path = null;
let _chattype = 1;//1朋友聊天,2分组天
let _mingancis = null;
let focususer = null;
let focusqun = null;
let _msgtype = 1;
let __fromlocation = false;

let _lastmsgcount = -1;

/********************************8聊天相关全局变量结束*************/


function chatIfameInit(){
    let uid = getSearchParam("uid");
    let fid = getSearchParam("fid");
    let chattype = getSearchParam("chattype");
    let action = getSearchParam("action");
    if(uid){
        if(chattype){
            _chattype = chattype
        }
        ajaxCallback("findJ",{table:"user",id:uid},function (data) {
            if(data){
                userinfo = data;
                if(action == "chat"){
                    if(fid && _chattype == 1){
                        ajaxCallback("findJ",{table:"user",id:fid},function (data2) {
                            if(data2){
                                focususer = data2;
                                doInChat();
                                $("#chatpageheader").hide();
                                $("#pagetitle").text("聊天中");
                            }
                        });
                    }else{
                        ajaxCallback("findJ",{table:"qunzu",id:fid},function (data2) {
                            if(data2){
                                focusqun = data2;
                                doInChat();
                                $("#chatpageheader").hide();
                                $("#pagetitle").text("聊天中");
                            }
                        });
                    }
                }

            }
        });
    }

}



$(function(){

    $("#chatattachbtn").click(function (e){
        //let el = e.currentTarget;
        let flag = $("#chatselectfilectn").is(":hidden");
        if(flag){
            $("#chatselectfilectn").show(300);
        }else{
            $("#chatselectfilectn").hide(300);
        }
    });

    $("#recordbtn").unbind("click").bind("click",function(){
        if(isRecordStart){
            isRecordStart = false;
            hideLoader();
            $("#recordbtn").text("点击录音");
            __path = myObj && myObj.getRecordFile();
            setTimeout(function(){
                sendMsg();
                __path = null;
            },2000);
            clearInterval(counttimmer);
            ___count = 0;
            myObj && myObj.stopSound();
        }else{
            isRecordStart = true;
            $("#recordbtn").text("录音中");
            //showLoader("录音中 "+count+"s",true);
            counttimmer = setInterval(function(){
                //showLoader("录音中 "+count+"s",true);
                $("#recordbtn").text("录音中"+___count+"s");
                ___count++;
            },1000);
            myObj && myObj.recordSound();
        }

    });

    /*$("#filebutton").unbind("click").bind("click",function(){
        sendFile();
    });*/
    chatIfameInit();


    /*****************关注聊天相关***************************/
});





function toLastMessage(){
    changePage("lastmessagepage");
    listLastMessage();
}

function listLastMessage(){
    ajaxCallback("listJ",{table:"huihua",uid:userinfo.id},function(data){
        $("#mymessagelist").refreshViewList(data,function (fid){
            toChat(fid,1);
        },listTpl.imgtxt3,['fid','img','fusername','note','ndate']);
    });
}
























/**************************************聊天相关******************************/

function backclear(){
    clearInterval(chattimmer);
    goback();
}

let refreshgap = 1000;
/*function toQunChat(id){
 let qz = getObjectById(id,focuslist);
 focusobj = qz;
 changePage("chatpage");
 chattimmer = setInterval(function (){
 refreshServerQunChatList();
 },refreshgap);
 }*/

function toChat(id,type){
    _chattype = type;
    if(type==2){
        ajaxCallback("findJ",{id:id,table:"qunzu"},function(data){
            focusqun = data;
            doInChat();
        });
    }else{
        ajaxCallback("findJ",{id:id,table:"user"},function(data){
            focususer = data;
            doInChat();
        });
    }


}

function doInChat(){
    _lastmsgcount = -1;
    changePage("chatpage");
    setTimeout(()=>{
        refreshServerChatList();
    },500);

    chattimmer = setInterval(function (){
        refreshServerChatList();
    },refreshgap);
}

function refreshChatMSg(){
    ajaxCallback("listMyMessage",{uid:userinfo.id,fid:focususer.id},function(data){
        $("#msglist").refreshShowListView(data);
    },true);
}


function sendMsg(){


    let obj = {};
    obj.uid = userinfo.id;
    obj.fid = focususer && focususer.id;
    if(_chattype==2){
        obj.qid = focusqun.id;
        obj.qtitle = focusqun.title;
        obj.fusername = focusqun.title;
        obj.fimg = focusqun.img;
    }else{
        obj.fusername = focususer.username;
        obj.fimg = focususer.img;
    }
    obj.img = userinfo.img;
    obj.note = $("#msgaarea").val();
    obj.username = userinfo.username;


    obj.type = 1;
    obj.msgtype = _chattype;

    obj.table="message";
    let fileInput = $('#selectimginput').get(0).files[0];
    if(fileInput){
        obj.type = 3;
        ajaxFormUploadFile(function (r){
            obj.attach = r;
            ajaxCallback("saveJ",obj,function(data){
                iftobutton = true;
                $("#selectimginput").val('');
                $("#chatattach").empty();
                refreshServerChatList();
            });
        });
    }else if(__path){
        obj.type = 4;
        obj.attach = __path;
        ajaxCallback("saveJ",obj,function(data){
            iftobutton = true;
            $("#selectimginput").val('');
            $("#chatattach").empty();
            refreshServerChatList();
        });
    }else if(__fromlocation){
        obj.attach = "";
        obj.type = 5;
        ajaxCallback("saveJ",obj,function(data){
            iftobutton = true;
            __fromlocation = false;
            refreshServerChatList();
        });
    }else{
        /*if(checkMgc(obj.note)){
         showLoader("消息不合法",true);
         return;
         }*/
        obj.attach = "";
        ajaxCallback("saveJ",obj,function(data){
            iftobutton = true;
            refreshServerChatList();
        });
    }
    $("#msgaarea").val("");
    $("#chatselectfilectn").hide(300);
    updateHuihua(obj);
}


function updateHuihua(msgobj){
    let note = msgobj.note;
    if(msgobj.type==5){
        note = "[位置]";
    }else if(msgobj.type==4){
        note = "[语音]";
    }else if(msgobj.type==3){
        note = "[图片文件]";
    }

    ajaxCallback("findJ",{table:"huihua",uid:msgobj.uid,fid:msgobj.fid},function (data) {
        if(data){
            data.note = note;
            data.ndate = null;
        }else{
            data = {};
            data.uid = msgobj.uid;
            data.fid = msgobj.fid;
            data.fusername = msgobj.fusername;
            data.img = msgobj.fimg;
            data.username = msgobj.username;
            data.note = note;
        }
        data.table = "huihua";
        ajaxCallback("saveJ",data,function (r2) {
            ajaxCallback("findJ",{table:"huihua",uid:msgobj.fid,fid:msgobj.uid},function (data2) {
                if(data2){
                    data2.note = note;
                    data2.ndate = null;
                }else{
                    data2 = {};
                    data2.uid = msgobj.fid;
                    data2.fid = msgobj.uid;
                    data2.fusername = msgobj.username;
                    data2.img = msgobj.img;
                    data2.username = msgobj.fusername;
                    data2.note = note;
                }
                data2.table = "huihua";
                ajaxCallback("saveJ",data2,function (r4) {

                });
            });
        });
    });
}

function checkMgc(str){
    for(let i=0;i<_mingancis.length;i++){
        let mgc = _mingancis[i]['title'];
        if(str.indexOf(mgc)!=-1){
            return true;
        }
    }
    return false;
}

function refreshServerChatList(){
    /*let queryobj = {uid:userinfo.id,fid:focususer.id};
    let ajaxurl = "listMyMessage";
    if(_chattype==2){
        queryobj = {uid:userinfo.id,qid:focususer.id};
        ajaxurl = "listQunMessage";
    }*/
    let uid = userinfo.id;
    let fid = focususer && focususer.id;
    if(_chattype==2){
        ajaxCallback("listJ",{table:"message",qid:focusqun.id,sort:"id",order:"asc"},function(data){
            data = data||[];
            if(data.length != _lastmsgcount){
                refreshChatList(data);
                _lastmsgcount = data.length
            }

        },true);
    }else{
        ajaxCallback("listSqlJ",{sql:"select * from tbl_message u where u.msgtype=1 and (u.uid="+uid+" or u.fid="+uid+") and (u.uid="+fid+" or u.fid="+fid+")"},function(data){
            data = data||[];
            if(data.length != _lastmsgcount){
                refreshChatList(data);
                _lastmsgcount = data.length
            }
        },true);
    }

}

function onVideoPlay(){
    clearInterval(chattimmer);
}

function delMessage(id){
    showConfirm("删除此消息!",function (flag){
        if(flag){
            ajaxCallback("deleteJ",{table:"message",id:id},function (data) {
                refreshServerChatList();
            });
        }
    })
}

let _oldlength = null;
function refreshChatList(data){
    if(data.length!=_oldlength){
        iftobutton = true;
        _oldlength = data.length;
    }
    let html = "";
    if(data && data.length){
        for(let i=0;i<data.length;i++){
            let msg = data[i];
            let cn = "citemfrom";
            let chatbg = "chatbgfrom"
            if(msg.uid != userinfo.id){
                cn = "citemto";
                chatbg = "chatbgto"
            }
            let li = "";
            if(msg.type==1){
                li = `<li onclick="delMessage(${msg.id})">
                        <div class="chattime">
                        ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}"><div class="chatcontent ${chatbg} chattxtcontent">${msg.note}</div>
                        </div>
                      </li>`;
            }else if(msg.type==5){
                li = `<li onclick="toLocation(${msg.id})">
                        <div class="chattime">
                        ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}"><div class="chatcontent ${chatbg} chattxtcontent">${msg.note}</div>
                        </div>
                      </li>`;
            }else if(msg.type==4){
                li = `<li onclick="playerAudio(${msg.id})">
                        <div class="chattime">
                        ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}"><div class="chatcontent ${chatbg} chattxtcontent">播放语音</div>
                        </div>
                      </li>`;
            }else{
                let filename = msg.attach;
                let chatFileURL = fileurl+filename;
                if(filename){
                    if(isImg(filename)){
                        li = `<li >
                        <div class="chattime">
                            ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}">
                            <img class="chatcontent" src="${chatFileURL}" alt="">
                        </div>
                    </li>`;
                    }else if(isVideo(filename)){
                        li = `<li>
                        <div class="chattime">
                            ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}">
                            <video class="chatcontent" controls="controls" src="${chatFileURL}"></video>
                        </div>
                        </li>`;
                    }else if(isMusic(filename)){
                        li = `<li>
                        <div class="chattime">
                            ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}">
                            <div onclick="playerAudio(${msg.id})" class="chatcontent ${chatbg} chattxtcontent">播放语音</div>
                        </div>
                        </li>`;
                    }else{
                        li = `<li>
                        <div class="chattime">
                            ${msg.ndate}
                        </div>
                        <div class="${cn}">
                            <img class="chattouxiang" src="${fileurl+msg.img}">
                       
                            <div onclick="doloadMsgAttach(${msg.id})" class="chatcontent ${chatbg} chattxtcontent">${msg.attach}</div>
                        </div>
                        </li>`;
                    }
                }

            }/*else if(msg.type==2){
                li = '<li class="'+cn+'" onclick="myObj.playAudio(\''+msg.attach+'\');"><div><img src="'+fileurl+msg.img+'"><p>点击播放语音</p></div></li>';
            }else if(msg.type==3){
                if(getFileType(msg.attach)==".png" || getFileType(msg.attach)==".jpg"||getFileType(msg.attach)==".gif"||getFileType(msg.attach)==".jpeg"){
                    li = '<li class="'+cn+'" onclick="localFile(\''+msg.attach+'\');"><div><img src="'+fileurl+msg.img+'"><p class="imgctn" style="background-image: url('+fileurl+msg.attach+')"></p></div></li>';
                }else{
                    li = '<li class="'+cn+'" onclick="localFile(\''+msg.attach+'\');"><div><img src="'+fileurl+msg.img+'"><p>'+msg.attachname+'</p></div></li>';
                }

            }*/

            html+=li;
        }
        $("#chatlist").html(html);
        //setScroll("chatscroll",document.getElementById("chatdiv"));

        setTimeout(function (){
            let hei = $("#chatlist").height();
            let vh = $("#chatdiv").height();

            if(hei > vh){
                let scrollY = (0-(hei-vh));
                if(BETTER_SCROLL){
                    BETTER_SCROLL.refresh();
                    scrollChatBottom(scrollY);
                }else{
                    initBetterScroll("chatdiv");
                    scrollChatBottom(scrollY);
                }
            }



        },200);

    }else{
        $("#chatlist").html(html);
    }

    if(iftobutton){
        iftobutton = false;
    }
}


function scrollChatBottom(my){
    if(my){
        BETTER_SCROLL.scrollTo(0,my,300);
    }else{
        BETTER_SCROLL.scrollTo(0,BETTER_SCROLL.maxScrollY,300);
    }

    console.log("scrollTo:"+BETTER_SCROLL.maxScrollY);
}
/**************************************聊天相关结束******************************/
/*****************************************************************关注管理********************************************/
function toMyFriend(){
    changePage('friendpage');
    listMyFriend();
}
function listMyFriend(){
    let fids = userinfo.fids || null;
    ajaxCallback("listSqlJ",{sql:`select * from tbl_user where id in (${fids})`},function(data){
        focuslist = data;
        $("#myfriendlist").refreshViewList(data,function (id){
            toUserInfo(id);
        },listTpl.imgtxt3,['id','img','username','sex','tel'],"聊天",function(uid){
            toChat(uid,1);
        });
    });
}

function toUserInfo(id){
    if(id){
        ajaxCallback("findJ",{id:id,table:"user"},function(obj){
            if(obj){
                focususer = obj;
                showUserInfo();
            }
        });
    }else{
        showUserInfo();
    }
}

function showUserInfo(){
    changePage('userdetailpage');
    checkIsMyFriend();
    $("#vusername2").text("用户名:"+focususer.username);
    $("#vuserimg2").attr("src",fileurl+focususer.img);
    $("#vbirth2").text("生日:"+focususer.birth);
    $("#vsex2").text("性别:"+focususer.sex);
    //$("#vqq2").text("标签:"+focususer.note);
    $("#vemail2").attr("href","tel:"+focusobj.tel).text("电话:"+focususer.tel);
}


function toSearchFriend(){
    changePage("addfriendpage");
    listSearchUser();
}

function listSearchUser(){
    ajaxCallback("listJ",{table:"user",roletype:2},function(data){
        focuslist = data;
        $("#searchuserlist").refreshViewList(data,function (id){
            toUserInfo(id);
        },listTpl.imgtxt3user,['id','img','username',"xuexiao","zhuanye",'sex','tel'],"聊天",function(uid){
            toChat(uid,1);
        });
    });
}

function checkIsMyFriend(cb){
    let fids = userinfo.fids;
    if(fids){
        let fidsarray = fids.split(",");
        let flag = false;
        for(let i=0;i<fidsarray.length;i++){
            let fid = fidsarray[i];
            if(fid==focususer.id){
                flag = true;
                break;
            }
        }
        if(flag){
            $("#canadd").hide();
            $("#candelf").show();
        }else{
            if(focususer.id!=userinfo.id){
                $("#canadd").show();
                $("#candelf").hide();
            }else{
                $("#canadd").hide();
                $("#candelf").hide();
            }
        }
    }else{
        if(focususer.id!=userinfo.id){
            $("#canadd").show();
            $("#candelf").hide();
        }else{
            $("#canadd").hide();
            $("#candelf").hide();
        }
    }

}

function toAddFriend(){
    changePage("preaddfriendpage");
    $("#anote").val("");
}

function sendYzMessage(){
    let note = $("#anote").val();
    ajaxCallback("saveJ",{table:"yzmessage",note:note,fuser:userinfo.username,fid:userinfo.id,status:"待同意",tid:focususer.id,img:userinfo.img},function (data) {
        showTipTimer("请求已发送,等待对方同意!",function (){
            toMyFriend();
        })
    });
}

function addFriendEach(fid,tid,cb){
    fid = fid || focususer.id;
    tid = tid || userinfo.id;
    ajaxCallback("findJ",{table:"user",id:tid},function(data){
        userinfo = data;
        //toMyFriend();
        ajaxCallback("findJ",{table:"user",id:fid},function(data2){
            focususer = data2;

            if(userinfo.fids){
                userinfo.fids+=","+fid;
            }else{
                userinfo.fids = fid;
            }

            if(focususer.fids){
                focususer.fids+=","+tid;
            }else{
                focususer.fids = tid;
            }

            let myuserobj = {};
            myuserobj.fids = userinfo.fids;
            myuserobj.table = "user";
            myuserobj.id = tid;

            let heuserobj = {};
            heuserobj.fids = focususer.fids;
            heuserobj.table = "user";
            heuserobj.id = fid;

            ajaxCallback("saveJ",myuserobj,function (r1) {
                    ajaxCallback("saveJ",heuserobj,function (r2) {
                        //addFs(fid);
                        showLoader("操作成功!",true);
                        if(cb){
                            cb();
                        }else{
                            toMyFriend();
                        }
                    })
            })
        });
    });
    //改为同意的时候后台自动加上
    /*ajaxCallback("sendAddMessage",{fid:userinfo.id,tid:focususer.id,status:"待同意",fuser:userinfo.username,img:userinfo.img},function(data){
        showLoader("请求已发送,等待关注验证!",true);
    });*/
}


function delFriend(){
    ajaxCallback("findJ",{table:"user",id:userinfo.id},function(data){
        userinfo = data;
        //toMyFriend();
        let fid = focususer.id;
        let fids = userinfo.fids;
        let list2 = [];
        if(fids){
            let list = fids.split(",");
            for(let i=0;i<list.length;i++){
                if(list[i]==fid){
                    continue;
                }
                list2.push(list[i]);
            }
        }
        userinfo.fids = list2.toString();
        if(!userinfo.fids){
            userinfo.fids="0";
        }
        userinfo.table="user";
        ajaxCallback("saveJ",userinfo,function (data) {
                showTipTimer("删除成功!",function (){
                    toMyFriend();
                })
        })
    });
}


function toMyYanzhengMessage(){
    changePage('yzmessagelistpage');
    ajaxCallback("listJ",{tid:userinfo.id,table:"yzmessage"},function(data){
        focuslist = data;
        $("#yzmessagelist").refreshViewList(data,function (id){
            toYzMessage(id);
        },listTpl.imgtxt3,['id','img','fuser','note','status'],"聊天",function(uid){
            toChat(uid,1);
        });
    });
}

function toYzMessage(id){
    let msg = getObjectById(id,focuslist);
    if(msg){
        focusobj = msg;
        changePage('yzmsgdetailpage');
        $("#vusername4").text(msg.fuser);
        $("#vstatus").text("状态:"+msg.status);
        showAttach("nimg",msg.img);
        $("#nnote").html(msg.note);
        if(msg.status=="待同意"){
            $("#opctn").show();
        }else{
            $("#opctn").hide();
        }
    }
}

function agree(){
    ajaxCallback("saveJ",{id:focusobj.id,status:"已同意",table:"yzmessage"},function(data){
        addFriendEach(focusobj.fid,userinfo.id,function (){
            toMyFriend();
        });

    });
}

function refuse(){
    ajaxCallback("saveJ",{id:focusobj.id,status:"已拒绝",table:"yzmessage"},function(data){
        goback();
    });

}

/**
 * 去聊天界面自动加关注
 */
function toChatPage(){
    let sid = focusobj.sid;
    ajaxCallback("getUserBySid",{sid:sid},function(data){
        focususer = data;
        checkIsMyFriend(function (info){
            if(info=="0"){
                addFriend();
            }
        });
        toChat(focususer.id,1);
    });
}

/*****************************************************************关注管理结束********************************************/

function toMyQunzu(){
    changePage("myqunzupage");
    listMyQunzu();
}

function listMyQunzu(){
    ajaxCallback("findJ",{table:"user",id:userinfo.id},function (data) {
        userinfo = data;
        let qids = userinfo.qids || null;
        ajaxCallback("listSqlJ",{sql:`select * from tbl_qunzu where id in (${qids})`},function(data){
            focuslist = data;
            $("#myqunzulist").refreshViewList(data,function (id){
                toQunInfo(id);
            },listTpl.imgtxt3,['id','img','title','note','username'],"",function(uid){
                toChat(uid,2);
            });
        });
    });

}

function saveQunzu(){
    var fdata = serializeObject($("#qunzuform"));
    fdata.username = userinfo.username;
    fdata.uid = userinfo.id;
    ajaxCallback("saveQunzu",fdata,function(data){
        ajaxCallback("addQunzu",{uid:userinfo.id,qid:data.id},function(data){
            toQunzu();
        });

    });
}

function toSearchQunzu(){
    changePage("addQunzupage");
    listQun();
}


function refreshQun(el){
    var type = $(el).val();
    listQun(type);
}

function listQun(type){
    type = type || "";
    ajaxCallback("listQunzu",{type:type},function(data){
        focuslist = data;
        $("#qunlist").refreshShowListView(data);
    });
}

function addQunzu(){
    ajaxCallback("addQunzu",{uid:userinfo.id,qid:focusobj.id},function(data){
        userinfo = data;
        showTipTimer("操作成功!",function (){
            toQunzu();
        })
    });

}

function toSelectUsers(id){
    changePage("selectuserpage");
    if(id){
        ajaxCallback("findJ",{table:"qunzu",id:id},function (data) {
            focusqun = data;
            let uids = focusqun.uids||"";
            let fids = userinfo.fids || null;
            $("#qltitle").val(focusqun.title);
            $("#qunid").val(focusqun.id);
            ajaxCallback("listSqlJ",{sql:`select * from tbl_user where id in (${fids})`},function(ulist){
                focuslist = ulist;
                let fulist = uids.split(",");
                for (let i = 0; i < fulist.length; i++) {
                    let flag = "";
                    let uid = fulist[i];
                    for (let j = 0; j < ulist.length; j++) {
                        let user = ulist[j];
                        if(uid==user.id){
                            flag = "checked";
                            ulist[j].flag = flag;
                            break;
                        }
                    }
                }
                listMyFriendSelect(ulist);
            });
        });
    }else{
        $("#qltitle").val("");
        $("#qunid").val("");
        listMyFriendSelect();
    }
}

function listMyFriendSelect(list){
    let fids = userinfo.fids || null;
    if(list){
        focuslist = list;
        $("#selectuserlist").refreshViewList(list,function (id){
            //toUserInfo(id);
        },listTpl.imgtxt2select,['id','img','username','tel',"flag",'id']);
    }else{
        ajaxCallback("listSqlJ",{sql:`select * from tbl_user where id in (${fids})`},function(data){
            focuslist = data;
            $("#selectuserlist").refreshViewList(data,function (id){
                //toUserInfo(id);
            },listTpl.imgtxt2select,['id','img','username','tel',"flag",'id']);
        });
    }

}

function createQunliao(){
    let title = $("#qltitle").val();
    let fdata = {};
    if(title){
        let qimg = "qunliao.png";
        fdata.title = title;
        fdata.img = qimg;
        fdata.uid = userinfo.id;
        fdata.username = userinfo.username;
        fdata.table="qunzu";
        fdata.note = $("#tdnote").val();
        let qunid = $("#qunid").val();
        if(qunid){
            fdata.id = qunid;
            ajaxCallback("saveJ",fdata,function () {
                preAddUser2Qun(qunid);
            });
        }else{
            ajaxCallback("saveJ",fdata,function (data) {
                preAddUser2Qun(data.info);
            });
        }

    }else{
        showLoader("请输入分组名称!",true);
    }


}

function preAddUser2Qun(qid){
    let uids = [];
    $('input[name="imgtxt2select"]:checked').each(function(){
        uids.push($(this).val());
    });
    addUser2Qun(uids,qid);
}

async  function addUser2Qun(uids,qid){
    if(uids.length){
        uids.push(userinfo.id);
        for (let i = 0; i < uids.length; i++) {
            let uid = uids[i];
            await doAddUser2Qun(uid,qid);
        }
        ajaxCallback("saveJ",{id:qid,table:"qunzu",uids:uids.toString()},function (data) {
            toMyQunzu();
        });

    }
}

function doAddUser2Qun(uid,qid){
    new Promise(function (resolve,reject){
        ajaxCallback("findJ",{id:uid,table:"user"},function (data) {
            let qids = data.qids;
            if(qids){
                qids+=","+qid;
            }else{
                qids = qid;
            }
            ajaxCallback("saveJ",{table:"user",id:uid,qids:qids},function (data) {
                resolve("ok");
            });

        });
    })
}

function delQunzus(){
    ajaxCallback("deleteJ",{id:focusqun.id,table:"qunzu"},function (data) {
            toMyQunzu();
    });
    /*ajaxCallback("findJ",{table:"user",id:userinfo.id},function(data){
        userinfo = data;
        let fid = focusqun.id;
        let fids = userinfo.qids;
        let list2 = [];
        if(fids){
            let list = fids.split(",");
            for(let i=0;i<list.length;i++){
                if(list[i]==fid){
                    continue;
                }
                list2.push(list[i]);
            }
        }
        userinfo.qids = list2.toString();
        if(!userinfo.qids){
            userinfo.qids="0";
        }
        userinfo.table="user";
        ajaxCallback("saveJ",userinfo,function (data) {
            showTipTimer("已退出分组!",function (){
                removeQunUser(userinfo.id)
                toMyQunzu();
            })
        })

    });*/
}

function removeQunUser(uid){
    let uids = focusqun.uids;
    let nuids = "";
    if(uids){
        let ulist = uids.split(",");
        for (let i = 0; i < ulist.length; i++) {
            let quid = ulist[i];
            if(quid==uid){
                continue;
            }
            if(nuids){
                nuids+=","+quid;
            }else{
                nuids = quid;
            }
        }
        ajaxCallback("saveJ",{table:"qunzu",uids:nuids,id:focusqun.id},function (data) {
            focusqun.uids = nuids;
        });
    }
}

function toAddQunzu(){
    changePage('qunzumgpage');
}

function toQunInfo(id){
    ajaxCallback("findJ",{id:id,table:"qunzu"},function (obj) {
        if(obj){
            focusqun = obj;
            changePage('qundetailpage');
            checkIsMyQunzu();
            $("#quntitle").text("名称:"+focusqun.title);
            //$("#qundesc").text("说明:"+focusqun.note);
            ajaxCallback("listSqlJ",{sql:`select * from tbl_user where id in (${focusqun.uids})`},function(data){
                focuslist = data;
                $("#qunuserlist").refreshViewList(data,function (id){
                    toUserInfo(id);
                },listTpl.imgtxt3,['id','img','username','sex','tel'],"聊天",function(uid){
                    toChat(uid,1);
                });
            });

        }
    });


}

function checkIsMyQunzu(cb){

    let fids = userinfo.qids;
    if(fids){
        let fidsarray = fids.split(",");
        let flag = false;
        for(let i=0;i<fidsarray.length;i++){
            let fid = fidsarray[i];
            if(fid==focusqun.id){
                flag = true;
                break;
            }
        }
        if(flag){
            $("#canadd2").hide();
            $("#candelf2").show();
        }else{
            $("#canadd2").show();
            $("#candelf2").hide();
        }
    }else{
        if(focususer.id!=userinfo.id){
            $("#canadd").show();
            $("#candelf").hide();
        }else{
            $("#canadd").hide();
            $("#candelf").hide();
        }
    }
}


function sendQunMsg(){
    var note = $("#chatnote").val();
    var msg = {};
    msg.note = note;
    msg.qid = focusobj.id;
    msg.uid = userinfo.id;
    msg.username = userinfo.username;
    ajaxCallback("addQunMessage",msg,function(data){
        ajaxCallback("listQunMessage",{uid:userinfo.id,qid:focusobj.id},function(data){
            $("#chatnote").val("");
            $("#qunmsglist").refreshShowListView(data);
        });
    });
}

/*function sendMsg(){
    var note = $("#chatcontent").val();
    var msg = {};
    msg.note = note;
    msg.fid = focusobj.id;
    msg.uid = userinfo.id;
    msg.username = userinfo.username;
    ajaxCallback("addMessage",msg,function(data){
        ajaxCallback("listMyMessage",{uid:userinfo.id,fid:focusobj.id},function(data){
            $("#chatcontent").val("");
            $("#msglist").refreshShowListView(data);
        });
    });
}*/

function toQunChat(id){
    var qz = getObjectById(id,focuslist);
    focusobj = qz;
    changePage("chatpage");
    chattimmer = setInterval(function (){
        //refreshServerQunChatList();
    },1000);
}



function doloadMsgAttach(id){
    ajaxCallback("findJ",{table:"message",id:id},function (data) {
        console.log(data.attach);
        if(cordovaFlag){
            myObj.openSite(fileurl+data.attach);
        }else{
            window.location.href=fileurl+data.attach;
        }
    });
}



function playerAudio(id){
    ajaxCallback("findJ",{table:"message",id:id},function (data) {
        /*let audio = document.createElement("audio");
        audio.src = data.attach;
        audio.play();*/
        myObj && myObj.playAudio(data.attach);
    });
}


function toLocation(id){
    ajaxCallback("findJ",{table:"message",id:id},function (data) {
        toAddress(data.note);
    });
}