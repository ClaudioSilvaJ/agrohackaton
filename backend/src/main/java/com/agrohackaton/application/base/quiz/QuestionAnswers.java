package com.agrohackaton.application.base.quiz;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Reference;

import java.util.Base64;
import java.util.Objects;

@Entity
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class QuestionAnswers {

    @Id
    private ObjectId id;

    @Reference
    private Question question;

    @Reference
    private QuestionnaireAnswers questionnaireAnswers;

    private long deadline;

    private String action;

    private String observation;

    private byte[] photo;

    private QuestionAnswers.ANSWERS answer;

    public enum ANSWERS {
        Conformidade, NaoConformidade
    }

    public QuestionAnswers() { }


    public QuestionAnswers(Question question, QuestionnaireAnswers questionnaireAnswers, long deadline, String action, String observation, byte[] photo, ANSWERS answer) {
        this.question = question;
        this.questionnaireAnswers = questionnaireAnswers;
        this.deadline = deadline;
        this.action = action;
        this.observation = observation;
        this.photo = photo;
        this.answer = answer;
    }

    public String getId() {
        return id.toString();
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public QuestionnaireAnswers getQuestionnaireAnswers() {
        return questionnaireAnswers;
    }

    public void setQuestionnaireAnswers(QuestionnaireAnswers questionnaireAnswers) {
        this.questionnaireAnswers = questionnaireAnswers;
    }

    public long getDeadline() {
        return deadline;
    }

    public void setDeadline(long deadline) {
        this.deadline = deadline;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public ANSWERS getAnswer() {
        return answer;
    }

    public void setAnswer(ANSWERS answer) {
        this.answer = answer;
    }

}
