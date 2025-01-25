'use client';

import {ActionIcon, MantineColorScheme, rem, useMantineColorScheme} from '@mantine/core';
import {IconBrightness2, IconBrightnessAuto, IconMoonStars} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import classes from '@/components/ColorSchemeToggle.module.css';

const schemes = [
  {scheme: 'auto', icon: <IconBrightnessAuto style={{width: rem(20)}} stroke={1.5}/>},
  {scheme: 'light', icon: <IconBrightness2 style={{width: rem(20)}} stroke={1.5}/>},
  {scheme: 'dark', icon: <IconMoonStars style={{width: rem(18)}} stroke={1.5}/>},
];

export function ColorSchemeToggle() {
  const {setColorScheme} = useMantineColorScheme();
  const [selected, setSelected] = useState(0);

  function selectNextColorScheme() {
    const nextSelected = selected <= 1 ? selected + 1 : 0;

    setColorScheme(schemes[nextSelected].scheme as MantineColorScheme);
    setSelected(nextSelected);
  }

  useEffect(() => {
    setColorScheme('auto');
  }, []);

  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      aria-label="Gallery"
      className={classes.link}
      onClick={selectNextColorScheme}
    >
      {schemes[selected].icon}
    </ActionIcon>
  );
}
