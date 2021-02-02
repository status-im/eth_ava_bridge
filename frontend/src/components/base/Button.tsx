import React, { Fragment } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Check from '@material-ui/icons/Check'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  check: {
    color: '#1AA56E'
  },
  formButton: {
    gridColumnStart: '3',
    gridColumnEnd: '49',
    minHeight: '50px',
    marginTop: '1.5rem',
    borderRadius: '8px',
    backgroundColor: '#1AA56E',
    color: 'white',
    '&:hover': {
      backgroundColor: '#137C53',
    }
  },
  disabledButton: {
    backgroundColor: 'none'
  },
  buttonContent: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    fontSize: '14px',
    [theme.breakpoints.up('md')]: {
      fontSize: '14px'
    }
  },
  progress: {
    color: '#1AA56E',
    animationDuration: '350ms'
  }
}))

type ButtonProps = {
  className?: string,
  disabled?: boolean,
  buttonText: string,
  confirmed?: boolean,
  loading?: boolean,
  onClick: any,
  type?: "button" | "reset" | "submit"
}

function StatusButton(props: ButtonProps) {
  const { className, disabled, buttonText, confirmed, loading, onClick } = props
  const classes = useStyles()
  const { check, formButton, disabledButton, buttonContent, progress } = classes
  const buttonType = props.type ? props.type : 'submit'
  return (
    <Fragment>
      <Button className={classnames(formButton, className)} disabled={disabled} type={buttonType} variant="contained" classes={{ disabled: disabledButton }} onClick={onClick}>
        <div className={buttonContent}>
          {confirmed && <Check className={check} />}
          {loading && <CircularProgress className={progress} size={24} disableShrink />}
          {buttonText || ''}
        </div>
      </Button>
    </Fragment>
  )
}

export default StatusButton
