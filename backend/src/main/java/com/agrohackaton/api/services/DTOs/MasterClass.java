package com.agrohackaton.api.services.DTOs;

import com.agrohackaton.application.base.Aviary;
import com.agrohackaton.application.base.quiz.QuestionAnswers;
import com.agrohackaton.application.base.quiz.QuestionnaireAnswers;

import java.util.ArrayList;
import java.util.List;

public class MasterClass {
    public List<Aviary> aviarys;
    public List<ResponseQuestionnaire> questionnaireAnswers;

    public List<Aviary> getAviarys() {
        if(aviarys == null)
            aviarys = new ArrayList<>();
        return aviarys;
    }

    public void setAviarys(List<Aviary> aviarys) {
        this.aviarys = aviarys;
    }

    public List<ResponseQuestionnaire> getQuestionnaireAnswers() {
        if(questionnaireAnswers == null)
            questionnaireAnswers = new ArrayList<>();
        return questionnaireAnswers;
    }

    public void setQuestionnaireAnswers(List<ResponseQuestionnaire> questionnaireAnswers) {
        this.questionnaireAnswers = questionnaireAnswers;
    }
}
