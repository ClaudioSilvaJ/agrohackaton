package com.agrohackaton.api.services.DTOs;

import com.agrohackaton.application.base.quiz.Question;
import com.agrohackaton.application.base.quiz.Questionnaire;

import java.util.List;

public class QuestionnairesAndQuestionsDTO {

    public String id;

    public String questionnaireName;

    public List<Question> questions;

    public QuestionnairesAndQuestionsDTO(Questionnaire questionnaire, List<Question> questions) {
        this.id = questionnaire.getId();
        this.questionnaireName = questionnaire.getQuestionnaireName();
        this.questions = questions;
    }
}
