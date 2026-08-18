'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Dashboard.module.css';

interface WelcomeBannerProps {
  title: string;
  description: string;
  monsterSrc: string;
  backgroundColor?: string;
}

export default function WelcomeBanner({ 
  title, 
  description, 
  monsterSrc, 
  backgroundColor = '#146ef5' 
}: WelcomeBannerProps) {
  return (
    <div className={styles.welcomeBanner} style={{ backgroundColor }}>
      <div className={styles.welcomeText}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className={styles.monsterContainer}>
         <Image src={monsterSrc} alt="Monster" width={160} height={160} style={{ objectFit: 'contain' }} />
      </div>
    </div>
  );
}
