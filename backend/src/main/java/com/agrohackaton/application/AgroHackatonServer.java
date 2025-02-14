package com.agrohackaton.application;

import com.agrohackaton.application.base.AviarysImpl;
import com.agrohackaton.application.base.quiz.QuestionnaireImpl;

public interface AgroHackatonServer {

    QuestionnaireImpl questions();

    AviarysImpl aviarys();
}
