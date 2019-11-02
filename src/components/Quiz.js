import React, { useState } from 'react';
import { Grid, Progress } from 'semantic-ui-react';

import { Cache, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';

import Question from './Question';

// Store answers for a day
const AnswerCache = Cache.createInstance({
  storage: window.sessionStorage,
  keyPrefix: 'answers',
  defaultTTL: 24 * 60 * 60 * 1000,
});

const ListQuizQuestions = `
query MyQuestions ($quizID: ID!){
    getQuiz(id: $quizID) {
        questions (limit: 50) {
            items {
                id
                tags
                text
                explanation
                links
                answers {
                    items { id text correct }
                }
            }
        }
    }
}`;

const ViewScore = ({ totalAnswers, correctAnswers }) => {
  if (totalAnswers === 0) return '';

  let color = 'grey';
  if (correctAnswers / totalAnswers > 0.85) {
    color = 'green';
  } else if (correctAnswers / totalAnswers > 0.7) {
    color = 'teal';
  } else if (correctAnswers / totalAnswers > 0.6) {
    color = 'yellow';
  } else if (correctAnswers / totalAnswers > 0.4) {
    color = 'orange';
  }
  return <Progress color={color} value={correctAnswers} total={totalAnswers} progress="ratio" />;
};

function Quiz({ activeQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [answeredIds, setAnsweredIds] = useState([]);
  // const [answeredIds, setAnsweredIds] = useState(AnswerCache.getAllKeys() || []);

  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const answer = qId => {
    console.log('User answered', qId);
    // AnswerCache.setItem(qId, 1);

    setTotalAnswers(prev => prev + 1);
    setAnsweredIds(prev => [...prev, qId]);
  };

  const rightAnswer = () => setCorrectAnswers(prev => prev + 1);

  const unansweredQuestions = () =>
    questions.filter(o => {
      // Filter out all questions that have been answered except the most recent question.
      return -1 === answeredIds.indexOf(o.id);
    });

  if (activeQuiz === null) return [];

  return (
    <>
      <Connect query={graphqlOperation(ListQuizQuestions, { quizID: activeQuiz })}>
        {({ data, loading }) => {
          if (loading || data === null || data.getQuiz === undefined) return [];
          return (
            <Grid celled>
              {data.getQuiz.questions.items
                .filter(o => {
                  // Filter out all questions that have been answered except the most recent question.
                  return -1 === answeredIds.indexOf(o.id);
                })
                .slice(0, 3)
                .map(q => (
                  <Question
                    rightAnswer={rightAnswer}
                    answer={answer}
                    key={`${q.id}row`}
                    question={q}
                  />
                ))}
            </Grid>
          );
        }}
      </Connect>

      <ViewScore totalAnswers={totalAnswers} correctAnswers={correctAnswers} />
    </>
  );
}

export default Quiz;
