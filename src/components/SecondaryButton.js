
import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import classNames from 'classnames';
const SecondaryButton = withStyles(theme => ({
    root: {
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        minWidth: theme.spacing.unit * 15,
        borderColor: theme.palette.secondary.main,
    },

}))(props => {
    const { children, classes, className, onClick, text } = props;
    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onClick}
            className={classNames(className, classes.root)}>
            <b>{text}</b>
            {children}
        </Button>
    );
});
export default SecondaryButton;