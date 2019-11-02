import React, { useState, useEffect } from 'react';
import { Segment, Header, Container } from 'semantic-ui-react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import aws_exports from './aws-exports';

import Quiz from './components/Quiz';
import QuizPicker from './components/QuizPicker';

Amplify.configure(aws_exports);
Amplify.Logger.LOG_LEVEL = 'INFO';

function App() {
  const [activeQuiz, setActiveQuiz] = useState(null);

  // componentDidMount
  useEffect(() => {
    document.title = 'QuizBiz';
  }, []);

  return (
    <div>
      <Segment className="inverted center aligned" style={{ minHeight: '200px' }}>
        <Container>
          <Header as="h1" textAlign="center" style={{ marginTop: '2em', color: 'white' }}>
            Welcome to QuizBiz
          </Header>
        </Container>
      </Segment>
      <Container>
        <QuizPicker activeQuiz={activeQuiz} propagateQuiz={setActiveQuiz} />
        <Quiz activeQuiz={activeQuiz} />
      </Container>
    </div>
  );
}

export default withAuthenticator(App);
