import React, { Component } from 'react';
import { withStyles, TextField, InputAdornment, IconButton, Fade, Typography } from '@material-ui/core'
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
            backgroundColor: 'rgba(255,255,255, 0.1)'
        }
    },
    btn: {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: 'none',
        cursor: 'pointer',
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
    }
})
class CoinDropdown extends Component {
    state = {
        selectedItem: this.props.items[0],
        address: '',
        addTokenExanded: false
    }
    onTockenAddressEntered = (event) => {
        this.setState(
            { address: event.target.value }
        )
    }
    onItemClick = (itemIndex) => {
        this.setState({ selectedItem: this.props.items[itemIndex] })
        this.props.onChange(itemIndex)
    }
    onAddClick = () => {
        this.setState({ addTokenExanded: false })
        if (this.state.address.length > 0) {
            this.props.onTockenAddressEntered(this.state.address)
            this.setState(
                { address: '' }
            )
        }

    }
    render() {
        const { classes, items, className, itemClassName } = this.props;
        const { selectedItem, address, addTokenExanded } = this.state;
        const dropDownItems = items.map((item, index) => {
            return (<button key={index} className={itemClassName} onClick={() => { this.onItemClick(index) }}> {item} </button>)
        })
        return (
            <div className={classes.dropdown}>
                <button
                    className={classes.btn + ' ' + className}>
                    {selectedItem}
                </button>
                <div className={classes.dropdownContent}>
                    {dropDownItems}
                    {addTokenExanded ?
                        <Fade in={addTokenExanded} >
                            <TextField
                                label="Token Address"
                                margin="normal"
                                color="primary"
                                value={address}
                                onChange={this.onTockenAddressEntered}
                                className={classes.addToken}
                                InputLabelProps={{
                                    className: classes.textField,
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.textFieldInput,
                                        underline: classes.underline
                                    },
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.onAddClick}>
                                            <Add />
                                        </IconButton>
                                    </InputAdornment>,
                                }} />
                        </Fade>
                        :
                        <IconButton
                            className={itemClassName+' '+classes.addTokenButton}
                            onClick={() => { this.setState({ addTokenExanded: true }) }}>
                            <Typography variant="subtitle2" >Add</Typography>
                            <Add />
                        </IconButton>}


                </div>
            </div>
        )
    }
}

CoinDropdown.propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    onTockenAddressEntered: PropTypes.func.isRequired
};


export default withStyles(styles)(CoinDropdown);