$(function(){
    /**********************************给list加搜索过滤 */
    let fullist = $("[data-filter]");

    for (let i=0;i<fullist.length;i++) {
       let ul = fullist[i];
       let placeholder = ($(ul).data("filter"))||"请输入关键字...";
       let htmltpl = `<div class="searchctn2" style="margin-bottom: 10px;">
                        <input type="search" placeholder="${placeholder}" class="searchinput2">
                    </div>`;
       $(ul).before(htmltpl);
    }
    let fd = FangDou();
    $(".searchinput2").on("keyup",function(){
        let pdiv = ($(this).parent('.searchctn2'))[0];
        let ulel = $(pdiv).next("ul")[0];
        let lis = $(ulel).find("li");
        if(lis && lis.length){
            fd(()=>{
                console.log("回调");
                let keystr = $.trim($(this).val());
                if(keystr){
                    //lis不是数组,遍历只能获取length属性获取长度然后操作
                      for (let i=0;i<lis.length;i++) {
                         let li = lis[i];
                         let h2 = $(li).find("h2");
                         let title = $(h2).text();
                          let p = $(li).find("p");
                          let titlep = $(p).text();
                          let span = $(li).find("span");
                          let titlespan = $(span).text();
                         if(title.indexOf(keystr)!=-1 || titlep.indexOf(keystr)!=-1 || titlespan.indexOf(keystr)!=-1){
                            $(li).show(300);
                         }else{
                            $(li).hide(300);
                         }
                     }
                }else{
                    lis.show(300);
                }
            })
        }

    })

    /**********************************给list加搜索过滤 */
});


function FangDou(){
    let timmer = null;
    return function(cb){
        if(timmer){
            clearInterval(timmer);
        }
        timmer = setTimeout(() => {
            cb.call(this);
        }, 500);

    }

}