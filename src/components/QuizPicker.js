import React, { useState } from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { Menu, Dropdown } from 'semantic-ui-react';
import QuizInput from './QuizInput';

const SubscribeToQuizzes = `
subscription OnCreateQuiz {
  onCreateQuiz {
    id
    title
  }
}
`;

const ListQuizzes = `
query MyQuizzes {
    listQuizzes(limit: 5) {
        nextToken
        items {
            id
            title
        }
    }
}`;

// A dropdown for selectiong the quiz that a user wants to use.
function QuizPicker({ activeQuiz, propagateQuiz }) {
  const [modalActiveState, setModalActiveState] = useState(false);

  const handleItemClick = (e, { name }) => propagateQuiz(name);
  const closeModal = () => setModalActiveState(false);
  const openModal = () => setModalActiveState(true);

  const renderDropdowns = data => {
    if (data.listQuizzes.items.length === 0) return [];

    return [
      <Menu.Item key="current" name={`current-${activeQuiz}`} active={!modalActiveState}>
        {activeQuiz
          ? data.listQuizzes.items.filter(q => q.id === activeQuiz)[0].title
          : 'Choose a quiz!'}
      </Menu.Item>,
      <Dropdown key="options" item text="Choose Another">
        <Dropdown.Menu>
          {data.listQuizzes.items
            .sort((a, b) => a.title - b.title)
            .filter(q => q.id !== activeQuiz)
            .map(q => {
              return (
                <Dropdown.Item key={q.id} name={q.id} active={false} onClick={handleItemClick}>
                  {q.title}
                </Dropdown.Item>
              );
            })}
        </Dropdown.Menu>
      </Dropdown>,
    ];
  };

  return (
    <Connect
      query={graphqlOperation(ListQuizzes)}
      subscription={graphqlOperation(SubscribeToQuizzes)}
      onSubscriptionMsg={(prev, data) => {
        console.log('New quiz created:', { prev: prev, newData: data });
        prev.listQuizzes.items = [
          ...prev.listQuizzes.items,
          {
            id: data.onCreateQuiz.id,
            title: data.onCreateQuiz.title,
          },
        ];
        return prev;
      }}
    >
      {({ data, loading }) => {
        if (loading || data === undefined || data === null || data.listQuizzes === undefined)
          return [];
        return (
          <Menu>
            {renderDropdowns(data)}
            <Menu.Item name={'new-question'} active={modalActiveState} onClick={openModal}>
              {
                <QuizInput
                  modalActive={modalActiveState}
                  onClose={closeModal}
                  activeQuiz={activeQuiz}
                  quizzes={data.listQuizzes.items}
                />
              }
            </Menu.Item>
          </Menu>
        );
      }}
    </Connect>
  );
}

export default QuizPicker;
