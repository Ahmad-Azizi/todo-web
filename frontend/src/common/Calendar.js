import { makeStyles } from "@material-ui/core/styles";
import React from 'react'

const useStyles = makeStyles({
    primary: {
        border: 'none',
        outline: 'none',
        userSelect: 'none'
    },
    outline: {
        width: '100%',
        padding: '15px 20px',
        outline:'none',
        border:'none',
        borderBottom: '1px solid #d3d3d3'
      }
});

function Calendar({ heading, defaultDate, onValueChange, styleClass, ...props }) {
    const classes = useStyles();
    return (
        <span >
            <h4 style={{ margin: '0px' }}>{heading}</h4>
            <input
                className={classes[styleClass] ? classes[styleClass] : classes.primary}
                type="datetime-local"
                value={defaultDate || ''}
                onChange={(event) => onValueChange(event.target.value)}
                {...props}
            />
        </span>
    )
}

export default Calendar
