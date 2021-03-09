import { createMuiTheme } from '@material-ui/core/styles'

//A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#2a4865',
            main: '#1b3a57',
            dark: '#051e34',
        },
        secondary: {
            light: '#ffecb3',
            main: '#ffc107',
            dark: '#ffa000',
        },
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '*::-webkit-scrollbar': {
                    width: '10px',
                },
                '*::-webkit-scrollbar-track': {
                    background: 'inherit',
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    borderRadius: '4px',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: 'inherit',
                    borderRadius: '4px',

                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
                '*::-webkit-scrollbar-corner': {
                    background: 'inherit',
                },
            },
        },

        // For MenuItem, change this to MuiMenuItem
        MuiListItem: {
            root: {
                '&$selected': {
                    backgroundColor: '#051e34',
                },
                '&$selected:hover': {
                    backgroundColor: '#2a4865',
                    opacity: 0.4,
                },
            },
        },
    },
})

export default theme
