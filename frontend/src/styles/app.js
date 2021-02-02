import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(48, [col] 1fr)',
        gridTemplateRows: '3rem 5rem auto auto',
        [theme.breakpoints.up('md')]: {
            gridTemplateRows: '4rem 4rem auto auto 6rem'
        }
    }
}));

export default useStyles;
