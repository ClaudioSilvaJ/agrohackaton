package com.agrohackaton.application.base.quiz;

import com.agrohackaton.api.services.DTOs.QuestionnairesAndQuestionsDTO;
import com.agrohackaton.api.services.DTOs.ResolverIrregularidade;
import com.agrohackaton.application.base.Aviary;
import org.mongodb.morphia.Datastore;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class QuestionnaireImpl implements Questionnaires {

    protected Datastore datastore;
    public QuestionnaireImpl(Datastore datastore) {
        this.datastore = datastore;

    }

    @Override
    public List<Question> getQuestions() {
        return datastore.createQuery(Question.class).asList();
    }

    @Override
    public void addQuestionnaire(Questionnaire questionnaire) {
        datastore.save(questionnaire);
    }

    @Override
    public void addQuestion(Question question, Questionnaire questionnaire) {
        question.setQuestionnaire(questionnaire);
        datastore.save(question);
    }

    @Override
    public Question getQuestion(String id) {
        return datastore.createQuery(Question.class).field("idQuestion").equal(id).get();
    }

    @Override
    public void addAnswer(QuestionAnswers answer) {
        datastore.save(answer);
    }

    @Override
    public void createQuestionnaireAnswers(QuestionnaireAnswers questionnaireAnswers) {
        datastore.save(questionnaireAnswers);
    }

    @Override
    public List<QuestionnairesAndQuestionsDTO> listQuestionnaires() {
        List<QuestionnairesAndQuestionsDTO> dtoQuestions = datastore.createQuery(Questionnaire.class).asList().stream().map(questionnaire -> {
            List<Question> questions = datastore.createQuery(Question.class).field("questionnaire").equal(questionnaire).asList();
            return new QuestionnairesAndQuestionsDTO(questionnaire, questions);
        }).collect(Collectors.toList());
        return dtoQuestions;
    }

    @Override
    public void updateQuestionnaire(Questionnaire questionnaire) {
        datastore.save(questionnaire);
    }

    @Override
    public void updateQuestion(Question question) {
        datastore.save(question);
    }

    @Override
    public List<QuestionAnswers> getIrregularidades(Aviary aviary) {
        List<QuestionnaireAnswers> questionnaireAnswers = datastore
                .createQuery(QuestionnaireAnswers.class)
                .field("aviary").equal(aviary)
                .asList();

        List<QuestionAnswers> questionAnswers = questionnaireAnswers.stream()
                .flatMap(questionnaireAnswer -> datastore.createQuery(QuestionAnswers.class)
                        .field("questionnaireAnswers").equal(questionnaireAnswer)
                        .asList()
                        .stream())
                .filter(qa -> qa.getAnswer().equals(QuestionAnswers.ANSWERS.NaoConformidade))
                .collect(Collectors.toList());

        Set<Object> resolvedIds = datastore.createQuery(ResolverIrregularidade.class)
                .asList()
                .stream()
                .map(ResolverIrregularidade::getQuestionAnswers)
                .filter(qa -> qa.getAnswer().equals(QuestionAnswers.ANSWERS.NaoConformidade))
                .map(QuestionAnswers::getId)
                .collect(Collectors.toSet());

        return questionAnswers.stream()
                .filter(qa -> !resolvedIds.contains(qa.getId()))
                .collect(Collectors.toList());
    }


    @Override
    public void resolverIrregularidade(ResolverIrregularidade resolverIrregularidade) {
        datastore.save(resolverIrregularidade);
    }

    @Override
    public List<ResolverIrregularidade> getResolverIrregularidades() {
        return datastore.createQuery(ResolverIrregularidade.class).asList();

    }

}
