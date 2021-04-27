import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(48, [col] 1fr)',
        gridColumn: '3 / 45',
        marginTop: '3rem',
        gridTemplateRows: '9em'
    },
    adornmentText: {
        cursor: 'pointer',
        color: '#4360DF'
    },
    balanceText: {
        color: '#025ea2',
        gridColumn: '3 / 49',
        fontSize: '1.5rem'
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
