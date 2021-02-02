import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(48, [col] 1fr)',
        gridColumn: '3 / 45',
        [theme.breakpoints.up('md')]: {
            gridTemplateRows: '4rem 4rem auto auto 6rem',
            gridColumn: '8 / 42',
        }
    },
    adornmentText: {
        cursor: 'pointer',
        color: '#4360DF'
    },
    title: {
        gridColumn: '3 / 49'
    },
    fieldWidth: {
        gridColumn: '3 / 49'
    },
    datePicker: {
        borderRadius: '25px'
    }
}))

export default useStyles
