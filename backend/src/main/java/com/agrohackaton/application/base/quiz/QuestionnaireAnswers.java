package com.agrohackaton.application.base.quiz;


import com.agrohackaton.application.base.Aviary;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Reference;

@Entity
public class QuestionnaireAnswers {

    @Id
    private ObjectId id;

    @Reference
    private Questionnaire questionnaire;

    @Reference
    private Aviary aviary;

    private long date;

    public QuestionnaireAnswers() {
    }

    public QuestionnaireAnswers(Questionnaire questionnaire, Aviary aviary, long date) {
        this.questionnaire = questionnaire;
        this.aviary = aviary;
        this.date = date;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public Aviary getAviary() {
        return aviary;
    }

    public void setAviary(Aviary aviary) {
        this.aviary = aviary;
    }

    public long getDate() {
        return date;
    }

    public void setDate(long date) {
        this.date = date;
    }
}
