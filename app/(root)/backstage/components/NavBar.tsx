import { useState } from 'react';
import { IconBellRinging, IconClockHour5, IconLogout, IconPlus, IconTrash, IconUsersGroup } from '@tabler/icons-react';
import classes from './BadgeCard.module.css';

const data = [
    {
        link: '',
        label: '信息',
        icon: IconBellRinging,
    },
    {
        link: '',
        label: '新建问卷',
        icon: IconPlus,
    },
    {
        link: '',
        label: '最近',
        icon: IconClockHour5,
    },
    {
        link: '',
        label: '与我合作',
        icon: IconUsersGroup,
    },
];

export default function NavBar() {
    const [active, setActive] = useState('Billing');
    const links = data.map((item) => (
        <a
          className={classes.link}
          data-active={item.label === active || undefined}
          href={item.link}
          key={item.label}
          onClick={(event) => {
            event.preventDefault();
            setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                {links}
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconTrash className={classes.linkIcon} stroke={1.5} />
                    <span>回收站</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>退出登录</span>
                </a>
            </div>
        </nav>
    );
}
