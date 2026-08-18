'use client';

import Image from 'next/image';
import { 
  Search01Icon, 
  Notification01Icon, 
  CommandIcon
} from 'hugeicons-react';
import styles from './PortalHeader.module.css';

export default function PortalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.searchArea}>
        <div className={styles.searchWrapper}>
          <Search01Icon size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search resources, lessons, or files..." 
            className={styles.search} 
          />
          <div className={styles.commandHint}>
            <CommandIcon size={12} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className={styles.userArea}>
        <button className={styles.iconBtn}>
          <Notification01Icon size={22} />
          <span className={styles.badge}></span>
        </button>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <Image src="/photo01.jpeg" alt="James Dean" width={44} height={44} style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>James Dean</span>
            <span className={styles.role}>@james_dean</span>
          </div>
        </div>
      </div>
    </header>
  );
}
