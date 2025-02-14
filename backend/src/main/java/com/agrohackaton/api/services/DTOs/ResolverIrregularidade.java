package com.agrohackaton.api.services.DTOs;

import com.agrohackaton.application.base.quiz.QuestionAnswers;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Reference;

@Entity
public class ResolverIrregularidade {

    @Id
    private ObjectId id;

    @Reference
    private QuestionAnswers questionAnswers;


    private byte[] photo;

    private long timestamp;

    public ResolverIrregularidade() { }

    public ResolverIrregularidade(QuestionAnswers questionAnswers, byte[] photo, long timestamp) {
        this.questionAnswers = questionAnswers;
        this.photo = photo;
        this.timestamp = timestamp;
    }

    public QuestionAnswers getQuestionAnswers() {
        return questionAnswers;
    }

    public void setQuestionAnswers(QuestionAnswers questionAnswers) {
        this.questionAnswers = questionAnswers;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
