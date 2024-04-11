let focusobj = {};
let focuslist = [];

$(function (){

});
function toMain(){
    changePage("mainpage");
    initSwiper();
    /*ajaxCallback("listJ",{table:"type"},function(r){
        $("#maintype").refreshTypeList(r,function(typeid,title){
            listBlog(typeid);
        });
    });*/
    listBlog();
}


function toNotice(type){
    $("#ntitle2").text("特色团队");
    if(type==1){
        $("#ntitle2").text("特色团队");
    }
    changePage("noticepage");
    listNotice(type);
}
function listNotice(type){
    ajaxCallback("listJ",{table:"notice",typeid:type},function (data) {
        $("#noticelist").refreshViewList(data,function (id){
            noticeDetail(id);
        },listTpl.generalList3);
    });
}
function noticeDetail(id){
    ajaxCallback("findJ",{id:id,table:"notice"},function (data) {
        changePage("noticedetailpage");
        $("#ntitle").text(data.title);
        $("#nndate").text(data.ndate);
        showAttach("nimg",data.img);
        /*let html = data.note;
        if(html.indexOf("http://")==-1){
            html = html.replace(/upload/g,fileurl);
        }
        $("#nnote").html(html);*/
        setHtmlNote(data.note,"nnote");
    });
}

function listBlog(typeid){
    typeid = typeid || null;
    let mfids = userinfo.fids;
    if(mfids){
        mfids+=","+userinfo.id;
    }else{
        mfids = userinfo.id;
    }
    let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_blog b left join tbl_user u on u.id=b.uid where b.uid in (${mfids})`;
    if(typeid){
        sql+=` and b.typeid=${typeid}`;
    }
    ajaxCallback("listSqlJ",{sql:sql},function(r2){
    //ajaxCallback("listJ",{table:"blog",typeid:typeid},function(r2){
        focuslist = r2.sort(function (o1,o2){
            return o2.id*1-o1.id*1;
        });
        /*$("#bloglist").refreshViewList(r2,function(id){
            blogDetail(id);
        },listTpl.imgtxt3,["id","img","title","typecn","ndate"]);*/

        $("#bloglist").refreshViewList(r2,function(id){
            blogDetail(id);
        },listTpl.blogoptlist,null,"关注",function(id,el){
            let obj = getObjectById(id,focuslist);
            toUserInfo(obj.uid);
        },function (id,el){
            listBtnHandler(id,el,"zan");
        },function (id,el){
            listBtnHandler(id,el,"cai");
        },function (id,el){
            blogDetail(id);
        },function (id,el){
            listBtnHandler(id,el,"fenxiang");
        });
        /*let lis="";
        for (let i = 0; i < r2.length; i++) {
            let obj = r2[i];
            let {title,typecn,img,ndate} = obj;
            let html=`<li>
                        <img class="list2item1" src="${fileurl+img}" alt="">
                        <div class="list2item2">
                            <h2>${title}</h2>
                            <p>${typecn}</p>
                        </div>
                        <div class="list2item3">
                            <p>${ndate}</p>
                        </div>
                    </li>`
            lis+=html;
        }

        $("#bloglist").html(lis);*/
    })
}

function listBtnHandler(id,el,btn){
    ajaxCallback("findJ",{id:id,table:"blog"},function (data) {
        let zan = data.zan||0;
        let cai = data.cai||0;
        let fenxiang = data.fenxiang||0;
        if(btn=="zan"){
            data.zan = zan*1+1
            $(el).text(data.zan);
        }else if(btn=="cai"){
            data.cai = cai*1+1;
            $(el).text(data.cai);
        }else if(btn=="fenxiang"){
            data.fenxiang = fenxiang*1+1;
            $(el).text(data.fenxiang);
        }
        ajaxCallback("saveJ",{table:"blog",id:id,zan:data.zan,cai:data.cai,fenxiang:data.fenxiang},function (data) {

        });
    });
}


function toBlog2(){
    /*changePage("blogpage2");
    ajaxCallback("listJ",{table:"blog",btype:2},function(data){
        data = htmlNote2txt(data);
        $("#bloglist2").refreshViewList(data,function(id){
            blogDetail(id);
        },listTpl.mimgtxt3,["id","img","title","note","ndate"]);
    })*/
    toMain();
}


function blogDetail(id){
    $("#myctn").hide();
    ajaxCallback("findJ",{table:"blog",id:id},function (data) {
        focusobj = data;
        $("#zanshow").text((data.zan||0));
        changePage('blogdetailpage');
        $("#btitle").text("标题:"+data.title);
        //$("#bnote").text(data.note);
        let html = data.note;
        if(html.indexOf("http://")==-1){
            html = data.note.replace(/upload/g,fileurl);
        }
        $("#bnote").html(html);
        $("#buser").text("作者:"+data.username);
        $("#bndate").text("更新时间:"+data.ndate);
        showAttach("bimgctn",data.img);
        showAttach("bvideoctn",data.video);
        checkFavs();
        listReplay();
        if(userinfo.id==focusobj.uid){
            $("#myctn").show();
        }
    });
}

function delBlog(){
    ajaxCallback("deleteJ",{table:"blog",id:focusobj.id},function (data) {
        showTipTimer("操作成功!",function (){
            toMain();
        })

    });
}

function toMgBlog(){
    changePage('blogmgpage');
    ajaxCallback("listJ",{table:"type"},function (data) {
        $("#typeid").refreshShowSelectMenu(data,"选择分类","id","title");
        $("#blogform")[0].reset();
        showAttach("pt2",null);
        showAttach("pt3",null);
    });
    setTimeout(function (){
        createEditor();
        editor.txt.html("");
    },400);
}

function saveBlog(){
    let fdata = serializeObject($("#blogform"));
    fdata.uid = userinfo.id;
    fdata.username = userinfo.username;
    fdata.uimg = userinfo.img;
    //fdata.typecn = $("#typeid").find("option:selected").text();
    fdata.note = editor.txt.html();
    fdata.btype = 2;

    ajaxFormUploadFile(function(img){
        if(img){
            fdata.img = img;
        }
        /*ajaxFormUploadFile2(function (v){
            fdata.video = v;*/
            fdata.table="blog";
            ajaxCallback("saveJ",fdata,function(){
                showTipTimer("发布成功!",function (){
                    toMain();
                });
            });
        //})

    });
}

function toMyBlog(uid){
    uid = uid ||null;
    changePage("myblogpage");
    ajaxCallback("listJ",{table:"blog",btype:2,uid:uid},function (list) {
        list = htmlNote2txt(list);
        $("#mybloglist").refreshViewList(list,function(id){
            blogDetail(id);
        },listTpl.mimgtxt3,["id","img","title","note","ndate"]);

    })
}


function zan(){
    let money = focusobj.zan;
    if(money){
        money+=1;
    }else{
        money = 1;
    }
    focusobj.zan = money;
    ajaxCallback("saveJ",{id:focusobj.id,table:"blog",zan:money},function(data){
        $("#zanshow").text(money);
        ajaxCallback("saveJ",{table:"zan",pid:focusobj.id,uid:userinfo.id,username:userinfo.username},function (data) {

        });
    });
}
function listReplay(){
    ajaxCallback("listJ",{table:"replay",pid:focusobj.id},function(data){
        $("#replaylist").refreshViewList(data,null,listTpl.replaylist1);
    })
}

function addReplay(){
    let note = $("#rnote").val();
    if (note){
        ajaxCallback("saveJ",{table:"replay",username:userinfo.username,note:note,pid:focusobj.id,type:1,uid:userinfo.id},function(){
            $("#brnote").val("");
            showLoader("操作成功!",true);
            listReplay();

        });
    }
}






let focuspost = null;
let postslist = [];
function replayUser(username){
    $("#rnote").val("回复 "+username+":");
    $("#rnote2").val("回复 "+username+":");
}


function listPosts(id){
    ajaxCallback("listJ",{uid:id,table:"posts"},function(data){
        $("#posts").refreshViewList(data,function(id){
            postDetail(id);
        },listTpl.txt3list1,["id","title","username","ndate"]);
        postslist = data;
    });
}
function toAddForm(){
    changePage("addformpage");
}
function addForm(){
    let fdata = serializeObject($("#postsform"));
    fdata.uid = userinfo.id;
    fdata.username = userinfo.username;
    ajaxFormUploadFile(function(r){
        fdata.img = r;
        fdata.table="posts";
        ajaxCallback("saveJ",fdata,function(){
            toLuntan();
        });
    });

}
function postDetail(id){
    let obj = getObjectById(id,postslist);
    focuspost = obj;
    focusobj = obj;
    changePage("postdetail");
    $("#vptitle").text("标题:"+obj.title);
    $("#vpnote").text("内容:"+obj.note);
    $("#vpusername").text("发布者:"+obj.username);
    $("#vpdate").text("时间:"+obj.ndate);
    //$("#pimg").attr("src",fileurl+obj.img);
    showAttach("pimg",obj.img);
    if(obj.uid == userinfo.id){
        $("#mypost").show();
    }else{
        $("#mypost").hide();
    }
    listReplay2();
}

function listReplay2(){
    ajaxCallback("listJ",{pid:focusobj.id,table:"replay",type:2,order:"desc",sort:"hot"},function(data){
        $("#replays2").refreshViewList(data,null,listTpl.replaylist1);
    });
}


function addReplay2(){
    if(!userinfo){
        toLogin();
        return;
    }
    let note = $("#rnote2").val();
    let hot = "0";
    if(userinfo.roletype=="3"){
        hot=1;
    }
    ajaxCallback("saveJ",{pid:focusobj.id,uid:userinfo.id,username:userinfo.username,note:note,table:"replay",type:2,hot:hot},function(data){
        listReplay2();
        $("#rnote2").val("");
    });

}


function toLuntan(id){
    changePage("luntanpage");
    listPosts(id);
}
function delPosts(){
    ajaxCallback("deleteJ",{id:focuspost.id,table:"posts"},function(data){
        toLuntan();
    });
}



function toMyReplay(){
    changePage("myreplaypage");
    ajaxCallback("listJ",{table:"replay",uid:userinfo.id,type:1},function (listdata) {
        focuslist = listdata;
        $("#myreplaylist").refreshViewList(listdata,function(id){
            blogDetail(id);
        },listTpl.replaylist1,["pid","username","ndate","note"]);
    })
}
function toMyZan(){
    changePage("myzanpage");
    ajaxCallback("listJ",{table:"zan",uid:userinfo.id},function (zanlist) {
        let bids = "";
        for(let i=0;i<zanlist.length;i++){
            if(bids==""){
                bids = zanlist[i].pid;
            }else{
                bids+=","+zanlist[i].pid;
            }
        }
        let sql = `select * from tbl_blog where id in ('${bids}')`;
        ajaxCallback("listSqlJ",{sql:sql},function (listdata) {
            $("#zanbloglist").refreshViewList(listdata,function(id){
                blogDetail(id);
            },listTpl.replaylist1,["pid","username","ndate","title"]);
        });

    })
}
