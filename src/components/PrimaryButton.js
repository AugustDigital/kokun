
import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import classNames from 'classnames';
const PrimaryButton = withStyles(theme => ({
  root: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit + 1,
    paddingBottom: theme.spacing.unit + 1,
    minWidth: theme.spacing.unit * 15,
    backgroundColor: theme.palette.common.primaryButton,
    "&:disabled": {
      backgroundColor: theme.palette.common.primaryButtonDisabled
    },
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    fontSize: 14,
  },
}))(props => {
  const { children, classes, className, onClick, showArrow, disabled, text } = props;
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={onClick}
      className={classNames(className, classes.root)}>
      <b>{text}</b>
      {children}
      {showArrow ?
        <ArrowForward className={classes.rightIcon} />
        : null}

    </Button>
  );
});
export default PrimaryButton;