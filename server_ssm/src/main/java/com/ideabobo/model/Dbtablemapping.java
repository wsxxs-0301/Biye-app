package com.ideabobo.model;
import com.alibaba.fastjson.JSON;
public class Dbtablemapping {
	public static Object parseStringModel(String value, String table) {
		Object object = null;
		switch (table) {
			case "tbl_blog": object = JSON.parseObject(value, Blog.class); break;
			case "tbl_city": object = JSON.parseObject(value, City.class); break;
			case "tbl_huihua": object = JSON.parseObject(value, Huihua.class); break;
			case "tbl_message": object = JSON.parseObject(value, Message.class); break;
			case "tbl_mgc": object = JSON.parseObject(value, Mgc.class); break;
			case "tbl_notice": object = JSON.parseObject(value, Notice.class); break;
			case "tbl_posts": object = JSON.parseObject(value, Posts.class); break;
			case "tbl_qunzu": object = JSON.parseObject(value, Qunzu.class); break;
			case "tbl_replay": object = JSON.parseObject(value, Replay.class); break;
			case "tbl_shop": object = JSON.parseObject(value, Shop.class); break;
			case "tbl_tags": object = JSON.parseObject(value, Tags.class); break;
			case "tbl_type": object = JSON.parseObject(value, Type.class); break;
			case "tbl_user": object = JSON.parseObject(value, User.class); break;
			case "tbl_yzmessage": object = JSON.parseObject(value, Yzmessage.class); break;
			case "tbl_zan": object = JSON.parseObject(value, Zan.class); break;
		}
		return object;
}
public static Object getModelByTable(String table) {
	Object object = null;
	switch (table) {
			case "tbl_blog": object = new Blog(); break;
			case "tbl_city": object = new City(); break;
			case "tbl_huihua": object = new Huihua(); break;
			case "tbl_message": object = new Message(); break;
			case "tbl_mgc": object = new Mgc(); break;
			case "tbl_notice": object = new Notice(); break;
			case "tbl_posts": object = new Posts(); break;
			case "tbl_qunzu": object = new Qunzu(); break;
			case "tbl_replay": object = new Replay(); break;
			case "tbl_shop": object = new Shop(); break;
			case "tbl_tags": object = new Tags(); break;
			case "tbl_type": object = new Type(); break;
			case "tbl_user": object = new User(); break;
			case "tbl_yzmessage": object = new Yzmessage(); break;
			case "tbl_zan": object = new Zan(); break;
		}
		return object;
	}
}
