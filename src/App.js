import React, { useState, useEffect } from 'react';
import './App.css';
import { Grid, AppBar, Toolbar, Typography, Card, Paper, Container,Box,
         Drawer, Divider, CardContent, CardMedia, Button, 
         IconButton, List, ListItem, ListItemText, TextField, Select,
         FormControl, InputLabel, MenuItem, CardActionArea, Fade, Modal,
         Backdrop, CircularProgress, Hidden,
        } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import HomeIcon from '@material-ui/icons/Home';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';

import {createAuthProvider} from 'react-token-auth'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect,
} from "react-router-dom";

const [useAuth, authFetch, login, logout] =
  createAuthProvider({
      accessTokenKey: 'access_token',
      onUpdateToken: (token) => fetch('/api/refresh', {
          method: 'POST',
          body: token.access_token
      })
      .then(r => r.json())
  });

// Taken from https://github.com/yasoob/Flask-React-JWT/blob/master/src/App.js
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [logged] = useAuth();

  return <Route {...rest} render={(props) => (
    logged
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
}

// Helper Function
function formatNumber (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#421eb0',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Futura"'
  }
});

const drawerWidth = 0;

const useHeaderStyles = makeStyles((theme) => ({
  title: {
    marginLeft: 10,
    flex: 1,
    textDecoration: 'none',
  },
  typography: {
    fontSize: 24,
    color: 'white',
    textTransform: 'none'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(66,30,176,1) 100%)'
  }
}));

function Header() {
  const classes = useHeaderStyles();

  return (
    <React.Fragment>
      <AppBar className={classes.appBar} position='fixed'>
        <Toolbar>
          <Link to='/' className={classes.title}>
            <Button style={{borderRadius: '10px'}}>
              <Typography className={classes.typography}>FPL Helper</Typography>
            </Button>
          </Link>
          <Link to='/'>
            <IconButton aria-label="Go to homepage" color='secondary'>
              <HomeIcon />          
            </IconButton>
          </Link>
          <Link to='/players'>
            <IconButton aria-label="Go to homepage" color='secondary'>
              <PersonIcon />          
            </IconButton>
          </Link>
          <Link to='/team'>
            <IconButton aria-label="Go to homepage" color='secondary'>
              <GroupIcon />          
            </IconButton>
          </Link>
          <Link to='/login'>
            <IconButton aria-label="Go to homepage" color='secondary'>
              <ExitToAppIcon />          
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

const useSidebarStyles = makeStyles((themes) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#e6e1f5',
  },
  toolbar: themes.mixins.toolbar
}));

