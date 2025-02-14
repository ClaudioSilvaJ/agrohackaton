package com.agrohackaton.application.base;

import com.agrohackaton.application.base.quiz.QuestionAnswers;
import com.agrohackaton.application.base.quiz.QuestionnaireAnswers;
import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;

import java.util.List;

public class AviarysImpl implements Aviarys{

    protected Datastore datastore;

    public AviarysImpl(Datastore datastore) {
        this.datastore = datastore;
    }

    @Override
    public void createAviary(Aviary aviary) {
        datastore.save(aviary);
    }

    @Override
    public List<Aviary> listAviaries() {
        return datastore.createQuery(Aviary.class).asList();
    }

    @Override
    public Aviary getAviary(String id) {
        return datastore.createQuery(Aviary.class).field("id").equal(new ObjectId(id)).get();
    }

    @Override
    public Aviary getFirstAviary(){
        return datastore.createQuery(Aviary.class).get();
    }

    @Override
    public AviaryRelatory generateRelatory(Aviary aviary) {
        QuestionnaireAnswers questionnaireAnswers = datastore.createQuery(QuestionnaireAnswers.class).field("aviary").equal(aviary).get();
        List<QuestionAnswers> questionAnswers = datastore.createQuery(QuestionAnswers.class).field("questionnaireAnswers").equal(questionnaireAnswers).asList();
        double totalPontos = questionAnswers.stream().mapToDouble(q -> q.getQuestion().getPriority()).sum();
        double totalPontosConformidade = questionAnswers.stream().filter(q -> q.getAnswer() == QuestionAnswers.ANSWERS.Conformidade).mapToDouble(q -> q.getQuestion().getPriority()).sum();
        return new AviaryRelatory(totalPontos, totalPontosConformidade);
    }
}
