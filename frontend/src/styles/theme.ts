import { createMuiTheme } from '@material-ui/core/styles';

// https://material-ui.com/guides/typescript/#customization-of-theme

declare module "@material-ui/core/styles/createBreakpoints" {
    interface BreakpointOverrides {
        xs: false; // removes the `xs` breakpoint
        sm: true;
        md: true;
        lg: false;
        xl: false;
        tablet: false; // adds the `tablet` breakpoint
        laptop: false;
        desktop: false;
    }
}

export default createMuiTheme({
    typography: {
        fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"].join(','),
    },
    breakpoints: {
        values: {
            sm: 320,
            md: 860
        }
    },
    palette: {
        primary: {
            100: '#1AA56E1A',
            500: '#1AA56E'
        },
        action: {
            disabledBackground: '#FAFAFA'
        }
    }
})
