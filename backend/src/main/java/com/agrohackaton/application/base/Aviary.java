package com.agrohackaton.application.base;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Id;

@Reference
public class Aviary {

    @Id
    private ObjectId id;

    private String idAviary;

    private String name;

    private String address;

    public Aviary() { }

    public Aviary(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public String getId() {
        return id.toString();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
