import { ReactNode } from "react";
import Nav from "./Nav/nav";
import styles from './layout.module.css';
 
const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <div className={styles.container}>
      <Nav />
      <main className={styles.content}>{children}</main>
    </div>
  )
}

export default Layout;