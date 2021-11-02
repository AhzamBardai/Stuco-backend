import Theme from '../models/Theme.js'

const themeSeed = [
    {
        colorName : 'Autumn',
        primaryColor : {
            main: '#ff8a65',
            contrastText: '#000000',
        },
        secondaryColor : {
            main: '#800000',
        },
        current: true
    },
    {
        colorName : 'Summer',
        primaryColor : {
            main: '#ffee58',
            contrastText: '#000000',
        },
        secondaryColor : {
            main: '#81d4fa',
        },
        current: false
    },
    {
        colorName : 'Spring',
        primaryColor : {
            main: '#ff7043',
            contrastText: '#000000',
        },
        secondaryColor : {
            main: '#bf360c',
        },
        current: false
    },
    {
        colorName : 'Winter',
        primaryColor : {
            main: '#7183bf',
            light: '#838ec5',
            contrastText: '#000000',
        },
        secondaryColor : {
            main: '#1976d2',
        },
        current: false
    },
    {
        colorName : 'Christmas',
        primaryColor : {
            main: '#2e7d32',
            contrastText: '#000000',
        },
        secondaryColor : {
            main: '#e53935',
        },
        current: false
    },
]

// Theme.deleteMany({})
//     .then(() => Theme.insertMany(themeSeed))
//     .catch((err) => console.log(err))
//     .finally(() => process.exit())


const hahatheme = async () => {
    const currentTheme = await Theme.findOne({ current : true })
    await Theme.updateMany({}, { current : false })
    const updateOne = await Theme.findOneAndUpdate({ colorName : 'Winter' }, { current : true }, { new : true})
    console.log(currentTheme,'\n', updateOne )
    process.exit()

}
hahatheme()