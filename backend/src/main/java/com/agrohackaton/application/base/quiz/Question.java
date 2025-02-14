package com.agrohackaton.application.base.quiz;


import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Reference;

@Entity
public class Question {

    @Id
    private ObjectId id;

    private String idQuestion;

    private String question;

    private int priority;

    @Reference
    private Questionnaire questionnaire;

    public Question() { }

    public Question(String idQuestion, String question, int priority) {
        this.idQuestion = idQuestion;
        this.question = question;
        this.priority = priority;
    }

    public String getIdQuestion() {
        return idQuestion;
    }

    public void setIdQuestion(String idQuestion) {
        this.idQuestion = idQuestion;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }
}
