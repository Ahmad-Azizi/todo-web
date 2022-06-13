import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Popover,
} from "@material-ui/core";
import { List, arrayMove } from 'react-movable';
import { setObjsByPriority } from "./utils";
import TodoRow from './common/TodoRow';
import Calendar from "./common/Calendar";

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
      "& $dueDateDisplay": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
  dueDateDisplay: {
    visibility: "hidden",
  },
  filterContainer: {
    height: '30px'

  },
  filterButton: {
    float: 'right',
  },
  filterClear: {
    float: 'right',
    margin: '5px',
    padding: '2px'
  },
  filterPopover: {
    flexDirection: 'column',
    position: 'relative'
  },
  filterDivider: {
    textAlign: 'center'
  }

});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [showFilter, setShowFilter] = useState(null);
  const [filters, setFilters] = useState(null);
  const [filteredTodos, setFilteredTodos] = useState(null)

  window.onbeforeunload = () => {
    let ids = todos.map(val => val.id);
    localStorage.setItem('todos', JSON.stringify(ids));
  }

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((todos) => {
        let todoPriority = JSON.parse(localStorage.getItem('todos'));
        if (todoPriority?.length) setTodos(setObjsByPriority(todos, todoPriority));
        else setTodos(todos);
      });
  }, [setTodos]);

  function addTodo(text) {
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
    setNewTodoText("");
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function setTodoDueDate(id, dueDate) {
  
      fetch(`http://localhost:3001/${id}/due-date`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          dueDate: dueDate,
        }),
      }).then((res) => {
          const newTodos = [...todos];
          const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
          newTodos[modifiedTodoIndex] = {
            ...newTodos[modifiedTodoIndex],
            dueDate,
          };
          setTodos(newTodos);
        
        }).catch(err => console.log(err))

  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }


  function filterTodos({ start = null, end = null }) {
    if (!start && !end) setFilteredTodos(null)
    else {

      start = new Date(start).valueOf();
      end = new Date(end).valueOf();

      let filtered = todos.filter(val => {
        if (!val.dueDate) return false;

        let date = new Date(val.dueDate).valueOf();

        if (start && end) {
          return (date >= start && date <= end)
        }
        else if (start) return (date >= start)
        else if (end) return (date <= end)
        else return false;
      });

      setFilteredTodos(filtered);
    }
  }

  // JSX STARTS HERE 
  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1}>
            <TextField
              fullWidth
              value={newTodoText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText);
                }
              }}
              onChange={(event) => setNewTodoText(event.target.value)}
            />
          </Box>
          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => addTodo(newTodoText)}
            disabled={!newTodoText}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* FILTER COMPONENT */}
      <div className={classes.filterContainer}>
        <Button
          className={classes.filterButton}
          endIcon={<Icon>{'filter_list'}</Icon>}
          onClick={(event) => setShowFilter(event.currentTarget)}
        >
          Filter
        </Button>
        {filteredTodos && (
          <Button
            variant='contained'
            className={classes.filterClear}
            onClick={() => {
              setFilters(null);
              setFilteredTodos(null)
            }}
          >
            CLEAR
          </Button>
        )}
        <Popover
          open={!!showFilter}
          anchorEl={showFilter}
          onClose={() => setShowFilter(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          className={classes.filterPopover}
        >

          <Calendar
            defaultDate={filters?.start}
            onValueChange={date => setFilters({ ...filters, start: date })}
            id="start-date"
            styleClass='outline'
          />
          <div className={classes.filterDivider}>To</div>


          <Calendar
            defaultDate={filters?.end}
            onValueChange={date => setFilters({ ...filters, end: date })}
            id="end-date"
            styleClass='outline'

          />
          <Button
            disabled={!filters}
            className={classes.filterButton}
            onClick={() => filterTodos(filters)}
          >
            Submit
          </Button>
        </Popover>
      </div>

      {/* (DRAGGABLE) TABLE COMPONENT */}
      {todos.length > 0 && (
        <Paper className={classes.todosContainer}>
          {filteredTodos ? filteredTodos.map(value => (
            <TodoRow
              key={value.id}
              value={value}
              classes={classes}
              onToggle={toggleTodoCompleted}
              onSetDueDate={setTodoDueDate}
              onDelete={deleteTodo}

            />
          )) : (
            <List
              values={filteredTodos || todos}
              onChange={({ oldIndex, newIndex }) => setTodos(arrayMove(todos, oldIndex, newIndex))}
              renderList={({ children, props }) => (
                <Box display="flex" flexDirection="column" alignItems="stretch" {...props}>
                  {children}
                </Box>
              )}
              renderItem={({ value, props }) => (
                <TodoRow
                  key={value.id}
                  value={value}
                  classes={classes}
                  onToggle={toggleTodoCompleted}
                  onSetDueDate={setTodoDueDate}
                  onDelete={deleteTodo}
                  dragableProps={props}
                />
              )}
            />
          )}
        </Paper>
      )}
    </Container>
  );
}

export default Todos;
