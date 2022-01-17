import { VscGithub } from 'react-icons/vsc';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import TelescopeAvatar from '../TelescopeAvatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    GitHubInfo: {
      lineHeight: 'normal',
      fontSize: '1.2rem',
    },
    GitHubMobile: {
      lineHeight: 'normal',
      fontSize: '1.2rem',
    },
    GitHubLinkTitle: {
      fontSize: '1.4rem',
      margin: 0,
      paddingTop: '1rem',
    },
    icon: {
      fontSize: '2rem',
      marginRight: '1rem',
      verticalAlign: 'text-bottom',
    },
    users: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
    },
    user: {
      listStyle: 'none',
    },
  })
);

const getUserImage = (user: string, size: number) => `https://github.com/${user}.png?size=${size}`;

type Props = {
  usernames: string[];
  avatarSize?: number;
};

const Users = ({ usernames, avatarSize = 25 }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.GitHubInfo}>
      <h2 className={classes.GitHubLinkTitle}>
        <VscGithub className={classes.icon} />
        {usernames.length === 1 ? 'User/Org' : 'Users/Orgs'}
      </h2>
      <ul className={classes.users}>
        {usernames?.map((user) => (
          <li key={user} className={classes.user}>
            <div>
              <TelescopeAvatar
                img={getUserImage(user, avatarSize)}
                size={`${avatarSize}px`}
                name={user}
                url={`https://github.com/${user}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
