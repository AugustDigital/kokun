import React, { Component } from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core'
import Add from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const styles = theme => ({

    dropdown: {
        position: 'relative',
        display: 'inline-block',
        '&:hover $dropdownContent': {
            display: 'block'
        },
        '&:hover $btn': {
            backgroundColor: 'rgba(255,255,255, 0.1)',
        }
    },
    btn: {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px'
    },
    dropdownContent: {
        display: 'none',
        position: 'absolute',
        backgroundColor: theme.palette.background.dropDown,
        minWidth: '100%',
        zIndex: 1,
        '& button': {
            color: theme.palette.text.primary,
            width: '100%',
            backgroundColor: 'transparent',
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'block',
            '&:hover': {
                backgroundColor: 'rgba(255,255,255, 0.1)'
            }
        }
    },
    underline: {
        '&:before': {
            borderBottom: '2px solid ' + theme.palette.common.underlineContrast,
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.common.underlineFocusedContrast}`
        }
    },
    textFieldInput: {
        color: theme.palette.text.primary + ' !important'
    },
    textField: {
        color: theme.palette.text.primary + ' !important',
    },
    addTokenButton: {
        backgroundColor: theme.palette.background.dropDown + ' !important'
    },
    addToken: {
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: theme.palette.secondary.main,
        width: '200px',
        position: 'absolute',
        left: '-108px',
        backgroundColor: theme.palette.background.dropDown
    },
    addButton: {
        fontSize: '13px',
        color: theme.palette.text.primary + ' !important'
    },
    lock: {
        pointerEvents:'none'
    }
})
class CoinDropdown extends Component {
    state = {
        address: '',
        addTokenExanded: false
    }

    onItemClick = (itemIndex) => {
        this.props.onChange(itemIndex)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedIndex) {
            this.setState({
                selectedItem: this.props.items[nextProps.selectedIndex]
            });
        }
    }

    render() {
        const { classes, items, className, itemClassName, selectedIndex, lock, isLedger } = this.props;
        const selectedItem= items[selectedIndex];
        const dropDownItems = items.map((item, index) => {
            return (<button key={index} className={itemClassName} onClick={() => { this.onItemClick(index) }}> <Typography variant="subtitle2">{item}</Typography> </button>)
        })
        return (
            <div className={classes.dropdown + (lock? ' '+classes.lock:'')}>
                <button className={classes.btn + ' ' + className + (lock? ' '+classes.lock:'')} key={dropDownItems.length} >
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Typography variant="subtitle2" >{selectedItem}</Typography>
                        <Typography variant="subtitle2" >{lock?null:'▾'}</Typography>
                    </Grid>
                </button>

                <div className={classes.dropdownContent}>
                    {dropDownItems}

                    {
                        !isLedger ?
                        <button className={itemClassName} key={dropDownItems.length} onClick={() => { this.props.onTokenAddClicked() }}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Typography variant="subtitle2" >ADD</Typography>
                                <Add className={classes.addButton} />
                            </Grid>
                        </button>
                        : null
                    }

                </div>

            </div>
        )
    }
}

CoinDropdown.propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    onTokenAddClicked: PropTypes.func.isRequired
};


export default withStyles(styles)(CoinDropdown);
