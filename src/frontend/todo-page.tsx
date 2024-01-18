import { invoke } from '@forge/bridge';
import ForgeReconciler, { Button, Cell, Checkbox, Form, Head, Row, Stack, Strong, Table, Text, TextField } from '@forge/react';
import React, { useEffect, useState } from 'react';


const App = () => {
  const [todos, setTodos] = useState(null);
  const [input, setInput] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [isDeleteAllShowing, setDeleteAllShowing] = useState(false);
  const [isDeletingAll, setDeletingAll] = useState(false);

  if (!isFetched) {
    setIsFetched(true);
    invoke('get-all').then(setTodos);
  }

  const createTodo = async (label) => {
    const newTodoList = [...todos, { label, isChecked: false, isSaving: true }];

    setTodos(newTodoList);
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, isChecked: !todo.isChecked, isSaving: true };
        }
        return todo;
      })
    )
  }

  const deleteTodo = (id) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, isDeleting: true };
        }
        return todo;
      })
    )
  }

  const deleteAllTodos = async () => {
    setDeletingAll(true);

    await invoke('delete-all');

    setTodos([]);
    setDeleteAllShowing(false);
    setDeletingAll(false);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    createTodo(input);
    setInput('');
  };

  const handleSubmitButton = () => {
    createTodo(input);
    setInput('');
  }

  useEffect(() => {
    if (!todos) return;
    if (!todos.find(todo => todo.isSaving || todo.isDeleting)) return;

    Promise.all(
      todos.map((todo) => {
        if (todo.isSaving && !todo.id) {
          return invoke('create', { label: todo.label, isChecked: false })
        }
        if (todo.isSaving && todo.id) {
          return invoke('update', { id: todo.id, label: todo.label, isChecked: todo.isChecked })
        }
        if (todo.isDeleting && todo.id) {
          return invoke('delete', { id: todo.id }).then(() => false);
        }
        return todo;
      })
    )
      .then(saved => saved.filter(a => a))
      .then(setTodos)
  }, [todos]);

  if (!todos) {
    return (
      <Text>
        Loading...
      </Text>
    );
  }

  const completedCount = todos.filter(todo => todo.isChecked).length;
  const totalCount = todos.length;

  const Rows = () => (
    <Table>
      <Head>
        <Cell>
          <Text>Issue Key</Text>
        </Cell>
        <Cell>
          <Text>Status</Text>
        </Cell>
      </Head>

      {todos.map(({ id, label, isChecked, isSaving, isDeleting }) => {
        const isSpinnerShowing = isSaving || isDeleting;
        return (
          <Row>
            <Cell>
              <Checkbox value={isChecked} label={label} onChange={() => toggleTodo(id)} />
            </Cell>
            <Cell>
              <Text>{label}</Text>
            </Cell>
            <Cell>
              {isSpinnerShowing ? <Text>...</Text> : null}
              {isChecked ? <Text>Done</Text> : null}
              <Button onClick={() => deleteTodo(id)}>
                DELETE
              </Button>
            </Cell>
          </Row>
        );
      })}
    </Table >
  );

  const DeleteAll = () => isDeleteAllShowing ? (
    <Button
      onClick={deleteAllTodos}
      disabled={isDeletingAll}
    >
      Delete All
    </Button>
  ) : (
    <Button onClick={() => setDeleteAllShowing(true)}>
      Loading...
    </Button>
  );

  const CompletedLozenge = () => <Text>{completedCount}/{totalCount} Completed</Text>;

  return (
    <Stack>
      <Rows />
      <Form onSubmit={onSubmit}>
        <TextField
          type="text"
          placeholder="Add a todo +"
          value={input}
          onChange={(value) => setInput(value)} name={''} label={''} />
        <Button onClick={handleSubmitButton} />
      </Form>
      <Text>Completed</Text>
      <CompletedLozenge />
      <Strong>
        Actions
      </Strong>
      <DeleteAll />
    </Stack>
  );
}

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

