import { Container } from '@mantine/core';
import classes from './Footer.module.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <div>
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
                </p>
            </Container>
        </div>
    );
}
