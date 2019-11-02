import React, { useState } from 'react';
import { Icon, Label, Form, Radio, Grid, Segment, Header } from 'semantic-ui-react';

// A single question with buttons to select the answer.
function Question({ rightAnswer, answer, question }) {
  const [comment, setComment] = useState([]);
  const [answeredState, setAnsweredState] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctState, setCorrectState] = useState(false);

  // enforce the radio button getting checked
  const updateRadio = (e, { value }) => setSelectedAnswer(value);

  const submitAnswer = e => {
    question.answers.items.map(a => {
      if (selectedAnswer === a.id) {
        // user was right, set this question as correctly answered
        if (a.correct) {
          setCorrectState(true);
          rightAnswer();
        }

        // show the comment
        if (a.comment) {
          setComment(a.comment);
        } else {
          a.correct ? setComment('Great work!') : setComment("Sorry, that's not it.");
        }
      }
      return selectedAnswer === a.id && a.correct;
    });
    setAnsweredState(true);
    answer(question.id);
  };

  return (
    <Grid.Row stretched key={question.id + '-main'}>
      <Grid.Column width={6}>
        <Header as="h3" className="middle aligned" key={question.id}>
          {question.text}
        </Header>
        {answeredState && (
          <Segment color={correctState ? 'green' : 'red'}>
            {!question.explanation ? (
              <p>{correctState ? 'Great work!' : "Sorry, that's not right"}</p>
            ) : (
              <p>{question.explanation}</p>
            )}
            {question.links && (
              <ul>
                {question.links.map((l, index) => (
                  <li key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={l}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Segment>
        )}
        <div>
          {(question.tags || []).map(t => (
            <Label key={question.id + t} color="teal">
              {t}
              <Label.Detail>Topic</Label.Detail>
            </Label>
          ))}
        </div>
      </Grid.Column>
      <Grid.Column width={10}>
        <Form onSubmit={submitAnswer}>
          {question.answers.items.map(a => (
            <Segment key={a.id}>
              <Form.Field
                control={Radio}
                disabled={answeredState}
                label={a.text}
                checked={selectedAnswer === a.id}
                value={a.id}
                onChange={updateRadio}
              />
            </Segment>
          ))}
          <Form.Group inline>
            <Form.Button primary icon labelPosition="right" disabled={answeredState}>
              <Icon name="right arrow" />
              Submit
            </Form.Button>
          </Form.Group>
        </Form>
      </Grid.Column>
    </Grid.Row>
  );
}

export default Question;
