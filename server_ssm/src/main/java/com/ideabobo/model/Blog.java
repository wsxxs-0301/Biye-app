package com.ideabobo.model;

import java.io.Serializable;

public class Blog implements Serializable {
    private Integer id;

    private String title;

    private String note;

    private String ndate;

    private String btype;

    private String img;

    private String video;

    private Integer typeid;

    private String typecn;

    private Integer uid;

    private String username;

    private Integer favcount;

    private Integer zan;

    private String address;

    private Integer cai;

    private Integer fenxiang;

    private String statecn;

    private String latitude;

    private String longitude;

    private String city;

    private Integer qid;

    private String qtitle;

    private static final long serialVersionUID = 1L;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note == null ? null : note.trim();
    }

    public String getNdate() {
        return ndate;
    }

    public void setNdate(String ndate) {
        this.ndate = ndate == null ? null : ndate.trim();
    }

    public String getBtype() {
        return btype;
    }

    public void setBtype(String btype) {
        this.btype = btype == null ? null : btype.trim();
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img == null ? null : img.trim();
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video == null ? null : video.trim();
    }

    public Integer getTypeid() {
        return typeid;
    }

    public void setTypeid(Integer typeid) {
        this.typeid = typeid;
    }

    public String getTypecn() {
        return typecn;
    }

    public void setTypecn(String typecn) {
        this.typecn = typecn == null ? null : typecn.trim();
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public Integer getFavcount() {
        return favcount;
    }

    public void setFavcount(Integer favcount) {
        this.favcount = favcount;
    }

    public Integer getZan() {
        return zan;
    }

    public void setZan(Integer zan) {
        this.zan = zan;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address == null ? null : address.trim();
    }

    public Integer getCai() {
        return cai;
    }

    public void setCai(Integer cai) {
        this.cai = cai;
    }

    public Integer getFenxiang() {
        return fenxiang;
    }

    public void setFenxiang(Integer fenxiang) {
        this.fenxiang = fenxiang;
    }

    public String getStatecn() {
        return statecn;
    }

    public void setStatecn(String statecn) {
        this.statecn = statecn == null ? null : statecn.trim();
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude == null ? null : latitude.trim();
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude == null ? null : longitude.trim();
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city == null ? null : city.trim();
    }

    public Integer getQid() {
        return qid;
    }

    public void setQid(Integer qid) {
        this.qid = qid;
    }

    public String getQtitle() {
        return qtitle;
    }

    public void setQtitle(String qtitle) {
        this.qtitle = qtitle == null ? null : qtitle.trim();
    }
}