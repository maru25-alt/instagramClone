import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 800,
    height: 450,
    "::-webkit-scrollbar": {
      display: "none"
    }
  }
  
}));


export default function TitlebarGridList({posts}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList} cols={3}>
        {posts.map((post) => (
               <GridListTile key={post.id} onClick={() => history.push('/myPosts')}>
                 <img src={post.post?.imageUrl} alt={post.id} />
               </GridListTile>
        ))}
      </GridList>
    </div>
  );
}