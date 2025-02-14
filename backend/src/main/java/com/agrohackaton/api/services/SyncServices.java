package com.agrohackaton.api.services;


import com.agrohackaton.ApiMain;
import com.agrohackaton.api.services.DTOs.CreateQuestionAnswer;
import com.agrohackaton.api.services.DTOs.MasterClass;
import com.agrohackaton.application.base.Aviary;
import com.agrohackaton.application.base.quiz.Question;
import com.agrohackaton.application.base.quiz.QuestionAnswers;
import com.agrohackaton.application.base.quiz.QuestionnaireAnswers;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

@Path("/")
public class SyncServices extends ApiMain {

    @POST
    @Path("/sync")
    public String sync(MasterClass masterClass){
        if(masterClass.aviarys != null){
            for(Aviary aviary : masterClass.getAviarys()){
                agroHackatonServer.aviarys().createAviary(aviary);
            }
        }

        if(masterClass.getQuestionnaireAnswers() != null){
            for(com.agrohackaton.api.services.DTOs.ResponseQuestionnaire responseQuestionnaire : masterClass.questionnaireAnswers){
                Question question = agroHackatonServer.questions().getQuestion(responseQuestionnaire.answers.get(0).questionId);
                Aviary aviary = agroHackatonServer.aviarys().getAviary(responseQuestionnaire.aviaryId);
                QuestionnaireAnswers questionnaireAnswers = new QuestionnaireAnswers(question.getQuestionnaire(), aviary, 10L);
                agroHackatonServer.questions().createQuestionnaireAnswers(questionnaireAnswers);
                QuestionAnswers answer;
                for(CreateQuestionAnswer createQuestionAnswer : responseQuestionnaire.answers){
                    question = agroHackatonServer.questions().getQuestion(createQuestionAnswer.questionId);
                    agroHackatonServer.questions().addAnswer(new QuestionAnswers(question, questionnaireAnswers, createQuestionAnswer.deadline, createQuestionAnswer.action, createQuestionAnswer.observation, createQuestionAnswer.photo, QuestionAnswers.ANSWERS.valueOf(createQuestionAnswer.answer)));
                }
            }
        }

        return "Sync done!";
    }
}
