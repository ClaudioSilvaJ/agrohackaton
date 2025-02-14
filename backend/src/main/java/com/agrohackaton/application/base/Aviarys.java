package com.agrohackaton.application.base;

import java.util.List;

public interface Aviarys {

    void createAviary(Aviary aviary);

    List<Aviary> listAviaries();

    Aviary getAviary(String id);

    Aviary getFirstAviary();

    AviaryRelatory generateRelatory(Aviary aviary);
}
