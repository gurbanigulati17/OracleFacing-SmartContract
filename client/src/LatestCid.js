import { List , ListItem, ListItemAvatar, ListItemText } from '@mui/material';
// import './Task.css';

const LatestCid=({latestCidText})=>{
    return (
        <List className=""> 
            <ListItem>
                <ListItemAvatar />
                    <ListItemText primary={latestCidText} />
            </ListItem>
        </List> 
    )
};

export default LatestCid;