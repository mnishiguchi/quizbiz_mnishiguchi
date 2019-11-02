import React, { useState } from 'react';
import { Icon, Form } from 'semantic-ui-react';

// The form layout.
function QuestionForm({ onSubmit, quizzes }) {
  const [state, setState] = useState({
    quizTitle: null,
    quizId: null,
    correctAnswer: null,
    questionText: null,
    questionExplanation: null,
    answerText1: null,
    answerText2: null,
    answerText3: null,
    answerText4: null,
    loading: false,
  });

  const submit = () => {
    onSubmit(state);
    setState(prev => ({ ...prev, loading: true }));
  };

  const updateCheck = (e, { value }) => {
    console.log({ event: e, value: value });
    setState(prev => ({ ...prev, correctAnswer: value }));
  };

  const updateText = (e, { name, value }) => {
    console.log({ event: e, name: name, value: value });
    setState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={submit}>
      <Form.TextArea name={'questionText'} onChange={updateText}></Form.TextArea>
      <h3>Answers</h3>
      {[1, 2, 3, 4].map(i => (
        <Form.Group inline key={'id' + i}>
          <Form.Radio
            disabled={false}
            label=""
            checked={state.correctAnswer === 'answerText' + i}
            onClick={updateCheck}
            value={'answerText' + i}
          />
          <Form.Input
            label={'Choice ' + i}
            onChange={updateText}
            name={'answerText' + i}
          ></Form.Input>
        </Form.Group>
      ))}
      <Form.TextArea
        label="Why is this correct?"
        name={'questionExplanation'}
        onChange={updateText}
      ></Form.TextArea>
      <Form.Group widths="equal">
        <Form.Dropdown
          search
          selection
          label="Add to quiz"
          name="quizId"
          placeholder="Choose One"
          onChange={updateText}
          options={quizzes
            .sort((a, b) => a.title - b.title)
            .map(v => ({ text: v.title, value: v.id }))}
        />
        <Form.Input
          label="Or create a new quiz"
          name="quizTitle"
          onChange={updateText}
        ></Form.Input>
      </Form.Group>
      <Form.Button
        primary
        icon
        labelPosition="right"
        disabled={state.loading || state.correctAnswer === null || state.questionText === null}
      >
        <Icon name="right arrow" />
        Submit
      </Form.Button>
    </Form>
  );
}

export default QuestionForm;
