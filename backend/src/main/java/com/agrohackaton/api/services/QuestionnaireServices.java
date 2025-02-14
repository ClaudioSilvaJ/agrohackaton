package com.agrohackaton.api.services;

import com.agrohackaton.ApiMain;
import com.agrohackaton.api.services.DTOs.*;
import com.agrohackaton.application.base.Aviary;
import com.agrohackaton.application.base.quiz.Question;
import com.agrohackaton.application.base.quiz.QuestionAnswers;
import com.agrohackaton.application.base.quiz.Questionnaire;
import com.agrohackaton.application.base.quiz.QuestionnaireAnswers;

import javax.ws.rs.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Path("/")
public class QuestionnaireServices extends ApiMain {

    @POST
    @Path("/create-questionnaire")
    public String createQuestionnaire(CreationQuestionnaireDTO creationQuestionnaireDTO){
        Questionnaire questionnaire = new Questionnaire(creationQuestionnaireDTO.questionnaireName);
        agroHackatonServer.questions().addQuestionnaire(questionnaire);
        for (Question question : creationQuestionnaireDTO.questions) { agroHackatonServer.questions().addQuestion(question, questionnaire); }
        return "API WORKS!";
    }

    @POST
    @Path("/response-questionnaire")
    public String responseQuestionnaire(ResponseQuestionnaire responseQuestionnaire){
        Question question = agroHackatonServer.questions().getQuestion(responseQuestionnaire.answers.get(0).questionId);
        Aviary aviary = agroHackatonServer.aviarys().getAviary(responseQuestionnaire.aviaryId);
        QuestionnaireAnswers questionnaireAnswers = new QuestionnaireAnswers(question.getQuestionnaire(), aviary, 10L);
        agroHackatonServer.questions().createQuestionnaireAnswers(questionnaireAnswers);
        QuestionAnswers answer;
        for(CreateQuestionAnswer createQuestionAnswer : responseQuestionnaire.answers){
            question = agroHackatonServer.questions().getQuestion(createQuestionAnswer.questionId);
            agroHackatonServer.questions().addAnswer(new QuestionAnswers(question, questionnaireAnswers, createQuestionAnswer.deadline, createQuestionAnswer.action, createQuestionAnswer.observation, createQuestionAnswer.photo, QuestionAnswers.ANSWERS.valueOf(createQuestionAnswer.answer)));
        }
        return "Questions answered!";
    }

    @GET
    @Path("/questionnaires")
    @Produces("application/json")
    public List<QuestionnairesAndQuestionsDTO> listQuestionnaires(){
        return agroHackatonServer.questions().listQuestionnaires();

    }

    @POST
    @Path("/update-questionnaire")
    @Produces("application/json")
    public String updateQuestionnaire(Questionnaire questionnaire){
        agroHackatonServer.questions().updateQuestionnaire(questionnaire);
        return "Questionnaire updated!";
    }

    @GET
    @Path("/irregularidades")
    @Produces("application/json")
    public List<QuestionAnswers> getIrregularidades() {
        Aviary aviary = agroHackatonServer.aviarys().getFirstAviary();
        List<QuestionAnswers> answers = agroHackatonServer.questions().getIrregularidades(aviary);
        List<ResolverIrregularidade> resolverIrregularidades = agroHackatonServer.questions().getResolverIrregularidades();

        Set<QuestionAnswers> answers1 = resolverIrregularidades.stream()
                .map(ResolverIrregularidade::getQuestionAnswers)
                .collect(Collectors.toSet());

        List<QuestionAnswers> answersDontSave = answers.stream()
                .filter(questionAnswers -> !answers1.contains(questionAnswers))
                .collect(Collectors.toList());

        return answersDontSave;
    }


    @POST
    @Path("/resolver-irregularidade")
    public String resolverIrregularidade(ResolverIrregularidade resolverIrregularidade){

        agroHackatonServer.questions().resolverIrregularidade(resolverIrregularidade);

        return "Irregularidade resolvida!";

    }
}