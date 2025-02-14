package com.agrohackaton.application.base.quiz;

import com.agrohackaton.api.services.DTOs.QuestionnairesAndQuestionsDTO;
import com.agrohackaton.api.services.DTOs.ResolverIrregularidade;
import com.agrohackaton.application.base.Aviary;

import java.util.List;

public interface Questionnaires {

    List<Question> getQuestions();

    void addQuestionnaire(Questionnaire questionnaire);

    void addQuestion(Question question, Questionnaire questionnaire);

    Question getQuestion(String id);

    void addAnswer(QuestionAnswers answer);

    void createQuestionnaireAnswers(QuestionnaireAnswers questionnaireAnswers);


    List<QuestionnairesAndQuestionsDTO> listQuestionnaires();

    void updateQuestionnaire(Questionnaire questionnaire);

    void updateQuestion(Question question);

    List<QuestionAnswers> getIrregularidades(Aviary aviary);

    void resolverIrregularidade(ResolverIrregularidade resolverIrregularidade);

    List<ResolverIrregularidade> getResolverIrregularidades();
}
