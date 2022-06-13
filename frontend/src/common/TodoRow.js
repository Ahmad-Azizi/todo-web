import React from 'react'
import {
    Typography,
    Button,
    Icon,
    Paper,
    Box,
    TextField,
    Checkbox,
    Popover,
} from "@material-ui/core";
import Calendar from './Calendar';

const TodoRow = ({ value, classes, onToggle, onSetDueDate, onDelete, dragableProps }) => {
    return (
        <Box
            key={value.id}
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={classes.todoContainer}
            {...dragableProps}
        >
            <Checkbox
                checked={value.completed}
                onChange={() => onToggle(value.id)}
            ></Checkbox>
            <Box flex={2}>
                <Typography
                    className={value.completed ? classes.todoTextCompleted : ""}
                    variant="body1"
                >
                    {value.text}
                </Typography>
            </Box>
            <Box flex={3} className={!value.dueDate ? classes.dueDateDisplay : ''}>
                <Calendar
                    heading='Due Date'
                    defaultDate={value.dueDate}
                    onValueChange={date => onSetDueDate(value.id, date)}
                    styleClass='primary'
                />
            </Box>
            <Button
                className={classes.deleteTodo}
                startIcon={<Icon>delete</Icon>}
                onClick={() => onDelete(value.id)}
            >
                Delete
            </Button>
        </Box>
    )
};


export default TodoRow
