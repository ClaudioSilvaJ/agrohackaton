package com.agrohackaton.application.base.quiz;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Reference;

@Entity
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Questionnaire {
    @Id
    private ObjectId id;

    private String questionnaireName;

    public Questionnaire() { }

    public Questionnaire(String questionnaireName) {
        this.questionnaireName = questionnaireName;
    }

    public String getId() {
        return id.toString();
    }

    public String getQuestionnaireName() {
        return questionnaireName;
    }

    public void setQuestionnaireName(String questionnaireName) {
        this.questionnaireName = questionnaireName;
    }
}
