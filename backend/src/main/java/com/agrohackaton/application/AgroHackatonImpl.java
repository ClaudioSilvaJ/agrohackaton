package com.agrohackaton.application;

import com.agrohackaton.application.base.AviarysImpl;
import com.agrohackaton.application.base.quiz.QuestionnaireImpl;
import org.mongodb.morphia.Datastore;

public class AgroHackatonImpl implements AgroHackatonServer {

    protected Datastore datastore;
    protected QuestionnaireImpl questions;
    protected AviarysImpl aviarys;


    public AgroHackatonImpl(Datastore datastore) {
        this.datastore = datastore;
        this.questions = new QuestionnaireImpl(datastore);
        this.aviarys = new AviarysImpl(datastore);
    }

    @Override
    public QuestionnaireImpl questions() {
        return questions;
    }

    @Override
    public AviarysImpl aviarys() {
        return aviarys;
    }

}
