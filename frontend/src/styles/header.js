import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(48, [col] 1fr)',
    gridTemplateRows: '12rem 5rem auto auto',
    gridColumn: '1 / 49',
    [theme.breakpoints.up('md')]: {
      gridTemplateRows: '4rem 4rem auto auto 6rem'
    }
  },
  accountText: {
    color: '#939BA1'
  },
  network:{
    color: '#939BA1',
    gridColumn: '8 / 25'
  },
  networkIndicator: {
    gridColumn: '5 / 5',
    marginTop: '0.5rem',
    height: '0.75rem',
    width: '0.75rem',
    backgroundColor: 'rgb(48, 189, 159)',
    borderRadius: '50%'
  },
  connect: {
    color: theme.palette.primary[500],
    fontSize: '15px',
    marginLeft: 'auto',
    marginRight: '3rem',
    cursor: 'pointer',
    gridColumnEnd: '50'
  },
  connected: {
    color: '#44D058',
    cursor: 'default'
  },
  connectedText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
}))

export default useStyles
