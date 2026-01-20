import { Container } from '@mantine/core';
import classes from './Footer.module.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <Container className={classes.inner}>
            <p>
                &copy; {year}&nbsp;
                <a
                  href="https://github.com/TeamVastsea"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                    瀚海工艺
                </a>
                &nbsp;|&nbsp;
                <a
                  href="https://klpbbs.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                    苦力怕论坛
                </a>
                &nbsp;|&nbsp;
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                    粤ICP备2023071842号-3
                </a>
                &nbsp;|&nbsp;
                <a
                  href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44200002445329"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                    <img src="https://data.klpbbs.com/file/tc/img/2022/11/12/636f24d117464.png" /> 粤公网安备 44200002445329号
                </a>
            </p>
        </Container>
    );
}