function Sidebar() {
  const classes = useSidebarStyles()

  return (
    <Drawer className={classes.drawer} 
      variant='permanent' anchor='left'
      classes={{paper: classes.drawerPaper}}>
      <div className={classes.toolbar} />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text} id={index}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

const useCardStyles = makeStyles({
  root: {
    // minWidth: 290,
    // maxWidth: 400,
    // margin: 'auto',
    // display: 'flex'
  },
  playerImg: {
    minWidth: 110 * 1.2,
    minHeight: 140 * 1.2,
    margin: 5,
    marginBottom: 0,
  },
  playerName: {
    // marginBottom: -10,
    // marginTop: -10,
    // padding: '-50px',
    background: 'linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(66,30,176,1) 100%)',
  },
  positionGkp: {
    color: '#3e007d',
  },
  positionDef: {
    color: '#007d02'
  },
  positionMid: {
    color: '#343deb'
  },
  positionFwd: {
    color: '#eb3434'
  },
});

const statToReadable = {
  total_points: 'Points',
  goals_scored: 'Goals',
  assists: 'Assists',
  clean_sheets: 'CS',

}
const posStrings= ['GKP', 'DEF', 'MID', 'FWD']
const allStatToReadable = {
  ...statToReadable,
  'bonus': 'Bonus', 
  'bps': 'BPS', 
  'cost_change_event': 'GW ΔCost',
  'cost_change_start': 'Total ΔCost',
  'creativity': 'Creativity', 
  'dreamteam_count': 'Dreamteam #',
  'event_points': 'GW Points',
  'form': 'Form', 
  'goals_conceded': 'Conceded',
  'ict_index': 'ICT',
  'influence': 'Influence',
  'minutes': 'Minutes',
  'now_cost': 'Cost',
  'own_goals': 'Own Goals',
  'penalties_missed': 'Pens Missed',
  'penalties_saved': 'Pens Saved',
  'points_per_game': 'Pts Per Game',
  'red_cards': 'Red Cards',
  'saves': 'Saves',
  'selected_by_percent': '% Selected',
  'threat': 'Threat',
  'transfers_in': 'Transfers In',
  'transfers_in_event': 'GW In',
  'transfers_out': 'Transfers Out',
  'transfers_out_event': 'GW Out',
  'value_season': 'Value',
  'yellow_cards': 'Yellow Cards'
}
const allStat = Object.keys(allStatToReadable);

function PlayerCard(props) {
  const classes = useCardStyles();

  const pos = props.data.element_type - 1
  const posClasses = [classes.positionGkp, classes.positionDef, 
                     classes.positionMid, classes.positionFwd]
  const imgURL = `https://resources.premierleague.com/premierleague/photos/`
               + `players/110x140/p${props.data.code}.png`

  return (
    <Card variant='elevation' elevation={5} className={classes.root}>
      <CardActionArea onClick={() => props.onClick(props.data)}>
        <CardContent className={classes.playerName}>
          <Typography variant='h5' align='center' style={{margin: -10, color: 'white'}}>
            {props.data.web_name}
          </Typography>
        </CardContent>
        <Divider />
        <Box display='flex' flexWrap='nowrap' alignItems='flex-end'>
          <Box>
            <CardMedia className={classes.playerImg} image={imgURL} />
          </Box>
          <Box flexGrow={1}>
            <CardContent>
              <Typography color='textSecondary' align='center' paragraph={true} style={{fontSize: 18}} noWrap={true}>
                <span className={posClasses[pos]}>{posStrings[pos]}</span> • £{(props.data.now_cost / 10).toFixed(1)}
              </Typography>
              <Divider style={{marginTop: -10, marginBottom: 10}} />
              {// Display stats
              /*Object.keys(statToReadable).map((key) => (
                <Box display='flex' flexWrap='nowrap'>
                  <Box><Typography>{statToReadable[key]}</Typography></Box>
                  <Box flex={1} align='Right'><Typography>{props.data[key]}</Typography></Box>
                </Box>
              ))*/}
              <Grid container spacing={3}>
                <Grid item container direction='column' xs={6}>
                  {Object.keys(statToReadable).map((key) => (
                    <Grid key={key} item align='right'><Typography style={{fontWeight: 'bolder'}}>{statToReadable[key]}</Typography></Grid>
                  ))}
                </Grid>
                <Grid item container direction='column' xs={6}>
                  {Object.keys(statToReadable).map((key) => (
                    <Grid item key={key}><Typography>{props.data[key]}</Typography></Grid>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function Players(props) {
  const perPage = 12;
  const [ playerDisplay, setPlayerDisplay ] = useState(props.players);
  const [ offset, setOffset ] = useState(0);
  const [ position, setPosition ] = useState(-1);
  const [ sortBy, setSortBy ] = useState(0);
  const [ playerData, setPlayerData ] = useState(null)
  const [ open, setOpen ] = useState(false);

  let match = useRouteMatch();

  console.log(match.url)

  const navButtons = (
    <Box display='flex' flexWrap='nowrap'>
      <IconButton onClick={() => (offset >= perPage) ? setOffset(offset - perPage) : null}>
        <ChevronLeftIcon fontSize='large' />
      </IconButton>
      <Typography style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <code>{Math.trunc(offset / perPage) + 1} of {Math.trunc(playerDisplay.length / perPage) + 1}</code>
      </Typography>
      <IconButton onClick={() => 
        (offset + perPage < playerDisplay.length) ? setOffset(offset + perPage) : null}>
        <ChevronRightIcon fontSize='large' />
      </IconButton>
    </Box>)
  
  return (
    <div>
      <div style={{'marginTop': -15, 'marginBottom': 15, display: 'flex'}}>
        <div style={{flex: 1}}>
          <TextField style={{width: `calc(100%)`}} label='Name' variant='filled' 
            onChange={(event) => {
              setPlayerDisplay(props.players.filter(player => 
                player.web_name.toLowerCase().includes(event.target.value.toLowerCase())
                || player.first_name.toLowerCase().includes(event.target.value.toLowerCase())
                || player.second_name.toLowerCase().includes(event.target.value.toLowerCase())
              ))
              setOffset(0)
            }}
          />
        </div>
        <div>
          <FormControl style={{width: 75, marginLeft: 20}}>
            <InputLabel>Position</InputLabel>
            <Select value={position}
              onChange={(event) => {
                setPosition(event.target.value)
                setOffset(0)
                if (event.target.value !== -1)
                  setPlayerDisplay(props.players.filter(player => 
                  player.element_type === event.target.value))
                else
                  setPlayerDisplay(props.players)
            }}>
              <MenuItem value={1}>GKP</MenuItem>
              <MenuItem value={2}>DEF</MenuItem>
              <MenuItem value={3}>MID</MenuItem>
              <MenuItem value={4}>FWD</MenuItem>
              <MenuItem value={-1}>ANY</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl style={{width: 175, marginLeft: 20}}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy}
              onChange={(event) => {
                if (event.target.value === sortBy) return;
                setSortBy(event.target.value)
                setOffset(0)
                const category = allStat[event.target.value]
                setPlayerDisplay(props.players.sort((a, b) => 
                ((parseFloat(a[category]) > parseFloat(b[category])) ? -1 : 1)))
            }}>
              {
                allStat.map((stat, i) => (
                  <MenuItem key={i} value={i}>{allStatToReadable[stat]}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
      </div>
      <div style={{marginTop: -5, marginBottom: 5, display: 'flex', justifyContent: 'center'}}>
        {navButtons}
      </div>
      <Grid container spacing={1} direction='row' justify='center'>
        {[...new Array(Math.min(playerDisplay.length - offset, perPage)).keys()].map((i) => (
            <Grid key={playerDisplay[offset + i].id} item xs={12} sm={6} lg={3} xl={3} style={{maxWidth: 400, minWidth: 290}}>
              <PlayerCard data={playerDisplay[offset + i]} onClick={(data) => {setPlayerData(data); setOpen(true)}} matchURL={props.matchURL}/>
            </Grid>)
        )}
      </Grid>
      <div style={{marginTop: 15, marginBottom: -55, display: 'flex', justifyContent: 'center'}}>
        {navButtons}
      </div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        //className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{timeout: 500}}
      >
        <Fade in={open}>
          <PlayerData data={playerData} onClick={() => setOpen(false)}/>
        </Fade>
      </Modal>
    </div>
  );
}

const usePlayerDataStyles = makeStyles({
  // '@keyframes fadeIn': {
  //   '0%': {opacity: 0},
  //   '100%': {opacity: 1}
  // },
  // '@keyframes fadeOut': {
  //   '0%': {opacity: 1},
  //   '100%': {opacity: 0},
  // },
  root: {
    margin: '10%',
    marginTop: '15vh',
    maxHeight: '70vh',
    background: 'white',
    //padding: 50,
    display: 'flex',
    overflow: 'scroll',
    // animation: '$fadeIn',
    // animationDuration: '0.5s',
    // animationTimingFunction: 'linear',
    // animationIterationCount: '1'
  },
  header: {
    // display: 'flex',
    // // border: '10px solid black', 
    // margin: 'auto',
    // justifyContent: 'center',
    background: 'linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(66,30,176,1) 100%)',
    padding: 50,
    color: 'white',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  },
  name: {
    //position: 'absolute',
    //right: '50%',
    marginLeft: 30, 
    marginTop: 25,
    display: 'block',
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    }
  },
  divider: {
    marginBottom: -15
  },
  imageCropper: {
    width: '150px',
    height: '150px',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '50%',
    //margin: 'auto',
    //display: 'flex'
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      margin:'auto',
      marginTop: -10,
    }
  },
  image: {
    //display: 'inline',
    //margin: '0 auto',
    marginLeft: '12.5%', // no idea why this has to be 12.5% but it does
    height: '100%',
    width: 'auto',
  },
  exit: {
    display: 'flex',
    margin: 'auto',
    marginTop: 50,
    marginRight: 20,
  },
  price: {
    marginLeft: 50,
    marginTop: 40,
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      marginLeft: 0,
      marginTop: 5,
    }
  },
  positionGkp: {
    color: '#3e007d',
  },
  positionDef: {
    color: '#007d02'
  },
  positionMid: {
    color: '#343deb'
  },
  positionFwd: {
    color: '#eb3434'
  },
  text: {
    //border: '1px solid black',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      justify: 'center',
      justifyContent: 'center',
      alignContent: 'center'
    }
  }
})

function PlayerData(props) {
  console.log(props.data)
  
  const classes = usePlayerDataStyles();
  const imgURL = `https://resources.premierleague.com/premierleague/photos/`
  + `players/110x140/p${props.data.code}.png`

  // const posClasses = [classes.positionGkp, classes.positionDef, 
  //                     classes.positionMid, classes.positionFwd]

  const posColors = ['#3e007d', '#007d02', '#343deb', '#eb3434'];

  return (
    <Card className={classes.root} elevation={5}>
      <div>
        <Grid container className={classes.header} justify='center'>
          {/* <Grid item>
            <IconButton title='Back' className={classes.exit} onClick={props.onClick}>
              <ChevronLeftIcon style={{transform: 'scale(3)', color: 'white'}}/>
            </IconButton>
          </Grid> */}
          <Grid item className={classes.imageCropper} style={{border: '4px solid ' + posColors[props.data.element_type-1]}}>
            <img alt={props.data.web_name} className={classes.image} src={imgURL}/>
          </Grid>
          <Grid item className={classes.name}>
            <Hidden xsDown>
              <Typography variant='h4' style={{marginLeft: 2}}>{props.data.first_name}</Typography>
              <Typography variant='h3'>{props.data.second_name}</Typography>
            </Hidden>
            <Hidden smUp>
              <div className={classes.text}>
                <Typography justify='center' style={{fontSize: '10vw'}}>{props.data.web_name}</Typography>
              </div>
              <div>
                <Divider orientation='horizontal' style={{marginTop: 15, marginBottom: 15, backgroundColor: 'white'}}/>
              </div>
            </Hidden>
          </Grid>
          <Grid item className={classes.price} spacing={3}>
            <div style={{display: 'flex'}} className={classes.text}>
              <Typography variant='h3'>
                {posStrings[props.data.element_type-1]}
              </Typography>
            </div>
            <Hidden xsDown>
              <div item style={{display: 'flex', marginLeft: 25, marginRight: 25}}>
                <Divider orientation='vertical' style={{height: '60px', backgroundColor: 'white'}}/>
              </div>
            </Hidden>
            <div style={{display: 'flex'}} className={classes.text}>
              <Typography variant='h3' noWrap={true} >
                £{(props.data.now_cost / 10).toFixed(1)}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
      
        <Grid container style={{padding: 50}}>
          {
            allStat.map((key) => (
              <Grid item key={key} xs={12} sm={6} md={4}>
                <Stat stat={allStatToReadable[key]} value={props.data[key]} />
              </Grid>
            ))
          }
        </Grid>
      </div>
    </Card>
  )
}

const useStatStyles = makeStyles({
  root: {
    display: 'block',
    margin: 10,
  },
  left: {
    display: 'flex',
    flex: 0,
    marginBottom: -3,
  },
  bar: {
    display: 'flex',
    flex: 1,
    //border: '1px solid black', 
    // maxHeight: 10,
  },
  data: {
    minWidth: '80px',
    marginLeft: 10,
    marginTop: -5
  }
})

function Stat(props) {
  const classes = useStatStyles();

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Typography noWrap={true} style={{fontWeight: 'bold'}}>
          {props.stat}
        </Typography>
      </div>
      <div style={{display: 'flex'}}>
        <div className={classes.bar}>
          <svg width='100%' height='100%' style={{border: '1px solid black', height: '10px'}}>
            {/* <rect width='100%' height='100%' stroke='orange' strokeWidth={5} fill='transparent'/> */}
            <rect x='0' y='0' width='100%' height='100%' fill='black' />
            <rect x='0' y='0' width='80%' height='100%' fill='green' />
          </svg>
        </div>
        <div className={classes.data}>
          <Typography align='left'>
            {formatNumber(props.value)}
          </Typography>
        </div>
      </div>
    </div>
  )
}

function Content() {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  let match = useRouteMatch();

  useEffect(() => {
    fetch('/api/data', {method: 'GET'})
    .then(response => response.json())
    .then(json => {
      json['elements'].sort((a, b) => 
        ((a['total_points'] > b['total_points']) ? -1 : 1))
      console.log(json)
      setData(json)
      setLoaded(true)
    })
  }, []);

  console.log(match.url)

  // if (!loaded)
  //   return <Typography variant='h2' align='center'>Loading...</Typography>
  // return (
  //   <Switch>
  //     <Route path={`${match.url}/<:pid>`}>
  //       <PlayerPage />
  //     </Route>
  //     <Route path={match.url}>
  //       <Players players={data.elements} onClick={data => setPlayerData(data)} matchURL={match.url}/>
  //     </Route>
  //   </Switch>
  // )

  if (!loaded)
    return (
      <div style={{display: 'block'}}>
        <Typography variant='h2' align='center'>Loading...</Typography>
        <CircularProgress size={100}  style={{display: 'flex', margin: 'auto', marginTop: 50}}/>
      </div>
    )
  // else if (playerData === null)
  else
    return <Players players={data.elements} onClick={(data) => setPlayerData(data)}/>
    // return <PlayerData data={playerData} onClick={() => setPlayerData(null)}/>

  // if (playerData !== null)
  //   return <PlayerData data={playerData} onClick={() => setPlayerData(null)}/>
  // else if (loaded)
  //   return <Players players={data.elements} onClick={(data) => setPlayerData(data)}/>
  // else
  //   return <Typography variant='h2' align='center'>Loading...</Typography>
}

const useFooterStyles = makeStyles({
  root: {
  }
});

function Footer() {
  const classes = useFooterStyles();

  return (
      <Grid container className={classes.root}>
        <Grid item xs={1} sm={2}/>
        <Grid item xs={10} sm={8}>
          <Paper elevation={0}>
            {/* <Typography align='center' color='textPrimary' 
             gutterBottom='true' variant='h2'>Footer</Typography> */}
            <Typography color='textSecondary' align='center'>
              All data, player likenesses, and logos are property of the Premier League.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={1} sm={2}/>
      </Grid>
  )
}

const useMainStyles = makeStyles({
  image: {
    width: '50%',
    height: 'auto',
    margin: 'auto',
    display: 'block'
  }
})

function Main() {
  const classes = useMainStyles();

  return (
    <div>
      <img className={classes.image} src='https://i.pinimg.com/originals/ac/f5/28/acf5284effcb7adf9fbdc6d0823be418.png' alt='FPL'/>
      <Typography align='center' variant='h2'>Welcome to FPL Helper!</Typography>
    </div>
  )
}

const useTeamStyles = makeStyles({
  field: {
    margin: 'auto',
    height: '80vh',
    display: 'flex',
    width: '80%'
    //width: '35vh',
    //border: '1px solid black'
    // transform: 'rotate3d(1,0,0, 45deg)'
  },
  grass: {
  },
  draggable: {
    cursor: 'move'
  }
})

function Team() {
  const classes = useTeamStyles();

  const height = 120;
  const width = 120;
  const iconWidth = 20;
  
  const mins = [3, 2, 1];

  const formation = [4, 4, 2];
  const ys = [80, 50, 20];
  const margins = [ 15, 20, 25 ];
  const spacing = [0, 0, 20, 10, 5, 3];
  var coords = [];

  
  for (var i = 0; i < 3; i++) {
    var pos = formation[i]
    var cx = width / 2 - (spacing[pos] + iconWidth) * (pos-1) / 2
    for (var j = 0; j < pos; j++) {
      coords.push([cx, ys[i]])
      cx += (iconWidth + spacing[pos])
    }
  }

  function makeDraggable(evt) {
    var svg = evt.target;
    function startDrag(evt) {
      console.log('evt')
    }
    function drag(evt) {
      console.log('evt')
    }
    function endDrag(evt) {
      console.log('evt')
    }
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
  }
  

  return (
    <div>
      <svg className={classes.field} viewBox='0 0 120 120' 
       xmlns="http://www.w3.org/2000/svg" onLoad={makeDraggable}>
        <defs>
          <pattern id='sonny' width='100%' height='100%' viewBox='0 0 512 512'>
            <image href='https://resources.premierleague.com/premierleague/photos/players/110x140/p85971.png'
             width='512' height='512' />
          </pattern>
        </defs>
        {/* <rect className={classes.grass} width='100%' height='100%' stroke='black' fill='green' />
        <line x1='0' y1='50%' x2='100%' y2='50%' stroke='white' />
        <circle cx='50%' cy='50%' r='12%' stroke='white' fill='transparent'/>
        <rect width='100%' height='100%' stroke='black' fill='transparent' strokeWidth='3' /> */}
        <polygon points='10,110 110,110 95,0 25,0' fill='#32a852' stroke='black' />
        <line x1='18.25' y1='50' x2='101.75' y2='50' stroke='white' />
        <ellipse cx='60' cy='51' rx='12' ry='8' stroke='white' fill='transparent' />
        <polygon points='52,110 68,110 67.4,106 52.6,106' stroke='white' fill='transparent'/>

        <polygon points='10,110 110,110 95,0 25,0' fill='transparent' stroke='black' strokeWidth='1.5' />
        
        {/* Goalkeeper */}
        {/* <circle cx='60' cy='105' r='10' fill='white'/>
        <circle cx='60' cy='105' r='10' fill='url(#sonny)' stroke='black'/> */}

        {/* Defenders */}
        {coords.map(([x, y]) => (
          <g key={x*1000 + y} className={classes.draggable}>
            <circle cx={x} cy={y} r='10' fill='white'/>
            <circle cx={x} cy={y} r='10' fill='url(#sonny)' stroke='black'/>
          </g>
        ))}
      </svg>
    </div>
  )
}

const useLoginStyles = makeStyles({
  box: {
    width: '50%',
    margin: 'auto',
    padding: '20px'
  }, 
  input: {
    width: '75%',
    margin: 'auto',
    display: 'flex',
    //marginTop: 20
  }
})

function doLogin(username, password) {
  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  .then(response => {console.log(response); return response.json()})
  .then(json => console.log(json))
  .catch(error => console.log(error))
}

function Login() {
  const classes = useLoginStyles();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    console.log('Event listener added.')
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
        doLogin(username, password);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div>
      <Card variant='outlined' className={classes.box}>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <Typography variant='h4' align='center'>Log In</Typography>
          </Grid>
          <Grid item>
            <TextField label='Username' variant='filled' 
              className={classes.input}
              onChange={event => setUsername(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField label='Password' variant='filled' 
              className={classes.input} type='password'
              onChange={event => setPassword(event.target.value)}
            />
          </Grid>
          <Grid item>
            <Button style={{margin: 'auto', display: 'flex'}}
             onClick={() => doLogin(username, password)}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}
  
const useAppStyles = makeStyles((themes) => ({
  toolbar: themes.mixins.toolbar,
  content: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
}));

function App() {
  const classes = useAppStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Container disableGutters={true}>
          <Sidebar />
          <Header />
          <Grid className={classes.content} container direction="column" spacing={4}>
            <Grid item><div className={classes.toolbar} /></Grid>
            <Grid item container>
              {/* <Grid item xs='auto' md={1}/> */}
              <Grid item xs={12}>
                <Switch>
                  {/* A <Switch> looks through its children <Route>s and
                  renders the first one that matches the current URL. */}
                  <Route path="/players">
                    <Content />
                  </Route>
                  <Route path='/login'>
                    <Login />
                  </Route>
                  <Route path='/team'>
                    <Team />
                  </Route>
                  <Route path="/">
                    <Main />
                  </Route>
                </Switch>
              </Grid>
              {/* <Grid item xs='auto' md={1}/> */}
            </Grid>
            <Grid item />
            <Grid item><Divider /></Grid>
            <Grid item />
            <Grid item><Footer /></Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </Router>
  )
}

export default App;
